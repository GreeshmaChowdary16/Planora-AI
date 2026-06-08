export interface ThemeStyles {
  isDark: boolean;
  bg: string;
  card: string;
  subCard: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  borderMuted: string;
  input: string;
  placeholder: string;
  accentText: string;
  accentBorder: string;
  accentBg: string;
  glow: string;
}

export const getThemeClasses = (theme: 'dark' | 'light', projectType?: 'software' | 'hardware'): ThemeStyles => {
  const isDark = theme === 'dark';
  const isHardware = projectType === 'hardware';

  if (isHardware) {
    return {
      isDark,
      bg: isDark ? 'bg-[#09090B] text-neutral-100' : 'bg-slate-50/50 text-zinc-900',
      card: isDark 
        ? 'bg-[#18181B] border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.02)]' 
        : 'bg-white border border-cyan-200/60 shadow-xs shadow-cyan-500/5',
      subCard: isDark 
        ? 'bg-neutral-900/40 border border-cyan-500/10' 
        : 'bg-cyan-50/20 border border-cyan-100/60',
      textPrimary: isDark ? 'text-neutral-100' : 'text-zinc-900',
      textSecondary: isDark ? 'text-neutral-400' : 'text-zinc-600',
      textMuted: isDark ? 'text-neutral-500' : 'text-zinc-400',
      border: isDark ? 'border-cyan-500/10' : 'border-cyan-100',
      borderMuted: isDark ? 'border-neutral-850' : 'border-zinc-150',
      input: isDark
        ? 'bg-[#09090B]/60 text-neutral-100 border-neutral-800 focus:border-cyan-500/50'
        : 'bg-white text-zinc-900 border-cyan-200 focus:bg-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/20',
      placeholder: isDark ? 'placeholder:text-zinc-500' : 'placeholder:text-zinc-650',
      accentText: isDark ? 'text-cyan-400' : 'text-cyan-600',
      accentBorder: isDark ? 'border-cyan-500/20' : 'border-cyan-200',
      accentBg: isDark ? 'bg-cyan-500/10' : 'bg-cyan-50',
      glow: isDark ? 'shadow-[0_0_20px_rgba(6,182,212,0.08)]' : 'shadow-xs shadow-cyan-500/5',
    };
  } else {
    // Software / Default
    return {
      isDark,
      bg: isDark ? 'bg-[#09090B] text-neutral-100' : 'bg-slate-50/50 text-zinc-900',
      card: isDark 
        ? 'bg-[#18181B] border border-neutral-800' 
        : 'bg-white border border-zinc-200 shadow-xs shadow-orange-500/5',
      subCard: isDark 
        ? 'bg-neutral-900/40 border border-neutral-800/60' 
        : 'bg-orange-50/10 border border-orange-100/50',
      textPrimary: isDark ? 'text-neutral-100' : 'text-zinc-900',
      textSecondary: isDark ? 'text-neutral-400' : 'text-zinc-600',
      textMuted: isDark ? 'text-neutral-500' : 'text-zinc-400',
      border: isDark ? 'border-neutral-800' : 'border-zinc-200',
      borderMuted: isDark ? 'border-neutral-850' : 'border-zinc-150',
      input: isDark
        ? 'bg-[#09090B]/60 text-neutral-100 border-neutral-800 focus:border-[#F97316]/50'
        : 'bg-white text-zinc-900 border-zinc-300 focus:bg-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20',
      placeholder: isDark ? 'placeholder:text-zinc-500' : 'placeholder:text-zinc-650',
      accentText: isDark ? 'text-[#FB923C]' : 'text-orange-600',
      accentBorder: isDark ? 'border-[#F97316]/20' : 'border-orange-200',
      accentBg: isDark ? 'bg-[#F97316]/10' : 'bg-orange-50',
      glow: isDark ? 'shadow-[0_0_20px_rgba(249,115,22,0.08)]' : 'shadow-xs shadow-orange-500/5',
    };
  }
};
