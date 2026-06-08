import { useState, useEffect } from 'react';
import { useTheme } from './components/ThemeContext';
import { AuthPage } from './components/AuthPage';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { ProjectWizard } from './components/ProjectWizard';
import { ProjectView } from './components/ProjectView';
import { SettingsModal } from './components/SettingsModal';
import type { ProjectPlan } from './data/mockPlans';
import { useProjects } from './components/ProjectContext';
import { Menu, X, Sun, Moon, Settings, AlertTriangle, Trash2, Zap } from 'lucide-react';
import apiFetch from './utils/api';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const { theme, toggleTheme } = useTheme();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'dashboard' | 'analyzer' | 'plan-view'>('dashboard');
  const { savedPlans, setSavedPlans, currentPlan, setCurrentPlan } = useProjects();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [deletingPlan, setDeletingPlan] = useState<ProjectPlan | null>(null);

  // Disable background scroll when delete modal is open
  useEffect(() => {
    if (deletingPlan) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [deletingPlan]);

  // Load saved projects on startup if token is present
  useEffect(() => {
    const checkAuthAndLoadPlans = async () => {
      const token = localStorage.getItem('planora_token');
      if (!token) {
        setIsCheckingAuth(false);
        return;
      }

      try {
        // Fetch user info from backend
        const authData = await apiFetch('/auth/me');
        setUserEmail(authData.user.email);
        setUserName(authData.user.name);

        // Fetch user's saved projects from backend
        const projectData = await apiFetch('/projects');
        const formattedPlans = projectData.projects.map((p: any) => ({
          ...p,
          id: p._id || p.id
        }));
        setSavedPlans(formattedPlans);
      } catch (e) {
        console.warn('Session restoration failed. Logging out...', e);
        handleLogout();
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuthAndLoadPlans();
  }, []);

  const handleLogin = async (token: string, user: { id: string; name: string; email: string }) => {
    setUserEmail(user.email);
    setUserName(user.name);
    localStorage.setItem('logged_in_user', user.email);
    localStorage.setItem('planora_token', token);

    try {
      const projectData = await apiFetch('/projects');
      const formattedPlans = projectData.projects.map((p: any) => ({
        ...p,
        id: p._id || p.id
      }));
      setSavedPlans(formattedPlans);
    } catch (e) {
      console.error('Failed to fetch projects after login:', e);
      setSavedPlans([]);
    }

    setActiveView('dashboard');
  };

  const handleLogout = () => {
    setUserEmail(null);
    setUserName(null);
    localStorage.removeItem('logged_in_user');
    localStorage.removeItem('planora_token');
    setActiveView('dashboard');
    setCurrentPlan(null);
    setSavedPlans([]);
  };

  const handleAnalysisComplete = (newPlan: ProjectPlan) => {
    const formattedPlan = {
      ...newPlan,
      id: (newPlan as any)._id || newPlan.id
    };

    // Save to list
    const updatedPlans = [formattedPlan, ...savedPlans.filter(p => p.id !== formattedPlan.id)];
    setSavedPlans(updatedPlans);
    setCurrentPlan(formattedPlan);
    setActiveView('plan-view');
  };

  const handleSelectPlan = (plan: ProjectPlan) => {
    setCurrentPlan(plan);
    setActiveView('plan-view');
    setIsMobileMenuOpen(false);
  };

  const handlePinPlan = async (plan: ProjectPlan) => {
    const isPinned = !plan.isPinned;
    // Optimistic UI update
    setSavedPlans(prev =>
      prev.map(p => p.id === plan.id ? { ...p, isPinned } : p)
    );
    if (currentPlan && currentPlan.id === plan.id) {
      setCurrentPlan(prev => prev ? { ...prev, isPinned } : null);
    }

    try {
      await apiFetch(`/projects/${plan.id}/pin`, {
        method: 'PUT',
        body: JSON.stringify({ isPinned }),
      });
    } catch (err) {
      console.error('Failed to update pin status on backend:', err);
      // Revert state on failure
      setSavedPlans(prev =>
        prev.map(p => p.id === plan.id ? { ...p, isPinned: !isPinned } : p)
      );
      if (currentPlan && currentPlan.id === plan.id) {
        setCurrentPlan(prev => prev ? { ...prev, isPinned: !isPinned } : null);
      }
    }
  };

  const handleDeletePlan = (plan: ProjectPlan) => {
    setDeletingPlan(plan);
  };

  const handleConfirmDelete = async () => {
    if (!deletingPlan) return;
    const planId = deletingPlan.id;

    // Optimistic UI update
    setSavedPlans(prev => prev.filter(p => p.id !== planId));
    if (currentPlan && currentPlan.id === planId) {
      setCurrentPlan(null);
      setActiveView('dashboard');
    }

    const planToDelete = deletingPlan;
    setDeletingPlan(null);

    try {
      await apiFetch(`/projects/${planId}`, {
        method: 'DELETE',
      });
    } catch (err) {
      console.error('Failed to delete project on backend:', err);
      // Refresh list to sync state
      try {
        const projectData = await apiFetch('/projects');
        const formattedPlans = projectData.projects.map((p: any) => ({
          ...p,
          id: p._id || p.id
        }));
        setSavedPlans(formattedPlans);
        if (currentPlan && currentPlan.id === planId) {
          setCurrentPlan(planToDelete);
        }
      } catch (e) {
        console.error('Failed to refetch project list:', e);
      }
    }
  };

  if (isCheckingAuth) {
    return (
      <div className={`min-h-screen flex flex-col justify-center items-center gap-4 font-sans ${
        theme === 'dark' ? 'bg-[#09090B] text-neutral-100' : 'bg-slate-50 text-slate-900'
      }`}>
        <div className={`w-10 h-10 border-4 border-t-[#F97316] rounded-full animate-spin ${
          theme === 'dark' ? 'border-neutral-800' : 'border-slate-200'
        }`} />
        <span className={`text-xs font-mono tracking-widest uppercase ${
          theme === 'dark' ? 'text-neutral-500' : 'text-slate-500'
        }`}>Restoring Session...</span>
      </div>
    );
  }

  // Class styling variables depending on dark/light mode
  const bgClass = theme === 'dark' ? 'bg-[#09090B] text-[#FAFAFA]' : 'bg-gradient-to-br from-slate-50 via-white to-orange-50/30 text-[#0F172A]';

  return (
    <div className={`h-screen w-full ${bgClass} transition-colors duration-300 relative overflow-hidden flex flex-col font-sans`}>
      {/* Floating ambient orange & purple blur circles (for dark mode only to preserve premium presentation neon glow) */}
      {theme === 'dark' && (
        <>
          <div className="glow-spot-orange -top-24 -left-24 animate-float" />
          <div className="glow-spot-purple -bottom-48 -right-24 animate-float" style={{ animationDelay: '2s' }} />
        </>
      )}
      {/* Redesigned Navbar Header */}
      <header className={`h-16 shrink-0 border-b z-40 flex items-center justify-between px-6 backdrop-blur-xl sticky top-0 ${
        theme === 'dark' ? 'bg-black/60 border-white/5' : 'bg-white/80 border-slate-200'
      }`}>
        <div className="flex items-center gap-2.5 transition-opacity duration-300 hover:opacity-90">
          {userEmail && (
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-1.5 rounded-lg md:hidden border ${
                theme === 'dark' ? 'bg-neutral-800/20 hover:bg-neutral-800/40 border-neutral-850' : 'bg-slate-100 hover:bg-slate-200 border-slate-200'
              }`}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          )}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-md">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-amber-500">
                PlanoraAI
              </span>
              <span className="text-xs text-zinc-400 tracking-wide font-medium">
                Plan Your Project Now
              </span>
            </div>
          </div>
        </div>

        {/* Center indicator */}
        <div className="flex-1 text-center hidden md:block">
          <span className="text-sm text-neutral-400">AI Project Intelligence Workspace</span>
        </div>

        {/* Right side buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg border transition-all ${
              theme === 'dark'
                ? 'bg-[#18181B] border-neutral-800 text-neutral-400 hover:text-neutral-200'
                : 'bg-white border-neutral-200 text-neutral-600 hover:text-neutral-900'
            }`}
          >
            {theme === 'dark' ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
          </button>
          <button
            onClick={() => setIsSettingsOpen(true)}
            className={`p-2 rounded-lg border transition-all ${
              theme === 'dark'
                ? 'bg-[#18181B] border-neutral-800 text-neutral-400 hover:text-neutral-200'
                : 'bg-white border-neutral-200 text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Settings className="w-4.5 h-4.5" />
          </button>
        </div>
      </header>

      {/* Main core layout grid */}
      <div className="flex-1 flex overflow-hidden">
        {/* If logged in, show sidebar */}
        {userEmail && (
          <>
            {/* Desktop Sidebar */}
            <div className="hidden md:block">
              <Sidebar
                userEmail={userEmail}
                userName={userName}
                activeView={activeView}
                setActiveView={setActiveView}
                savedPlans={savedPlans}
                onSelectPlan={handleSelectPlan}
                onLogout={handleLogout}
                onOpenSettings={() => setIsSettingsOpen(true)}
                onPinPlan={handlePinPlan}
                onDeletePlan={handleDeletePlan}
                activePlanId={currentPlan?.id}
              />
            </div>

            {/* Mobile Drawer (Absolute overlay) */}
            {isMobileMenuOpen && (
              <div className="fixed inset-0 z-30 md:hidden flex">
                <div className={`absolute inset-0 backdrop-blur-xs ${theme === 'dark' ? 'bg-black/60' : 'bg-slate-900/20'}`} onClick={() => setIsMobileMenuOpen(false)} />
                <div className={`relative w-64 h-full border-r flex flex-col justify-between animate-fade-in ${
                  theme === 'dark' ? 'bg-neutral-900 border-neutral-850' : 'bg-white border-slate-200'
                }`}>
                  <Sidebar
                    userEmail={userEmail}
                    userName={userName}
                    activeView={activeView}
                    setActiveView={setActiveView}
                    savedPlans={savedPlans}
                    onSelectPlan={handleSelectPlan}
                    onLogout={handleLogout}
                    onOpenSettings={() => {
                      setIsSettingsOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                    onPinPlan={handlePinPlan}
                    onDeletePlan={handleDeletePlan}
                    activePlanId={currentPlan?.id}
                  />
                </div>
              </div>
            )}
          </>
        )}

        {/* View switcher content display */}
        <main className="flex-1 overflow-y-auto">
          {!userEmail ? (
            <AuthPage onLoginSuccess={handleLogin} />
          ) : (
            <div className="py-4">
              {activeView === 'dashboard' && (
                <Dashboard
                  userEmail={userEmail}
                  userName={userName}
                  savedPlans={savedPlans}
                  onSelectPlan={handleSelectPlan}
                  onCreateNew={() => setActiveView('analyzer')}
                />
              )}
              {activeView === 'analyzer' && (
                <ProjectWizard onAnalysisComplete={handleAnalysisComplete} />
              )}
              {activeView === 'plan-view' && currentPlan && (
                <ProjectView
                  plan={currentPlan}
                  onBackToDashboard={() => setActiveView('dashboard')}
                />
              )}
            </div>
          )}
        </main>
      </div>

      {/* Settings Dialog Preference Panel */}
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deletingPlan && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setDeletingPlan(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />

            {/* Modal Container */}
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 8 }}
                transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                className={`pointer-events-auto relative w-full max-w-md backdrop-blur-xl border rounded-2xl p-6 shadow-2xl overflow-hidden ${
                  theme === 'dark' ? 'bg-neutral-900/90 border-neutral-800/80 text-neutral-100' : 'bg-white/95 border-slate-200 text-slate-900'
                }`}
                style={theme === 'dark' ? { boxShadow: '0 0 50px -10px rgba(249, 115, 22, 0.25)' } : { boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.1)' }}
              >
                {/* Neon Orange Border Glow at the top */}
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#F97316] to-transparent shadow-[0_0_12px_rgba(249,115,22,0.8)]" />

                <div className="flex gap-4 items-start">
                  <div className={`p-3 border rounded-xl shrink-0 ${
                    theme === 'dark' ? 'bg-red-500/10 border-red-500/20 text-[#F97316]' : 'bg-red-50 border-red-100 text-red-600'
                  }`}>
                    <AlertTriangle className="w-5 h-5 animate-pulse" />
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <h3 className={`text-base font-bold tracking-tight ${theme === 'dark' ? 'text-neutral-100' : 'text-slate-900'}`}>Delete Project Plan?</h3>
                    <p className={`text-xs leading-relaxed ${theme === 'dark' ? 'text-neutral-400' : 'text-slate-600'}`}>
                      Are you sure you want to delete <span className={`font-semibold ${theme === 'dark' ? 'text-neutral-200' : 'text-slate-800'}`}>"{deletingPlan.title}"</span>? This will permanently delete the AI roadmap, custom configurations, and deployment checklists.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row-reverse gap-2.5 mt-6 sm:justify-start">
                  <button
                    onClick={handleConfirmDelete}
                    className="w-full sm:w-auto px-4 py-2 bg-red-600 hover:bg-red-500 active:bg-red-700 text-white font-medium rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5 shadow-lg shadow-red-600/10 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Plan</span>
                  </button>
                  <button
                    onClick={() => setDeletingPlan(null)}
                    className={`w-full sm:w-auto px-4 py-2 font-medium rounded-lg text-xs transition-colors border cursor-pointer ${
                      theme === 'dark' 
                        ? 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-neutral-100 border-neutral-700' 
                        : 'bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border-slate-300'
                    }`}
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
        
    </div>
  );
}

export default App;
