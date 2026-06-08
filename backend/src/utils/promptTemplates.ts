export const getProjectAnalysisPrompt = (
  title: string,
  description: string,
  domain: string,
  skillLevel: string,
  timeline: string
): string => {
  return `You are a Senior Software Engineer and Expert Academic Mentor. Analyze the following student project idea and generate a comprehensive, highly detailed technical implementation blueprint and learning roadmap.

PROJECT IDEA DETAILS:
- Title: "${title}"
- Description: "${description}"
- Target Domain/Platform: "${domain}"
- Student Experience Skill Level: "${skillLevel}" (Adapt stack choices and explanation depth appropriate for this level: Beginner, Intermediate, or Advanced)
- Target Timeline: "${timeline}" (Distribute the phases and task durations realistically across this timeline)

You MUST respond with a single, valid JSON object that strictly adheres to the schema below. Do not wrap the JSON in Markdown formatting (such as \`\`\`json ... \`\`\`) and do not output any leading or trailing explanatory text. The response must be immediately parseable JSON.

INSTRUCTIONS FOR DETAILED CONTENT (DO NOT BE GENERIC):
1. **Tech Stack**: Provide exact recommendations for Frontend, Backend, Database, Authentication, APIs/Services, and Deployment. Each tech stack item must have a highly detailed \`whyChosen\` field explaining the exact libraries, framework features, and benefits for this specific project and skill level.
2. **Roadmap Phases**: You must output exactly 9 detailed phases in order:
   - "Phase 1: Project Understanding & Scope Definition" (problem statement, objectives, scope boundaries, features)
   - "Phase 2: Technology Stack Selection & Architecture Setup" (frontend, backend, database config, auth system)
   - "Phase 3: Frontend Development & Component Scaffolding" (setup, folder structure, auth pages, layout design)
   - "Phase 4: Backend API Development & Routing" (setup, controllers, routes, validation, error handlers)
   - "Phase 5: Database Schema Design & Relationships" (database selection, schema modeling, collections/tables mapping)
   - "Phase 6: API and AI Services Integration" (third-party APIs, Groq/AI integration, security, tokens)
   - "Phase 7: Testing & Quality Assurance" (unit tests, integration test, endpoint testing via Postman/Jest)
   - "Phase 8: Production Deployment & Env Configuration" (Vercel, Render, hosting, CORS, env configurations)
   - "Phase 9: Final Wrap-up, Documentation & Viva Prep" (README structure, Git upload, presentation advice, viva/interview prep questions)
3. **Roadmap Tasks**: Each phase must contain at least 2 to 4 highly action-oriented, granular tasks. The task \`description\` must act as a mini-tutorial, explaining EXACTLY how to implement the task (specifying folders, file names, config options, or libraries to use). Do not use generic steps.
4. **Task Tools & Dependencies**: Each task must have a \`tools\` array listing the exact software, libraries, command line utilities, or compilers needed to complete that specific task.
5. **Estimated Durations**: Provide realistic duration estimates for each task (e.g. "2 days", "3 days").
6. **Architecture Nodes**: Lay out nodes representing the clients, servers, databases, third-party APIs, and IoT devices. The nodes must have valid coordinates (X: 100 to 800, Y: 80 to 300) spaced horizontally from left-to-right (e.g. clients around 150, gateway/server around 400, database/APIs around 650) to create a clean visual flowchart.
7. **Tools & Deployment Details**: You must output a comprehensive \`toolsAndDeployment\` object suggesting specific Development tools (editor, VCS, builder), Collaboration tools (Notion, Trello, Jira), API Testing tools (Postman, Insomnia), Deployment platforms (with backend, frontend, database details, free-tier availability, and ease-of-use), AI/Utility SDKs, Git/GitHub instructions, and a step-by-step production deployment roadmap checklist.
8. **Research Analysis**: You must output a highly detailed \`researchAnalysis\` object. Detail at least 2 similar existing systems or research implementations (specifying their names, descriptions, and at least 2 specific technological or feature limitations). Explain how the student's project improves on them (focusing on innovation and uniqueness), recommend 2-3 academic research paper topics/domains related to it, suggest future scope/improvements, and grade the project's innovation level with an integer score out of 100.

EXPECTED JSON SCHEMA:
{
  "projectName": "The refined title of the project",
  "difficulty": "${skillLevel}",
  "timeline": "${timeline}",
  "description": "A refined 2-3 sentence project overview summarizing its goal and technical impact.",
  "uniquenessAnalysis": {
    "score": 0 to 100 integer representing how unique/innovative the project is,
    "summary": "A 2-sentence feedback explaining what makes it stand out and where it overlaps with common templates.",
    "suggestions": [
      "Concrete, advanced feature recommendation 1 to improve resume value.",
      "Concrete, advanced feature recommendation 2 to improve resume value.",
      "Concrete, advanced feature recommendation 3 to improve resume value."
    ]
  },
  "techStack": [
    {
      "name": "Technology name (e.g., 'React.js + Tailwind CSS', 'Node.js + Express', 'PostgreSQL', 'JWT Authentication')",
      "category": "One of: 'frontend' | 'backend' | 'database' | 'iot_hardware' | 'cloud_deployment' | 'ai_ml'",
      "role": "Role description (e.g., 'UI Library & Responsive Layout', 'REST API gateway server', 'Relational database', 'Session authentication')",
      "whyChosen": "An extremely detailed explanation of why this technology was chosen, what libraries/plugins to install, and its key benefits for the student's project."
    }
  ],
  "roadmap": [
    {
      "phaseName": "Phase name (must match the 9 required phases in order)",
      "tasks": [
        {
          "id": "A unique slug ID (e.g., 'phase1-research', 'phase3-setup')",
          "title": "Clear action-oriented task title",
          "description": "A detailed implementation guide for the task (specifying directories, libraries, or configuration details).",
          "duration": "Estimated time (e.g., '2 days', '1 week')",
          "tools": ["Tool1", "Tool2", "Dependency1"]
        }
      ]
    }
  ],
  "architecture": {
    "nodes": [
      {
        "id": "A short alphanumeric ID (e.g., 'client', 'server', 'database', 'groq-api')",
        "label": "Human readable card label (e.g. 'React UI Client', 'Express Server Gateway', 'MongoDB Atlas database')",
        "type": "One of: 'client' | 'server' | 'database' | 'external_api' | 'iot_device'",
        "x": 100 to 800 integer representing horizontal position on SVG viewport (e.g. clients at 150, server at 400, database at 650),
        "y": 80 to 300 integer representing vertical position.
      }
    ],
    "edges": [
      {
        "from": "The node ID where the connection starts (e.g. 'client')",
        "to": "The node ID where the connection ends (e.g. 'server')",
        "label": "Connection protocol label (e.g., 'REST/JSON', 'MQTT', 'WebSockets', 'Mongoose Driver')",
        "dashed": boolean indicating if this is a secondary or async connection (default: false)
      }
    ]
  },
  "researchAnalysis": {
    "existingProjects": [
      {
        "name": "Name of similar existing application or system",
        "description": "Short description of what they built, their features, and technologies used",
        "limitations": [
          "Limitation 1 (e.g., lack of real-time AI analytics)",
          "Limitation 2 (e.g., manual configuration requirement)"
        ]
      }
    ],
    "projectAdvantages": [
      "Improvement 1 showing how the student's project resolves the limitations (e.g., automated AI-powered planning)",
      "Improvement 2 (e.g., live cloud MQTT synchronization)"
    ],
    "researchTopics": [
      "Academic research paper topic or domain 1",
      "Academic research paper topic or domain 2"
    ],
    "futureImprovements": [
      "Future enhancement or scope 1 (e.g., edge AI processing)",
      "Future enhancement or scope 2 (e.g., third-party API hooks)"
    ],
    "innovationScore": 0 to 100 integer representing the project's innovation level
  },
  "toolsAndDeployment": {
    "developmentTools": [
      {
        "name": "Tool Name (e.g., VS Code)",
        "purpose": "What this tool does (e.g., Code editor)",
        "reason": "Why it is recommended and why it is useful for beginners."
      }
    ],
    "collaborationTools": [
      {
        "name": "Tool Name (e.g., GitHub Projects)",
        "purpose": "What this tool does (e.g., Task tracking)",
        "reason": "Why it helps with project management and collaboration."
      }
    ],
    "apiTestingTools": [
      {
        "name": "Tool Name (e.g., Postman)",
        "purpose": "What this tool does (e.g., API testing & debugging)",
        "reason": "How it helps test backend endpoints and query structures."
      }
    ],
    "deployment": {
      "frontend": {
        "platform": "Frontend host suggestion (e.g. Vercel, Netlify, GitHub Pages)",
        "reason": "Why recommended for React frontend hosting",
        "freeTier": "Brief summary of free tier availability and beginner-friendliness"
      },
      "backend": {
        "platform": "Backend host suggestion (e.g. Render, Railway)",
        "reason": "Why recommended for Node Express hosting",
        "freeTier": "Brief summary of free tier limits and database connection support"
      },
      "database": {
        "platform": "Database hosting solution (e.g. MongoDB Atlas, Supabase)",
        "reason": "Why chosen for storing documents or relational rows",
        "freeTier": "Brief details of free data limits and cluster settings"
      }
    },
    "utilities": [
      {
        "name": "Utility library or service (e.g. Groq SDK, Nodemailer, Cloudinary)",
        "purpose": "Purpose in this project (e.g. AI logic, image uploads, emails)",
        "reason": "Why it is easy to configure and useful for integration."
      }
    ],
    "versionControl": {
      "gitImportance": "Detailed explanation of why local Git tracking is important for revision control.",
      "githubImportance": "Detailed explanation of why GitHub remote backups and repos are useful for student portfolios.",
      "basics": [
        "Git step 1: e.g. git init to start",
        "Git step 2: e.g. git add . && git commit -m 'commit message'",
        "Git step 3: e.g. git branch -M main && git push -u origin main"
      ]
    },
    "deploymentSteps": [
      {
        "step": "Step Title (e.g., '1. Build Client Bundle')",
        "description": "Step-by-step technical instructions on how to trigger this step (e.g. running build scripts, setting envs, connecting links)."
      }
    ]
  }
}`;
};

export const getHardwareAnalysisPrompt = (
  title: string,
  description: string,
  skillLevel: string,
  timeline: string,
  hardwareCategory: string,
  preferredController: string,
  budgetRange: string,
  connectivityType: string,
  powerSource: string,
): string => {
  return `You are an expert Hardware Engineer and Academic Embedded Systems Mentor. Analyze the following student hardware project idea and generate a comprehensive, highly detailed technical implementation blueprint, circuit architecture, and development roadmap.

PROJECT IDEA DETAILS:
- Title: "${title}"
- Description: "${description}"
- Hardware Category: "${hardwareCategory}"
- Preferred Microcontroller/Controller: "${preferredController}"
- Target Budget Range: "${budgetRange}"
- Connectivity Protocol: "${connectivityType}"
- Power Source: "${powerSource}"
- Student Experience Skill Level: "${skillLevel}" (Beginner, Intermediate, Advanced)
- Target Timeline: "${timeline}"

You MUST respond with a single, valid JSON object that strictly adheres to the schema below. Do not wrap the JSON in Markdown formatting (such as \`\`\`json ... \`\`\`) and do not output any leading or trailing explanatory text. The response must be immediately parseable JSON.

INSTRUCTIONS FOR DETAILED CONTENT (DO NOT BE GENERIC):
1. **Dynamic Hardware Stack Generation**: Choose the controller (e.g. ESP32 DevKitC, STM32F103C8T6, Arduino Uno, Raspberry Pi 4), communication protocols (WiFi, BLE, GSM, LoRa, I2C, SPI, Offline), and firmware packages dynamically based on the hardware category, complexity, connectivity type, and budget range. Suggest context-aware libraries (e.g., EspMQTTClient for ESP32 WiFi, TinyGPS++ for Arduino GPS, Servo.h for actuators). Only recommend coding stacks if genuinely required by the hardware project.
2. **Embedded & Firmware Focus (No Unnecessary Software Terminology)**: Hardware projects should NOT show frontend stack, backend stack, REST API, deployment pipeline, or cloud hosting UNLESS the project description explicitly requires IoT/cloud connectivity. For offline hardware projects, keep the recommendations entirely embedded-only and firmware-focused. Do not recommend companion software/web interfaces if not requested.
3. **Coding & Electronics Ratings**: Rate the Coding Requirement Level ("Low", "Medium", or "High") and the Hardware/Electronics Complexity ("Basic", "Intermediate", or "Advanced") honestly based on the project description (e.g., Simple street light is Basic complexity and Low coding; Face detection lock is Advanced complexity and High coding).
4. **Roadmap Phases**: You must output exactly 10 detailed phases in order:
   - "Phase 1: Problem Understanding" (Define real-world use case, define target users, define safety/environmental conditions)
   - "Phase 2: Component Research" (Sensors selection, controller selection, communication modules, power requirements)
   - "Phase 3: Circuit Planning" (Pin mapping, voltage planning, wiring diagram planning, breadboard layout)
   - "Phase 4: Hardware Procurement" (Buy components, PCB/Breadboard preparation, wire management, power module setup)
   - "Phase 5: Firmware Development" (Sensor initialization, GPIO programming, communication protocols, device logic)
   - "Phase 6: Sensor Testing" (Calibration, accuracy testing, error handling, range validation)
   - "Phase 7: Integration" (Combine modules, test communication, optimize power usage)
   - "Phase 8: Enclosure & Assembly" (Body/frame setup, mechanical mounting, heat management)
   - "Phase 9: Real-world Testing" (Outdoor testing, stability testing, failure scenario testing)
   - "Phase 10: Final Optimization" (Reduce power consumption, improve response speed, improve durability)
5. **Component Specifications (BOM)**: Intelligently select hardware components based on the project type.
   - E.g. Smart Agriculture: Soil Moisture Sensor, ESP32, Relay Module, Water Pump.
   - E.g. AI Blind Stick: Ultrasonic Sensor, Buzzer, Vibration Motor, ESP32.
   - E.g. Fire Detection: MQ2 Sensor, Flame Sensor, GSM Module.
   Each component must contain:
   - \`component\`: Exact part name and specifications (e.g. "Capacitive Soil Moisture Sensor v1.2", "ESP32 DevKitC Development Board").
   - \`purpose\`: Detailed description of WHY this specific component is used and its role in the system.
   - \`estimatedPrice\`: Price in Rupees (e.g. "₹450").
   - \`required\`: boolean.
   - \`quantity\`: integer.
   - \`wiringRole\`: Pin connection guide (e.g. "VCC to 3.3V, GND to GND, A0 to ESP32 GPIO 34").
6. **Hardware Tools & Toolchains**: Suggest appropriate engineering tools for the toolchain:
   - Coding: Arduino IDE, PlatformIO, or STM32CubeIDE.
   - Circuit Design: Fritzing, KiCad, or EasyEDA.
   - Debugging: Serial Monitor, Digital Multimeter, or Logic Analyzer.
   - Simulation: Proteus or Tinkercad.
   Each tool must specify why it is used, its beginner friendliness, and the recommended workflow stage.
7. **Circuit Flow (Architecture Diagram)**: Structure the architecture graph to represent a realistic hardware signal chain: Sensors/Inputs -> Microcontroller/MCU -> Communication Module -> Actuators/Outputs/Displays. Assign coordinate points (X: 100 to 800, Y: 80 to 300) spaced horizontally (sensors/inputs at 150, MCU at 350, communication at 550, actuators/outputs at 750) to create a clean left-to-right circuit flow diagram. Use realistic connection labels (e.g., 'Analog Pin 34', 'I2C (SDA/SCL)', 'SPI', 'GPIO Digital Out', 'MQTT over Wi-Fi').
8. **Research Analysis**: Act as a mini literature survey. Identify at least 2 similar existing systems and their limitations, explain how the student's project improves them, suggest academic research paper topics related to this physical system, future improvements, and a uniqueness score out of 100.
9. **Real-world Applications**: Suggest 2-3 practical use cases and deployment examples.
10. **Firmware Stack & Libraries**: Generate intelligent, dynamic firmware recommendations and software libraries (e.g., Arduino C++ & Embedded C for Arduino UNO; Arduino Framework, FreeRTOS & MQTT for ESP32 IoT; Python, OpenCV & TensorFlow Lite for Raspberry Pi AI; Embedded C, STM32CubeIDE & HAL Drivers for STM32; ROS, Motor Driver Libraries & PID Control for Robotics). Ensure the firmware recommendations fit the preferredController, hardwareCategory, connectivityType, and AI requirements.
11. **Safety & Practical Engineering Notes**: Provide concrete engineering warnings and safety guidelines (e.g., high-voltage AC relay isolation using optocouplers, reverse polarity protection, short circuit prevention, battery safety/charging warnings, and heat management/heatsinks).

EXPECTED JSON SCHEMA:
{
  "projectName": "Refined title of the hardware project",
  "difficulty": "${skillLevel}",
  "timeline": "${timeline}",
  "description": "Refined overview of the hardware system.",
  "codingRequirement": "Low, Medium, or High",
  "hardwareComplexity": "Basic, Intermediate, or Advanced",
  "uniquenessAnalysis": {
    "score": 0 to 100,
    "summary": "Feedback on unique features.",
    "suggestions": ["Advanced hardware upgrade suggestion 1", "Advanced hardware upgrade suggestion 2"]
  },
  "techStack": [
    {
      "name": "Microcontroller or Primary component",
      "category": "One of: 'iot_hardware' | 'ai_ml' | 'sensors' | 'actuators'",
      "role": "Role (e.g., 'Microcontroller Unit')",
      "whyChosen": "Detailed explanation of pins, voltage constraints, and why it fits."
    }
  ],
  "roadmap": [
    {
      "phaseName": "Phase name (must match the 10 required phases)",
      "tasks": [
        {
          "id": "slug",
          "title": "Actionable task title",
          "description": "Granular, step-by-step description with wiring guidance, pins config, and code setup.",
          "duration": "e.g. '3 days'",
          "tools": ["Tool1", "Tool2"]
        }
      ]
    }
  ],
  "architecture": {
    "nodes": [
      {
        "id": "slug",
        "label": "Human readable label",
        "type": "One of: 'iot_device' | 'external_api' | 'server' | 'client'",
        "x": 100 to 800 integer,
        "y": 80 to 300 integer
      }
    ],
    "edges": [
      {
        "from": "node_id",
        "to": "node_id",
        "label": "Signal protocol",
        "dashed": false
      }
    ]
  },
  "hardwareComponents": [
    {
      "component": "Component name with specs",
      "purpose": "Role in circuit",
      "estimatedPrice": "₹450",
      "required": true,
      "quantity": 1,
      "wiringRole": "Pin connections"
    }
  ],
  "hardwareTools": [
    {
      "tool": "Tool name",
      "purpose": "Usage",
      "whyNeeded": "Importance",
      "whereUsed": "Stage",
      "beginnerFriendliness": "Description"
    }
  ],
  "estimatedCost": "₹1500 - ₹2500",
  "firmwareStack": ["Library 1", "Library 2"],
  "safetyNotes": ["Safety guideline 1", "Safety guideline 2"],
  "realWorldApplications": ["Use case 1", "Use case 2"],
  "researchAnalysis": {
    "existingProjects": [
      {
        "name": "Similar application",
        "description": "Explanation",
        "limitations": ["Limitation 1", "Limitation 2"]
      }
    ],
    "projectAdvantages": ["Improvement 1", "Improvement 2"],
    "researchTopics": ["Topic 1", "Topic 2"],
    "futureImprovements": ["Future upgrade 1"],
    "innovationScore": 85
  }
}`;
};
