import { Response, NextFunction } from 'express';
import Project from '../models/Project';
import AppError from '../utils/appError';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { generateProjectPlan } from '../services/groqService';

const getFallbackToolsAndDeployment = (
  domain: string,
  skillLevel: string,
  techStack: any[]
): any => {
  const query = `${domain} ${JSON.stringify(techStack)}`.toLowerCase();
  
  if (query.includes('diet') || query.includes('food') || query.includes('meal') || query.includes('calorie')) {
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
  } else if (query.includes('plant') || query.includes('irrigation') || query.includes('water') || query.includes('iot') || query.includes('soil')) {
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
    // Default template
    return {
      developmentTools: [
        { name: 'VS Code', purpose: 'Code Editor', reason: 'Best for modern web application programming.' },
        { name: 'Git & GitHub', purpose: 'Version Control', reason: 'Track changes and backup source code online.' },
        { name: 'Chrome DevTools', purpose: 'Browser Inspector', reason: 'Inspect CSS styles and debug JavaScript console statements.' }
      ],
      collaborationTools: [
        { name: 'GitHub Projects', purpose: 'Task Board', reason: 'Organize features and deadlines.' },
        { name: 'Notion', purpose: 'Documentation Hub', reason: 'Draft schemas and brainstorm flowcharts.' }
      ],
      apiTestingTools: [
        { name: 'Postman', purpose: 'Endpoint Validator', reason: 'Verify Express API responses.' }
      ],
      deployment: {
        frontend: { platform: 'Vercel', reason: 'Fast frontend builds linked to GitHub.', freeTier: 'Free tier with auto-SSL.' },
        backend: { platform: 'Render', reason: 'Simple cloud platform to run backend servers.', freeTier: 'Free web service allocation.' },
        database: { platform: 'MongoDB Atlas', reason: 'Remote Atlas cluster configuration.', freeTier: 'M0 free sandbox tier.' }
      },
      utilities: [
        { name: 'Local Env Variables', purpose: 'Security config', reason: 'Keep keys safe.' }
      ],
      versionControl: {
        gitImportance: 'Tracks project progress history.',
        githubImportance: 'Hosts copy of repository in the cloud.',
        basics: [
          'git init - Set up local tracker.',
          'git add . && git commit -m "initial commit" - Commit progress.'
        ]
      },
      deploymentSteps: [
        { step: '1. Build Client Bundle', description: 'Run npm run build to package frontend.' },
        { step: '2. Deploy Client to Vercel', description: 'Link to Vercel dashboard.' },
        { step: '3. Host Server on Render', description: 'Create web service on Render dashboard.' }
      ]
    };
  }
};

const getFallbackResearchAnalysis = (
  title: string,
  domain: string,
  skillLevel: string,
  techStack: any[]
): any => {
  const query = `${title} ${domain} ${JSON.stringify(techStack)}`.toLowerCase();

  if (query.includes('diet') || query.includes('food') || query.includes('meal') || query.includes('calorie')) {
    return {
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
    };
  } else if (query.includes('plant') || query.includes('irrigation') || query.includes('water') || query.includes('iot') || query.includes('soil')) {
    return {
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
    };
  } else {
    // Default fallback
    return {
      existingProjects: [
        {
          name: `Standard ${domain} Web App Template`,
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
    };
  }
};

// Analyze project idea using Groq (or fallbacks) and save to DB
export const analyzeProject = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const { 
    projectName, 
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
  } = req.body;
  const projectTitle = projectName || title;
  const projectTimeline = timeline || '6 weeks';

  try {
    if (!req.user) {
      return next(new AppError('User session not found.', 401));
    }

    // Call Groq AI service
    const rawPlan = await generateProjectPlan(
      projectTitle, 
      description, 
      domain, 
      skillLevel, 
      projectTimeline, 
      projectType,
      hardwareCategory,
      preferredController,
      budgetRange,
      connectivityType,
      powerSource
    );

    // Save generated blueprint into MongoDB Atlas associated with user ID
    const newProject = await Project.create({
      user: req.user.id,
      projectType: projectType || 'software',
      title: rawPlan.projectName || projectTitle,
      domain: rawPlan.domain || domain,
      skillLevel: rawPlan.difficulty || skillLevel,
      duration: rawPlan.timeline || projectTimeline,
      description: rawPlan.description || description,
      uniquenessAnalysis: rawPlan.uniquenessAnalysis,
      techStack: rawPlan.techStack,
      roadmap: rawPlan.roadmap,
      architecture: rawPlan.architecture,
      resources: rawPlan.resources,
      researchAnalysis: rawPlan.researchAnalysis || getFallbackResearchAnalysis(projectTitle, domain, skillLevel, rawPlan.techStack || []),
      toolsAndDeployment: rawPlan.toolsAndDeployment || getFallbackToolsAndDeployment(domain, skillLevel, rawPlan.techStack || []),
      hardwareComponents: rawPlan.hardwareComponents || [],
      hardwareTools: rawPlan.hardwareTools || [],
      hardwareCategory: hardwareCategory || '',
      preferredController: preferredController || '',
      budgetRange: budgetRange || '',
      connectivityType: connectivityType || '',
      powerSource: powerSource || '',
      realWorldApplications: rawPlan.realWorldApplications || [],
      estimatedCost: rawPlan.estimatedCost || '',
      codingRequirement: rawPlan.codingRequirement || 'Medium',
      hardwareComplexity: rawPlan.hardwareComplexity || 'Intermediate',
      firmwareStack: rawPlan.firmwareStack || [],
      safetyNotes: rawPlan.safetyNotes || [],
    });

    res.status(201).json({
      status: 'success',
      project: newProject,
    });
  } catch (error) {
    next(error);
  }
};

// Fetch all saved project plans for the active user
export const getAllProjects = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return next(new AppError('User session not found.', 401));
    }

    const projects = await Project.find({ user: req.user.id }).sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      results: projects.length,
      projects,
    });
  } catch (error) {
    next(error);
  }
};

// Fetch a single project plan by ID
export const getProjectById = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    if (!req.user) {
      return next(new AppError('User session not found.', 401));
    }

    const project = await Project.findOne({ _id: id, user: req.user.id });
    if (!project) {
      return next(new AppError('Project roadmap blueprint not found.', 404));
    }

    res.status(200).json({
      status: 'success',
      project,
    });
  } catch (error) {
    next(error);
  }
};

// Delete a project plan
export const deleteProject = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    if (!req.user) {
      return next(new AppError('User session not found.', 401));
    }

    const project = await Project.findOneAndDelete({ _id: id, user: req.user.id });
    if (!project) {
      return next(new AppError('Project roadmap blueprint not found.', 404));
    }

    res.status(200).json({
      status: 'success',
      message: 'Project roadmap blueprint deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// Update a specific task checkbox within the nested roadmap phases
export const updateRoadmapTask = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const { projectId, taskId } = req.params;
  const { completed } = req.body;

  try {
    if (!req.user) {
      return next(new AppError('User session not found.', 401));
    }

    const project = await Project.findOne({ _id: projectId, user: req.user.id });
    if (!project) {
      return next(new AppError('Project roadmap blueprint not found.', 404));
    }

    let found = false;
    for (const phase of project.roadmap) {
      for (const task of phase.tasks) {
        if (task.id === taskId) {
          task.completed = completed;
          found = true;
          break;
        }
      }
      if (found) break;
    }

    if (!found) {
      return next(new AppError('Task not found in project roadmap phases.', 404));
    }

    // Save changes to Mongoose
    await project.save();

    // Calculate progress percentage
    const totalTasksCount = project.roadmap.reduce((acc, phase) => acc + phase.tasks.length, 0);
    const completedTasksCount = project.roadmap.reduce((acc, phase) => {
      return acc + phase.tasks.filter(t => t.completed).length;
    }, 0);
    const progressPercentValue = totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0;

    res.status(200).json({
      success: true,
      updatedProject: {
        id: project._id || project.id,
        progress: progressPercentValue,
        roadmap: project.roadmap,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Toggle conversation / project pin status
export const togglePinProject = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { isPinned } = req.body;

  try {
    if (!req.user) {
      return next(new AppError('User session not found.', 401));
    }

    const project = await Project.findOne({ _id: id, user: req.user.id });
    if (!project) {
      return next(new AppError('Project roadmap blueprint not found.', 404));
    }

    project.isPinned = isPinned !== undefined ? isPinned : !project.isPinned;
    await project.save();

    res.status(200).json({
      status: 'success',
      project,
    });
  } catch (error) {
    next(error);
  }
};
export default { analyzeProject, getAllProjects, getProjectById, deleteProject, updateRoadmapTask, togglePinProject };
