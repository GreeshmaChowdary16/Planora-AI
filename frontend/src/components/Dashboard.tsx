import React from 'react';
import { motion } from 'framer-motion';
import { Plus, ArrowRight, BookOpen, Clock, Activity, BarChart2, Star, Sparkles } from 'lucide-react';
import type { ProjectPlan } from '../data/mockPlans';
import { useTheme } from './ThemeContext';

interface DashboardProps {
  userEmail: string;
  userName: string | null;
  savedPlans: ProjectPlan[];
  onSelectPlan: (plan: ProjectPlan) => void;
  onCreateNew: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  userEmail,
  userName,
  savedPlans,
  onSelectPlan,
  onCreateNew,
}) => {
  const { theme } = useTheme();
  const username = userEmail.split('@')[0] || 'student';
  const fallbackUsername = username.charAt(0).toUpperCase() + username.slice(1);
  const displayUsername = userName || fallbackUsername;

  // Compute mock stats
  const totalProjects = savedPlans.length;
  const avgDuration = totalProjects > 0 ? '7 weeks' : 'N/A';
  const skillsCount = totalProjects * 3; // mock calculation

  return (
    <div className={`space-y-8 p-6 max-w-5xl mx-auto ${theme === 'dark' ? 'text-neutral-100' : 'text-slate-900'}`}>
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Welcome, {displayUsername}!</h2>
          <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-neutral-400' : 'text-slate-600'}`}>Track your university projects and technical stack roadmaps.</p>
        </div>
        <button
          onClick={onCreateNew}
          className="flex items-center gap-2 bg-[#F97316] hover:bg-[#FB923C] text-neutral-100 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-lg shadow-[#F97316]/10 group"
        >
          <Plus className="w-4.5 h-4.5" />
          <span>New Analysis</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Analytics widgets row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className={`border rounded-xl p-5 flex items-center gap-4 transition-all ${
          theme === 'dark' ? 'bg-[#18181B] border-neutral-800 hover:border-[#F97316]/20' : 'bg-white border-slate-200 shadow-sm hover:shadow-md hover:border-slate-350 hover:-translate-y-0.5'
        }`}>
          <div className="p-3 rounded-lg bg-[#F97316]/10 text-[#FB923C]">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <span className={`text-xs block font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-neutral-400' : 'text-slate-500'}`}>Active Roadmaps</span>
            <span className={`text-2xl font-bold mt-1 block ${theme === 'dark' ? 'text-neutral-100' : 'text-slate-800'}`}>{totalProjects}</span>
          </div>
        </div>

        <div className={`border rounded-xl p-5 flex items-center gap-4 transition-all ${
          theme === 'dark' ? 'bg-[#18181B] border-neutral-800 hover:border-[#F97316]/20' : 'bg-white border-slate-200 shadow-sm hover:shadow-md hover:border-slate-350 hover:-translate-y-0.5'
        }`}>
          <div className="p-3 rounded-lg bg-indigo-500/10 text-indigo-400">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className={`text-xs block font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-neutral-400' : 'text-slate-500'}`}>Avg. Dev Cycles</span>
            <span className={`text-2xl font-bold mt-1 block ${theme === 'dark' ? 'text-neutral-100' : 'text-slate-800'}`}>{avgDuration}</span>
          </div>
        </div>

        <div className={`border rounded-xl p-5 flex items-center gap-4 transition-all ${
          theme === 'dark' ? 'bg-[#18181B] border-neutral-800 hover:border-[#F97316]/20' : 'bg-white border-slate-200 shadow-sm hover:shadow-md hover:border-slate-350 hover:-translate-y-0.5'
        }`}>
          <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-400">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <span className={`text-xs block font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-neutral-400' : 'text-slate-500'}`}>Gained Skills</span>
            <span className={`text-2xl font-bold mt-1 block ${theme === 'dark' ? 'text-neutral-100' : 'text-slate-800'}`}>{skillsCount} Technologies</span>
          </div>
        </div>
      </div>

      {/* Center CTA Card (if no projects) */}
      {totalProjects === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`border rounded-2xl p-8 text-center max-w-xl mx-auto space-y-6 relative overflow-hidden ${
            theme === 'dark' ? 'bg-[#18181B] border-neutral-800' : 'bg-white border-slate-200 shadow-xl'
          }`}
          style={theme === 'dark' ? { boxShadow: '0 0 30px -5px rgba(249, 115, 22, 0.03)' } : undefined}
        >
          <div className="w-16 h-16 rounded-full bg-[#F97316]/10 flex items-center justify-center mx-auto text-[#F97316] mb-4">
            <Sparkles className="w-8 h-8 animate-pulse" />
          </div>
          <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-neutral-100' : 'text-slate-800'}`}>Translate Your Next Project Idea</h3>
          <p className={`text-sm leading-relaxed max-w-sm mx-auto ${theme === 'dark' ? 'text-neutral-400' : 'text-slate-600'}`}>
            Input your project description and receive automated stack suggestions, API setups, structural diagrams, and full roadmaps.
          </p>
          <button
            onClick={onCreateNew}
            className="inline-flex items-center gap-2 bg-[#F97316] hover:bg-[#FB923C] text-neutral-100 px-6 py-3 rounded-lg text-sm font-semibold transition-all shadow-lg"
          >
            <span>Launch Project Analyzer</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      ) : (
        /* Saved Projects Grid */
        <div className="space-y-4">
          <h3 className={`text-lg font-bold tracking-tight flex items-center gap-2 ${theme === 'dark' ? 'text-neutral-100' : 'text-slate-800'}`}>
            <BarChart2 className="w-4.5 h-4.5 text-[#F97316]" />
            <span>Saved Architecture Plans</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {savedPlans.map((plan) => {
              const totalTasks = plan.roadmap?.reduce((acc, phase) => acc + (phase.tasks?.length || 0), 0) || 0;
              const completedTasks = plan.roadmap?.reduce((acc, phase) => {
                return acc + (phase.tasks?.filter(t => t.completed).length || 0);
              }, 0) || 0;
              const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

              return (
                <div
                  key={plan.id}
                  onClick={() => onSelectPlan(plan)}
                  className={`border rounded-xl p-5 cursor-pointer transition-all duration-300 group flex flex-col justify-between relative overflow-hidden ${
                    theme === 'dark' 
                      ? `bg-[#18181B] border-neutral-850 ${plan.projectType === 'hardware' ? 'hover:border-cyan-400/40 shadow-cyan-950/5' : 'hover:border-[#F97316]/40'}` 
                      : `bg-white border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 ${plan.projectType === 'hardware' ? 'hover:border-cyan-300' : 'hover:border-orange-350'}`
                  }`}
                >
                  <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl ${
                    plan.projectType === 'hardware' ? 'from-cyan-500/5' : 'from-[#F97316]/5'
                  } to-transparent rounded-bl-full pointer-events-none`} />

                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex gap-1.5 flex-wrap">
                        <span className={`text-[10px] border font-semibold px-2 py-0.5 rounded tracking-wide font-mono ${
                          theme === 'dark' 
                            ? (plan.projectType === 'hardware' ? 'bg-neutral-800 text-cyan-400 border-cyan-500/20' : 'bg-neutral-800 text-[#FB923C] border-[#F97316]/20') 
                            : (plan.projectType === 'hardware' ? 'bg-cyan-50 text-cyan-700 border-cyan-200' : 'bg-orange-50 text-orange-600 border-orange-200')
                        }`}>
                          {plan.domain}
                        </span>
                        <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full font-mono uppercase tracking-wider ${
                          plan.projectType === 'hardware'
                            ? theme === 'dark' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'bg-cyan-50 text-cyan-750 border border-cyan-200'
                            : theme === 'dark' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' : 'bg-orange-50 text-orange-600 border border-orange-200'
                        }`}>
                          {plan.projectType === 'hardware' ? 'Hardware' : 'Software'}
                        </span>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                        theme === 'dark' 
                          ? (plan.skillLevel === 'Beginner' ? 'bg-green-500/10 text-green-400' :
                             plan.skillLevel === 'Intermediate' ? 'bg-blue-500/10 text-blue-400' :
                             'bg-red-500/10 text-red-400')
                          : (plan.skillLevel === 'Beginner' ? 'bg-green-50 text-green-700 border border-green-200/50' :
                             plan.skillLevel === 'Intermediate' ? 'bg-blue-50 text-blue-700 border border-blue-200/50' :
                             'bg-red-50 text-red-700 border border-red-200/50')
                      }`}>
                        {plan.skillLevel}
                      </span>
                    </div>

                    <h4 className={`text-base font-bold ${
                      plan.projectType === 'hardware'
                        ? theme === 'dark' ? 'group-hover:text-cyan-400' : 'group-hover:text-cyan-600'
                        : theme === 'dark' ? 'group-hover:text-[#FB923C]' : 'group-hover:text-orange-600'
                    } transition-colors line-clamp-1 mb-2 ${theme === 'dark' ? 'text-neutral-100' : 'text-slate-800'}`}>
                      {plan.title}
                    </h4>
                    <p className={`text-xs line-clamp-2 leading-relaxed mb-4 ${theme === 'dark' ? 'text-neutral-400' : 'text-slate-600'}`}>
                      {plan.description}
                    </p>
                  </div>

                  {/* Progress Bar Component */}
                  <div className="space-y-1.5 mb-4">
                    <div className="flex justify-between items-center text-[10px] font-mono">
                      <span className={`font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-neutral-500' : 'text-slate-500'}`}>Milestones</span>
                      <span className={`font-bold ${
                        plan.projectType === 'hardware'
                          ? theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'
                          : theme === 'dark' ? 'text-[#FB923C]' : 'text-orange-600'
                      }`}>{completedTasks}/{totalTasks} ({progressPercent}%)</span>
                    </div>
                    <div className={`w-full h-1.5 rounded-full overflow-hidden border ${
                      theme === 'dark' ? 'bg-neutral-900/60 border-neutral-850' : 'bg-slate-100 border-slate-200'
                    }`}>
                      <div 
                        className={`h-full transition-all duration-300 ${
                          plan.projectType === 'hardware' ? 'bg-cyan-500' : 'bg-[#F97316]'
                        }`}
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>

                  <div className={`flex items-center justify-between border-t pt-3 text-[11px] ${theme === 'dark' ? 'border-neutral-800/80 text-neutral-500' : 'border-slate-100 text-slate-500'}`}>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{plan.duration} duration</span>
                    </div>
                    <div className={`flex items-center gap-1.5 font-medium ${
                      plan.projectType === 'hardware'
                        ? theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'
                        : theme === 'dark' ? 'text-[#F97316]' : 'text-orange-600'
                    } group-hover:translate-x-1 transition-transform`}>
                      <span>View Roadmap</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              );
          })}
          </div>
        </div>
      )}

      {/* Suggested Quick Hacks / Student tips */}
      <div className={`border rounded-xl p-5 ${
        theme === 'dark' ? 'bg-[#18181B]/40 border-neutral-800/60' : 'bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200/60 shadow-sm'
      }`}>
        <h4 className={`text-sm font-bold flex items-center gap-2 mb-2 ${theme === 'dark' ? 'text-neutral-200' : 'text-orange-950'}`}>
          <Star className="w-4 h-4 text-yellow-500 animate-spin" style={{ animationDuration: '8s' }} />
          <span>AI Academic Tip of the Day</span>
        </h4>
        <p className={`text-xs leading-relaxed ${theme === 'dark' ? 'text-neutral-400' : 'text-slate-700'}`}>
          When demonstrating IoT project architectures during college presentations, focus on describing the message brokering protocol (MQTT). Explaining why MQTT is more network-efficient than traditional HTTP REST for sensors showcases deep engineering maturity and impresses evaluators!
        </p>
      </div>
    </div>
  );
};
