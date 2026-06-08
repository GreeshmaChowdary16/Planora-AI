import React from 'react';
import { Cpu, Laptop } from 'lucide-react';
import { useTheme } from './ThemeContext';

interface ProjectTypeSelectionProps {
  selected: 'software' | 'hardware' | null;
  onSelect: (type: 'software' | 'hardware') => void;
}

export const ProjectTypeSelection: React.FC<ProjectTypeSelectionProps> = ({ selected, onSelect }) => {
  const { theme } = useTheme();

  const cardBase = `w-full max-w-sm p-8 rounded-2xl border-2 cursor-pointer transition-all duration-300 flex flex-col items-center gap-4 text-center relative overflow-hidden group`;

  const renderCard = (type: 'software' | 'hardware') => {
    const isSelected = selected === type;
    const Icon = type === 'software' ? Laptop : Cpu;
    const title = type === 'software' ? 'Software Project' : 'Hardware Project';
    const description = type === 'software'
      ? 'Web apps, mobile apps, SaaS platforms, or AI integrations'
      : 'IoT telemetry, microcontrollers, circuits, or embedded systems';

    const themeStyles = type === 'software'
      ? {
          selected: theme === 'dark'
            ? 'border-orange-500 bg-[#18181B] shadow-[0_0_25px_rgba(249,115,22,0.15)] text-[#FAFAFA]'
            : 'border-orange-500 bg-orange-50/40 shadow-[0_0_25px_rgba(249,115,22,0.1)] text-orange-950',
          unselected: theme === 'dark' 
            ? 'border-neutral-800 bg-neutral-900/60 hover:border-orange-500/40 hover:shadow-[0_0_15px_rgba(249,115,22,0.05)] text-neutral-400' 
            : 'border-slate-200 bg-white hover:border-orange-400 hover:shadow-md text-zinc-600',
          accent: theme === 'dark' ? 'text-[#F97316]' : 'text-orange-650',
          badgeBg: theme === 'dark' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' : 'bg-orange-50 text-orange-700 border border-orange-200',
          badgeText: 'AI SaaS Planner'
        }
      : {
          selected: theme === 'dark'
            ? 'border-cyan-500 bg-[#18181B] shadow-[0_0_25px_rgba(6,182,212,0.15)] text-[#FAFAFA]'
            : 'border-cyan-500 bg-cyan-50/40 shadow-[0_0_25px_rgba(6,182,212,0.1)] text-cyan-950',
          unselected: theme === 'dark' 
            ? 'border-neutral-800 bg-neutral-900/60 hover:border-cyan-500/40 hover:shadow-[0_0_15px_rgba(6,182,212,0.05)] text-neutral-400' 
            : 'border-slate-200 bg-white hover:border-cyan-400 hover:shadow-md text-zinc-600',
          accent: theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600',
          badgeBg: theme === 'dark' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'bg-cyan-50 text-cyan-700 border border-cyan-200',
          badgeText: 'IoT Engineering Mentor'
        };

    const activeStyles = isSelected ? themeStyles.selected : themeStyles.unselected;

    return (
      <div
        className={`${cardBase} ${activeStyles}`}
        onClick={() => onSelect(type)}
      >
        {/* Glow orb */}
        <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl ${
          type === 'software' ? 'from-orange-500/5' : 'from-cyan-500/5'
        } to-transparent rounded-bl-full pointer-events-none`} />

        {/* Selected outline glow */}
        {isSelected && (
          <div className={`absolute inset-0 rounded-2xl border-2 pointer-events-none animate-pulse ${
            type === 'software' ? 'border-orange-500/10' : 'border-cyan-500/10'
          }`} />
        )}

        <div className={`p-4 rounded-full border ${
          theme === 'dark' ? 'bg-neutral-900 border-neutral-800' : 'bg-slate-50 border-slate-200'
        } ${
          isSelected 
            ? (type === 'software' ? 'border-orange-500/30' : 'border-cyan-500/30') 
            : ''
        }`}>
          <Icon className={`w-8 h-8 ${themeStyles.accent}`} />
        </div>

        <div className="space-y-2">
          <span className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold uppercase tracking-wider ${themeStyles.badgeBg}`}>
            {themeStyles.badgeText}
          </span>
          <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-neutral-100' : 'text-zinc-800'}`}>{title}</h3>
          <p className={`text-xs leading-relaxed max-w-[200px] ${theme === 'dark' ? 'text-neutral-400' : 'text-zinc-550'}`}>{description}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <h3 className={`text-sm font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-neutral-400' : 'text-zinc-500'}`}>Choose Project Paradigm</h3>
        <p className={`text-xs ${theme === 'dark' ? 'text-neutral-500' : 'text-zinc-400'}`}>Select either the software planner or the hardware electronics mentor.</p>
      </div>
      <div className="flex flex-col md:flex-row justify-center items-center gap-6">
        {renderCard('software')}
        {renderCard('hardware')}
      </div>
    </div>
  );
};
