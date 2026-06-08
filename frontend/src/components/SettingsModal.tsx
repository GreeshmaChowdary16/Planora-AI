import React, { useState } from 'react';
import { useTheme } from './ThemeContext';
import { X, Moon, Sun, Key, Shield } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { theme, setTheme } = useTheme();
  const [apiKey, setApiKey] = useState(() => {
    return localStorage.getItem('groq_api_key') || '';
  });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveApiKey = () => {
    localStorage.setItem('groq_api_key', apiKey);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div 
        className={`relative w-full max-w-md border rounded-2xl p-6 shadow-2xl z-10 overflow-hidden ${
          theme === 'dark' ? 'bg-neutral-900 border-neutral-800 text-neutral-100' : 'bg-white border-slate-200 text-slate-800'
        }`}
        style={theme === 'dark' ? { boxShadow: '0 0 50px -10px rgba(249, 115, 22, 0.15)' } : { boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)' }}
      >
        {/* Glow border corner */}
        <div className="absolute top-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-[#F97316]/50 to-transparent" />

        <div className={`flex items-center justify-between border-b pb-4 mb-4 ${theme === 'dark' ? 'border-neutral-800' : 'border-slate-100'}`}>
          <h3 className="text-lg font-bold">Preferences & Settings</h3>
          <button onClick={onClose} className={`p-1 rounded-lg transition-colors ${theme === 'dark' ? 'hover:bg-neutral-800' : 'hover:bg-slate-100'}`}>
            <X className={`w-5 h-5 ${theme === 'dark' ? 'text-neutral-400 hover:text-neutral-200' : 'text-slate-400 hover:text-slate-600'}`} />
          </button>
        </div>

        {/* Setting Group: Theme */}
        <div className="space-y-5">
          <div>
            <h4 className={`text-xs font-semibold uppercase tracking-wider mb-3 ${theme === 'dark' ? 'text-neutral-400' : 'text-slate-500'}`}>Color Mode Theme</h4>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setTheme('dark')}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-lg border text-sm font-medium transition-all ${
                  theme === 'dark'
                    ? 'border-[#F97316] bg-[#F97316]/10 text-neutral-100'
                    : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                <Moon className="w-4 h-4" />
                <span>Dark Mode</span>
              </button>
              <button
                onClick={() => setTheme('light')}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-lg border text-sm font-medium transition-all ${
                  theme === 'light'
                    ? 'border-[#F97316] bg-[#F97316]/10 text-slate-900 shadow-sm'
                    : 'border-neutral-800 bg-neutral-800/30 text-neutral-400 hover:bg-[#18181b]/50 hover:text-neutral-200'
                }`}
              >
                <Sun className="w-4 h-4" />
                <span>Light Mode</span>
              </button>
            </div>
          </div>

          {/* Setting Group: API Key */}
          <div className={`border-t pt-4 ${theme === 'dark' ? 'border-neutral-800' : 'border-slate-100'}`}>
            <h4 className={`text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5 ${theme === 'dark' ? 'text-neutral-400' : 'text-slate-500'}`}>
              <Key className="w-3.5 h-3.5" />
              <span>Groq API Integration</span>
            </h4>
            <p className={`text-xs leading-relaxed mb-3 ${theme === 'dark' ? 'text-neutral-400' : 'text-slate-600'}`}>
              Used for generating AI-powered project roadmaps and analysis.
            </p>
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your Groq API key"
                  className={`flex-1 border focus:border-[#F97316]/50 outline-none rounded-lg px-3 py-2 text-sm font-mono ${
                    theme === 'dark' ? 'bg-neutral-950 border-neutral-800 text-neutral-100 placeholder:text-neutral-500' : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-1 focus:ring-[#F97316]/20'
                  }`}
                />
                <button
                  onClick={handleSaveApiKey}
                  className={`px-4 py-2 rounded-lg text-sm transition-colors border ${
                    theme === 'dark' ? 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border-neutral-750' : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  Save
                </button>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className={`flex items-center ${apiKey ? 'text-green-500' : 'text-red-500'}`}>
                  <span className="h-2 w-2 rounded-full mr-1" style={{ backgroundColor: apiKey ? '#22c55e' : '#ef4444' }}></span>
                  {apiKey ? '● Connected' : '● API Key Missing'}
                </span>
                <a href="https://console.groq.com/keys" target="_blank" rel="noopener noreferrer" className={`underline ${theme === 'dark' ? 'text-orange-300 hover:text-orange-200' : 'text-orange-600 hover:text-orange-500'}`}>Get Free API Key</a>
              </div>
            </div>
            {savedSuccess && (
              <p className="text-xs text-green-500 mt-1.5 flex items-center gap-1">
                <Shield className="w-3.5 h-3.5" />
                <span>API Key saved locally.</span>
              </p>
            )}
          </div>

          {/* Setting Group: Demo Data */}
          <div className={`border-t pt-4 text-[11px] leading-relaxed ${theme === 'dark' ? 'border-neutral-800 text-neutral-500' : 'border-slate-100 text-slate-500'}`}>
            PlanoraAI is currently running in <span className="text-[#FB923C]">Presentation Mock Mode</span>. In Phase 2, backend connections will load analysis structures in real-time.
          </div>
        </div>
      </div>
    </div>
  );
};
