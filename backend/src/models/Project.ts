import { Schema, model } from 'mongoose';

const techStackSchema = new Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  role: { type: String, required: true },
  whyChosen: { type: String, required: true },
});

const taskSchema = new Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  duration: { type: String, required: true },
  completed: { type: Boolean, default: false },
  tools: [{ type: String }],
});

const roadmapPhaseSchema = new Schema({
  phaseName: { type: String, required: true },
  tasks: [taskSchema],
});

const architectureNodeSchema = new Schema({
  id: { type: String, required: true },
  label: { type: String, required: true },
  type: { type: String, required: true },
  x: { type: Number, required: true },
  y: { type: Number, required: true },
});

const architectureEdgeSchema = new Schema({
  from: { type: String, required: true },
  to: { type: String, required: true },
  label: { type: String },
  dashed: { type: Boolean, default: false },
});

const resourceSchema = new Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  url: { type: String, required: true },
  description: { type: String, required: true },
});

const existingProjectSchema = new Schema({
  name: { type: String },
  description: { type: String },
  limitations: [{ type: String }],
});

const researchAnalysisSchema = new Schema({
  existingProjects: [existingProjectSchema],
  projectAdvantages: [{ type: String }],
  researchTopics: [{ type: String }],
  futureImprovements: [{ type: String }],
  innovationScore: { type: Number },
});

const toolDetailSchema = new Schema({
  name: { type: String },
  purpose: { type: String },
  reason: { type: String },
});

const deploymentPlatformSchema = new Schema({
  platform: { type: String },
  reason: { type: String },
  freeTier: { type: String },
});

const deploymentStepSchema = new Schema({
  step: { type: String },
  description: { type: String },
});

const toolsAndDeploymentSchema = new Schema({
  developmentTools: [toolDetailSchema],
  collaborationTools: [toolDetailSchema],
  apiTestingTools: [toolDetailSchema],
  deployment: {
    frontend: deploymentPlatformSchema,
    backend: deploymentPlatformSchema,
    database: deploymentPlatformSchema,
  },
  utilities: [toolDetailSchema],
  versionControl: {
    gitImportance: { type: String },
    githubImportance: { type: String },
    basics: [{ type: String }],
  },
  deploymentSteps: [deploymentStepSchema],
});

const hardwareComponentSchema = new Schema({
  component: { type: String, required: true },
  purpose: { type: String, required: true },
  estimatedPrice: { type: String },
  required: { type: Boolean, default: true },
  quantity: { type: Number, default: 1 },
  wiringRole: { type: String },
});

const hardwareToolSchema = new Schema({
  tool: { type: String, required: true },
  purpose: { type: String, required: true },
  whyNeeded: { type: String },
  whereUsed: { type: String },
  beginnerFriendliness: { type: String },
});

const projectSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
    },
    domain: {
      type: String,
      required: [true, 'Project domain is required'],
    },
    skillLevel: {
      type: String,
      required: true,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
    },
    duration: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: [true, 'Project description is required'],
    },
    uniquenessAnalysis: {
      score: { type: Number, required: true },
      summary: { type: String, required: true },
      suggestions: [{ type: String }],
    },
    techStack: [techStackSchema],
    roadmap: [roadmapPhaseSchema],
    architecture: {
      nodes: [architectureNodeSchema],
      edges: [architectureEdgeSchema],
    },
    resources: [resourceSchema],
    researchAnalysis: { type: researchAnalysisSchema },
    toolsAndDeployment: { type: toolsAndDeploymentSchema },
    projectType: { type: String, enum: ['software', 'hardware'], default: 'software' },
    hardwareComponents: [hardwareComponentSchema],
    hardwareTools: [hardwareToolSchema],
    hardwareCategory: String,
    preferredController: String,
    budgetRange: String,
    connectivityType: String,
    powerSource: String,
    realWorldApplications: [String],
    estimatedCost: String,
    codingRequirement: { type: String, enum: ['Low', 'Medium', 'High'] },
    hardwareComplexity: { type: String, enum: ['Basic', 'Intermediate', 'Advanced'] },
    developmentProcess: [String],
    firmwareStack: [String],
    safetyNotes: [String],
    isPinned: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export const Project = model('Project', projectSchema);
export default Project;
