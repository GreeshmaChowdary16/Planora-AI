import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, Layers, Milestone, Network, 
  Copy, Check, FileText, ArrowLeft, Clock, ShieldCheck, Award,
  Wrench, GitBranch, Search, ChevronRight, ChevronDown, Sparkles,
  CheckCircle2, TrendingUp, AlertTriangle, Cpu, Terminal, ShieldAlert, DollarSign,
  XCircle, CheckCircle
} from 'lucide-react';
import type { ProjectPlan } from '../data/mockPlans';
import apiFetch from '../utils/api';
import { useProjects } from './ProjectContext';
import { useTheme } from './ThemeContext';
import { getThemeClasses } from '../utils/themeStyles';
import { ExportProjectPDF } from './ExportProjectPDF';
// @ts-ignore
import html2pdf from 'html2pdf.js';

interface ProjectViewProps {
  plan: ProjectPlan;
  onBackToDashboard: () => void;
}

export const ProjectView: React.FC<ProjectViewProps> = ({ plan, onBackToDashboard }) => {
  const { updateProjectProgress } = useProjects();
  const { theme } = useTheme();
  const c = getThemeClasses(theme, plan.projectType);
  const [exporting, setExporting] = useState(false);

  const [activeTab, setActiveTab] = useState<
    'overview' | 'tech-stack' | 'roadmap' | 'architecture' | 'research' | 'tools-deployment' | 'export' |
    'hardware-components' | 'hardware-tools' | 'firmware' | 'circuit-flow' | 'development-process' | 'budget' | 'safety'
  >('overview');
  
  // Roadmap task tracking states loaded from localStorage
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});
  const [copySuccess, setCopySuccess] = useState(false);
  const [expandedProjects, setExpandedProjects] = useState<Record<number, boolean>>({ 0: true });

  // Toast notifications state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Auto-dismiss toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
  };

  const toggleProjectExpand = (index: number) => {
    setExpandedProjects(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // SVG Architecture Interaction States
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  const isHardware = plan.projectType === 'hardware';

  // Load roadmap progress from project plan prop directly
  useEffect(() => {
    const initialCompleted: Record<string, boolean> = {};
    if (plan && plan.roadmap) {
      plan.roadmap.forEach(phase => {
        if (phase && phase.tasks) {
          phase.tasks.forEach(task => {
            initialCompleted[task.id] = task.completed || false;
          });
        }
      });
    }
    setCompletedTasks(initialCompleted);
  }, [plan]);

  const toggleTask = async (taskId: string) => {
    const isCompleted = !completedTasks[taskId];
    const updated = { ...completedTasks, [taskId]: isCompleted };
    setCompletedTasks(updated);

    // Optimistic progress update
    const originalRoadmap = plan.roadmap;
    const updatedRoadmap = plan.roadmap.map(phase => ({
      ...phase,
      tasks: phase.tasks.map(task => {
        if (task.id === taskId) {
          return {
            ...task,
            completed: isCompleted
          };
        }
        return task;
      })
    }));

    updateProjectProgress(plan.id, updatedRoadmap);

    try {
      await apiFetch(`/projects/${plan.id}/roadmap/${taskId}`, {
        method: 'PUT',
        body: JSON.stringify({ completed: isCompleted }),
      });
    } catch (err) {
      console.error('Failed to sync task status with backend:', err);
      // Revert state on failure
      setCompletedTasks(prev => ({ ...prev, [taskId]: !isCompleted }));
      updateProjectProgress(plan.id, originalRoadmap);
      showToast('Failed to update roadmap progress', 'error');
    }
  };

  // Calculate Roadmap Progress
  const totalTasks = plan.roadmap.reduce((acc, phase) => acc + phase.tasks.length, 0);
  const completedCount = plan.roadmap.reduce((acc, phase) => {
    return acc + phase.tasks.filter(t => completedTasks[t.id]).length;
  }, 0);
  const progressPercent = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  // Format plan as Markdown for Export
  const generateMarkdown = () => {
    const hasCompanionSoftware = plan.techStack?.some(t => 
      ['frontend', 'backend', 'database', 'cloud_deployment'].includes(t.category)
    );
    let md = `# Project Plan: ${plan.title}\n\n`;
    md += `**Domain:** ${plan.domain}\n`;
    md += `**Skill Level Required:** ${plan.skillLevel}\n`;
    md += `**Estimated Duration:** ${plan.duration}\n\n`;
    md += `## Description\n${plan.description}\n\n`;
    
    md += `## Uniqueness Analysis (Score: ${plan.uniquenessAnalysis.score}/100)\n`;
    md += `${plan.uniquenessAnalysis.summary}\n\n`;
    md += `### Suggestions to Improve Project:\n`;
    plan.uniquenessAnalysis.suggestions.forEach(s => {
      md += `- ${s}\n`;
    });
    md += `\n`;

    md += `## Recommended Technology Stack\n`;
    plan.techStack.forEach(t => {
      md += `- **${t.name}** (${t.role}): ${t.whyChosen}\n`;
    });
    md += `\n`;

    md += `## Development Roadmap\n`;
    plan.roadmap.forEach(phase => {
      md += `### ${phase.phaseName}\n`;
      phase.tasks.forEach(task => {
        md += `- [ ] **${task.title}** (${task.duration}) - ${task.description}\n`;
      });
      md += `\n`;
    });

    if (plan.projectType === `hardware`) {
      md += `## Hardware Specifications & Components\n`;
      md += `**Estimated Hardware Cost:** ${plan.estimatedCost || 'N/A'}\n\n`;
      
      md += `### Bill of Materials (BOM)\n`;
      plan.hardwareComponents?.forEach(c => {
        md += `- **${c.component}** (Required: ${c.required ? 'Yes' : 'No'}): ${c.purpose}\n`;
      });
      md += `\n`;
      
      md += `### Necessary Hardware Tools\n`;
      plan.hardwareTools?.forEach(t => {
        md += `- **${t.tool}**: ${t.purpose}\n`;
      });
      md += `\n`;

      md += `### Firmware Stack & Libraries\n`;
      plan.firmwareStack?.forEach(f => {
        md += `- ${f}\n`;
      });
      md += `\n`;

      md += `### Safety Warnings & Precautions\n`;
      plan.safetyNotes?.forEach(s => {
        md += `- ⚠️ ${s}\n`;
      });
      md += `\n`;
    }

    md += `## Research Papers & Existing Solutions\n\n`;
    if (plan.researchAnalysis) {
      md += `### Innovation & Uniqueness Score: ${plan.researchAnalysis.innovationScore}/100\n\n`;
      md += `### Similar Existing Projects & Limitations\n`;
      plan.researchAnalysis.existingProjects?.forEach(proj => {
        md += `- **${proj.name}**: ${proj.description}\n`;
        md += `  *Limitations:*\n`;
        proj.limitations?.forEach(lim => {
          md += `    - ${lim}\n`;
        });
      });
      md += `\n`;
      
      md += `### How This Project Improves Existing Solutions\n`;
      plan.researchAnalysis.projectAdvantages?.forEach(adv => {
        md += `- ${adv}\n`;
      });
      md += `\n`;
      
      md += `### Academic Research Paper Topics\n`;
      plan.researchAnalysis.researchTopics?.forEach(topic => {
        md += `- ${topic}\n`;
      });
      md += `\n`;
      
      md += `### Future Improvements & Scope\n`;
      plan.researchAnalysis.futureImprovements?.forEach(imp => {
        md += `- ${imp}\n`;
      });
      md += `\n`;
    } else if (plan.resources) {
      md += `## Resources & Datasets\n`;
      plan.resources.forEach(r => {
        md += `- [${r.name}](${r.url}) (${r.type}): ${r.description}\n`;
      });
      md += `\n`;
    }

    if (plan.toolsAndDeployment && (plan.projectType !== `hardware` || hasCompanionSoftware)) {
      md += `## Recommended Tools & Deployment\n\n`;
      md += `### Development & Coding Tools\n`;
      plan.toolsAndDeployment.developmentTools?.forEach(t => {
        md += `- **${t.name}** (${t.purpose}): ${t.reason}\n`;
      });
      md += `\n`;

      md += `### Collaboration & Productivity Tools\n`;
      plan.toolsAndDeployment.collaborationTools?.forEach(t => {
        md += `- **${t.name}** (${t.purpose}): ${t.reason}\n`;
      });
      md += `\n`;

      md += `### Deployment Platforms\n`;
      md += `- **Frontend Hosting:** ${plan.toolsAndDeployment.deployment?.frontend?.platform} - ${plan.toolsAndDeployment.deployment?.frontend?.reason} (Tier: ${plan.toolsAndDeployment.deployment?.frontend?.freeTier})\n`;
      md += `- **Backend Server:** ${plan.toolsAndDeployment.deployment?.backend?.platform} - ${plan.toolsAndDeployment.deployment?.backend?.reason} (Tier: ${plan.toolsAndDeployment.deployment?.backend?.freeTier})\n`;
      md += `- **Database Store:** ${plan.toolsAndDeployment.deployment?.database?.platform} - ${plan.toolsAndDeployment.deployment?.database?.reason} (Tier: ${plan.toolsAndDeployment.deployment?.database?.freeTier})\n`;
      md += `\n`;

      md += `### Version Control Guidelines\n`;
      md += `- **Git Relevance:** ${plan.toolsAndDeployment.versionControl?.gitImportance}\n`;
      md += `- **GitHub Relevance:** ${plan.toolsAndDeployment.versionControl?.githubImportance}\n`;
      md += `\n#### Basic Branch Commands:\n`;
      plan.toolsAndDeployment.versionControl?.basics?.forEach(b => {
        md += '- `' + b + '`\n';
      });
      md += `\n`;

      md += `### Step-by-Step Production Deployment Roadmap\n`;
      plan.toolsAndDeployment.deploymentSteps?.forEach(s => {
        md += `- **${s.step}:** ${s.description}\n`;
      });
      md += `\n`;
    }

    return md;
  };

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(generateMarkdown());
    setCopySuccess(true);
    showToast('Markdown copied to clipboard!', 'success');
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(plan, null, 2));
    const downloadAnchor = document.createElement(`a`);
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `PlanoraAI_${plan.title.replace(/\s+/g, '_')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleExportPDF = async () => {
    const element = document.getElementById("project-report");
    if (!element) {
      showToast("PDF report template not found in DOM!", "error");
      return;
    }

    setExporting(true);
    document.body.classList.add("pdf-mode");

    const opt = {
      margin: 0.5,
      filename: `${plan.title}.pdf`,
      image: { type: "jpeg", quality: 1 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        logging: false
      },
      jsPDF: {
        unit: "in",
        format: "a4",
        orientation: "portrait"
      }
    };

    try {
      // Small delay to let classes apply and DOM repaint
      await new Promise(resolve => setTimeout(resolve, 250));
      // @ts-ignore
      await html2pdf().set(opt).from(element).save();
      showToast("PDF report exported successfully!", "success");
    } catch (err) {
      console.error(err);
      showToast("Failed to generate PDF report.", "error");
    } finally {
      document.body.classList.remove("pdf-mode");
      setExporting(false);
    }
  };


  return (
    <div className={`space-y-6 p-4 max-w-6xl mx-auto ${c.textPrimary}`}>
      {/* Header breadcrumb */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b ${c.border} pb-5`}>
        <div className="flex items-center gap-3">
          <button 
            onClick={onBackToDashboard}
            className={`p-2 rounded-lg border transition-colors ${
              theme === 'dark'
                ? isHardware
                  ? 'bg-[#09090B]/60 border-cyan-500/20 text-cyan-400 hover:bg-neutral-800' 
                  : `bg-neutral-800/40 hover:bg-neutral-800 border-neutral-800 ${c.textSecondary}`
                : isHardware
                  ? 'bg-white hover:bg-cyan-50/50 border-cyan-200 text-cyan-600'
                  : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
            }`}
          >
            <ArrowLeft className="w-4.5 h-4.5" />
          </button>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className={`text-[10px] ${
                isHardware 
                  ? theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'
                  : theme === 'dark' ? 'text-[#FB923C]' : 'text-orange-600'
              } font-semibold uppercase tracking-wider block font-mono`}>{plan.domain}</span>
              <span className={`text-[8px] font-mono px-2 py-0.5 rounded font-bold uppercase tracking-widest ${
                isHardware 
                  ? theme === 'dark' 
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-[0_0_8px_rgba(6,182,212,0.1)]' 
                    : 'bg-cyan-50 text-cyan-700 border border-cyan-200'
                  : theme === 'dark'
                    ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                    : 'bg-orange-50 text-orange-600 border border-orange-200'
              }`}>
                {isHardware ? 'IoT Engineering Mentor' : 'SaaS Project Planner'}
              </span>
            </div>
            <h2 className={`text-xl sm:text-2xl font-bold tracking-tight mt-1.5 ${c.textPrimary}`}>{plan.title}</h2>
          </div>
        </div>

        {/* Action Widgets */}
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <div className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-lg text-xs font-semibold ${c.subCard}`}>
            <Clock className={`w-3.5 h-3.5 ${isHardware ? 'text-cyan-500' : 'text-orange-500'}`} />
            <span>{plan.duration}</span>
          </div>
          <div className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-lg text-xs font-semibold ${c.subCard}`}>
            <Award className={`w-3.5 h-3.5 ${isHardware ? 'text-cyan-500' : 'text-orange-500'}`} />
            <span>{plan.skillLevel}</span>
          </div>
          {isHardware && plan.codingRequirement && (
            <div className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-lg text-xs font-semibold ${c.subCard}`}>
              <span className={`${theme === 'dark' ? 'text-neutral-450' : 'text-zinc-500'} font-mono`}>Coding:</span>
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                plan.codingRequirement === 'Low' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                plan.codingRequirement === 'Medium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                'bg-rose-500/10 text-rose-400 border border-rose-500/20'
              }`}>{plan.codingRequirement}</span>
            </div>
          )}
          {isHardware && plan.hardwareComplexity && (
            <div className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-lg text-xs font-semibold ${c.subCard}`}>
              <span className={`${theme === 'dark' ? 'text-neutral-450' : 'text-zinc-500'} font-mono`}>Complexity:</span>
              <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold border ${
                plan.hardwareComplexity === 'Basic' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                plan.hardwareComplexity === 'Intermediate' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                'bg-rose-500/10 text-rose-400 border border-rose-500/20'
              }`}>{plan.hardwareComplexity}</span>
            </div>
          )}
        </div>
      </div>

      {/* Tabs Header */}
      <div className={`flex flex-wrap gap-1 border-b p-1 rounded-xl max-w-max ${
        theme === 'dark' ? 'border-neutral-850 bg-neutral-900/60' : 'border-slate-205 bg-slate-100'
      }`}>
        {(isHardware ? [
          { id: 'overview', label: 'Overview', icon: <BookOpen className="w-4 h-4" /> },
          { id: 'hardware-components', label: 'Components', icon: <Cpu className="w-4 h-4" /> },
          { id: 'hardware-tools', label: 'Hardware Tools', icon: <Wrench className="w-4 h-4" /> },
          { id: 'firmware', label: 'Firmware', icon: <Terminal className="w-4 h-4" /> },
          { id: 'circuit-flow', label: 'Circuit Flow', icon: <Network className="w-4 h-4" /> },
          { id: 'development-process', label: 'Development Process', icon: <Milestone className="w-4 h-4" /> },
          { id: 'budget', label: 'Budget', icon: <DollarSign className="w-4 h-4" /> },
          { id: 'safety', label: 'Safety Notes', icon: <ShieldAlert className="w-4 h-4" /> },
          { id: 'research', label: 'Research Analysis', icon: <Search className="w-4 h-4" /> },
          { id: 'export', label: 'Export Plan', icon: <FileText className="w-4 h-4" /> }
        ] : [
          { id: 'overview', label: 'Overview', icon: <BookOpen className="w-4 h-4" /> },
          { id: 'tech-stack', label: 'Tech Stack', icon: <Layers className="w-4 h-4" /> },
          { id: 'roadmap', label: 'Roadmap', icon: <Milestone className="w-4 h-4" /> },
          { id: 'architecture', label: 'Architecture', icon: <Network className="w-4 h-4" /> },
          { id: 'research', label: 'Research Papers & Existing Solutions', icon: <Search className="w-4 h-4" /> },
          { id: 'tools-deployment', label: 'Tools & Deployment', icon: <Wrench className="w-4 h-4" /> },
          { id: 'export', label: 'Export Plan', icon: <FileText className="w-4 h-4" /> }
        ]).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
              activeTab === tab.id
                ? (isHardware ? 'bg-[#06B6D4] text-[#FAFAFA] shadow-md shadow-[#06B6D4]/20' : 'bg-[#F97316] text-[#FAFAFA] shadow-md shadow-[#F97316]/20')
                : `${c.textSecondary} hover:${c.textPrimary} hover:bg-neutral-800/40`
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <div className="mt-4">
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {/* Left section: Description */}
            <div className="md:col-span-2 space-y-6">
              <div className={`${c.card} rounded-xl p-6 space-y-3 relative overflow-hidden`}>
                {isHardware && (
                  <>
                    <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-cyan-400 rounded-full" />
                    <div className="absolute top-0.5 right-0.5 w-1 h-1 bg-cyan-400 rounded-full" />
                  </>
                )}
                <h3 className={`text-base font-bold text-neutral-100 uppercase tracking-wider ${isHardware ? 'text-cyan-400' : 'text-[#F97316]'}`}>
                  {isHardware ? 'System Specification & Objective' : 'Project Synopsis'}
                </h3>
                <p className={`${c.textSecondary} text-sm leading-relaxed font-light`}>{plan.description}</p>
              </div>

              {/* Suggestions for improvement */}
              <div className={`${c.card} rounded-xl p-6 space-y-4 relative overflow-hidden`}>
                {isHardware && (
                  <>
                    <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-cyan-400 rounded-full" />
                    <div className="absolute top-0.5 right-0.5 w-1 h-1 bg-cyan-400 rounded-full" />
                  </>
                )}
                <h3 className="text-base font-bold text-neutral-100 flex items-center gap-2">
                  <ShieldCheck className={`w-5 h-5 ${isHardware ? 'text-cyan-400' : 'text-green-400'}`} />
                  <span>{isHardware ? 'Hardware Optimization & Upgrade Tips' : 'How to Make this Project Stand Out'}</span>
                </h3>
                <div className="space-y-3">
                  {plan.uniquenessAnalysis.suggestions.map((suggestion, index) => (
                    <div key={index} className={`flex gap-3 p-3 rounded-lg ${c.subCard}`}>
                      <div className={`w-5 h-5 ${isHardware ? 'bg-cyan-500/10 text-cyan-400' : 'bg-[#F97316]/10 text-[#FB923C]'} rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5`}>
                        {index + 1}
                      </div>
                      <p className={`text-xs ${c.textSecondary} leading-relaxed font-light`}>{suggestion}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Real World Applications section for hardware */}
              {isHardware && plan.realWorldApplications && plan.realWorldApplications.length > 0 && (
                <div className={`border rounded-xl p-6 space-y-4 shadow-[0_0_15px_rgba(6,182,212,0.05)] relative overflow-hidden ${c.card}`}>
                  <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-cyan-400 rounded-full" />
                  <div className="absolute top-0.5 right-0.5 w-1 h-1 bg-cyan-400 rounded-full" />
                  <div className="absolute bottom-0.5 left-0.5 w-1 h-1 bg-cyan-400 rounded-full" />
                  <div className="absolute bottom-0.5 right-0.5 w-1 h-1 bg-cyan-400 rounded-full" />
                  
                  <h3 className="text-base font-bold text-neutral-100 flex items-center gap-2">
                    <Award className="w-5 h-5 text-cyan-400" />
                    <span>Real-World Engineering Applications</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {plan.realWorldApplications.map((app, index) => (
                      <div key={index} className={`p-4 rounded-lg flex gap-3 border ${theme === 'dark' ? 'bg-neutral-900/40 border-neutral-800' : 'bg-slate-50 border-slate-200'}`}>
                        <div className="w-5 h-5 bg-cyan-500/10 text-cyan-400 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5 font-mono">
                          {index + 1}
                        </div>
                        <p className={`text-xs ${c.textSecondary} leading-relaxed font-light`}>{app}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right section: Uniqueness Metric gauge */}
            <div className="md:col-span-1 space-y-6">
              <div 
                className={`${c.card} rounded-xl p-6 text-center space-y-5 relative overflow-hidden`}
                style={{ boxShadow: `0 0 25px -10px ${isHardware ? 'rgba(6, 182, 212, 0.05)' : 'rgba(249, 115, 22, 0.05)'}` }}
              >
                {isHardware && (
                  <>
                    <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-cyan-400 rounded-full" />
                    <div className="absolute top-0.5 right-0.5 w-1 h-1 bg-cyan-400 rounded-full" />
                  </>
                )}
                <h3 className={`text-xs font-semibold uppercase tracking-wider ${c.textSecondary}`}>
                  {isHardware ? 'Circuit Engineering Score' : 'AI Uniqueness Matrix'}
                </h3>

                {/* Score gauge circle */}
                <div className="relative w-36 h-36 mx-auto flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" stroke="#262626" strokeWidth="6" fill="transparent" />
                    <circle 
                      cx="50" 
                      cy="50" 
                      r="42" 
                      stroke={isHardware ? "#06B6D4" : "#F97316"} 
                      strokeWidth="6" 
                      fill="transparent" 
                      strokeDasharray="263.8"
                      strokeDashoffset={263.8 - (263.8 * plan.uniquenessAnalysis.score) / 100}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute flex flex-col justify-center items-center font-mono">
                    <span className="text-3xl font-extrabold text-neutral-100">{plan.uniquenessAnalysis.score}</span>
                    <span className={`text-[9px] ${c.textMuted} font-bold uppercase tracking-wider`}>
                      {isHardware ? 'ENG INDEX' : 'Score Index'}
                    </span>
                  </div>
                </div>

                <div className={`text-xs ${c.textSecondary} leading-relaxed font-light p-3.5 rounded-lg ${c.subCard}`}>
                  {plan.uniquenessAnalysis.summary}
                </div>
              </div>

              {/* Progress Summary Widget */}
              <div className={`${c.card} rounded-xl p-5 space-y-4 relative overflow-hidden`}>
                {isHardware && (
                  <>
                    <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-cyan-400 rounded-full" />
                    <div className="absolute top-0.5 right-0.5 w-1 h-1 bg-cyan-400 rounded-full" />
                  </>
                )}
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className={`${c.textSecondary} font-semibold uppercase tracking-wider`}>
                    {isHardware ? 'Execution Milestones' : 'Roadmap Checklist'}
                  </span>
                  <span className={`${isHardware ? 'text-cyan-400' : 'text-[#FB923C]'} font-bold`}>{progressPercent}% Done</span>
                </div>

                <div className={`w-full h-2.5 rounded-full overflow-hidden border ${theme === 'dark' ? 'bg-neutral-900 border-neutral-800' : 'bg-slate-150 border-slate-200'}`}>
                  <div 
                    className={`${isHardware ? 'bg-cyan-500' : 'bg-[#F97316]'} h-full transition-all duration-300`}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <p className={`text-[10px] ${c.textMuted} font-mono text-center`}>
                  {completedCount} of {totalTasks} milestones completed
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'tech-stack' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {plan.techStack.map((tech) => (
              <div 
                key={tech.name} 
                className={`rounded-xl p-5 space-y-4 flex flex-col justify-between hover:border-[#F97316]/30 transition-all duration-300 relative group ${c.card}`}
              >
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-neutral-800/10 to-transparent rounded-bl-full pointer-events-none" />

                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className={`text-[10px] bg-neutral-800 px-2 py-0.5 rounded font-mono font-bold uppercase ${c.textSecondary}`}>
                      {tech.category.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-[#FB923C] font-medium">{tech.role}</span>
                  </div>
                  <h4 className="text-lg font-bold text-neutral-100">{tech.name}</h4>
                </div>

                <div className={`p-3 rounded-lg text-xs mt-3 ${c.subCard} ${c.textSecondary} leading-relaxed font-light mt-3`}>
                  <span className="text-[9px] text-[#F97316] uppercase tracking-wider font-semibold block mb-1">AI Recommendation Context</span>
                  {tech.whyChosen}
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {activeTab === 'roadmap' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Progress indicator */}
            <div className={`rounded-xl p-4 flex items-center justify-between ${c.card}`}>
              <div>
                <h3 className="text-sm font-bold">Interactive Learning Tracker</h3>
                <p className={`text-xs ${c.textSecondary}`}>Check off tasks to track your implementation progress. Stored locally.</p>
              </div>
              <div className="flex items-center gap-3 text-right">
                <div>
                  <span className="text-lg font-bold text-[#F97316] font-mono">{progressPercent}%</span>
                  <span className={`text-[10px] ${c.textMuted} block`}>Completion</span>
                </div>
                <div className={`w-16 h-1.5 rounded-full overflow-hidden ${theme === 'dark' ? 'bg-neutral-800' : 'bg-slate-200'}`}>
                  <div className="bg-[#F97316] h-full" style={{ width: `${progressPercent}%` }} />
                </div>
              </div>
            </div>

            {/* Phase stack */}
            <div className={`space-y-6 relative border-l pl-6 ml-3 ${theme === 'dark' ? 'border-neutral-800' : 'border-slate-200'}`}>
              {plan.roadmap.map((phase, phaseIndex) => (
                <div key={phaseIndex} className="space-y-4 relative">
                  {/* Indicator Dot */}
                  <div className={`absolute -left-[31px] top-1 w-2.5 h-2.5 rounded-full bg-[#F97316] border-2 shadow-sm shadow-[#F97316] ${theme === 'dark' ? 'border-[#09090B]' : 'border-white'}`} />

                  <h4 className="text-sm font-bold uppercase tracking-wider text-[#FB923C]">{phase.phaseName}</h4>

                  <div className="grid grid-cols-1 gap-3">
                    {phase.tasks.map((task) => {
                      const isCompleted = !!completedTasks[task.id];
                      return (
                        <div 
                          key={task.id}
                          onClick={() => toggleTask(task.id)}
                          className={`flex items-start gap-4 rounded-xl p-4 cursor-pointer select-none transition-all duration-300 ${c.card} ${
                            isCompleted 
                              ? 'border-neutral-800/40 bg-neutral-900/30 opacity-70' 
                              : 'hover:border-neutral-400/40'
                          }`}
                        >
                          <button 
                            type="button"
                            className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                              isCompleted 
                                ? 'bg-green-500/10 border-green-500 text-green-400' 
                                : 'border-neutral-700 hover:border-[#F97316]'
                            }`}
                          >
                            {isCompleted && <Check className="w-3.5 h-3.5" />}
                          </button>

                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className={`text-xs font-semibold ${isCompleted ? `line-through ${c.textMuted}` : `${c.textPrimary}`}`}>
                                {task.title}
                              </span>
                              <span className={`text-[9px] bg-neutral-800 ${c.textSecondary} font-mono px-1.5 py-0.5 rounded`}>
                                {task.duration}
                              </span>
                            </div>
                            <p className={`text-xs ${c.textSecondary} font-light leading-relaxed`}>
                              {task.description}
                            </p>
                            {task.tools && task.tools.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 mt-2">
                                {task.tools.map((tool, tIdx) => (
                                  <span 
                                    key={tIdx} 
                                    className="text-[9px] bg-[#F97316]/10 text-[#FB923C] border border-[#F97316]/20 px-2 py-0.5 rounded-md font-mono font-medium tracking-wide"
                                  >
                                    {tool}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'architecture' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-2xl p-6 space-y-4 ${c.card}`}
          >
            <div>
              <h3 className="text-sm font-bold">Interactive Structural Map</h3>
              <p className={`text-xs ${c.textSecondary}`}>Hover over system nodes to trace connections and active protocols.</p>
            </div>

            {/* SVG Render Container */}
            <div className={`w-full rounded-xl border ${c.subCard} overflow-x-auto p-4 flex justify-center`}>
              <svg className="w-[850px] h-[360px]" viewBox="0 0 850 360">
                {/* Defs filters for glows */}
                <defs>
                  <filter id="glow-edge" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                  <filter id="glow-node" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Draw Edges */}
                {plan.architecture.edges.map((edge, idx) => {
                  const fromNode = plan.architecture.nodes.find(n => n.id === edge.from);
                  const toNode = plan.architecture.nodes.find(n => n.id === edge.to);
                  if (!fromNode || !toNode) return null;

                  const isHighlighted = hoveredNodeId === edge.from || hoveredNodeId === edge.to;

                  return (
                    <g key={idx}>
                      <line
                        x1={fromNode.x}
                        y1={fromNode.y}
                        x2={toNode.x}
                        y2={toNode.y}
                        stroke={isHighlighted ? "#F97316" : "#262626"}
                        strokeWidth={isHighlighted ? "2.5" : "1.5"}
                        strokeDasharray={edge.dashed ? "4,4" : "0"}
                        filter={isHighlighted ? "url(#glow-edge)" : ""}
                        className="transition-all duration-300"
                      />
                      {/* Edge label */}
                      {edge.label && (
                        <rect
                          x={(fromNode.x + toNode.x) / 2 - 45}
                          y={(fromNode.y + toNode.y) / 2 - 8}
                          width="90"
                          height="15"
                          rx="3"
                          fill="#09090B"
                          stroke={isHighlighted ? "#F97316" : "#262626"}
                          strokeWidth="0.5"
                        />
                      )}
                      {edge.label && (
                        <text
                          x={(fromNode.x + toNode.x) / 2}
                          y={(fromNode.y + toNode.y) / 2 + 3}
                          fill={isHighlighted ? "#FB923C" : "#737373"}
                          fontSize="8.5"
                          textAnchor="middle"
                          fontFamily="monospace"
                        >
                          {edge.label}
                        </text>
                      )}
                    </g>
                  );
                })}

                {/* Draw Nodes */}
                {plan.architecture.nodes.map((node) => {
                  const isHovered = hoveredNodeId === node.id;
                  
                  // Color configuration based on type
                  const nodeColors = {
                    client: { bg: '#09090B', border: '#3b82f6', text: '#60a5fa' },
                    server: { bg: '#09090B', border: '#8b5cf6', text: '#a78bfa' },
                    database: { bg: '#09090B', border: '#10b981', text: '#34d399' },
                    external_api: { bg: '#09090B', border: '#f43f5e', text: '#fb7185' },
                    iot_device: { bg: '#09090B', border: '#eab308', text: '#facc15' }
                  };
                  
                  const colors = nodeColors[node.type] || { bg: '#09090B', border: '#525252', text: '#a3a3a3' };
                  const borderColor = isHovered ? '#F97316' : colors.border;
                  const textColor = isHovered ? '#FAFAFA' : colors.text;

                  return (
                    <g 
                      key={node.id}
                      onMouseEnter={() => setHoveredNodeId(node.id)}
                      onMouseLeave={() => setHoveredNodeId(null)}
                      className="cursor-pointer"
                    >
                      {/* Outer Card Rectangle */}
                      <rect
                        x={node.x - 65}
                        y={node.y - 25}
                        width="130"
                        height="50"
                        rx="8"
                        fill={colors.bg}
                        stroke={borderColor}
                        strokeWidth={isHovered ? "2.5" : "1.5"}
                        filter={isHovered ? "url(#glow-node)" : ""}
                        className="transition-all duration-300"
                      />
                      {/* Node label */}
                      <text
                        x={node.x}
                        y={node.y - 2}
                        fill="#FAFAFA"
                        fontSize="10"
                        fontWeight="semibold"
                        textAnchor="middle"
                        fontFamily="sans-serif"
                      >
                        {node.label}
                      </text>
                      {/* Node type sub-label */}
                      <text
                        x={node.x}
                        y={node.y + 12}
                        fill={textColor}
                        fontSize="8.5"
                        textAnchor="middle"
                        fontFamily="monospace"
                        className="transition-all duration-300"
                      >
                        {node.type.toUpperCase().replace('_', ' ')}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
            
            <div className={`flex justify-center gap-6 text-[10px] ${c.textMuted} pt-2 border-t border-neutral-850/60 font-mono`}>
              <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded bg-blue-500" /><span>Client View</span></div>
              <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded bg-purple-500" /><span>Gateway Server</span></div>
              <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded bg-emerald-500" /><span>Database Cache</span></div>
              <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded bg-red-500" /><span>External API Node</span></div>
            </div>
          </motion.div>
        )}

        {activeTab === 'hardware-components' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className={`rounded-2xl p-5 flex items-center justify-between ${c.card}`}>
              <div>
                <h3 className="text-sm font-bold tracking-wide">Bill of Materials (BOM)</h3>
                <p className={`text-xs ${c.textSecondary} mt-1`}>Recommended physical components and microcontroller peripherals for this project.</p>
              </div>
              <Cpu className="w-8 h-8 text-cyan-400 shrink-0 opacity-80" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {plan.hardwareComponents && plan.hardwareComponents.length > 0 ? (
                plan.hardwareComponents.map((comp, idx) => (
                  <div key={idx} className={`border rounded-xl p-5 hover:border-cyan-400/40 shadow-[0_0_15px_rgba(6,182,212,0.03)] hover:shadow-[0_0_20px_rgba(6,182,212,0.1)] transition-all duration-300 relative overflow-hidden group ${c.card}`}>
                    <div className="absolute top-0.5 left-0.5 w-1.5 h-1.5 bg-cyan-500 rounded-full opacity-60" />
                    <div className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-cyan-500 rounded-full opacity-60" />
                    <div className="absolute bottom-0.5 left-0.5 w-1.5 h-1.5 bg-cyan-500 rounded-full opacity-60" />
                    <div className="absolute bottom-0.5 right-0.5 w-1.5 h-1.5 bg-cyan-500 rounded-full opacity-60" />

                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="text-base font-bold text-neutral-100 tracking-wide">{comp.component}</h4>
                        <div className="flex gap-2 mt-1">
                          <span className="text-[9px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded font-mono font-bold">
                            QTY: {comp.quantity || 1}
                          </span>
                          {comp.estimatedPrice && (
                            <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-mono font-bold">
                              {comp.estimatedPrice}
                            </span>
                          )}
                        </div>
                      </div>
                      <span className={`text-[9px] px-2 py-0.5 rounded font-mono uppercase font-bold tracking-wider ${
                        comp.required 
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' 
                          : 'bg-neutral-800 ' + c.textSecondary + ' border border-neutral-700'
                      }`}>
                        {comp.required ? 'Required' : 'Optional'}
                      </span>
                    </div>

                    <p className={`text-xs ${c.textSecondary} leading-relaxed font-light mb-4`}>{comp.purpose}</p>

                    {comp.wiringRole && (
                      <div className={`rounded-lg p-3 text-xs ${c.subCard}`}>
                        <span className="text-[9px] text-cyan-400 font-semibold font-mono block mb-1 uppercase tracking-wider">Connection & Wiring Role</span>
                        <span className={`${c.textSecondary} font-mono font-light text-[11px] leading-relaxed`}>{comp.wiringRole}</span>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className={`col-span-2 border rounded-xl p-6 text-center text-xs ${c.card} ${c.textSecondary}`}>
                  No hardware components specified.
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'hardware-tools' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-[#18181B] border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.05)] rounded-2xl p-5 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold tracking-wide">Required Hardware Tools</h3>
                <p className={`text-xs ${c.textSecondary} mt-1`}>Laboratory equipment, wiring supplies, and diagnostic tools needed for assembly.</p>
              </div>
              <Wrench className="w-8 h-8 text-cyan-400 shrink-0 opacity-80" />
            </div>

            <div className="grid grid-cols-1 gap-6">
              {plan.hardwareTools && plan.hardwareTools.length > 0 ? (
                plan.hardwareTools.map((tool, idx) => (
                  <div key={idx} className={`border rounded-xl p-5 hover:border-cyan-400/40 shadow-[0_0_15px_rgba(6,182,212,0.03)] transition-all duration-300 relative overflow-hidden group flex flex-col md:flex-row gap-4 ${c.card}`}>
                    <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-cyan-400 rounded-full" />
                    <div className={`p-3 border rounded-xl h-fit text-cyan-400 shrink-0 ${theme === 'dark' ? 'bg-neutral-900 border-cyan-500/10' : 'bg-cyan-50 border-cyan-100'}`}>
                      <Wrench className="w-6 h-6" />
                    </div>
                    <div className="flex-1 space-y-3">
                      <div>
                        <h4 className="text-base font-bold text-neutral-100">{tool.tool}</h4>
                        <p className={`text-xs ${c.textSecondary} leading-relaxed font-light mt-1`}>{tool.purpose}</p>
                      </div>
                      
                      <div className={`grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t ${theme === 'dark' ? 'border-neutral-800' : 'border-slate-200'}`}>
                        {tool.whyNeeded && (
                          <div>
                            <span className="text-[9px] text-cyan-400 font-mono font-bold block uppercase tracking-wider">Why Needed</span>
                            <p className={`text-[11px] ${c.textSecondary} font-light mt-0.5 leading-relaxed`}>{tool.whyNeeded}</p>
                          </div>
                        )}
                        {tool.whereUsed && (
                          <div>
                            <span className="text-[9px] text-cyan-400 font-mono font-bold block uppercase tracking-wider">Where Used</span>
                            <p className={`text-[11px] ${c.textSecondary} font-light mt-0.5 leading-relaxed`}>{tool.whereUsed}</p>
                          </div>
                        )}
                        {tool.beginnerFriendliness && (
                          <div>
                            <span className="text-[9px] text-cyan-400 font-mono font-bold block uppercase tracking-wider">Learning Curve</span>
                            <p className={`text-[11px] ${c.textSecondary} font-light mt-0.5 leading-relaxed`}>{tool.beginnerFriendliness}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className={`border rounded-xl p-6 text-center text-xs ${c.card} ${c.textSecondary}`}>
                  No hardware tools specified.
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'firmware' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-[#18181B] border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.05)] rounded-2xl p-5 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold tracking-wide">Firmware Stack & Libraries</h3>
                <p className={`text-xs ${c.textSecondary} mt-1`}>Embedded libraries, SDK modules, and device drivers needed for the microcontroller code.</p>
              </div>
              <Terminal className="w-8 h-8 text-cyan-400 shrink-0 opacity-80" />
            </div>

            <div className={`rounded-xl overflow-hidden shadow-[0_0_20px_rgba(6,182,212,0.05)] border ${theme === 'dark' ? 'bg-[#09090B] border-cyan-500/20' : 'bg-slate-50 border-cyan-200'}`}>
              <div className={`px-4 py-2.5 border-b flex items-center justify-between ${theme === 'dark' ? 'bg-[#18181B] border-cyan-500/10' : 'bg-white border-cyan-100'}`}>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/40" />
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/40" />
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500/40" />
                  </div>
                  <span className={`text-[10px] ${c.textSecondary} font-mono font-bold`}>firmware_config.ino</span>
                </div>
                <span className="text-[9px] text-cyan-400 font-mono">C++ / Arduino</span>
              </div>
              <div className={`p-5 font-mono text-xs ${c.textSecondary} space-y-4 select-all`}>
                <div>
                  <span className="text-cyan-400">// Required libraries and header declarations</span>
                </div>
                {plan.firmwareStack && plan.firmwareStack.length > 0 ? (
                  plan.firmwareStack.map((fw, idx) => {
                    const match = fw.match(/^([^\s\(]+)(?:\s+\((.+)\))?/);
                    const lib = match ? match[1] : fw;
                    const comment = match && match[2] ? ` // ${match[2]}` : '';
                    
                    return (
                      <div key={idx} className="flex items-start gap-4">
                        <span className="text-neutral-600 select-none text-right w-6">{idx + 1}</span>
                        <div>
                          <span className="text-[#F43F5E]">#include</span>{' '}
                          <span className="text-emerald-400">&lt;{lib}&gt;</span>
                          {comment && <span className={`${c.textMuted} font-light italic`}>{comment}</span>}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className={`${c.textMuted} italic p-4 text-center`}>No libraries specified.</div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'circuit-flow' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-2xl p-6 space-y-4 shadow-[0_0_15px_rgba(6,182,212,0.05)] ${c.card}`}
          >
            <div>
              <h3 className="text-sm font-bold tracking-wide">Circuit Signal & Telemetry Flow</h3>
              <p className={`text-xs ${c.textSecondary}`}>Hover over hardware modules to trace connection pins and telemetry signals.</p>
            </div>

            {/* Circuit-board style SVG Render Container */}
            <div className={`w-full rounded-xl overflow-x-auto p-4 flex justify-center relative border ${theme === 'dark' ? 'bg-[#09090B] border-cyan-500/10' : 'bg-slate-50 border-cyan-100'}`}>
              {/* Background grid lines for circuit vibe */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
              
              <svg className="w-[850px] h-[360px] relative z-10" viewBox="0 0 850 360">
                <defs>
                  <filter id="glow-edge" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                  <filter id="glow-node" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Draw circuit tracks with right-angled corners */}
                {plan.architecture.edges.map((edge, idx) => {
                  const fromNode = plan.architecture.nodes.find(n => n.id === edge.from);
                  const toNode = plan.architecture.nodes.find(n => n.id === edge.to);
                  if (!fromNode || !toNode) return null;

                  const isHighlighted = hoveredNodeId === edge.from || hoveredNodeId === edge.to;

                  // Compute right-angled path coordinates
                  const midX = (fromNode.x + toNode.x) / 2;

                  return (
                    <g key={idx}>
                      <path
                        d={`M ${fromNode.x} ${fromNode.y} L ${midX} ${fromNode.y} L ${midX} ${toNode.y} L ${toNode.x} ${toNode.y}`}
                        fill="none"
                        stroke={isHighlighted ? "#22D3EE" : "#06B6D4"}
                        strokeWidth={isHighlighted ? "2.5" : "1.5"}
                        strokeDasharray={edge.dashed ? "4,4" : "0"}
                        filter={isHighlighted ? "url(#glow-edge)" : ""}
                        className="transition-all duration-300 opacity-80"
                      />
                      
                      {/* Solder terminal dots */}
                      <circle cx={fromNode.x} cy={fromNode.y} r="3" fill="#22D3EE" />
                      <circle cx={toNode.x} cy={toNode.y} r="3" fill="#22D3EE" />

                      {/* Connection Label */}
                      {edge.label && (
                        <g transform={`translate(${(fromNode.x + toNode.x) / 2 - 45}, ${(fromNode.y + toNode.y) / 2 - 8})`}>
                          <rect
                            width="90"
                            height="16"
                            rx="3"
                            fill="#09090B"
                            stroke={isHighlighted ? "#22D3EE" : "#06B6D4"}
                            strokeWidth="0.5"
                            className="opacity-90"
                          />
                          <text
                            x="45"
                            y="11"
                            fill={isHighlighted ? "#22D3EE" : "#a3a3a3"}
                            fontSize="8"
                            textAnchor="middle"
                            fontFamily="monospace"
                          >
                            {edge.label}
                          </text>
                        </g>
                      )}
                    </g>
                  );
                })}

                {/* Draw circuit components */}
                {plan.architecture.nodes.map((node) => {
                  const isHovered = hoveredNodeId === node.id;
                  const borderColor = isHovered ? '#22D3EE' : '#06B6D4';
                  
                  // Component styling
                  const isMCU = node.label.toLowerCase().includes('mcu') || node.label.toLowerCase().includes('esp32') || node.label.toLowerCase().includes('arduino') || node.label.toLowerCase().includes('raspberry');

                  return (
                    <g 
                      key={node.id}
                      onMouseEnter={() => setHoveredNodeId(node.id)}
                      onMouseLeave={() => setHoveredNodeId(null)}
                      className="cursor-pointer"
                    >
                      {/* Chip package body */}
                      <rect
                        x={node.x - 70}
                        y={node.y - 28}
                        width="140"
                        height="56"
                        rx="4"
                        fill="#09090B"
                        stroke={borderColor}
                        strokeWidth={isHovered ? "2.5" : "1.5"}
                        filter={isHovered ? "url(#glow-node)" : ""}
                        className="transition-all duration-300"
                      />

                      {/* Draw IC legs/pins on the edges */}
                      {isMCU ? (
                        <>
                          {/* MCU style: 5 pins on left, 5 on right */}
                          {[-16, -8, 0, 8, 16].map((offset, i) => (
                            <g key={i}>
                              <rect x={node.x - 75} y={node.y + offset - 2} width="5" height="4" fill="#67E8F9" rx="0.5" />
                              <rect x={node.x + 70} y={node.y + offset - 2} width="5" height="4" fill="#67E8F9" rx="0.5" />
                            </g>
                          ))}
                          {/* Dot marker */}
                          <circle cx={node.x - 60} cy={node.y - 18} r="2" fill="#22D3EE" />
                        </>
                      ) : (
                        <>
                          {/* Module style: 3 pins on the bottom */}
                          {[-15, 0, 15].map((offset, i) => (
                            <rect key={i} x={node.x + offset - 2} y={node.y + 28} width="4" height="5" fill="#67E8F9" rx="0.5" />
                          ))}
                        </>
                      )}

                      {/* Component title */}
                      <text
                        x={node.x}
                        y={node.y - 2}
                        fill="#FAFAFA"
                        fontSize="9.5"
                        fontWeight="semibold"
                        textAnchor="middle"
                        fontFamily="monospace"
                      >
                        {node.label}
                      </text>

                      {/* Node classification */}
                      <text
                        x={node.x}
                        y={node.y + 12}
                        fill="#22D3EE"
                        fontSize="8"
                        textAnchor="middle"
                        fontFamily="monospace"
                        className="opacity-90"
                      >
                        {isMCU ? 'MICROCONTROLLER' : node.type.toUpperCase().replace('_', ' ')}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
            
            <div className={`flex justify-center gap-6 text-[10px] ${c.textMuted} pt-2 border-t border-neutral-850/60 font-mono`}>
              <div className="flex items-center gap-1.5"><span className="w-3 h-1.5 bg-[#06B6D4]" /><span>PCB Trace Track</span></div>
              <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded bg-cyan-400" /><span>Solder Terminal Joint</span></div>
              <div className="flex items-center gap-1.5"><span className={`w-4 h-2.5 border rounded ${theme === 'dark' ? 'border-cyan-500/80 bg-[#09090B]' : 'border-cyan-300 bg-white'}`} /><span>Embedded Controller/Module</span></div>
            </div>
          </motion.div>
        )}

        {activeTab === 'development-process' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-[#18181B] border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.05)] rounded-2xl p-5 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold tracking-wide">Hardware Engineering Execution Progress</h3>
                <p className={`text-xs ${c.textSecondary} mt-1`}>Calibrate and execute each laboratory phase. Stored locally.</p>
              </div>
              <div className="flex items-center gap-3 text-right">
                <div>
                  <span className="text-lg font-bold text-cyan-400 font-mono">{progressPercent}%</span>
                  <span className={`text-[10px] ${c.textMuted} block font-mono`}>CALIBRATION</span>
                </div>
                <div className={`w-24 h-2 rounded-full overflow-hidden border ${theme === 'dark' ? 'bg-neutral-900 border-cyan-500/10' : 'bg-slate-100 border-cyan-200'}`}>
                  <div className="bg-cyan-500 h-full" style={{ width: `${progressPercent}%` }} />
                </div>
              </div>
            </div>

            <div className="space-y-8 relative border-l-2 border-cyan-500/20 pl-6 ml-4">
              {plan.roadmap.map((phase, phaseIndex) => (
                <div key={phaseIndex} className="space-y-4 relative">
                  <div className={`absolute -left-[32px] top-1 w-3.5 h-3.5 rounded-full border-2 border-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.6)] flex items-center justify-center ${theme === 'dark' ? 'bg-[#09090B]' : 'bg-white'}`}>
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  </div>

                  <div className={`rounded-xl p-5 shadow-[0_0_15px_rgba(6,182,212,0.02)] ${c.card}`}>
                    <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3 mb-4 ${theme === 'dark' ? 'border-neutral-800' : 'border-slate-100'}`}>
                      <h4 className="text-sm font-bold uppercase tracking-wider text-cyan-400 font-mono">
                        {phase.phaseName}
                      </h4>
                      <span className="text-[10px] bg-cyan-950/40 text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded font-mono">
                        Duration: {phase.tasks.reduce((sum, t) => sum + parseInt(t.duration || `0`), 0) || 3} Days
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-3.5">
                      {phase.tasks.map((task) => {
                        const isCompleted = !!completedTasks[task.id];
                        return (
                          <div 
                            key={task.id}
                            onClick={() => toggleTask(task.id)}
                            className={`flex items-start gap-4 border rounded-xl p-4 cursor-pointer select-none transition-all duration-300 ${c.card} ${
                              isCompleted 
                                ? 'opacity-65' 
                                : 'hover:border-cyan-500/40'
                            }`}
                          >
                            <button 
                              type="button"
                              className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                                isCompleted 
                                  ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400' 
                                  : 'border-neutral-700 hover:border-cyan-400'
                              }`}
                            >
                              {isCompleted && <Check className="w-3.5 h-3.5" />}
                            </button>

                            <div className="space-y-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className={`text-xs font-semibold font-mono ${isCompleted ? 'line-through ' + c.textMuted : c.textPrimary}`}>
                                  {task.title}
                                </span>
                                <span className={`text-[9px] bg-neutral-800 ${c.textSecondary} font-mono px-1.5 py-0.5 rounded`}>
                                  {task.duration}
                                </span>
                              </div>
                              <p className={`text-xs ${c.textSecondary} font-light leading-relaxed`}>
                                {task.description}
                              </p>
                              {task.tools && task.tools.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 mt-2">
                                  {task.tools.map((tool, tIdx) => (
                                    <span 
                                      key={tIdx} 
                                      className="text-[9px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded-md font-mono font-medium tracking-wide"
                                    >
                                      {tool}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    
                    <div className={`mt-4 rounded-lg p-3 text-xs flex items-center gap-3 ${c.subCard}`}>
                      <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0" />
                      <div>
                        <span className="text-[9px] text-cyan-400 font-bold font-mono uppercase tracking-wider block">Expected Output Milestone</span>
                        <p className={`${c.textSecondary} font-light text-[11px] mt-0.5 leading-relaxed font-mono`}>
                          {phaseIndex === 0 && "Completed technical requirement specification document with clear inputs/outputs."}
                          {phaseIndex === 1 && "All microcontrollers, sensors, actuators, and jumper wires ordered or gathered in lab."}
                          {phaseIndex === 2 && "Finished wiring schematics on Fritzing or Proteus, and verified connection map."}
                          {phaseIndex === 3 && "Completed physical breadboard mock assembly, verifying standard GND rails."}
                          {phaseIndex === 4 && "Uploaded boilerplate firmware code, verifying USB serial console output."}
                          {phaseIndex === 5 && "Stable telemetry readings displayed on serial monitor with noise filters running."}
                          {phaseIndex === 6 && "Threshold trigger points calibrated and verified under real ambient variables."}
                          {phaseIndex === 7 && "Successfully diagnosed and fixed any I2C connection errors, loose wires, or logic bugs."}
                          {phaseIndex === 8 && "Circuit permanently soldered on perfboard/PCB and housed securely inside enclosure."}
                          {phaseIndex === 9 && "Fully deployed and operational standalone unit running on battery/power-adapter."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'budget' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-[#18181B] border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.05)] rounded-2xl p-5 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold tracking-wide">BOM Budget Cost Breakdown</h3>
                <p className={`text-xs ${c.textSecondary} mt-1`}>Financial estimation and procurement limits for the electronics components.</p>
              </div>
              <DollarSign className="w-8 h-8 text-cyan-400 shrink-0 opacity-80" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Target Budget Card */}
              <div className={`rounded-xl p-5 text-center flex flex-col justify-between relative overflow-hidden ${c.card}`}>
                <div className="absolute top-1 left-1 w-1.5 h-1.5 bg-cyan-500 rounded-full" />
                <span className={`text-[10px] ${c.textMuted} font-mono font-bold uppercase tracking-wider block`}>Target budget limit</span>
                <div className="py-6">
                  <div className="text-3xl font-extrabold text-cyan-400 tracking-tight">
                    {plan.budgetRange || `N/A`}
                  </div>
                </div>
                <p className={`text-xs ${c.textSecondary} leading-relaxed font-light p-3 rounded-lg ${c.subCard}`}>
                  Procurement limit set during initialization to avoid over-engineering cost structures.
                </p>
              </div>

              {/* Estimated BOM Cost Card */}
              <div className="bg-[#18181B] border border-cyan-500/10 rounded-xl p-5 text-center flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-1 left-1 w-1.5 h-1.5 bg-cyan-500 rounded-full" />
                <span className={`text-[10px] ${c.textMuted} font-mono font-bold uppercase tracking-wider block`}>Calculated BOM Cost</span>
                <div className="py-6">
                  <div className="text-3xl font-extrabold text-emerald-400 tracking-tight">
                    {plan.estimatedCost || `N/A`}
                  </div>
                </div>
                <p className={`text-xs ${c.textSecondary} leading-relaxed font-light p-3 rounded-lg ${c.subCard}`}>
                  Accumulated market estimation of components required to compile the core features.
                </p>
              </div>

              {/* Procurement Suggestions */}
              <div className="bg-[#18181B] border border-cyan-500/10 rounded-xl p-5 text-center flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-1 left-1 w-1.5 h-1.5 bg-cyan-500 rounded-full" />
                <span className={`text-[10px] ${c.textMuted} font-mono font-bold uppercase tracking-wider block`}>Procurement Channel</span>
                <div className="py-6">
                  <div className={`text-lg font-bold ${c.textPrimary} tracking-tight`}>
                    Online Electronics / Local Lab
                  </div>
                </div>
                <p className={`text-xs ${c.textSecondary} leading-relaxed font-light bg-neutral-900/60 border border-neutral-850 p-3 rounded-lg`}>
                  Compare prices on online retailers (Robu.in, Quartz, Amazon) or check college laboratory stock closets before purchasing.
                </p>
              </div>
            </div>

            {/* Detailed BOM Table */}
            <div className={`rounded-xl p-6 ${c.card}`}>
              <h4 className={`text-sm font-bold ${c.textPrimary} mb-4 font-mono uppercase tracking-wide`}>Procurement Bill of Materials</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className={`border-b ${theme === 'dark' ? 'border-neutral-800' : 'border-slate-200'} ${c.textSecondary} font-mono uppercase tracking-wider`}>
                      <th className="pb-3 font-semibold">Component</th>
                      <th className="pb-3 font-semibold">Quantity</th>
                      <th className="pb-3 font-semibold">Unit Est. Price</th>
                      <th className="pb-3 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800">
                    {plan.hardwareComponents && plan.hardwareComponents.length > 0 ? (
                      plan.hardwareComponents.map((comp, idx) => (
                        <tr key={idx} className={`${c.textSecondary}`}>
                          <td className="py-3.5 font-medium">{comp.component}</td>
                          <td className="py-3.5 font-mono">{comp.quantity || 1}</td>
                          <td className="py-3.5 font-mono text-cyan-400">{comp.estimatedPrice || `₹-`}</td>
                          <td className="py-3.5">
                            <span className={`text-[9px] px-2 py-0.5 rounded font-mono font-bold uppercase ${
                              comp.required ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'bg-neutral-800 ' + c.textSecondary
                            }`}>
                              {comp.required ? 'Required' : 'Optional'}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className={`py-4 text-center ${c.textMuted}`}>No components listed.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'safety' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-[#18181B] border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.05)] rounded-2xl p-5 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold tracking-wide">Safety Precautions & Guidelines</h3>
                <p className={`text-xs ${c.textSecondary} mt-1`}>Critical electrical safety directives, power guidelines, and laboratory precautions.</p>
              </div>
              <ShieldAlert className="w-8 h-8 text-cyan-400 shrink-0 opacity-80" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className={`md:col-span-1 border rounded-xl p-6 flex flex-col justify-between text-center relative overflow-hidden ${c.card}`}>
                <div className="absolute top-1 left-1 w-1.5 h-1.5 bg-cyan-500 rounded-full" />
                <h3 className={`text-xs font-semibold uppercase tracking-wider ${c.textSecondary} mb-4`}>Estimated Hardware Cost</h3>
                <div className="my-auto py-6">
                  <div className="text-4xl font-extrabold text-cyan-400 tracking-tight">
                    {plan.estimatedCost || `N/A`}
                  </div>
                  <span className={`text-[10px] ${c.textMuted} font-mono font-bold uppercase tracking-wider block mt-2`}>BOM Estimate</span>
                </div>
                <p className={`text-xs ${c.textSecondary} leading-relaxed font-light bg-neutral-900/60 border border-neutral-855 p-3 rounded-lg`}>
                  Reflects the market cost of the microcontroller, primary sensors, actuators, and basic breadboard components.
                </p>
              </div>

              <div className={`md:col-span-2 border rounded-xl p-6 space-y-4 ${c.card}`}>
                <h3 className="text-base font-bold text-neutral-100 flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-red-400" />
                  <span>Important Safety & Wiring Notes</span>
                </h3>
                <div className="space-y-3">
                  {plan.safetyNotes && plan.safetyNotes.length > 0 ? (
                    plan.safetyNotes.map((note, idx) => (
                      <div key={idx} className={`flex gap-3 p-3.5 rounded-lg ${c.subCard}`}>
                        <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                        <p className={`text-xs ${c.textSecondary} leading-relaxed font-light`}>{note}</p>
                      </div>
                    ))
                  ) : (
                    <div className={`p-6 text-center text-xs rounded-lg border ${theme === 'dark' ? 'bg-neutral-900/20 border-neutral-800/40 text-neutral-400' : 'bg-slate-100/50 border-slate-200/50 text-slate-650'}`}>
                      No safety guidelines available.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'research' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Top Overview Bar */}
            <div className={`${c.card} rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-4 relative overflow-hidden`}>
              {isHardware && (
                <>
                  <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-cyan-400 rounded-full" />
                  <div className="absolute top-0.5 right-0.5 w-1 h-1 bg-cyan-400 rounded-full" />
                </>
              )}
              <div>
                <h3 className="text-sm font-bold flex items-center gap-2">
                  <Sparkles className={`w-5 h-5 ${isHardware ? 'text-cyan-400' : 'text-[#F97316]'}`} />
                  <span>{isHardware ? 'Academic Mini Literature Survey' : 'AI Research & Competitor Analysis'}</span>
                </h3>
                <p className={`text-xs ${c.textSecondary} mt-1`}>
                  {isHardware 
                    ? 'Review existing physical systems, analyze their design limitations, and evaluate your improvements.'
                    : 'Analyze existing research implementations, identify key design vulnerabilities, and highlight the innovation boundaries of your project.'}
                </p>
              </div>
              
              {/* Innovation Score circular widget */}
              {plan.researchAnalysis && (
                <div className={`flex items-center gap-3 p-3 rounded-xl shrink-0 font-mono ${c.subCard}`}>
                  <div className="text-right">
                    <span className={`text-sm font-extrabold ${isHardware ? 'text-cyan-400' : 'text-[#F97316]'} font-mono`}>{plan.researchAnalysis.innovationScore}%</span>
                    <span className={`text-[9px] ${c.textMuted} block uppercase tracking-wider font-bold`}>Innovation Index</span>
                  </div>
                  <div className="w-10 h-10 relative flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-neutral-800"
                        strokeWidth="2.5"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className={isHardware ? "text-cyan-400" : "text-[#F97316]"}
                        strokeWidth="2.5"
                        strokeDasharray={`${plan.researchAnalysis.innovationScore}, 100`}
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                  </div>
                </div>
              )}
            </div>

            {/* If no researchAnalysis (old record) */}
            {!plan.researchAnalysis ? (
              <div className={`rounded-xl p-6 text-center text-xs ${c.card} ${c.textSecondary}`}>
                Research analytics are not available for this project. Try generating a new plan to unlock these insights!
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Columns: Existing similar solutions */}
                <div className="lg:col-span-2 space-y-5">
                  <div className="space-y-3">
                    <h4 className={`text-xs font-bold ${c.textSecondary} uppercase tracking-wider flex items-center gap-2`}>
                      <Search className={`w-4 h-4 ${isHardware ? 'text-cyan-400' : 'text-[#F97316]'}`} />
                      <span>{isHardware ? 'Surveyed Systems & Prior Art' : 'Similar Existing Projects'}</span>
                    </h4>
                    
                    <div className="space-y-4">
                      {plan.researchAnalysis.existingProjects?.map((proj, idx) => {
                        const isExpanded = !!expandedProjects[idx];
                        return (
                          <div
                            key={idx}
                            className={`backdrop-blur-md rounded-xl overflow-hidden transition-all duration-300 shadow-md ${c.card}`}
                          >
                            {/* Card Header (Clickable to Expand) */}
                            <div
                              onClick={() => toggleProjectExpand(idx)}
                              className="p-5 flex items-center justify-between gap-4 cursor-pointer select-none"
                            >
                              <div className="space-y-1">
                                <span className={`text-[10px] border px-2 py-0.5 rounded font-mono font-semibold uppercase ${
                                  theme === 'dark' ? 'bg-neutral-800/60 border-neutral-800' : 'bg-slate-100 border-slate-200'
                                } ${isHardware ? 'text-cyan-400' : 'text-[#FB923C]'}`}>
                                  {isHardware ? `Reference #${idx + 1}` : `Solution #${idx + 1}`}
                                </span>
                                <h5 className={`text-sm font-bold ${c.textPrimary}`}>{proj.name}</h5>
                              </div>
                              <button className={`p-1 rounded transition-colors ${theme === 'dark' ? 'hover:bg-neutral-800' : 'hover:bg-slate-100'} ${c.textSecondary}`}>
                                {isExpanded ? <ChevronDown className={`w-4 h-4 ${isHardware ? 'text-cyan-400' : 'text-[#F97316]'}`} /> : <ChevronRight className="w-4 h-4" />}
                              </button>
                            </div>

                            {/* Card Details (Expandable) */}
                            {isExpanded && (
                              <div className={`px-5 pb-5 pt-1 border-t space-y-4 animate-fade-in ${theme === 'dark' ? 'border-neutral-850/60 bg-neutral-900/10' : 'border-slate-150 bg-slate-50/30'}`}>
                                <div className="space-y-1">
                                  <span className={`text-[9px] ${c.textMuted} uppercase tracking-wider font-semibold font-mono block`}>System Description</span>
                                  <p className={`text-xs ${c.textSecondary} leading-relaxed font-light`}>{proj.description}</p>
                                </div>
                                
                                <div className="space-y-2">
                                  <span className="text-[9px] text-red-400 uppercase tracking-wider font-semibold font-mono flex items-center gap-1">
                                    <AlertTriangle className="w-3.5 h-3.5" />
                                    <span>Identified Problems & Limitations</span>
                                  </span>
                                  <div className="grid grid-cols-1 gap-2">
                                    {proj.limitations?.map((lim, lIdx) => (
                                      <div key={lIdx} className="bg-red-950/10 border border-red-500/10 px-3.5 py-2.5 rounded-lg flex gap-2.5 items-start">
                                        <div className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0 mt-1.5" />
                                        <p className={`text-xs ${c.textSecondary} font-light leading-relaxed`}>{lim}</p>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Future Scope enhancements */}
                  <div className="space-y-3 pt-2">
                    <h4 className={`text-xs font-bold ${c.textSecondary} uppercase tracking-wider flex items-center gap-2`}>
                      <TrendingUp className={`w-4 h-4 ${isHardware ? 'text-cyan-400' : 'text-[#F97316]'}`} />
                      <span>Project Future Scope & Upgrades</span>
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {plan.researchAnalysis.futureImprovements?.map((imp, idx) => (
                        <div key={idx} className={`backdrop-blur-md p-4 rounded-xl flex gap-3 transition-colors ${c.subCard} ${isHardware ? 'hover:border-cyan-400/40' : 'hover:border-orange-200/65'}`}>
                          <div className={`w-5 h-5 ${isHardware ? 'bg-cyan-500/10 text-cyan-400' : 'bg-[#F97316]/10 text-[#FB923C]'} rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5`}>
                            {idx + 1}
                          </div>
                          <p className={`text-xs ${c.textSecondary} leading-relaxed font-light`}>{imp}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column: Improvements & Research Topics */}
                <div className="lg:col-span-1 space-y-6">
                  {/* How this project improves things */}
                  <div className={`${c.card} rounded-xl p-5 space-y-4`}>
                    <h4 className={`text-xs font-bold ${c.textSecondary} uppercase tracking-wider border-b pb-2 flex items-center gap-2 ${theme === 'dark' ? 'border-neutral-800' : 'border-slate-200'}`}>
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                      <span>{isHardware ? 'Your System Enhancements' : 'Your Project Enhancements'}</span>
                    </h4>
                    <div className="space-y-3.5">
                      {plan.researchAnalysis.projectAdvantages?.map((adv, idx) => (
                        <div key={idx} className="flex gap-2.5 items-start">
                          <div className="p-1 bg-green-500/10 border border-green-500/25 rounded-md text-green-400 shrink-0 mt-0.5">
                            <Check className="w-3 h-3" />
                          </div>
                          <p className={`text-xs ${c.textSecondary} leading-relaxed font-light`}>{adv}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Research Paper Topics / Domains */}
                  <div className={`rounded-xl p-5 space-y-4 ${c.card}`}>
                    <h4 className={`text-xs font-bold ${c.textSecondary} uppercase tracking-wider border-b pb-2 flex items-center gap-2 ${theme === 'dark' ? 'border-neutral-800' : 'border-slate-200'}`}>
                      <BookOpen className={`w-4 h-4 ${isHardware ? 'text-cyan-400' : 'text-[#F97316]'}`} />
                      <span>Related Research Domains</span>
                    </h4>
                    <p className={`text-[11px] ${c.textMuted} leading-relaxed`}>
                      Leverage these academic topics to structure your final report and prepare for viva/presentation discussions:
                    </p>
                    <div className="space-y-3">
                      {plan.researchAnalysis.researchTopics?.map((topic, idx) => (
                        <div
                          key={idx}
                          className={`p-3 rounded-lg flex items-start gap-3 transition-all cursor-default ${c.subCard} hover:border-${isHardware ? 'cyan-500' : '[#F97316]'}/20`}
                        >
                          <span className={`${c.textMuted} font-mono text-xs select-none`}>#</span>
                          <span className={`text-xs ${c.textSecondary} font-medium leading-relaxed`}>{topic}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'tools-deployment' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 text-neutral-100"
          >
            {/* Top overview widget */}
            <div className={`rounded-2xl p-5 flex items-center justify-between ${c.card}`}>
              <div>
                <h3 className="text-sm font-bold">Tools & Production Environments</h3>
                <p className={`text-xs ${c.textSecondary}`}>Essential software, configuration guides, and platforms to build and deploy your project.</p>
              </div>
              <Wrench className="w-8 h-8 text-[#F97316] shrink-0 opacity-80" />
            </div>

            {/* If no toolsAndDeployment is present in plan (old project) */}
            {!plan.toolsAndDeployment ? (
              <div className={`bg-[#18181B] border border-neutral-800 rounded-xl p-6 text-center ${c.textSecondary} text-xs`}>
                Tools & Deployment parameters are not available for this project. Try generating a new plan!
              </div>
            ) : (
              <>
                {/* 1. Categorized Tools Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Development Tools */}
                  <div className={`rounded-xl p-5 space-y-4 ${c.card}`}>
                    <h4 className={`text-sm font-bold ${c.textPrimary} border-b pb-2 flex items-center gap-2 ${theme === 'dark' ? 'border-neutral-800' : 'border-slate-200'}`}>
                      <span className="w-1.5 h-3 bg-[#F97316] rounded-full" />
                      <span>Development & Coding Tools</span>
                    </h4>
                    <div className="space-y-3.5">
                      {plan.toolsAndDeployment.developmentTools?.map((tool, idx) => (
                        <div key={idx} className={`p-3 rounded-lg flex flex-col justify-between transition-colors ${c.subCard} hover:border-[#F97316]/20`}>
                          <div className="flex justify-between items-center mb-1">
                            <span className={`text-xs font-bold ${c.textPrimary}`}>{tool.name}</span>
                            <span className="text-[9px] bg-neutral-850 text-[#FB923C] font-mono px-1.5 py-0.5 rounded uppercase font-bold tracking-wide">{tool.purpose}</span>
                          </div>
                          <p className={`text-[11px] ${c.textSecondary} font-light mt-1`}>{tool.reason}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Collaboration & API Testing Tools */}
                  <div className={`rounded-xl p-5 space-y-5 ${c.card}`}>
                    {/* Collaboration */}
                    <div className="space-y-3">
                      <h4 className={`text-sm font-bold ${c.textPrimary} border-b pb-2 flex items-center gap-2 ${theme === 'dark' ? 'border-neutral-800' : 'border-slate-200'}`}>
                        <span className="w-1.5 h-3 bg-[#F97316] rounded-full" />
                        <span>Project Management & Collab</span>
                      </h4>
                      <div className="grid grid-cols-1 gap-2.5">
                        {plan.toolsAndDeployment.collaborationTools?.map((tool, idx) => (
                          <div key={idx} className={`p-3 rounded-lg flex justify-between items-start gap-4 ${c.subCard}`}>
                            <div className="space-y-0.5">
                              <span className={`text-xs font-bold ${c.textPrimary}`}>{tool.name}</span>
                              <p className={`text-[11px] ${c.textSecondary} font-light`}>{tool.reason}</p>
                            </div>
                            <span className="text-[8px] bg-[#F97316]/10 text-[#FB923C] font-mono px-1.5 py-0.5 rounded font-bold uppercase shrink-0 mt-0.5">{tool.purpose}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* API Testing */}
                    <div className="space-y-3 pt-2">
                      <h4 className={`text-sm font-bold ${c.textPrimary} border-b pb-2 flex items-center gap-2 ${theme === 'dark' ? 'border-neutral-800' : 'border-slate-200'}`}>
                        <span className="w-1.5 h-3 bg-[#F97316] rounded-full" />
                        <span>API Validation & Testing</span>
                      </h4>
                      <div className="grid grid-cols-1 gap-2.5">
                        {plan.toolsAndDeployment.apiTestingTools?.map((tool, idx) => (
                          <div key={idx} className="bg-neutral-900/40 border border-neutral-800/60 p-3 rounded-lg flex justify-between items-start gap-4">
                            <div className="space-y-0.5">
                              <span className={`text-xs font-bold ${c.textPrimary}`}>{tool.name}</span>
                              <p className={`text-[11px] ${c.textSecondary} font-light`}>{tool.reason}</p>
                            </div>
                            <span className="text-[8px] bg-[#F97316]/10 text-[#FB923C] font-mono px-1.5 py-0.5 rounded font-bold uppercase shrink-0 mt-0.5">{tool.purpose}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI / Utility SDKs section if present */}
                {plan.toolsAndDeployment.utilities && plan.toolsAndDeployment.utilities.length > 0 && (
                  <div className="bg-[#18181B] border border-neutral-800 rounded-xl p-5 space-y-4">
                    <h4 className={`text-sm font-bold ${c.textPrimary} border-b pb-2 flex items-center gap-2 ${theme === 'dark' ? 'border-neutral-800' : 'border-slate-200'}`}>
                      <span className="w-1.5 h-3 bg-[#F97316] rounded-full" />
                      <span>AI & Development Utilities</span>
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {plan.toolsAndDeployment.utilities.map((tool, idx) => (
                        <div key={idx} className={`p-3.5 rounded-lg flex justify-between items-start gap-4 ${c.subCard}`}>
                          <div className="space-y-1">
                            <span className={`text-xs font-bold ${c.textPrimary}`}>{tool.name}</span>
                            <p className={`text-[11px] ${c.textSecondary} font-light leading-relaxed`}>{tool.reason}</p>
                          </div>
                          <span className="text-[8px] bg-[#F97316]/10 text-[#FB923C] font-mono px-1.5 py-0.5 rounded font-bold uppercase shrink-0 mt-0.5">{tool.purpose}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. Version Control Section */}
                <div className="bg-[#18181B] border border-neutral-800 rounded-xl p-5 space-y-4">
                  <h4 className={`text-sm font-bold ${c.textPrimary} flex items-center gap-2.5`}>
                    <GitBranch className="w-5 h-5 text-[#F97316]" />
                    <span>Git & Version Control Workflows</span>
                  </h4>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                    <div className="lg:col-span-1 space-y-3">
                      <div className={`p-3.5 rounded-lg space-y-1 ${c.subCard}`}>
                        <span className="text-[10px] text-[#FB923C] font-mono font-bold uppercase tracking-wider block">Local Repository Tracking</span>
                        <p className={`text-[11px] ${c.textSecondary} leading-relaxed font-light`}>{plan.toolsAndDeployment.versionControl?.gitImportance}</p>
                      </div>
                      <div className="bg-neutral-900/40 border border-neutral-800/60 p-3.5 rounded-lg space-y-1">
                        <span className="text-[10px] text-[#FB923C] font-mono font-bold uppercase tracking-wider block">Remote Cloud Backups</span>
                        <p className={`text-[11px] ${c.textSecondary} leading-relaxed font-light`}>{plan.toolsAndDeployment.versionControl?.githubImportance}</p>
                      </div>
                    </div>

                    <div className={`lg:col-span-2 p-4 rounded-xl flex flex-col justify-between ${c.subCard}`}>
                      <span className={`text-[10px] ${c.textSecondary} font-mono font-semibold uppercase tracking-wider block mb-2`}>Standard Command Line Operations</span>
                      <div className={`font-mono text-xs ${c.textSecondary} space-y-2 leading-relaxed bg-neutral-950 p-3.5 rounded-lg border border-neutral-900 overflow-x-auto select-all`}>
                        {plan.toolsAndDeployment.versionControl?.basics?.map((cmd, idx) => (
                          <div key={idx} className="flex gap-2">
                            <span className="text-neutral-600 select-none">$</span>
                            <span>{cmd}</span>
                          </div>
                        ))}
                      </div>
                      <p className="text-[10px] text-neutral-505 font-sans italic mt-2.5">
                        Tip: Working on branches protects the main codebase and creates a clean portfolio commit log.
                      </p>
                    </div>
                  </div>
                </div>

                {/* 3. Deployment Platforms Matrix */}
                <div className="space-y-4">
                  <h4 className={`text-sm font-bold ${c.textPrimary} flex items-center gap-2`}>
                    <span className="w-1.5 h-3 bg-[#F97316] rounded-full" />
                    <span>Production Host Platforms</span>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {/* Frontend */}
                    <div className={`rounded-xl p-5 space-y-4 flex flex-col justify-between transition-all duration-300 ${c.card} hover:border-[#F97316]/30`}>
                      <div>
                        <div className="flex justify-between items-center mb-3">
                          <span className={`text-[10px] border px-2 py-0.5 rounded font-mono font-bold uppercase ${theme === 'dark' ? 'bg-neutral-900 border-neutral-800 text-[#FB923C]' : 'bg-slate-100 border-slate-200 text-orange-600'}`}>FRONTEND</span>
                          <span className={`text-xs ${c.textSecondary} font-medium font-mono`}>Web UI</span>
                        </div>
                        <h5 className="text-base font-bold text-neutral-100">{plan.toolsAndDeployment.deployment?.frontend?.platform}</h5>
                        <p className={`text-xs ${c.textSecondary} font-light mt-2 leading-relaxed`}>{plan.toolsAndDeployment.deployment?.frontend?.reason}</p>
                      </div>
                      <div className={`p-2.5 rounded-lg text-[10px] ${c.textSecondary} font-light mt-2 ${c.subCard}`}>
                        <span className="text-[9px] text-[#F97316] uppercase tracking-wider font-semibold block mb-0.5">Tier & Friendliness</span>
                        {plan.toolsAndDeployment.deployment?.frontend?.freeTier}
                      </div>
                    </div>

                    {/* Backend */}
                    <div className="bg-[#18181B] border border-neutral-800 rounded-xl p-5 space-y-4 flex flex-col justify-between hover:border-[#F97316]/30 transition-all duration-300">
                      <div>
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-[10px] bg-neutral-900 border border-neutral-800 text-[#FB923C] px-2 py-0.5 rounded font-mono font-bold uppercase">BACKEND SERVER</span>
                          <span className={`text-xs ${c.textSecondary} font-medium font-mono`}>API Gateway</span>
                        </div>
                        <h5 className="text-base font-bold text-neutral-100">{plan.toolsAndDeployment.deployment?.backend?.platform}</h5>
                        <p className={`text-xs ${c.textSecondary} font-light mt-2 leading-relaxed`}>{plan.toolsAndDeployment.deployment?.backend?.reason}</p>
                      </div>
                      <div className={`bg-neutral-900/60 border border-neutral-805/80 p-2.5 rounded-lg text-[10px] ${c.textSecondary} font-light mt-2`}>
                        <span className="text-[9px] text-[#F97316] uppercase tracking-wider font-semibold block mb-0.5">Tier & Friendliness</span>
                        {plan.toolsAndDeployment.deployment?.backend?.freeTier}
                      </div>
                    </div>

                    {/* Database */}
                    <div className="bg-[#18181B] border border-neutral-800 rounded-xl p-5 space-y-4 flex flex-col justify-between hover:border-[#F97316]/30 transition-all duration-300">
                      <div>
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-[10px] bg-neutral-900 border border-neutral-800 text-[#FB923C] px-2 py-0.5 rounded font-mono font-bold uppercase">DATABASE</span>
                          <span className={`text-xs ${c.textSecondary} font-medium font-mono`}>Cloud Store</span>
                        </div>
                        <h5 className="text-base font-bold text-neutral-100">{plan.toolsAndDeployment.deployment?.database?.platform}</h5>
                        <p className={`text-xs ${c.textSecondary} font-light mt-2 leading-relaxed`}>{plan.toolsAndDeployment.deployment?.database?.reason}</p>
                      </div>
                      <div className={`bg-neutral-900/60 border border-neutral-805/80 p-2.5 rounded-lg text-[10px] ${c.textSecondary} font-light mt-2`}>
                        <span className="text-[9px] text-[#F97316] uppercase tracking-wider font-semibold block mb-0.5">Tier & Friendliness</span>
                        {plan.toolsAndDeployment.deployment?.database?.freeTier}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. Deployment Roadmap / Steps */}
                <div className="bg-[#18181B] border border-neutral-800 rounded-xl p-5 space-y-4">
                  <h4 className={`text-sm font-bold ${c.textPrimary} flex items-center gap-2`}>
                    <span className="w-1.5 h-3 bg-[#F97316] rounded-full" />
                    <span>Production Deployment Blueprint (Step-by-Step)</span>
                  </h4>
                  <div className={`space-y-4 relative border-l pl-4 ml-2 ${theme === 'dark' ? 'border-neutral-800' : 'border-slate-200'}`}>
                    {plan.toolsAndDeployment.deploymentSteps?.map((step, idx) => (
                      <div key={idx} className="relative space-y-1">
                        <div className="absolute -left-[21px] top-1.5 w-2 h-2 rounded-full bg-[#F97316] border border-[#09090B]" />
                        <span className={`text-xs font-bold ${c.textPrimary} block`}>{step.step}</span>
                        <p className={`text-[11px] ${c.textSecondary} font-light leading-relaxed`}>{step.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}

        {activeTab === 'export' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Action Columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Copy Markdown */}
              <div className={`rounded-xl p-5 flex flex-col justify-between relative overflow-hidden ${c.card}`}>
                <div>
                  <h3 className="text-sm font-bold">Markdown Blueprint Exporter</h3>
                  <p className={`text-xs mt-1.5 ${c.textSecondary}`}>Copy document structure for README files or project reports.</p>
                </div>
                <button
                  onClick={handleCopyMarkdown}
                  className={`mt-6 w-full flex items-center justify-center gap-1.5 cursor-pointer text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-all ${
                    isHardware 
                      ? 'bg-cyan-500 hover:bg-cyan-400 shadow-md shadow-cyan-500/10' 
                      : 'bg-orange-500 hover:bg-orange-450 shadow-md'
                  }`}
                >
                  {copySuccess ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copySuccess ? 'Copied' : 'Copy Markdown'}</span>
                </button>
              </div>

              {/* Export PDF */}
              <div className={`rounded-xl p-5 flex flex-col justify-between relative overflow-hidden ${c.card}`}>
                <div>
                  <h3 className="text-sm font-bold">Academic PDF Report</h3>
                  <p className={`text-xs mt-1.5 ${c.textSecondary}`}>Download a structured, formal laboratory PDF document for evaluations.</p>
                </div>
                <button
                  onClick={handleExportPDF}
                  disabled={exporting}
                  className={`mt-6 w-full flex items-center justify-center gap-1.5 cursor-pointer text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-all relative overflow-hidden ${
                    isHardware 
                      ? 'bg-cyan-500 hover:bg-cyan-450 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40' 
                      : 'bg-orange-500 hover:bg-orange-450 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40'
                  } ${exporting ? 'opacity-80 cursor-not-allowed' : ''}`}
                  style={{
                    boxShadow: isHardware ? '0 0 12px rgba(6, 182, 212, 0.3)' : '0 0 12px rgba(249, 115, 22, 0.3)'
                  }}
                >
                  {exporting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4.5 w-4.5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Exporting PDF...</span>
                    </>
                  ) : (
                    <>
                      <FileText className="w-4 h-4" />
                      <span>Export as PDF</span>
                    </>
                  )}
                </button>
              </div>

              {/* Export JSON */}
              <div className={`rounded-xl p-5 flex flex-col justify-between relative overflow-hidden ${c.card}`}>
                <div>
                  <h3 className="text-sm font-bold">Standard JSON Blueprint</h3>
                  <p className={`text-xs mt-1.5 ${c.textSecondary}`}>Download raw system parameters and configuration definitions.</p>
                </div>
                <button
                  onClick={handleExportJSON}
                  className={`mt-6 w-full flex items-center justify-center gap-1.5 cursor-pointer text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-all ${
                    isHardware 
                      ? 'bg-cyan-500 hover:bg-cyan-400 shadow-md shadow-cyan-500/10' 
                      : 'bg-orange-500 hover:bg-orange-450 shadow-md shadow-orange-500/10'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>Download JSON</span>
                </button>
              </div>
            </div>

            {/* Text Preview Box */}
            <div className={`border rounded-xl p-6 max-h-[300px] overflow-y-auto font-mono text-xs leading-relaxed whitespace-pre-wrap select-all ${
              theme === 'dark' ? `bg-[#09090B] border-neutral-850 ${c.textSecondary}`
                : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}>
              {generateMarkdown()}
            </div>
          </motion.div>
        )}
      </div>

      {/* Off-screen high fidelity PDF renderer */}
      <ExportProjectPDF 
        plan={plan} 
        completedTasks={completedTasks} 
      />

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className={`fixed top-20 right-6 z-50 flex items-center gap-3 px-4 py-3.5 rounded-xl border shadow-2xl backdrop-blur-md ${
              toast.type === 'error'
                ? 'bg-red-955 text-red-200 border-red-500/30'
                : 'bg-emerald-955 text-emerald-205 border-emerald-500/30'
            }`}
            style={{ boxShadow: toast.type === 'error' ? '0 10px 30px -10px rgba(239, 68, 68, 0.3)' : '0 10px 30px -10px rgba(16, 185, 129, 0.3)' }}
          >
            {toast.type === 'error' ? (
              <XCircle className="w-5 h-5 text-red-400 shrink-0" />
            ) : (
              <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
            )}
            <span className="text-xs font-semibold tracking-wide">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
