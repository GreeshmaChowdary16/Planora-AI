import Groq from 'groq-sdk';
import env from '../utils/envValidator';
import { getProjectAnalysisPrompt, getHardwareAnalysisPrompt } from '../utils/promptTemplates';
import { extractJSON } from '../utils/jsonSanitizer';
import { mockPlans, fallbackPlan } from '../data/mockPlans';
import type { ProjectPlan } from '../data/mockPlans';

// Initialize the Groq SDK client
let groq: Groq | null = null;
try {
  if (env.GROQ_API_KEY && !env.GROQ_API_KEY.includes('your_groq_api_key')) {
    groq = new Groq({ apiKey: env.GROQ_API_KEY });
  }
} catch (error) {
  console.warn('⚠️ Groq client initialization skipped. Running in Fallback/Demo mode.');
}

export const generateProjectPlan = async (
  title: string,
  description: string,
  domain: string,
  skillLevel: string,
  timeline: string,
  projectType?: 'software' | 'hardware',
  hardwareCategory?: string,
  preferredController?: string,
  budgetRange?: string,
  connectivityType?: string,
  powerSource?: string
): Promise<ProjectPlan> => {
  const prompt = projectType === 'hardware' 
    ? getHardwareAnalysisPrompt(title, description, skillLevel, timeline, hardwareCategory || 'IoT', preferredController || 'ESP32', budgetRange || '₹1000–₹3000', connectivityType || 'WiFi', powerSource || 'USB') 
    : getProjectAnalysisPrompt(title, description, domain, skillLevel, timeline);

  if (!groq) {
    console.log('📡 Groq API Client not initialized or using example key. Executing Fallback Mock Plan.');
    return getFallbackPlan(
      title,
      description,
      domain,
      skillLevel,
      timeline,
      projectType,
      hardwareCategory,
      preferredController,
      budgetRange,
      connectivityType,
      powerSource
    );
  }

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are an expert technical mentor. You must return only a valid JSON object matching the requested schema. No markdown formatting, no explanation.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      model: 'llama-3.3-70b-versatile',
      response_format: { type: 'json_object' }
    });

    const text = completion.choices[0]?.message?.content;

    if (!text) {
      throw new Error('Received empty response from Groq API.');
    }

    const sanitizedJson = extractJSON(text);
    const parsedData = JSON.parse(sanitizedJson) as ProjectPlan;

    // Validate structured response mapping
    if (!parsedData.projectName || !parsedData.techStack || !parsedData.roadmap) {
      throw new Error('AI response is missing critical fields (projectName, techStack, or roadmap).');
    }

    return parsedData;
  } catch (error) {
    console.error('❌ Groq API Generation Failed:', error);
    console.log('🔄 Engaging AI Fallback handler...');
    return getFallbackPlan(
      title,
      description,
      domain,
      skillLevel,
      timeline,
      projectType,
      hardwareCategory,
      preferredController,
      budgetRange,
      connectivityType,
      powerSource
    );
  }
};

const getFallbackPlan = (
  title: string,
  description: string,
  domain: string,
  skillLevel: string,
  timeline: string,
  projectType?: 'software' | 'hardware',
  hardwareCategory?: string,
  preferredController?: string,
  budgetRange?: string,
  connectivityType?: string,
  powerSource?: string
): ProjectPlan => {
  const query = `${title} ${description}`.toLowerCase();

  if (projectType === 'hardware') {
    const isOffline = connectivityType === 'Offline';
    const isSimple = (skillLevel === 'Beginner') || (title.toLowerCase().includes('light') || title.toLowerCase().includes('blind'));
    
    // Set codingRequirement and hardwareComplexity
    let codingReq: 'Low' | 'Medium' | 'High' = 'Medium';
    let hwComp: 'Basic' | 'Intermediate' | 'Advanced' = 'Intermediate';
    
    if (skillLevel === 'Beginner') {
      codingReq = 'Low';
      hwComp = 'Basic';
    } else if (skillLevel === 'Advanced') {
      codingReq = 'High';
      hwComp = 'Advanced';
    }
    
    if (title.toLowerCase().includes('robot') || title.toLowerCase().includes('surveillance') || title.toLowerCase().includes('ai')) {
      codingReq = 'High';
      hwComp = 'Advanced';
    } else if (title.toLowerCase().includes('light') || title.toLowerCase().includes('stick') || title.toLowerCase().includes('parking')) {
      if (skillLevel === 'Beginner') {
        codingReq = 'Low';
        hwComp = 'Basic';
      }
    }

    // Determine techStack
    const techStack = [
      {
        name: preferredController || 'ESP32 DevKitC',
        category: 'iot_hardware',
        role: 'Microcontroller Unit',
        whyChosen: `Serves as the main control unit, chosen for its input/output pin layout and processing capabilities to coordinate hardware peripherals.`
      }
    ];

    // Add sensors/components to techStack
    let componentList: { component: string; purpose: string; required: boolean; estimatedPrice?: string; quantity?: number; wiringRole?: string }[] = [];
    let toolsList: { tool: string; purpose: string; whyNeeded?: string; whereUsed?: string; beginnerFriendliness?: string }[] = [];
    let firmwareStackList: string[] = [];
    let safetyNotesList: string[] = [];

    // Setup defaults
    let estCostVal = budgetRange || '₹1000–₹3000';

    if (query.includes('helmet') || query.includes('accident')) {
      // Smart Helmet
      codingReq = 'Medium';
      hwComp = 'Intermediate';
      techStack.push(
        { name: 'MPU6050 Accelerometer', category: 'iot_hardware', role: 'Telemetry Sensor', whyChosen: 'Measures angular velocity and acceleration to accurately identify sudden falls.' },
        { name: 'SIM900A GSM Module', category: 'iot_hardware', role: 'Communication', whyChosen: 'Enables cellular SMS sending of coordinates without WiFi connectivity.' },
        { name: 'NEO-6M GPS Module', category: 'iot_hardware', role: 'Telemetry Sensor', whyChosen: 'Retrieves raw latitude and longitude GPS coordinates to pinpoint accident locations.' }
      );
      componentList = [
        { component: `${preferredController || 'ESP32'} MCU Board`, purpose: 'Processes sensor data, calculates fall threshold, and triggers SMS alerts.', required: true, estimatedPrice: '₹450', quantity: 1, wiringRole: 'Power VCC to 5V battery, GND to GND.' },
        { component: 'MPU6050 Gyro/Accelerometer', purpose: 'Detects impact forces and orientation changes.', required: true, estimatedPrice: '₹250', quantity: 1, wiringRole: 'SDA to GPIO 21, SCL to GPIO 22, VCC to 3.3V.' },
        { component: 'NEO-6M GPS Module', purpose: 'Fetches satellite geographic coordinates.', required: true, estimatedPrice: '₹400', quantity: 1, wiringRole: 'TX to GPIO 16 (RX2), RX to GPIO 17 (TX2), VCC to 3.3V.' },
        { component: 'SIM900A GSM Modem', purpose: 'Dispatches emergency SMS warnings.', required: true, estimatedPrice: '₹800', quantity: 1, wiringRole: 'TX/RX pins to MCU software serial pins, powered via 5V 2A regulator.' }
      ];
      firmwareStackList = ['TinyGPS++.h (GPS sentence parser)', 'Wire.h (I2C communication for MPU6050)', 'SoftwareSerial.h (GSM communication)'];
      safetyNotesList = ['Ensure GSM module is powered by an external source, as the USB port cannot supply enough peak current.', 'Double check cellular antenna connections inside the helmet.'];
    } else if (query.includes('blind') || query.includes('stick')) {
      // AI Blind Stick
      codingReq = 'Low';
      hwComp = 'Basic';
      techStack.push(
        { name: 'HC-SR04 Ultrasonic Sensor', category: 'iot_hardware', role: 'Distance Measurement', whyChosen: 'Calculates distance to obstacles in front of the user via ultrasonic ping times.' },
        { name: 'Active Buzzer & Vibration Motor', category: 'iot_hardware', role: 'Haptic Feedback Actuators', whyChosen: 'Provides immediate audio beep warnings and haptic vibrations to alert the user.' }
      );
      componentList = [
        { component: `${preferredController || 'Arduino Uno'} Board`, purpose: 'Measures ping response and drives alert buzzers.', required: true, estimatedPrice: '₹350', quantity: 1, wiringRole: 'Power via 9V battery, common GND.' },
        { component: 'HC-SR04 Ultrasonic Sensor', purpose: 'Measures distance in front of the stick.', required: true, estimatedPrice: '₹120', quantity: 1, wiringRole: 'Trigger to Pin 9, Echo to Pin 10, VCC to 5V.' },
        { component: 'Vibration Motor & Driver', purpose: 'Delivers haptic vibrations for tactile warnings.', required: true, estimatedPrice: '₹150', quantity: 1, wiringRole: 'Signal wire to Pin 6 via NPN transistor.' },
        { component: 'Active 5V Buzzer', purpose: 'Sounds audible alarm tones.', required: true, estimatedPrice: '₹40', quantity: 1, wiringRole: 'Connected to Pin 5 via 220-ohm resistor.' }
      ];
      firmwareStackList = ['NewPing.h (Optimized ultrasonic trigger library)', 'Arduino.h (Core library)'];
      safetyNotesList = ['Waterproof the ultrasonic sensors since they are low to the ground and exposed to puddles.', 'Ensure vibration motor is driven through a transistor, not directly from MCU pins.'];
    } else if (query.includes('parking')) {
      // Smart Parking
      codingReq = 'Low';
      hwComp = 'Basic';
      techStack.push(
        { name: 'IR Obstacle Sensors', category: 'iot_hardware', role: 'Occupancy Detection', whyChosen: 'Detects the physical presence of cars in the slots by checking infrared reflections.' },
        { name: 'Servo Motor (SG90)', category: 'iot_hardware', role: 'Gate Actuator', whyChosen: 'Swings open the parking barrier gate automatically when a spot is booked or empty.' }
      );
      componentList = [
        { component: `${preferredController || 'NodeMCU'} MCU Board`, purpose: 'Polls slot sensors and manages gate servo motor.', required: true, estimatedPrice: '₹300', quantity: 1, wiringRole: 'Power via 5V USB, GND to GND.' },
        { component: 'IR Obstacle Avoidance Sensors', purpose: 'Detects cars occupying parking spaces.', required: true, estimatedPrice: '₹80', quantity: 3, wiringRole: 'Out pins to Pin D1, D2, D3, VCC to 3.3V.' },
        { component: 'SG90 Micro Servo Motor', purpose: 'Operates entry/exit gate barrier.', required: true, estimatedPrice: '₹150', quantity: 1, wiringRole: 'PWM Signal to Pin D4, VCC to 5V.' },
        { component: '16x2 I2C LCD Display', purpose: 'Shows slot occupancy feedback locally.', required: true, estimatedPrice: '₹220', quantity: 1, wiringRole: 'SDA to Pin D2, SCL to Pin D1.' }
      ];
      firmwareStackList = ['Servo.h (PWM gate actuator control)', 'LiquidCrystal_I2C.h (LCD controller)'];
      safetyNotesList = ['Isolate the servo motor supply to avoid MCU brownouts during high starting currents.', 'Adjust IR sensor potentiometers to filter out sunlight noise.'];
    } else if (query.includes('agri') || query.includes('irrigation') || query.includes('plant') || query.includes('water')) {
      // Smart Agriculture
      codingReq = 'Medium';
      hwComp = 'Intermediate';
      techStack.push(
        { name: 'Capacitive Soil Moisture Sensor', category: 'iot_hardware', role: 'Soil Telemetry', whyChosen: 'Measures soil water content resistively without sensor decay.' },
        { name: '5V Relay Module & Water Pump', category: 'iot_hardware', role: 'Actuation', whyChosen: 'Switches the DC water pump safely using external power rails.' }
      );
      componentList = [
        { component: `${preferredController || 'ESP32'} MCU Board`, purpose: 'Reads moisture levels and switches watering cycles.', required: true, estimatedPrice: '₹450', quantity: 1, wiringRole: 'VCC to 5V USB source, GND to GND.' },
        { component: 'Capacitive Soil Moisture Sensor', purpose: 'Measures volumetric soil moisture content.', required: true, estimatedPrice: '₹120', quantity: 1, wiringRole: 'Analog Out to GPIO 34, VCC to 3.3V.' },
        { component: '5V Single-Channel Relay', purpose: 'Isolates pump electrical load from MCU.', required: true, estimatedPrice: '₹100', quantity: 1, wiringRole: 'Signal to GPIO 26, VCC to 5V, GND to GND.' },
        { component: '3-6V Mini DC Water Pump', purpose: 'Pumps water to plants.', required: true, estimatedPrice: '₹150', quantity: 1, wiringRole: 'Connected to relay contact terminals.' }
      ];
      firmwareStackList = ['WiFi.h (ESP32 network connection)', 'PubSubClient.h (MQTT communication)'];
      safetyNotesList = ['Ensure high-voltage elements (if using AC pumps) are fully isolated in a plastic box.', 'Do not submerge the electronics or wires in water.'];
    } else if (query.includes('fire') || query.includes('smoke') || query.includes('gas') || query.includes('leak')) {
      // Fire Detection
      codingReq = 'Medium';
      hwComp = 'Intermediate';
      techStack.push(
        { name: 'MQ-2 Gas Sensor', category: 'iot_hardware', role: 'Smoke Telemetry', whyChosen: 'Detects combustible gases and smoke levels in ambient air.' },
        { name: 'Flame Sensor Module', category: 'iot_hardware', role: 'Infrared Flame detection', whyChosen: 'Detects light waves emitted by fire sources within a 180-degree spectrum.' }
      );
      componentList = [
        { component: `${preferredController || 'STM32'} MCU Board`, purpose: 'Polls gas and flame thresholds, sounding emergency alarms.', required: true, estimatedPrice: '₹350', quantity: 1, wiringRole: 'VCC to 3.3V, GND to GND.' },
        { component: 'MQ-2 Smoke & Gas Sensor', purpose: 'Measures gas concentration.', required: true, estimatedPrice: '₹180', quantity: 1, wiringRole: 'Analog out to PA0 (ADC1), VCC to 5V.' },
        { component: 'Flame Sensor (IR)', purpose: 'Detects fire light source.', required: true, estimatedPrice: '₹90', quantity: 1, wiringRole: 'Digital output to PA1.' },
        { component: 'Active Piezo Buzzer', purpose: 'Emits loud warning sirens.', required: true, estimatedPrice: '₹50', quantity: 1, wiringRole: 'Connected to PA2 via 220-ohm resistor.' }
      ];
      firmwareStackList = ['STM32ADC.h (Fast ADC conversions)', 'SoftwareSerial.h (Optional GSM communication)'];
      safetyNotesList = ['MQ-2 sensors require a pre-heating phase (~2 minutes) to return stable values.', 'Avoid proximity of the STM32 board to active heat or fires during tests.'];
    } else if (query.includes('surveillance') || query.includes('robot') || query.includes('tracking')) {
      // AI Surveillance Robot
      codingReq = 'High';
      hwComp = 'Advanced';
      techStack.push(
        { name: 'L298N Motor Driver', category: 'iot_hardware', role: 'Actuator control', whyChosen: 'Enables high-current dual H-bridge control of wheels direction and speed.' },
        { name: 'Raspberry Pi Camera Module', category: 'iot_hardware', role: 'AI Video Telemetry', whyChosen: 'Streams video directly to Raspberry Pi for real-time OpenCV object tracking.' }
      );
      componentList = [
        { component: `${preferredController || 'Raspberry Pi 4'} Board`, purpose: 'Executes Python scripts, runs TensorFlow Lite, and processes video streams.', required: true, estimatedPrice: '₹4500', quantity: 1, wiringRole: 'Power via 5V 3A USB-C regulator.' },
        { component: 'L298N Dual H-Bridge Motor Driver', purpose: 'Drives wheeled chassis motors.', required: true, estimatedPrice: '₹220', quantity: 1, wiringRole: 'IN1-IN4 to GPIO pins, OUT1-OUT4 to DC motors.' },
        { component: '5MP RPi Wide-Angle Camera', purpose: 'Captures raw frames for neural network input.', required: true, estimatedPrice: '₹600', quantity: 1, wiringRole: 'Flat flex ribbon connected to CSI port.' },
        { component: '12V DC Geared Motors & Wheels', purpose: 'Moves the robot platform.', required: true, estimatedPrice: '₹400', quantity: 2, wiringRole: 'Wired to L298N output terminals.' }
      ];
      firmwareStackList = ['OpenCV Python (Computer vision)', 'TensorFlow Lite (Object detection model execution)', 'RPi.GPIO (Actuators control)'];
      safetyNotesList = ['Always power Raspberry Pi and DC motors from separate battery sources to avoid CPU resets from motor noise.', 'Do not short-circuit the L298N driver terminal outputs.'];
    } else if (query.includes('energy') || query.includes('meter')) {
      // Smart Energy Meter
      codingReq = 'Medium';
      hwComp = 'Intermediate';
      techStack.push(
        { name: 'PZEM-004T AC Sensor', category: 'iot_hardware', role: 'Power Telemetry', whyChosen: 'Safely measures voltage, current, power factor, and active power usage.' },
        { name: 'Solid State Relay (SSR)', category: 'iot_hardware', role: 'Grid Switch Actuator', whyChosen: 'Allows remote grid connection/disconnection via safe digital switching.' }
      );
      componentList = [
        { component: `${preferredController || 'ESP32'} MCU Board`, purpose: 'Reads PZEM telemetry and uploads it to cloud broker.', required: true, estimatedPrice: '₹450', quantity: 1, wiringRole: 'Power via 5V adapter, common GND.' },
        { component: 'PZEM-004T AC Power Sensor V3.0', purpose: 'Measures active power, voltage, and current.', required: true, estimatedPrice: '₹950', quantity: 1, wiringRole: 'TX/RX to hardware serial pins via optoisolator.' },
        { component: '16x2 LCD Display with I2C module', purpose: 'Displays instant usage values locally.', required: true, estimatedPrice: '₹220', quantity: 1, wiringRole: 'SDA to GPIO 21, SCL to GPIO 22.' },
        { component: 'Solid State Relay (40A SSR)', purpose: 'Allows remote power cutoff.', required: true, estimatedPrice: '₹550', quantity: 1, wiringRole: 'Control pins to MCU GPIO 25.' }
      ];
      firmwareStackList = ['PZEM004Tv30.h (AC telemetry parser)', 'LiquidCrystal_I2C.h (LCD driver)', 'WiFi.h (Data upload client)'];
      safetyNotesList = ['WARNING: This circuit interfaces with high voltage 230V AC lines. Ensure all AC connections are properly enclosed and insulated.', 'Never touch raw terminals while the meter is plugged into grid mains.'];
    } else {
      // General/Unknown Hardware
      codingReq = 'Medium';
      hwComp = 'Intermediate';
      techStack.push(
        { name: 'Analog/Digital Sensor Module', category: 'iot_hardware', role: 'Environment Telemetry', whyChosen: 'Reads ambient values (humidity, heat, light, etc.) for processing.' },
        { name: 'LED and Buzzer Alerts', category: 'iot_hardware', role: 'Output Indicator', whyChosen: 'Provides basic local feedback when critical conditions are triggered.' }
      );
      componentList = [
        { component: `${preferredController || 'Arduino Uno'} Board`, purpose: 'Main processing controller.', required: true, estimatedPrice: '₹350', quantity: 1, wiringRole: 'Power via USB / DC Jack.' },
        { component: 'Basic Sensor Module', purpose: 'Collects feedback data from environment.', required: true, estimatedPrice: '₹150', quantity: 1, wiringRole: 'Data out to analog/digital pin.' },
        { component: 'Active buzzer and Status LEDs', purpose: 'Alert indicator warnings.', required: true, estimatedPrice: '₹60', quantity: 1, wiringRole: 'Wired to digital out pins.' }
      ];
      firmwareStackList = ['Arduino.h (Core environment libraries)'];
      safetyNotesList = ['Ensure proper current limiting resistors are placed in series with LEDs and buzzers.', 'Check pin voltages to avoid MCU overload.'];
    }

    if (toolsList.length === 0) {
      toolsList = [
        { tool: 'Soldering Iron & Solder wire', purpose: 'For making permanent circuit connections.', whyNeeded: 'Ensures parts remain securely connected under vibrations.', whereUsed: 'Phase 8: Perfboard Assembly', beginnerFriendliness: 'Requires minor practice but highly accessible.' },
        { tool: 'Digital Multimeter', purpose: 'To debug voltage levels, check wire continuity, and monitor current draw.', whyNeeded: 'Essential to confirm 3.3V and 5V power rails before powering up components.', whereUsed: 'Phase 3: Schematic & Breadboard Assembly', beginnerFriendliness: 'Very easy to use for basic voltage and continuity checks.' },
        { tool: 'Breadboard & Jumper Wires', purpose: 'For initial hardware prototyping and wire routing.', whyNeeded: 'Allows testing circuit connections without permanent solder joints.', whereUsed: 'Phase 3: Schematic & Breadboard Assembly', beginnerFriendliness: 'Highly beginner friendly with simple plug-and-play layout.' }
      ];
    }

    // Connect software stack elements if WiFi/BLE are selected
    if (connectivityType && connectivityType !== 'Offline') {
      techStack.push(
        { name: 'MQTT Broker (HiveMQ)', category: 'backend', role: 'Message broker transport', whyChosen: 'Lightweight broker chosen to push sensor readings dynamically.' },
        { name: 'Firebase Database', category: 'database', role: 'Realtime database store', whyChosen: 'Instantly caches incoming logs to render web charts.' }
      );
    }

    // Build architecture nodes
    const nodes = [
      { id: 'sensor', label: 'Sensor Module', type: 'iot_device', x: 150, y: 150 },
      { id: 'mcu', label: `${preferredController || 'MCU'} Controller`, type: 'iot_device', x: 350, y: 150 }
    ];
    const edges = [
      { from: 'sensor', to: 'mcu', label: 'Analog/I2C Signals', dashed: false }
    ];

    if (connectivityType && connectivityType !== 'Offline') {
      nodes.push(
        { id: 'broker', label: 'Cloud MQTT Broker', type: 'server', x: 550, y: 150 },
        { id: 'dashboard', label: 'Monitoring Web UI', type: 'client', x: 750, y: 150 }
      );
      edges.push(
        { from: 'mcu', to: 'broker', label: 'MQTT Publish', dashed: true },
        { from: 'broker', to: 'dashboard', label: 'WebSocket Subscribe', dashed: true }
      );
    } else {
      nodes.push(
        { id: 'output', label: 'Actuator / Alert Output', type: 'iot_device', x: 550, y: 150 }
      );
      edges.push(
        { from: 'mcu', to: 'output', label: 'GPIO Digital Output', dashed: false }
      );
    }

    // Build Roadmap (10 phases tailored to project complexity/category)
    const roadmapPhases = [
      {
        phaseName: 'Phase 1: Component Sourcing & Prep',
        tasks: [
          { id: 'hw-1', title: 'Procure Hardware Components', description: `Gather the specified ${preferredController || 'MCU'} board and sensors from lab stock or suppliers.`, duration: '3 days', tools: ['BOM list'] },
          { id: 'hw-2', title: 'Setup Lab Debug Workspace', description: 'Clear breadboards, gather multimeter, and setup USB serial drivers.', duration: '2 days', tools: ['Digital Multimeter', 'Soldering Station'] }
        ]
      },
      {
        phaseName: 'Phase 2: Schematic Designing',
        tasks: [
          { id: 'hw-3', title: 'Draw Fritzing Schematic Map', description: 'Lay out breadboard pins connections to prevent wrong wiring.', duration: '3 days', tools: ['Fritzing', 'EasyEDA'] }
        ]
      },
      {
        phaseName: 'Phase 3: Breadboard Prototyping',
        tasks: [
          { id: 'hw-4', title: 'Assemble Circuit on Breadboard', description: 'Insert sensors and wire them to correct GPIO pin channels.', duration: '4 days', tools: ['Breadboard', 'Jumper Wires'] }
        ]
      },
      {
        phaseName: 'Phase 4: Power Rails Testing',
        tasks: [
          { id: 'hw-5', title: 'Verify Input Pin Voltages', description: 'Ensure no sensor pins exceed 3.3V or 5V limits to prevent burnout.', duration: '2 days', tools: ['Multimeter'] }
        ]
      },
      {
        phaseName: 'Phase 5: Boilerplate Firmware Code',
        tasks: [
          { id: 'hw-6', title: 'Flash Serial Test Code', description: 'Write basic pin setup loops and confirm board responds on Serial console.', duration: '3 days', tools: ['Arduino IDE', 'USB-C Cable'] }
        ]
      },
      {
        phaseName: 'Phase 6: Sensors Telemetry Verification',
        tasks: [
          { id: 'hw-7', title: 'Calibrate Sensors Readings', description: 'Log raw analog telemetry values and apply linear mapping formulas.', duration: '4 days', tools: ['Arduino Serial Monitor'] }
        ]
      },
      {
        phaseName: 'Phase 7: Network Integration & MQTT',
        tasks: [
          { id: 'hw-8', title: 'Establish Connectivity Link', description: isOffline ? 'Verify local offline loops run without network blocks.' : 'Write WiFi credentials and publish JSON test data to MQTT topic.', duration: '5 days', tools: isOffline ? ['Serial Debugger'] : ['PubSubClient library'] }
        ]
      },
      {
        phaseName: 'Phase 8: Perfboard Soldering',
        tasks: [
          { id: 'hw-9', title: 'Solder Circuit Permanently', description: 'Transfer clean breadboard connections onto a perfboard using headers.', duration: '5 days', tools: ['Soldering Iron', 'Solder Wire'] }
        ]
      },
      {
        phaseName: 'Phase 9: Enclosure Housing',
        tasks: [
          { id: 'hw-10', title: 'Mount Components inside Box', description: 'Secure board and routing inside a plastic project box with sensor slits.', duration: '3 days', tools: ['Hot Glue Gun', 'Project Box'] }
        ]
      },
      {
        phaseName: 'Phase 10: Final Deployment Test',
        tasks: [
          { id: 'hw-11', title: 'Continuous Battery Run Test', description: `Power via ${powerSource || 'Battery'} and track stability under daily conditions.`, duration: '4 days', tools: [`${powerSource || 'Battery'}`] }
        ]
      }
    ];

    // Filter roadmap phases if simpler project
    let finalRoadmap = roadmapPhases;
    if (isSimple) {
      finalRoadmap = roadmapPhases.filter(p => p.phaseName !== 'Phase 7: Network Integration & MQTT');
    }

    return {
      projectName: title,
      domain: hardwareCategory || 'IoT',
      difficulty: skillLevel,
      timeline,
      description,
      codingRequirement: codingReq,
      hardwareComplexity: hwComp,
      uniquenessAnalysis: {
        score: isSimple ? 78 : 88,
        summary: `A practical implementation in the ${hardwareCategory} category. Adding solar charging modules or local TinyML filters will enhance this.`,
        suggestions: [
          'Incorporate local micro-SD storage log backup systems to prevent telemetry loss.',
          'Optimize sleep cycles (Deep Sleep) to conserve battery during low activity.',
          'Design custom PCB tracks via EasyEDA and fabricate a prototype board.'
        ]
      },
      techStack,
      roadmap: finalRoadmap,
      architecture: { nodes, edges },
      hardwareComponents: componentList,
      hardwareTools: toolsList,
      estimatedCost: estCostVal,
      firmwareStack: firmwareStackList,
      safetyNotes: safetyNotesList,
      realWorldApplications: [
        `Commercial deployment of smart tracking in localized logistics or security fields.`,
        `Student lab demonstration of modern integrated circuit microcontrollers.`
      ],
      projectType: 'hardware',
      hardwareCategory: hardwareCategory || '',
      preferredController: preferredController || '',
      budgetRange: budgetRange || '',
      connectivityType: connectivityType || '',
      powerSource: powerSource || ''
    };
  }

  // Try matching search queries to our high-fidelity mockPlans
  if (query.includes('diet') || query.includes('food') || query.includes('meal') || query.includes('calorie')) {
    console.log('🎯 Matched AI Fallback query: "AI-Powered Personalized Diet Planner"');
    return mockPlans[0];
  }
  if (query.includes('plant') || query.includes('irrigation') || query.includes('water') || query.includes('iot') || query.includes('soil')) {
    console.log('🎯 Matched AI Fallback query: "Smart Plant Irrigation IoT System"');
    return mockPlans[1];
  }
  if (query.includes('code') || query.includes('editor') || query.includes('collab') || query.includes('ide') || query.includes('peer')) {
    console.log('🎯 Matched AI Fallback query: "CollabCode – Real-time Peer IDE"');
    return mockPlans[2];
  }

  // Fallback to custom template
  console.log('🎯 Fallback matched generic project template');
  return {
    ...fallbackPlan,
    projectName: title,
    domain,
    difficulty: skillLevel,
    timeline,
    description,
  };
};
