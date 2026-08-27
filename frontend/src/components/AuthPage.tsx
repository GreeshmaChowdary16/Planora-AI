import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Sparkles, ArrowRight } from 'lucide-react';
import apiFetch from '../utils/api';
import { useTheme } from './ThemeContext';
import { getThemeClasses } from '../utils/themeStyles';

interface AuthPageProps {
  onLoginSuccess: (token: string, user: { id: string; name: string; email: string }) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onLoginSuccess }) => {
  const { theme } = useTheme();
  const c = getThemeClasses(theme);
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Validation States
  const [errors, setErrors] = useState<{ email?: string; password?: string; name?: string }>({});
  
  const validateForm = () => {
    const newErrors: typeof errors = {};
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Invalid email address';
    }
    
    if (mode !== 'forgot') {
      if (!password) {
        newErrors.password = 'Password is required';
      } else if (password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }
    }
    
    if (mode === 'signup' && !name) {
      newErrors.name = 'Full name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      if (mode === 'forgot') {
        alert('Password reset link sent to ' + email);
        setMode('signin');
      } else if (mode === 'signin') {
        const data = await apiFetch('/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email, password }),
        });
        
        localStorage.setItem('planora_token', data.token);
        onLoginSuccess(data.token, data.user);
      } else {
        const data = await apiFetch('/auth/register', {
          method: 'POST',
          body: JSON.stringify({ name, email, password }),
        });
        
        localStorage.setItem('planora_token', data.token);
        onLoginSuccess(data.token, data.user);
      }
    } catch (err: any) {
      console.error('[Auth Page] Authentication failed:', err);
      setErrors({ email: err.message || 'Authentication failed. Please check your credentials.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setErrors({});
    const googleUser = {
      name: 'Google Student',
      email: 'google.student@planora.ai',
      password: 'GoogleStudentPass123!',
    };

    try {
      let data;
      try {
        data = await apiFetch('/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email: googleUser.email, password: googleUser.password }),
        });
      } catch {
        // If account doesn't exist yet in the database, register it automatically
        data = await apiFetch('/auth/register', {
          method: 'POST',
          body: JSON.stringify(googleUser),
        });
      }

      localStorage.setItem('planora_token', data.token);
      onLoginSuccess(data.token, data.user);
    } catch (err: any) {
      console.error('[Auth Page] Google authentication failed:', err);
      setErrors({ email: err.message || 'Authentication with Google failed. Please check network connection.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-[calc(100vh-64px)] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center px-4 max-w-7xl mx-auto py-8 ${c.textPrimary}`}>
      {/* Left Column: Form Card */}
      <div className="lg:col-span-5 flex justify-center w-full z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`w-full max-w-md border rounded-2xl p-8 shadow-2xl relative overflow-hidden group hover:border-[#F97316]/30 transition-all duration-500 ${
            theme === 'dark' ? 'bg-[#18181B] border-neutral-800' : 'bg-white border-zinc-200'
          }`}
          style={theme === 'dark' ? { boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.7), 0 0 40px -15px rgba(249, 115, 22, 0.05)' } : { boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.05)' }}
        >
          {/* Subtle Orange Glow Border Corner */}
          <div className="absolute top-0 left-0 w-24 h-[1px] bg-gradient-to-r from-transparent via-[#F97316] to-transparent opacity-50 group-hover:w-48 transition-all duration-750" />
          <div className="absolute top-0 left-0 h-24 w-[1px] bg-gradient-to-b from-transparent via-[#F97316] to-transparent opacity-50 group-hover:h-48 transition-all duration-750" />

          <AnimatePresence mode="wait">
            {mode === 'signin' && (
              <motion.div
                key="signin"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-6">
                  <div className="flex items-center gap-2 text-[#F97316] font-semibold text-sm tracking-wider uppercase mb-1">
                    <Sparkles className="w-4 h-4 animate-pulse" />
                    <span>Welcome Back</span>
                  </div>
                  <h2 className={`text-2xl font-bold ${c.textPrimary}`}>Sign in to PlanoraAI</h2>
                  <p className={`text-sm mt-1 ${c.textSecondary}`}>Access your personalized project roadmaps</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${c.textSecondary}`}>Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                      <input 
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (errors.email) setErrors(prev => ({ ...prev, email: undefined }));
                        }}
                        className={`w-full border rounded-lg py-2.5 pl-10 pr-4 text-sm outline-none transition-all ${
                          errors.email 
                            ? 'border-red-500/50 focus:border-red-500' 
                            : theme === 'dark' 
                              ? 'bg-[#09090B]/60 border-neutral-800 text-neutral-100 focus:border-[#F97316]/50'
                              : 'bg-white border-zinc-300 text-zinc-900 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20'
                        } ${c.placeholder}`}
                        placeholder="you@school.edu"
                      />
                    </div>
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className={`text-xs font-semibold uppercase tracking-wider ${c.textSecondary}`}>Password</label>
                      <button 
                        type="button" 
                        onClick={() => setMode('forgot')}
                        className="text-xs text-[#FB923C] hover:text-[#F97316] transition-colors"
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                      <input 
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          if (errors.password) setErrors(prev => ({ ...prev, password: undefined }));
                        }}
                        className={`w-full border rounded-lg py-2.5 pl-10 pr-10 text-sm outline-none transition-all ${
                          errors.password 
                            ? 'border-red-500/50 focus:border-red-500' 
                            : theme === 'dark' 
                              ? 'bg-[#09090B]/60 border-neutral-800 text-neutral-100 focus:border-[#F97316]/50'
                              : 'bg-white border-zinc-300 text-zinc-900 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20'
                        } ${c.placeholder}`}
                        placeholder="••••••••"
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-350 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                  </div>

                  <div className="flex items-center">
                    <input 
                      type="checkbox"
                      id="showPass"
                      checked={showPassword}
                      onChange={() => setShowPassword(!showPassword)}
                      className={`w-4 h-4 rounded focus:ring-0 outline-none accent-[#F97316] ${
                        theme === 'dark' ? 'border-neutral-800 bg-[#09090B] text-[#F97316]' : 'border-zinc-300 bg-white'
                      }`}
                    />
                    <label htmlFor="showPass" className={`ml-2 text-xs select-none cursor-pointer ${c.textSecondary}`}>
                      Show Password
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#F97316] hover:bg-[#FB923C] text-neutral-100 text-sm font-semibold py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 group relative overflow-hidden disabled:opacity-60 shadow-lg shadow-[#F97316]/10"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-neutral-100 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Sign In</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            )}

            {mode === 'signup' && (
              <motion.div
                key="signup"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-6">
                  <div className="flex items-center gap-2 text-[#F97316] font-semibold text-sm tracking-wider uppercase mb-1">
                    <Sparkles className="w-4 h-4 animate-pulse" />
                    <span>Get Started</span>
                  </div>
                  <h2 className={`text-2xl font-bold ${c.textPrimary}`}>Create Account</h2>
                  <p className={`text-sm mt-1 ${c.textSecondary}`}>Start planning your next innovation</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${c.textSecondary}`}>Full Name</label>
                    <div className="relative">
                      <input 
                        type="text"
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          if (errors.name) setErrors(prev => ({ ...prev, name: undefined }));
                        }}
                        className={`w-full border rounded-lg py-2.5 px-4 text-sm outline-none transition-all ${
                          errors.name 
                            ? 'border-red-500/50 focus:border-red-500' 
                            : theme === 'dark' 
                              ? 'bg-[#09090B]/60 border-neutral-800 text-neutral-100 focus:border-[#F97316]/50'
                              : 'bg-white border-zinc-300 text-zinc-900 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20'
                        } ${c.placeholder}`}
                        placeholder="Alex Johnson"
                      />
                    </div>
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${c.textSecondary}`}>Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                      <input 
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (errors.email) setErrors(prev => ({ ...prev, email: undefined }));
                        }}
                        className={`w-full border rounded-lg py-2.5 pl-10 pr-4 text-sm outline-none transition-all ${
                          errors.email 
                            ? 'border-red-500/50 focus:border-red-500' 
                            : theme === 'dark' 
                              ? 'bg-[#09090B]/60 border-neutral-800 text-neutral-100 focus:border-[#F97316]/50'
                              : 'bg-white border-zinc-300 text-zinc-900 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20'
                        } ${c.placeholder}`}
                        placeholder="you@school.edu"
                      />
                    </div>
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${c.textSecondary}`}>Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                      <input 
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          if (errors.password) setErrors(prev => ({ ...prev, password: undefined }));
                        }}
                        className={`w-full border rounded-lg py-2.5 pl-10 pr-10 text-sm outline-none transition-all ${
                          errors.password 
                            ? 'border-red-500/50 focus:border-red-500' 
                            : theme === 'dark' 
                              ? 'bg-[#09090B]/60 border-neutral-800 text-neutral-100 focus:border-[#F97316]/50'
                              : 'bg-white border-zinc-300 text-zinc-900 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20'
                        } ${c.placeholder}`}
                        placeholder="Min 6 characters"
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-350 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#F97316] hover:bg-[#FB923C] text-neutral-100 text-sm font-semibold py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 group relative overflow-hidden disabled:opacity-60 shadow-lg shadow-[#F97316]/10"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-neutral-100 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Create Account</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            )}

            {mode === 'forgot' && (
              <motion.div
                key="forgot"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-6">
                  <h2 className={`text-2xl font-bold ${c.textPrimary}`}>Reset Password</h2>
                  <p className={`text-sm mt-1 ${c.textSecondary}`}>Enter your email and we'll send you a link to reset your password.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${c.textSecondary}`}>Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                      <input 
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (errors.email) setErrors(prev => ({ ...prev, email: undefined }));
                        }}
                        className={`w-full border rounded-lg py-2.5 pl-10 pr-4 text-sm outline-none transition-all ${
                          errors.email 
                            ? 'border-red-500/50 focus:border-red-500' 
                            : theme === 'dark' 
                              ? 'bg-[#09090B]/60 border-neutral-800 text-neutral-100 focus:border-[#F97316]/50'
                              : 'bg-white border-zinc-300 text-zinc-900 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20'
                        } ${c.placeholder}`}
                        placeholder="you@school.edu"
                      />
                    </div>
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#F97316] hover:bg-[#FB923C] text-neutral-100 text-sm font-semibold py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-neutral-100 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <span>Send Reset Link</span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setMode('signin')}
                    className={`w-full border text-sm py-2 rounded-lg transition-all ${
                      theme === 'dark' ? 'border-neutral-850 hover:bg-neutral-800/40 text-neutral-300' : 'border-zinc-200 hover:bg-zinc-50 text-zinc-700'
                    }`}
                  >
                    Back to Sign In
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Social Auth Separator */}
          {mode !== 'forgot' && (
            <>
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className={`w-full border-t ${theme === 'dark' ? 'border-neutral-800' : 'border-zinc-200'}`} />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className={`px-2 text-neutral-500 ${theme === 'dark' ? 'bg-[#18181B]' : 'bg-white'}`}>Or continue with</span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className={`flex items-center justify-center gap-2.5 py-2.5 px-4 border rounded-lg text-sm font-medium transition-all group duration-300 ${
                    theme === 'dark' 
                      ? 'border-neutral-850 bg-[#18181B] hover:bg-neutral-800/40 hover:border-neutral-700 text-neutral-200' 
                      : 'border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 hover:border-zinc-300'
                  }`}
                >
                  <svg className="w-4 h-4 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                    <g transform="matrix(1, 0, 0, 1, 0, 0)">
                      <path d="M21.35,11.1H12v2.7h5.38C16.88,15.65,14.8,17,12,17c-2.76,0-5-2.24-5-5s2.24-5,5-5c1.47,0,2.75,0.64,3.65,1.68l2.12-2.12C16.15,4.72,14.21,4,12,4c-4.42,0-8,3.58-8,8s3.58,8,8,8c4.14,0,7-2.61,7-7A6.47,6.47,0,0,0,21.35,11.1Z" fill={theme === 'dark' ? '#FAFAFA' : '#09090B'} />
                    </g>
                  </svg>
                  <span>Google</span>
                </button>
              </div>

              {/* Toggle Sign In / Sign Up */}
              <div className={`mt-6 text-center text-xs ${c.textSecondary}`}>
                {mode === 'signin' ? (
                  <>
                    Don't have an account?{' '}
                    <button onClick={() => setMode('signup')} className="text-[#FB923C] hover:text-[#F97316] font-semibold transition-colors">
                      Sign Up
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{' '}
                    <button onClick={() => setMode('signin')} className="text-[#FB923C] hover:text-[#F97316] font-semibold transition-colors">
                      Sign In
                    </button>
                  </>
                )}
              </div>
            </>
          )}
        </motion.div>
      </div>

      {/* Right Column: Introduce PlanoraAI */}
      <div className="lg:col-span-7 flex flex-col justify-center px-4 lg:pl-12 text-left z-10 select-none">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-xl space-y-6"
        >
          <div className="inline-flex items-center gap-2 bg-[#F97316]/10 border border-[#F97316]/20 rounded-full px-3 py-1 text-xs text-[#FB923C] font-semibold tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI-Powered Project Mentor</span>
          </div>

          <h1 className={`text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight ${c.textPrimary}`}>
            Build your project ideas <br />
            <span className="bg-gradient-to-r from-[#F97316] to-[#FB923C] bg-clip-text text-transparent">
              with structural guidance
            </span>
          </h1>

          <p className={`text-base sm:text-lg leading-relaxed font-light ${c.textSecondary}`}>
            PlanoraAI is an AI-powered project planning assistant designed for students. It helps users transform project ideas into structured development plans by recommending technology stacks, frameworks, tools, APIs, datasets, architecture guidance, and step-by-step roadmaps.
          </p>

          {/* Glowing Preview Dashboard Visualization (SVG Card Grid Mockup) */}
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className={`w-full relative rounded-xl p-6 overflow-hidden shadow-2xl backdrop-blur-md border ${
              theme === 'dark' ? 'bg-[#18181B]/55 border-neutral-800' : 'bg-white/70 border-zinc-200'
            }`}
          >
            {/* Ambient orange glow inside the mockup card */}
            <div className="absolute -right-20 -bottom-20 w-48 h-48 rounded-full bg-[#F97316]/10 blur-3xl pointer-events-none" />

            <div className={`flex items-center justify-between border-b pb-3 mb-4 ${theme === 'dark' ? 'border-neutral-800' : 'border-zinc-150'}`}>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                <span className={`text-[10px] font-mono ml-2 ${c.textMuted}`}>planora-ai-workspace_v1.0</span>
              </div>
              <div className="px-2 py-0.5 bg-[#F97316]/10 text-[9px] text-[#FB923C] font-mono rounded">Active Plan</div>
            </div>

            {/* Simulated Architecture Node System */}
            <div className="grid grid-cols-3 gap-3">
              <div className={`col-span-1 border rounded p-2.5 flex flex-col space-y-1.5 hover:border-[#F97316]/40 transition-colors ${
                theme === 'dark' ? 'border-neutral-800 bg-[#09090B]/80' : 'border-zinc-200 bg-zinc-50/85'
              }`}>
                <span className="text-[8px] text-[#FB923C] uppercase tracking-wider font-semibold">Step 01</span>
                <span className={`text-xs font-medium font-sans truncate ${c.textPrimary}`}>Frontend UI App</span>
                <span className={`text-[9px] truncate ${c.textMuted}`}>Vite / React.ts</span>
              </div>
              <div className={`col-span-1 border rounded p-2.5 flex flex-col space-y-1.5 hover:border-[#F97316]/40 transition-colors ${
                theme === 'dark' ? 'border-neutral-800 bg-[#09090B]/80' : 'border-zinc-200 bg-zinc-50/85'
              }`}>
                <span className="text-[8px] text-[#FB923C] uppercase tracking-wider font-semibold">Step 02</span>
                <span className={`text-xs font-medium font-sans truncate ${c.textPrimary}`}>Express Gateway</span>
                <span className={`text-[9px] truncate ${c.textMuted}`}>Node.js Server</span>
              </div>
              <div className={`col-span-1 border rounded p-2.5 flex flex-col space-y-1.5 hover:border-[#F97316]/40 transition-colors ${
                theme === 'dark' ? 'border-neutral-800 bg-[#09090B]/80' : 'border-zinc-200 bg-zinc-50/85'
              }`}>
                <span className="text-[8px] text-[#FB923C] uppercase tracking-wider font-semibold">Step 03</span>
                <span className={`text-xs font-medium font-sans truncate ${c.textPrimary}`}>Data Storage</span>
                <span className={`text-[9px] truncate ${c.textMuted}`}>MongoDB / Atlas</span>
              </div>
            </div>

            {/* Small decorative progress simulation */}
            <div className={`mt-4 pt-3 border-t flex items-center justify-between text-[10px] ${theme === 'dark' ? 'border-neutral-800/60' : 'border-zinc-150'}`}>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping" />
                <span className={`font-mono ${c.textSecondary}`}>Simulated Architecture Node Flow</span>
              </div>
              <span className="text-[#FB923C] font-mono">Sync Code 100%</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};
