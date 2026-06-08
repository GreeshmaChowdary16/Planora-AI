export interface TechStackItem {
  name: string;
  category: 'frontend' | 'backend' | 'database' | 'iot_hardware' | 'cloud_deployment' | 'ai_ml';
  role: string;
  whyChosen: string;
}

export interface RoadmapTask {
  id: string;
  title: string;
  description: string;
  duration: string;
  completed: boolean;
  tools?: string[];
}

export interface RoadmapPhase {
  phaseName: string;
  tasks: RoadmapTask[];
}

export interface ArchitectureNode {
  id: string;
  label: string;
  type: 'client' | 'server' | 'database' | 'external_api' | 'iot_device';
  x: number;
  y: number;
}

export interface ArchitectureEdge {
  from: string;
  to: string;
  label?: string;
  dashed?: boolean;
}

export interface ResourceItem {
  name: string;
  type: 'dataset' | 'api' | 'documentation' | 'tool';
  url: string;
  description: string;
}

export interface ExistingProject {
  name: string;
  description: string;
  limitations: string[];
}

export interface ResearchAnalysis {
  existingProjects: ExistingProject[];
  projectAdvantages: string[];
  researchTopics: string[];
  futureImprovements: string[];
  innovationScore: number;
}

export interface ToolDetail {
  name: string;
  purpose: string;
  reason: string;
}

export interface DeploymentPlatform {
  platform: string;
  reason: string;
  freeTier: string;
}

export interface DeploymentStep {
  step: string;
  description: string;
}

export interface ProjectToolsAndDeployment {
  developmentTools: ToolDetail[];
  collaborationTools: ToolDetail[];
  apiTestingTools: ToolDetail[];
  deployment: {
    frontend: DeploymentPlatform;
    backend: DeploymentPlatform;
    database: DeploymentPlatform;
  };
  utilities: ToolDetail[];
  versionControl: {
    gitImportance: string;
    githubImportance: string;
    basics: string[];
  };
  deploymentSteps: DeploymentStep[];
}

export interface ProjectPlan {
  id: string;
  title: string;
  domain: string;
  skillLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  description: string;
  uniquenessAnalysis: {
    score: number;
    summary: string;
    suggestions: string[];
  };
  techStack: TechStackItem[];
  roadmap: RoadmapPhase[];
  architecture: {
    nodes: ArchitectureNode[];
    edges: ArchitectureEdge[];
  };
  resources?: ResourceItem[];
  researchAnalysis?: ResearchAnalysis;
  toolsAndDeployment?: ProjectToolsAndDeployment;
  isPinned?: boolean;
  projectType?: 'software' | 'hardware';
  hardwareComponents?: {
    component: string;
    purpose: string;
    required: boolean;
    estimatedPrice?: string;
    quantity?: number;
    wiringRole?: string;
  }[];
  hardwareTools?: {
    tool: string;
    purpose: string;
    whyNeeded?: string;
    whereUsed?: string;
    beginnerFriendliness?: string;
  }[];
  estimatedCost?: string;
  firmwareStack?: string[];
  safetyNotes?: string[];
  hardwareCategory?: string;
  preferredController?: string;
  budgetRange?: string;
  connectivityType?: string;
  powerSource?: string;
  realWorldApplications?: string[];
  codingRequirement?: 'Low' | 'Medium' | 'High';
  hardwareComplexity?: 'Basic' | 'Intermediate' | 'Advanced';
}

export const mockPlans: ProjectPlan[] = [
  {
    id: 'ai-diet-planner',
    title: 'AI-Powered Personalized Diet Planner',
    domain: 'AI & Web Development',
    skillLevel: 'Intermediate',
    duration: '6 weeks',
    description: 'An AI-driven web application that suggests personalized meal structures, recipes, and caloric targets based on user physical metrics, dietary restrictions, fitness goals, and real-time food preferences.',
    uniquenessAnalysis: {
      score: 82,
      summary: 'While meal planning tools are common, integrating real-time ingredient availability APIs and local grocery store inventory data makes this project stand out compared to simple GPT wrappers.',
      suggestions: [
        'Add a food photo-to-calories scanner using a lightweight mobile browser camera API and Gemini Vision.',
        'Implement grocery cart auto-generation with direct checkout integration placeholders (e.g. Instacart API).',
        'Incorporate offline caching of diet roadmaps using browser Service Workers so students can access meals at the gym without network.'
      ]
    },
    techStack: [
      { name: 'React.js', category: 'frontend', role: 'UI Library', whyChosen: 'Component-based architecture allows for smooth tab switching and instant updates on macro calculations.' },
      { name: 'Tailwind CSS', category: 'frontend', role: 'Styling', whyChosen: 'Provides rapid visual prototyping for creating sleek glassmorphic dashboard designs and responsiveness.' },
      { name: 'Node.js & Express', category: 'backend', role: 'Web Server', whyChosen: 'Non-blocking I/O handles multiple API requests (Google Gemini API, USDA API) simultaneously.' },
      { name: 'MongoDB', category: 'database', role: 'NoSQL Database', whyChosen: 'Flexible document schema easily stores variable user profiles and custom daily meal plans without rigid migrations.' },
      { name: 'Google Gemini API', category: 'ai_ml', role: 'AI Model API', whyChosen: 'Generates structured JSON dietary recommendations and tailors recipes dynamically based on prompt templates.' },
      { name: 'Vercel / Render', category: 'cloud_deployment', role: 'Hosting Platforms', whyChosen: 'Provides free tiers and seamless CI/CD git integration for rapid student deployment.' }
    ],
    roadmap: [
      {
        phaseName: 'Phase 1: Setup & UI Scaffolding',
        tasks: [
          { id: 'diet-1', title: 'Initialize Project Repository', description: 'Configure React frontend with Tailwind CSS and set up Node/Express folder structures.', duration: '3 days', completed: false, tools: ['Vite', 'React.js', 'Tailwind CSS', 'npm'] },
          { id: 'diet-2', title: 'Build User Profile Form', description: 'Create multi-step input screens capturing age, weight, height, allergens, and dietary goals.', duration: '4 days', completed: false, tools: ['React Hook Form', 'Zod', 'Lucide React'] }
        ]
      },
      {
        phaseName: 'Phase 2: Backend & Gemini API Integration',
        tasks: [
          { id: 'diet-3', title: 'Set up Express API Server', description: 'Configure basic Express routing and set up environment variables for API safety.', duration: '3 days', completed: false, tools: ['Node.js', 'Express', 'TypeScript', 'dotenv'] },
          { id: 'diet-4', title: 'Integrate Gemini API Client', description: 'Create utility functions to prompt Gemini 2.5 Flash and return structured JSON recipes and macro targets.', duration: '5 days', completed: false, tools: ['groq-sdk', 'Node.js', 'JSON.parse'] }
        ]
      },
      {
        phaseName: 'Phase 3: Core Features & USDA Lookup',
        tasks: [
          { id: 'diet-5', title: 'USDA Food Central Integration', description: 'Connect third-party nutritional database to allow search of raw ingredients and caloric values.', duration: '4 days', completed: false, tools: ['Axios', 'USDA API Key'] },
          { id: 'diet-6', title: 'Implement Dashboard Visualizer', description: 'Build interactive progress bar widgets showing protein, carb, fat, and hydration percentages.', duration: '5 days', completed: false, tools: ['Recharts', 'Tailwind CSS'] }
        ]
      },
      {
        phaseName: 'Phase 4: Optimization & Deployment',
        tasks: [
          { id: 'diet-7', title: 'Mobile UX Refinement', description: 'Ensure the macro logs and recipes are fully responsive and feel native on mobile screens.', duration: '4 days', completed: false, tools: ['Chrome DevTools', 'Tailwind CSS'] },
          { id: 'diet-8', title: 'Deploy Web Apps', description: 'Host the React client on Vercel and backend server on Render, connecting environment variables.', duration: '4 days', completed: false, tools: ['Vercel CLI', 'Render CLI', 'Git'] }
        ]
      }
    ],
    architecture: {
      nodes: [
        { id: 'client', label: 'React Client (Vite)', type: 'client', x: 100, y: 150 },
        { id: 'server', label: 'Express API Gateway', type: 'server', x: 300, y: 150 },
        { id: 'database', label: 'MongoDB (Atlas)', type: 'database', x: 500, y: 80 },
        { id: 'gemini', label: 'Gemini AI API', type: 'external_api', x: 500, y: 180 },
        { id: 'usda', label: 'USDA Food API', type: 'external_api', x: 500, y: 280 }
      ],
      edges: [
        { from: 'client', to: 'server', label: 'HTTPS / JSON' },
        { from: 'server', to: 'database', label: 'Mongoose Driver' },
        { from: 'server', to: 'gemini', label: 'SDK Call' },
        { from: 'server', to: 'usda', label: 'REST Call' }
      ]
    },
    researchAnalysis: {
      existingProjects: [
        {
          name: 'MyFitnessPal Calorie Tracker',
          description: 'A commercial application to log food items manually and calculate daily calorie intake.',
          limitations: [
            'Requires manual logging of every meal, leading to high user churn.',
            'Does not offer smart AI-driven recommendations or predictive health insights based on historical trends.'
          ]
        },
        {
          name: 'Academic Rule-Based Diet Planner',
          description: 'A prototype web application using simple hardcoded static calorie thresholds to recommend diet plans.',
          limitations: [
            'Lacks personalization for individual metabolism or dynamic lifestyle changes.',
            'Static advice becomes generic and does not integrate real-time user feedback loops.'
          ]
        }
      ],
      projectAdvantages: [
        'AI-driven macro and diet recommendations dynamically tailored using user profile statistics and Groq integrations.',
        'Predictive health dashboards mapping weight goals against daily nutrition trends using automated algorithms.',
        'Interactive real-time meal swap suggestions to address instant ingredient limitations or allergic alerts.'
      ],
      researchTopics: [
        'Artificial Intelligence in Personalized Medical Nutrition',
        'Predictive Analytics for Preventive Lifestyle Disease Management',
        'Natural Language Processing for Automating Diet Logging Interfaces'
      ],
      futureImprovements: [
        'Mobile application companion with image-recognition capabilities to identify food items via camera snapshots.',
        'Integration with smart wearable devices (e.g. Fitbit, Apple Watch) to sync active metabolic rates in real time.',
        'Crowdsourced database for regional food recipes with automated validation protocols.'
      ],
      innovationScore: 85
    }
  },
  {
    id: 'smart-plant-irrigation',
    title: 'Smart Plant Irrigation IoT System',
    projectType: 'hardware',
    domain: 'IoT & Hardware Systems',
    skillLevel: 'Advanced',
    duration: '8 weeks',
    estimatedCost: '$25 USD',
    hardwareComponents: [
      { component: 'ESP32 Development Board', purpose: 'Main MCU for sensor reading, MQTT publishing, and logic control.', required: true },
      { component: 'Capacitive Soil Moisture Sensor v1.2', purpose: 'Measures soil volumetric water content without electrode corrosion.', required: true },
      { component: '5V Solenoid Valve / 5V DC Water Pump', purpose: 'Actuator to control water flow to the plant root zone.', required: true },
      { component: 'S8050 NPN Transistor & 1N4007 Diode', purpose: 'Driver circuit to switch the 5V water pump safely from 3.3V GPIO.', required: true }
    ],
    hardwareTools: [
      { tool: 'Soldering Iron & Solder wire', purpose: 'For making permanent circuit connections.' },
      { tool: 'Digital Multimeter', purpose: 'To debug voltage levels, check wire continuity, and monitor current draw.' },
      { tool: 'Breadboard & Jumper Wires', purpose: 'For initial hardware prototyping and wire routing.' }
    ],
    firmwareStack: [
      'WiFi.h (ESP32 core library for network connection)',
      'PubSubClient (MQTT broker publishing client library)',
      'ArduinoJson (Optimized JSON serialization for sensor payload)'
    ],
    safetyNotes: [
      'Ensure the 5V power supply has shared common ground (GND) with the ESP32.',
      'Always place a flyback diode (e.g. 1N4007) in parallel with the DC pump to prevent inductive voltage spikes from killing the transistor or ESP32.',
      'Keep electrical connections and batteries completely isolated from the water tubes and pump outlet.'
    ],
    description: 'An automated plant watering system utilizing ESP32 microcontrollers, soil moisture sensors, and water pumps, integrated with a cloud dashboard to track moisture levels and execute schedules remotely.',
    uniquenessAnalysis: {
      score: 87,
      summary: 'While smart watering is popular, adding real-time weather API forecasting to dynamically delay irrigation if rain is forecasted in the next 12 hours is a highly practical and eco-friendly upgrade.',
      suggestions: [
        'Use solar panel charging estimations to display hardware battery degradation logs on the dashboard.',
        'Implement an MQTT broker failover system that saves logs onto a local micro-SD card if WiFi connection drops.',
        'Integrate a voice-command toggle using Web Speech APIs in the web app to trigger immediate watering.'
      ]
    },
    techStack: [
      { name: 'ESP32 Development Board', category: 'iot_hardware', role: 'Microcontroller Unit', whyChosen: 'Built-in WiFi and Bluetooth capabilities at a very low cost, with plenty of analog pins for sensors.' },
      { name: 'Soil Moisture Sensor (Capacitive)', category: 'iot_hardware', role: 'Analog Sensors', whyChosen: 'Capacitive sensors resist corrosion over time much better than cheaper resistive soil sensors.' },
      { name: 'Arduino IDE & C++', category: 'iot_hardware', role: 'Embedded Programming', whyChosen: 'C++ provides direct hardware performance, and the Arduino ecosystem provides robust libraries for MQTT/WiFi.' },
      { name: 'MQTT Broker (HiveMQ)', category: 'backend', role: 'Message Transport Protocol', whyChosen: 'Lightweight publish-subscribe protocol ideal for minimal packet transfer on low-power battery-operated IoT boards.' },
      { name: 'Firebase Realtime DB', category: 'database', role: 'NoSQL Data Sync', whyChosen: 'Instantly pushes incoming sensor logs from MQTT to the web dashboard without needing WebSockets logic.' },
      { name: 'React (Web)', category: 'frontend', role: 'Dashboard Frontend', whyChosen: 'Perfect framework for rendering SVG dials and interactive charts displaying realtime moisture levels.' }
    ],
    roadmap: [
      {
        phaseName: 'Phase 1: Hardware Assembly & Basic Code',
        tasks: [
          { id: 'iot-1', title: 'Hardware Wiring Setup', description: 'Wire ESP32, capacitive moisture sensor, relay switch, and water pump on breadboard.', duration: '4 days', completed: false, tools: ['ESP32 Board', 'Moisture Sensor', '5V Relay Switch', 'Jumper Wires'] },
          { id: 'iot-2', title: 'Write Basic ESP32 Firmware', description: 'Write basic C++ code to read moisture sensor values and print to serial logs.', duration: '5 days', completed: false, tools: ['Arduino IDE', 'C++', 'ESP32 Sketch Core'] }
        ]
      },
      {
        phaseName: 'Phase 2: Cloud Communication Setup',
        tasks: [
          { id: 'iot-3', title: 'Set up HiveMQ Broker', description: 'Create a free HiveMQ cloud broker instance and verify client publishing capabilities.', duration: '4 days', completed: false, tools: ['HiveMQ Console', 'MQTT Box Client'] },
          { id: 'iot-4', title: 'Write MQTT ESP32 client', description: 'Code the ESP32 to connect to local WiFi and publish sensor data to the broker every 15 minutes.', duration: '6 days', completed: false, tools: ['PubSubClient', 'WiFi Library', 'Arduino IDE'] }
        ]
      },
      {
        phaseName: 'Phase 3: Database & Cloud Integration',
        tasks: [
          { id: 'iot-5', title: 'MQTT to Firebase Bridge', description: 'Write a small Node.js server bridge or utilize cloud functions to forward MQTT payloads into Firebase DB.', duration: '5 days', completed: false, tools: ['Node.js', 'Firebase SDK', 'mqtt-node-client'] },
          { id: 'iot-6', title: 'Configure Firebase Security Rules', description: 'Secure the database endpoints while keeping read operations open for the web dashboard.', duration: '3 days', completed: false, tools: ['Firebase Console', 'JSON Config Rules'] }
        ]
      },
      {
        phaseName: 'Phase 4: Web Dashboard Development',
        tasks: [
          { id: 'iot-7', title: 'Build React charts', description: 'Integrate custom chart components to visualize moisture levels over the past 24 hours.', duration: '6 days', completed: false, tools: ['React.js', 'ChartJS', 'Tailwind CSS'] },
          { id: 'iot-8', title: 'Implement Manual Watering Trigger', description: 'Build a button in React that writes to MQTT and triggers the ESP32 relay to open the water pump.', duration: '5 days', completed: false, tools: ['mqtt.js client', 'React State Hook'] }
        ]
      }
    ],
    architecture: {
      nodes: [
        { id: 'sensors', label: 'Capacitive Sensors', type: 'iot_device', x: 80, y: 150 },
        { id: 'esp32', label: 'ESP32 MCU Board', type: 'iot_device', x: 240, y: 150 },
        { id: 'mqtt', label: 'HiveMQ MQTT Broker', type: 'server', x: 420, y: 150 },
        { id: 'bridge', label: 'Node Connector / Server', type: 'server', x: 420, y: 260 },
        { id: 'firebase', label: 'Firebase Realtime DB', type: 'database', x: 580, y: 200 },
        { id: 'dashboard', label: 'React Web Client', type: 'client', x: 740, y: 200 }
      ],
      edges: [
        { from: 'sensors', to: 'esp32', label: 'Analog Signal' },
        { from: 'esp32', to: 'mqtt', label: 'MQTT Publish' },
        { from: 'mqtt', to: 'bridge', label: 'TCP Subscribe' },
        { from: 'bridge', to: 'firebase', label: 'Firebase SDK' },
        { from: 'dashboard', to: 'firebase', label: 'Realtime Sync', dashed: true },
        { from: 'dashboard', to: 'mqtt', label: 'Trigger Watering', dashed: true }
      ]
    },
    researchAnalysis: {
      existingProjects: [
        {
          name: 'Basic Timer-Based Watering System',
          description: 'A legacy hardware system that waters crops or house plants on fixed daily intervals.',
          limitations: [
            'Irrigates regardless of actual soil moisture or local weather predictions, leading to water wastage.',
            'No diagnostic dashboard or remote notification capability.'
          ]
        },
        {
          name: 'Standard Sensor-Triggered Irrigation Kit',
          description: 'An IoT project connecting soil moisture sensors to trigger solenoid valves locally.',
          limitations: [
            'Uses simple hardware-level logic without remote cloud telemetry or historical analytics.',
            'Difficult to monitor or configure unless the operator is physically next to the microcontroller.'
          ]
        }
      ],
      projectAdvantages: [
        'Real-time cloud database syncing with telemetry charts showing soil moisture and ambient humidity trends.',
        'Smart rain prediction integration checking external weather APIs to skip watering cycles if rainfall is expected.',
        'Automatic and manual override toggles exposed through a secure web application dashboard.'
      ],
      researchTopics: [
        'Precision Agriculture and IoT Optimization Systems',
        'Cloud-Connected Smart Cities and Water Conservation Infrastructure',
        'Predictive Analytics in Agricultural Water Management'
      ],
      futureImprovements: [
        'Machine learning models deployed locally on microcontrollers (TinyML) to optimize watering cycles without active internet.',
        'Support for multiple sensor nodes mapped spatially across large farms with cellular backup.',
        'Solar-powered charging modules to build a self-sustaining grid nodes network.'
      ],
      innovationScore: 88
    }
  },
  {
    id: 'collabcode-editor',
    title: 'CollabCode – Real-time Peer IDE',
    domain: 'Web Development',
    skillLevel: 'Advanced',
    duration: '10 weeks',
    description: 'A collaborative browser-based development environment enabling multiple students to edit code concurrently with synchronized cursor statuses, file trees, and a secure Docker sandboxed code executor.',
    uniquenessAnalysis: {
      score: 91,
      summary: 'Collaborative text editors are challenging. Moving from standard Socket diff-patch syncing to a true CRDT model (Conflict-free Replicated Data Types) like Yjs guarantees conflict-free operations even with latency.',
      suggestions: [
        'Use WebRTC signaling through sockets to allow direct voice-and-video peer calling right in the workspace.',
        'Implement an AI Code Companion panel that uses local browser WebLLM models to assist students without incurring server token costs.',
        'Create a visual Git-like tree visualization of code revision history inside the client UI.'
      ]
    },
    techStack: [
      { name: 'Monaco Editor (React)', category: 'frontend', role: 'Code Editor Core', whyChosen: 'Powerhouse editor that drives VS Code, giving students auto-completion, hover definitions, and native theme configurations.' },
      { name: 'Yjs & Y-Websockets', category: 'frontend', role: 'CRDT Conflict Sync', whyChosen: 'Handles collaborative text synchronization mathematically, guaranteeing that document states merge cleanly.' },
      { name: 'Socket.io', category: 'backend', role: 'WebSocket Framework', whyChosen: 'Provides fallback protocols and namespaces to separate peer editing sessions.' },
      { name: 'Docker Engine API', category: 'backend', role: 'Execution Sandbox', whyChosen: 'Executes user-compiled languages inside isolated containers to prevent security exploits on the host backend.' },
      { name: 'Redis', category: 'database', role: 'In-Memory Store & PubSub', whyChosen: 'Stores active room directories and scales WebSocket connections across multiple server processes.' },
      { name: 'Node.js & Express', category: 'backend', role: 'API Server', whyChosen: 'Event-driven model pairs exceptionally well with real-time WebSocket communication.' }
    ],
    roadmap: [
      {
        phaseName: 'Phase 1: Basic Editor & Sync Scaffolding',
        tasks: [
          { id: 'code-1', title: 'Integrate Monaco Editor', description: 'Mount Monaco Editor inside React and set up custom syntax themes.', duration: '5 days', completed: false, tools: ['React.js', '@monaco-editor/react'] },
          { id: 'code-2', title: 'Set up Express Socket Server', description: 'Build basic Node server that opens Socket.io listeners and handles room joining/leaving.', duration: '5 days', completed: false, tools: ['Node.js', 'Express', 'Socket.io'] }
        ]
      },
      {
        phaseName: 'Phase 2: Collaborative Synchronization',
        tasks: [
          { id: 'code-3', title: 'Implement Yjs Sync', description: 'Connect Monaco text models with Yjs document stores and link them via Websocket providers.', duration: '7 days', completed: false, tools: ['Yjs CRDT', 'y-websocket', 'y-protocols'] },
          { id: 'code-4', title: 'Build Telemetry Indicators', description: 'Implement floating user cursors and highlighting indicating which developer is typing.', duration: '6 days', completed: false, tools: ['React Hooks', 'Tailwind CSS'] }
        ]
      },
      {
        phaseName: 'Phase 3: Sandbox Code Execution',
        tasks: [
          { id: 'code-5', title: 'Docker Runner Setup', description: 'Configure Docker containers that read a string of code, execute it securely, and capture stdout.', duration: '8 days', completed: false, tools: ['Docker Engine', 'Bash Scripting', 'Security sandbox'] },
          { id: 'code-6', title: 'Create Sandbox API endpoints', description: 'Build a secure POST endpoint on Express to run Python, JS, and C++ files, integrating timeout limits.', duration: '7 days', completed: false, tools: ['Node.js', 'Dockerode SDK', 'Express API'] }
        ]
      },
      {
        phaseName: 'Phase 4: File Tree & UI Polish',
        tasks: [
          { id: 'code-7', title: 'Construct Virtual Directory', description: 'Build a sidebar file explorer allowing creation, deletion, and renaming of files in the editor.', duration: '6 days', completed: false, tools: ['React-Arborist', 'Lucide React'] },
          { id: 'code-8', title: 'Deploy Sandbox Server', description: 'Deploy the main app to digital ocean or AWS EC2, configuring Docker socket permissions.', duration: '6 days', completed: false, tools: ['AWS EC2', 'Nginx', 'Docker Compose'] }
        ]
      }
    ],
    architecture: {
      nodes: [
        { id: 'userA', label: 'Student A (Browser)', type: 'client', x: 80, y: 80 },
        { id: 'userB', label: 'Student B (Browser)', type: 'client', x: 80, y: 220 },
        { id: 'socket', label: 'Socket.io Server', type: 'server', x: 300, y: 150 },
        { id: 'redis', label: 'Redis Room Store', type: 'database', x: 480, y: 80 },
        { id: 'docker', label: 'Docker Sandboxes', type: 'server', x: 480, y: 220 }
      ],
      edges: [
        { from: 'userA', to: 'socket', label: 'WebSockets (CRDT)' },
        { from: 'userB', to: 'socket', label: 'WebSockets (CRDT)' },
        { from: 'socket', to: 'redis', label: 'Cache Sync' },
        { from: 'socket', to: 'docker', label: 'Execute Code' }
      ]
    },
    researchAnalysis: {
      existingProjects: [
        {
          name: 'Codeshare.io Peer Text Editor',
          description: 'A browser-based simple collaborative notepad allowing raw real-time document editing.',
          limitations: [
            'Does not execute code natively in the browser.',
            'Lacks file directory explorer and virtual terminal outputs.'
          ]
        },
        {
          name: 'Academic Code Sandbox Systems',
          description: 'Custom learning web portals allowing students to compile and submit single-file scripts.',
          limitations: [
            'No real-time collaboration or multi-user peer editing.',
            'Hardcoded sandboxing features that execute slowly.'
          ]
        }
      ],
      projectAdvantages: [
        'CRDT-based (Conflict-free Replicated Data Types) Yjs editing engine that synchronizes key characters without conflict.',
        'Docker-based secure environment executing Javascript, Python, and C++ source code in isolation.',
        'Fully-functional mock virtual directory explorer allowing workspace management.'
      ],
      researchTopics: [
        'Conflict-free Replicated Data Types in Real-Time Browser Applications',
        'Secure Remote Code Execution Sandboxes inside Lightweight Virtual Nodes',
        'Collaborative Software Development Environments for Distance Education'
      ],
      futureImprovements: [
        'WebRTC peer-to-peer visual signallers letting users video chat inside the session.',
        'Custom local Large Language Model assistant executing queries via WebLLM client-side.',
        'Git repository visualizer outlining commits history in a dynamic interactive node map.'
      ],
      innovationScore: 92
    }
  }
];

export const fallbackPlan: ProjectPlan = {
  id: 'custom-plan',
  title: 'Custom AI Project Plan',
  domain: 'General Development',
  skillLevel: 'Intermediate',
  duration: '4 weeks',
  description: 'A custom, tailor-made project planning template generated in real-time by the PlanoraAI assistant based on your prompt analysis.',
  uniquenessAnalysis: {
    score: 75,
    summary: 'A standard entry-level approach. Adding advanced state management and testing suites will make this project considerably stronger.',
    suggestions: [
      'Write comprehensive unit and integration test suites using Jest or Vitest.',
      'Deploy the production build to a CDN (e.g. Netlify) with continuous delivery.',
      'Implement structured logging and crash reporting systems (e.g., Sentry).'
    ]
  },
  techStack: [
    { name: 'Vite & React.js', category: 'frontend', role: 'Client Application', whyChosen: 'Vite offers blazing fast hot-reload development speeds.' },
    { name: 'Tailwind CSS', category: 'frontend', role: 'Responsive Styling', whyChosen: 'Quick utility styling for polished interfaces.' },
    { name: 'LocalStorage', category: 'database', role: 'Client-Side Cache', whyChosen: 'Allows mock data caching without server load.' }
  ],
  roadmap: [
    {
      phaseName: 'Phase 1: Foundation & Base Structure',
      tasks: [
        { id: 'custom-1', title: 'Initialize Workspace', description: 'Setup code repository and clean project scaffolding.', duration: '2 days', completed: false, tools: ['Vite', 'React.js', 'Git'] },
        { id: 'custom-2', title: 'Design Core Interface', description: 'Wireframe user input flows and setup styling themes.', duration: '3 days', completed: false, tools: ['Tailwind CSS', 'Framer Motion'] }
      ]
    },
    {
      phaseName: 'Phase 2: Feature Development',
      tasks: [
        { id: 'custom-3', title: 'Implement Primary Logic', description: 'Build component behaviors and state machines.', duration: '5 days', completed: false, tools: ['React Hooks', 'Context API'] }
      ]
    }
  ],
  architecture: {
    nodes: [
      { id: 'client', label: 'Vite Client App', type: 'client', x: 150, y: 150 },
      { id: 'storage', label: 'LocalStorage Sync', type: 'database', x: 450, y: 150 }
    ],
    edges: [
      { from: 'client', to: 'storage', label: 'Web Storage API' }
    ]
  },
  researchAnalysis: {
    existingProjects: [
      {
        name: 'Standard Generic Web App Template',
        description: 'A boilerplate implementation showcasing core CRUD functionality.',
        limitations: [
          'Static structure without dynamic AI customization or personalized user analytics.',
          'Lacks step-by-step guidance, interactivity, or advanced feature pipelines.'
        ]
      }
    ],
    projectAdvantages: [
      'AI-driven custom generation adapting layout structures to the user\'s precise project request.',
      'Clean separated architectural nodes mapping frontend, server, database, and utilities flows.',
      'Step-by-step instructional roadmap providing mini-tutorials for advanced academic preparation.'
    ],
    researchTopics: [
      'AI-Powered E-Learning and Academic Mentorship Platforms',
      'Low-Code System Architecture Generators',
      'User Experience Optimization in Specialized Educational Software'
    ],
    futureImprovements: [
      'Third-party integration to directly export workspace blueprints to online IDEs.',
      'Collaborative team workspaces letting multiple users build plan structures concurrently.',
      'Voice interaction modules to brainstorm architecture systems verbally.'
    ],
    innovationScore: 80
  }
};

// Populate toolsAndDeployment dynamically for mock plans
const getMockToolsAndDeployment = (id: string): ProjectToolsAndDeployment => {
  if (id.includes('diet') || id.includes('food') || id.includes('meal')) {
    return {
      developmentTools: [
        { name: 'VS Code', purpose: 'Code Editor', reason: 'Industry-standard editor with rich TypeScript and React ecosystem support.' },
        { name: 'Git & GitHub', purpose: 'Version Control', reason: 'Track project changes locally and back up code to a remote repository.' },
        { name: 'Postman', purpose: 'API Testing Client', reason: 'Test and debug raw nutrition and recipe endpoints before integration.' },
        { name: 'Figma', purpose: 'UI/UX Design', reason: 'Design responsive mockups of macro charts and recipes pages.' }
      ],
      collaborationTools: [
        { name: 'GitHub Projects', purpose: 'Task Tracker', reason: 'Manage tasks via Kanban boards and prioritize features.' },
        { name: 'Notion', purpose: 'Documentation Hub', reason: 'Draft API documentation, macro equations, and coordinate ideas.' }
      ],
      apiTestingTools: [
        { name: 'Postman', purpose: 'API Testing & Debugging', reason: 'Send raw POST payloads to local server and Groq completions.' }
      ],
      deployment: {
        frontend: { platform: 'Vercel', reason: 'Seamless deployment of React apps with automated build pipelines.', freeTier: 'Hobby tier with custom domains and SSL.' },
        backend: { platform: 'Render', reason: 'Easiest platform to deploy Express and Node.js servers for free.', freeTier: 'Free web service with automatic builds.' },
        database: { platform: 'MongoDB Atlas', reason: 'Cloud-hosted database cluster for secure, remote document storage.', freeTier: 'Shared M0 cluster with 512MB storage.' }
      },
      utilities: [
        { name: 'Groq Cloud SDK', purpose: 'AI Suggestion Engine', reason: 'Execute personalized recipe queries using llama-3.3-70b-versatile.' },
        { name: 'Nodemailer', purpose: 'Email Dispatcher', reason: 'Trigger progress digests and allergen alerts to users.' }
      ],
      versionControl: {
        gitImportance: 'Git registers snapshots of local files so students can revert bugs and branch off safely.',
        githubImportance: 'GitHub keeps a copy of the repository in the cloud, acting as a backup and collaboration center.',
        basics: [
          'git init - Initialize a new local Git repository.',
          'git checkout -b feature/auth - Create a separate workspace to build features safely.',
          'git add . && git commit -m "feat: setup auth" - Commit progress snapshots.'
        ]
      },
      deploymentSteps: [
        { step: '1. Build Client Bundle', description: 'Run npm run build in the frontend to compile React assets into static files.' },
        { step: '2. Deploy Client to Vercel', description: 'Link your GitHub repo to Vercel for instant builds on push.' },
        { step: '3. Host Server on Render', description: 'Create a new Render Web Service linked to the backend repository folder.' },
        { step: '4. Bind MongoDB Connection', description: 'Save the MONGODB_URI connection string into Render Environment Variables.' },
        { step: '5. Verify E2E Flow', description: 'Confirm frontend forms successfully query the hosted backend.' }
      ]
    };
  } else if (id.includes('plant') || id.includes('irrigation') || id.includes('iot')) {
    return {
      developmentTools: [
        { name: 'Arduino IDE', purpose: 'Hardware Code Compiler', reason: 'Write, compile, and upload C++ code directly onto the ESP32 board.' },
        { name: 'VS Code', purpose: 'Frontend Development', reason: 'Superb environment for building the React monitoring charts.' },
        { name: 'Fritzing', purpose: 'Hardware Circuit Design', reason: 'Create clean breadboard wiring schematics for moisture sensors.' }
      ],
      collaborationTools: [
        { name: 'Trello', purpose: 'Kanban Task Board', reason: 'Track hardware tasks (wiring, firmware, MQTT) separately.' },
        { name: 'GitHub Projects', purpose: 'Repository Board', reason: 'Manage code changes and firmware versions.' }
      ],
      apiTestingTools: [
        { name: 'MQTT Box / MQTT Explorer', purpose: 'MQTT Client Debugger', reason: 'Subscribe to moisture topics to verify ESP32 telemetry packages.' }
      ],
      deployment: {
        frontend: { platform: 'Vercel', reason: 'Fast React dashboard builds.', freeTier: 'Hobby tier with automated CI/CD.' },
        backend: { platform: 'HiveMQ Cloud', reason: 'Secure, managed MQTT broker that eliminates complex server configurations.', freeTier: 'Up to 10 active connections for free.' },
        database: { platform: 'Firebase Realtime DB', reason: 'Instantly push soil readings to web client via sockets.', freeTier: 'Spark Plan (1 GB stored data).' }
      },
      utilities: [
        { name: 'Adafruit IO', purpose: 'Dashboard Service', reason: 'Alternative easy visualization for IoT metrics if React dashboard is offline.' }
      ],
      versionControl: {
        gitImportance: 'Git tracks revisions in C++ firmware and React components, letting you revert buggy circuits code.',
        githubImportance: 'GitHub backs up your hardware files and React web client code securely.',
        basics: [
          'git init - Set up Git.',
          'git checkout -b firmware/mqtt - Work on MQTT code without breaking hardware sensor loops.',
          'git add . && git commit -m "firmware: configure esp32 mqtt publish"'
        ]
      },
      deploymentSteps: [
        { step: '1. Flash ESP32 Board', description: 'Upload completed C++ firmware via Arduino IDE USB connection.' },
        { step: '2. Set up HiveMQ Broker', description: 'Deploy a HiveMQ broker cluster and note the connection endpoint.' },
        { step: '3. Deploy Node.js Bridge', description: 'Deploy your MQTT-to-Firebase listener bridge to Render.' },
        { step: '4. Deploy Dashboard UI', description: 'Host your React monitoring application on Vercel.' }
      ]
    };
  } else {
    // CollabCode IDE or generic fallback
    return {
      developmentTools: [
        { name: 'VS Code', purpose: 'Primary IDE', reason: 'Build the IDE project inside the IDE.' },
        { name: 'Docker Desktop', purpose: 'Container Sandbox Environment', reason: 'Configure and test code executor environments locally.' },
        { name: 'Postman', purpose: 'REST Testing', reason: 'Debug code execution requests.' }
      ],
      collaborationTools: [
        { name: 'Jira Software', purpose: 'Agile Planning', reason: 'Manage complex epics (Docker execution, Yjs syncing, Monaco UI).' },
        { name: 'Notion', purpose: 'Technical Specifications', reason: 'Write down concurrency models and state synchronization diagrams.' }
      ],
      apiTestingTools: [
        { name: 'Insomnia', purpose: 'REST Testing', reason: 'Clean desktop client to test execution POST payloads.' }
      ],
      deployment: {
        frontend: { platform: 'Vercel', reason: 'React frontend deployment.', freeTier: 'Hobby tier with continuous integrations.' },
        backend: { platform: 'Railway', reason: 'Railway handles Docker container deployments and raw sockets.', freeTier: 'Trial usage credit for Railway.' },
        database: { platform: 'Redis Cloud', reason: 'In-memory data structures to sync socket rooms.', freeTier: 'Free 30MB cluster sandbox.' }
      },
      utilities: [
        { name: 'Docker API', purpose: 'Sandboxed Runtime', reason: 'Run Python/JS scripts in isolated virtual settings.' }
      ],
      versionControl: {
        gitImportance: 'Tracks complicated merge logic in real-time syncing files.',
        githubImportance: 'Remote backup and source control gateway.',
        basics: [
          'git init - Setup local Git tracker.',
          'git checkout -b docker-executor - Build the execution features in isolation.',
          'git add . && git commit -m "feat: complete docker execution endpoint"'
        ]
      },
      deploymentSteps: [
        { step: '1. Test Docker Images', description: 'Ensure the execution containers compiled correctly locally.' },
        { step: '2. Deploy Express Server', description: 'Host backend on Railway or DigitalOcean, ensuring Docker daemon permissions are configured.' },
        { step: '3. Host Client App on Vercel', description: 'Host the Monaco React app.' }
      ]
    };
  }
};

// Set values dynamically on mock plans
mockPlans.forEach(plan => {
  const id = (plan.id || '').toLowerCase();
  plan.toolsAndDeployment = getMockToolsAndDeployment(id);
});
fallbackPlan.toolsAndDeployment = getMockToolsAndDeployment('generic');

