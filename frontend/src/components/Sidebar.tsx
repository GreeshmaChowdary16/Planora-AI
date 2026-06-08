import React, { useState } from 'react';
import { LayoutDashboard, Sparkles, Settings, LogOut, BookOpen, MoreVertical, Pin, Trash2 } from 'lucide-react';
import type { ProjectPlan } from '../data/mockPlans';
import { useTheme } from './ThemeContext';

interface SidebarProps {
  userEmail: string;
  userName: string | null;
  activeView: 'dashboard' | 'analyzer' | 'plan-view';
  setActiveView: (view: 'dashboard' | 'analyzer' | 'plan-view') => void;
  savedPlans: ProjectPlan[];
  onSelectPlan: (plan: ProjectPlan) => void;
  onLogout: () => void;
  onOpenSettings: () => void;
  onPinPlan?: (plan: ProjectPlan) => void;
  onDeletePlan?: (plan: ProjectPlan) => void;
  activePlanId?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  userEmail,
  userName,
  activeView,
  setActiveView,
  savedPlans,
  onSelectPlan,
  onLogout,
  onOpenSettings,
  onPinPlan,
  onDeletePlan,
  activePlanId,
}) => {
  const { theme } = useTheme();
  const username = userEmail.split('@')[0] || 'student';
  const fallbackUsername = username.charAt(0).toUpperCase() + username.slice(1);
  const displayUsername = userName || fallbackUsername;

  // UI State for dropdown
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);

  // Group plans into Pinned and Standard
  const pinnedPlans = savedPlans.filter(p => p.isPinned);
  const standardPlans = savedPlans.filter(p => !p.isPinned);

  const renderPlanItem = (plan: ProjectPlan) => {
    const isSelected = activeView === 'plan-view' && activePlanId === plan.id;
    const totalTasks = plan.roadmap?.reduce((acc, phase) => acc + (phase.tasks?.length || 0), 0) || 0;
    const completedTasks = plan.roadmap?.reduce((acc, phase) => {
      return acc + (phase.tasks?.filter(t => t.completed).length || 0);
    }, 0) || 0;
    const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return (
      <div
        key={plan.id}
        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all relative group ${
          isSelected
            ? theme === 'dark'
              ? plan.projectType === 'hardware'
                ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-medium'
                : 'bg-[#F97316]/10 text-[#FB923C] border border-[#F97316]/20 font-medium'
              : plan.projectType === 'hardware'
                ? 'bg-cyan-100 text-cyan-700 border border-cyan-200 font-medium'
                : 'bg-orange-100 text-orange-700 border border-orange-200 font-medium'
            : theme === 'dark'
              ? 'text-zinc-200 hover:text-neutral-200 hover:bg-neutral-800/40 border border-transparent'
              : 'text-zinc-700 hover:text-slate-900 hover:bg-zinc-100 border border-transparent'
        }`}
      >
        <button
          onClick={() => onSelectPlan(plan)}
          className="flex items-center gap-2 truncate flex-1 text-left"
        >
          <BookOpen className={`w-3.5 h-3.5 shrink-0 ${
            isSelected
              ? plan.projectType === 'hardware' ? 'text-cyan-500' : 'text-[#F97316]'
              : theme === 'dark'
                ? 'text-zinc-400 group-hover:text-zinc-200'
                : 'text-zinc-500 group-hover:text-zinc-800'
          }`} />
          <span className="truncate flex-1">{plan.title}</span>
          <span className={`text-[10px] shrink-0 font-mono ${theme === 'dark' ? 'text-neutral-500' : 'text-slate-400'}`}>
            ({completedTasks}/{totalTasks})
          </span>
        </button>

        <div className="flex items-center gap-2 shrink-0 ml-1.5 relative">
          {plan.isPinned && (
            <Pin className="w-3.5 h-3.5 text-[#FB923C] rotate-45 opacity-80 shrink-0" />
          )}

          {/* Circular progress ring */}
          <div className="relative w-4.5 h-4.5 flex items-center justify-center shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 16 16">
              <circle
                cx="8"
                cy="8"
                r="6"
                className={`${theme === 'dark' ? 'stroke-neutral-800' : 'stroke-slate-200'} fill-none`}
                strokeWidth="2.2"
              />
              <circle
                cx="8"
                cy="8"
                r="6"
                className={`fill-none transition-all duration-300 ${
                  plan.projectType === 'hardware'
                    ? 'stroke-cyan-500'
                    : 'stroke-[#F97316]'
                }`}
                strokeWidth="2.2"
                strokeDasharray="37.7"
                strokeDashoffset={37.7 - (progressPercent / 100) * 37.7}
              />
            </svg>
            <span className={`absolute text-[7.5px] font-mono font-bold scale-[0.8] leading-none ${
              plan.projectType === 'hardware'
                ? (theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600')
                : (theme === 'dark' ? 'text-[#F97316]' : 'text-orange-600')
            }`}>
              {progressPercent}
            </span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveDropdownId(activeDropdownId === plan.id ? null : plan.id);
            }}
            className={`p-1 rounded transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 shrink-0 ${
              theme === 'dark' ? 'hover:bg-neutral-800 text-neutral-500 hover:text-neutral-300' : 'hover:bg-slate-100 text-slate-400 hover:text-slate-700'
            }`}
          >
            <MoreVertical className="w-3.5 h-3.5" />
          </button>

          {/* Action Dropdown Menu */}
          {activeDropdownId === plan.id && (
            <>
              {/* Invisible Backdrop to close dropdown on clicking outside */}
              <div 
                className="fixed inset-0 z-40 cursor-default" 
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveDropdownId(null);
                }}
              />
              <div className={`absolute right-0 top-6 w-40 border rounded-lg shadow-2xl py-1 z-50 animate-fade-in font-sans ${
                theme === 'dark' ? 'bg-[#18181B] border-neutral-800' : 'bg-white border-slate-200 shadow-xl text-slate-700'
              }`}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onPinPlan && onPinPlan(plan);
                    setActiveDropdownId(null);
                  }}
                  className={`w-full flex items-center gap-2 px-3 py-1.5 text-[11px] transition-colors text-left ${
                    theme === 'dark' ? 'text-neutral-300 hover:text-neutral-100 hover:bg-neutral-800/50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Pin className="w-3 h-3 text-[#FB923C] rotate-45" />
                  <span>{plan.isPinned ? 'Unpin Project' : 'Pin Project'}</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeletePlan && onDeletePlan(plan);
                    setActiveDropdownId(null);
                  }}
                  className={`w-full flex items-center gap-2 px-3 py-1.5 text-[11px] transition-colors text-left border-t ${
                    theme === 'dark' ? 'text-red-400 hover:text-red-350 hover:bg-red-950/20 border-neutral-800/60' : 'text-red-600 hover:text-red-700 hover:bg-red-50 border-slate-100'
                  }`}
                >
                  <Trash2 className="w-3.5 h-3.5 text-red-400" />
                  <span>Delete Project</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <aside className={`w-64 border-r flex flex-col shrink-0 h-screen sticky top-0 overflow-hidden font-sans transition-colors duration-300 ${
      theme === 'dark' ? 'bg-[#18181B] border-neutral-800 text-neutral-100' : 'bg-white border-slate-200 text-slate-800'
    }`}>
      {/* Brand Logo Header (Fixed height) */}
        <div className={`flex items-center gap-2.5 px-6 py-5 border-b shrink-0 ${theme === 'dark' ? 'border-neutral-800' : 'border-slate-200'} group transition-colors duration-200 hover:opacity-90`} >
        <div className="w-8 h-8 rounded-lg bg-[#F97316] flex items-center justify-center font-bold text-lg text-[#FAFAFA] shadow-md shadow-[#F97316]/30">
          P
        </div>
          <div>
            <h1 className={`text-base font-bold tracking-tight ${theme === 'dark' ? 'text-neutral-100' : 'text-slate-900'}`}>PlanoraAI</h1>
            <span className="text-xs text-zinc-400 tracking-wide font-medium">Plan Your Project Now</span>
          </div>
      </div>

      {/* Navigation Actions (Fixed height) */}
      <div className="px-4 py-4 space-y-1 shrink-0">
        <button
          onClick={() => setActiveView('dashboard')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activeView === 'dashboard'
              ? theme === 'dark' ? 'bg-[#F97316]/10 text-[#FB923C] border border-[#F97316]/20' : 'bg-orange-100 text-orange-700 border border-orange-200'
              : theme === 'dark' ? 'text-zinc-200 hover:text-neutral-200 hover:bg-neutral-800/40 border border-transparent' : 'text-zinc-700 hover:text-slate-900 hover:bg-zinc-100 border border-transparent'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Dashboard</span>
        </button>
        <button
          onClick={() => setActiveView('analyzer')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activeView === 'analyzer'
              ? theme === 'dark' ? 'bg-[#F97316]/10 text-[#FB923C] border border-[#F97316]/20' : 'bg-orange-100 text-orange-700 border border-orange-200'
              : theme === 'dark' ? 'text-zinc-200 hover:text-neutral-200 hover:bg-neutral-800/40 border border-transparent' : 'text-zinc-700 hover:text-slate-900 hover:bg-zinc-100 border border-transparent'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>New Analysis</span>
        </button>
      </div>

      {/* Saved Plans Subsection (Scrollable internally) */}
      <div className={`px-4 py-4 border-t flex-1 flex flex-col min-h-0 ${theme === 'dark' ? 'border-neutral-800/60' : 'border-slate-200'}`}>
        {savedPlans.length === 0 ? (
          <div className={`text-center py-6 text-xs px-3 leading-relaxed shrink-0 ${theme === 'dark' ? 'text-neutral-500' : 'text-slate-500'}`}>
            No project roadmaps saved yet. Create an analysis to get started.
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin scrollbar-thumb-neutral-800 min-h-0">
            {/* Pinned Section */}
            {pinnedPlans.length > 0 && (
              <div className="space-y-1">
                <div className={`flex items-center gap-1.5 px-3 mb-1.5 shrink-0 ${theme === 'dark' ? 'text-neutral-500' : 'text-slate-500'}`}>
                  <Pin className="w-3 h-3 text-[#FB923C] rotate-45" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Pinned Projects</span>
                </div>
                {pinnedPlans.map(renderPlanItem)}
              </div>
            )}

            {/* Standard Saved Roadmaps Section */}
            <div className="space-y-1">
              <div className={`flex items-center justify-between px-3 mb-1.5 shrink-0 ${theme === 'dark' ? 'text-neutral-500' : 'text-slate-500'}`}>
                <span className="text-[10px] font-bold uppercase tracking-wider">Saved Roadmaps</span>
                {pinnedPlans.length === 0 && (
                  <span className={`text-xs px-1.5 py-0.5 rounded font-mono ${theme === 'dark' ? 'bg-neutral-800' : 'bg-slate-100 text-slate-600'}`}>{standardPlans.length}</span>
                )}
              </div>
              {standardPlans.map(renderPlanItem)}
            </div>
          </div>
        )}
      </div>

      {/* User profile footer (Fixed height) */}
      <div className={`p-4 border-t flex flex-col gap-2 shrink-0 ${theme === 'dark' ? 'border-neutral-800 bg-neutral-900/40' : 'border-slate-200 bg-slate-50/50'}`}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#F97316] to-[#FB923C] flex items-center justify-center text-neutral-100 font-bold text-sm">
            {displayUsername.charAt(0)}
          </div>
          <div className="truncate flex-1">
            <h4 className={`text-xs font-semibold truncate ${theme === 'dark' ? 'text-neutral-200' : 'text-slate-800'}`}>{displayUsername}</h4>
            <span className={`text-[10px] truncate block ${theme === 'dark' ? 'text-neutral-500' : 'text-slate-500'}`}>{userEmail}</span>
          </div>
        </div>

        <div className={`grid grid-cols-2 gap-2 mt-2 pt-2 border-t ${theme === 'dark' ? 'border-neutral-800/60' : 'border-slate-200'}`}>
          <button
            onClick={onOpenSettings}
            className={`flex items-center justify-center gap-1.5 py-1.5 rounded text-[11px] font-medium transition-colors ${
              theme === 'dark' ? 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300' : 'bg-white border border-slate-200 hover:bg-slate-50 text-slate-700'
            }`}
          >
            <Settings className="w-3 h-3" />
            <span>Settings</span>
          </button>
          <button
            onClick={onLogout}
            className={`flex items-center justify-center gap-1.5 py-1.5 rounded text-[11px] font-medium transition-colors border ${
              theme === 'dark' ? 'bg-red-955/10 hover:bg-red-955/20 text-red-400 hover:text-red-300 border-red-950/20' : 'bg-white hover:bg-red-50 text-red-600 hover:text-red-700 border-slate-200 hover:border-red-200'
            }`}
          >
            <LogOut className="w-3 h-3" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
