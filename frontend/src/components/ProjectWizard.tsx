import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Terminal, Cpu, Network, CheckCircle, XCircle } from 'lucide-react';
import type { ProjectPlan } from '../data/mockPlans';
import apiFetch from '../utils/api';
import { useTheme } from './ThemeContext';
import { ProjectTypeSelection } from './ProjectTypeSelection';
import { getThemeClasses } from '../utils/themeStyles';

interface ProjectWizardProps {
  onAnalysisComplete: (plan: ProjectPlan) => void;
}

export const ProjectWizard: React.FC<ProjectWizardProps> = ({ onAnalysisComplete }) => {
  const { theme } = useTheme();
const [projectType, setProjectType] = useState<'software' | 'hardware' | null>(null);
  const c = getThemeClasses(theme, projectType || undefined);
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [domain, setDomain] = useState('');
  const [skillLevel, setSkillLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [timeline, setTimeline] = useState('6 weeks');
  
  // Hardware specific states
  const [hardwareCategory, setHardwareCategory] = useState('IoT');
  const [preferredController, setPreferredController] = useState('ESP32');
  const [budgetRange, setBudgetRange] = useState('₹1000–₹3000');
  const [connectivityType, setConnectivityType] = useState('WiFi');
  const [powerSource, setPowerSource] = useState('USB');
  
  // Validation errors
  const [errors, setErrors] = useState<{ projectName?: string; description?: string; domain?: string }>({});
  const [touched, setTouched] = useState<{ projectName?: boolean; description?: boolean; domain?: boolean }>({});
  
  // Toast notifications state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Loading states
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loaderMessage, setLoaderMessage] = useState('Initializing analysis engine...');

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

  const fillMock = (
    type: 
      | 'diet' 
      | 'collab' 
      | 'saas-dash' 
      | 'smart-helmet' 
      | 'blind-stick' 
      | 'smart-parking' 
      | 'smart-agri' 
      | 'fire-detect' 
      | 'ai-robot' 
      | 'smart-meter'
  ) => {
    if (type === 'diet') {
      setProjectName('AI-Powered Personalized Diet Planner');
      setDescription('An AI-driven web application that suggests personalized meal structures, recipes, and caloric targets based on user physical metrics, dietary restrictions, fitness goals, and real-time food preferences.');
      setDomain('AI/ML');
      setSkillLevel('Intermediate');
      setTimeline('6 weeks');
    } else if (type === 'collab') {
      setProjectName('CollabCode – Real-time Peer IDE');
      setDescription('A collaborative browser-based development environment enabling multiple students to edit code concurrently with synchronized cursor statuses, file trees, and a secure Docker sandboxed code executor.');
      setDomain('Web Development');
      setSkillLevel('Advanced');
      setTimeline('10 weeks');
    } else if (type === 'saas-dash') {
      setProjectName('SaaS Multi-Tenant Analytics Dashboard');
      setDescription('A modern SaaS analytics platform featuring multi-tenant authentication, real-time activity stream charts, Stripe billing integration, and role-based dashboard access controls.');
      setDomain('Web Development');
      setSkillLevel('Advanced');
      setTimeline('8 weeks');
    } else if (type === 'smart-helmet') {
      setProjectName('Smart IoT Helmet for Accident Detection');
      setDescription('An intelligent safety helmet using an ESP32, MPU6050 accelerometer/gyroscope, and NEO-6M GPS module to detect sudden falls or impacts and send coordinates via a GSM module to emergency contacts.');
      setHardwareCategory('IoT');
      setPreferredController('ESP32');
      setBudgetRange('₹3000–₹5000');
      setConnectivityType('GSM');
      setPowerSource('Battery');
      setSkillLevel('Intermediate');
      setTimeline('6 weeks');
    } else if (type === 'blind-stick') {
      setProjectName('AI-Powered Smart Blind Stick');
      setDescription('An assistive smart walking stick featuring ultrasonic sensors for obstacle detection, a water sensor for puddle detection, and a buzzer/vibration motor for haptic warnings. Optionally uses a local camera on Raspberry Pi for simple object name audio feedback.');
      setHardwareCategory('Embedded Systems');
      setPreferredController('Arduino');
      setBudgetRange('₹1000–₹3000');
      setConnectivityType('Offline');
      setPowerSource('Battery');
      setSkillLevel('Beginner');
      setTimeline('4 weeks');
    } else if (type === 'smart-parking') {
      setProjectName('IoT Smart Parking Space Allocator');
      setDescription('A parking system utilizing NodeMCU/ESP8266 and IR sensors at each slot to detect car occupancy, publishing data to a Firebase cloud database. Features a local 16x2 I2C LCD displaying slot availability and a servo motor gate.');
      setHardwareCategory('Automation');
      setPreferredController('NodeMCU');
      setBudgetRange('₹1000–₹3000');
      setConnectivityType('WiFi');
      setPowerSource('USB');
      setSkillLevel('Beginner');
      setTimeline('6 weeks');
    } else if (type === 'smart-agri') {
      setProjectName('Autonomous Smart Irrigation & Crop Monitor');
      setDescription('A precision farming system using an ESP32 connected to soil moisture, temperature, and humidity sensors. Operates a water pump via relay while posting telemetry to a cloud dashboard. Includes solar battery charger support.');
      setHardwareCategory('Smart Agriculture');
      setPreferredController('ESP32');
      setBudgetRange('₹3000–₹5000');
      setConnectivityType('WiFi');
      setPowerSource('Solar');
      setSkillLevel('Advanced');
      setTimeline('8 weeks');
    } else if (type === 'fire-detect') {
      setProjectName('GSM Smart Fire Alarm & Gas Leak Detector');
      setDescription('An automatic safety system equipped with flame, MQ-2 smoke/gas sensors, and an STM32 microcontroller. Triggers a high-output buzzer, active exhaust fan relay, and sends emergency alerts via a SIM900A GSM modem.');
      setHardwareCategory('Embedded Systems');
      setPreferredController('STM32');
      setBudgetRange('₹1000–₹3000');
      setConnectivityType('GSM');
      setPowerSource('Adapter');
      setSkillLevel('Intermediate');
      setTimeline('6 weeks');
    } else if (type === 'ai-robot') {
      setProjectName('Autonomous AI Object Tracking Surveillance Robot');
      setDescription('A wheeled robot powered by Raspberry Pi 4 running Python, OpenCV, and TensorFlow Lite. Captures video streams, runs real-time human detection models, controls dual DC motor drives to follow targets, and hosts a local WebSocket web stream.');
      setHardwareCategory('Robotics');
      setPreferredController('Raspberry Pi');
      setBudgetRange('₹5000+');
      setConnectivityType('WiFi');
      setPowerSource('Battery');
      setSkillLevel('Advanced');
      setTimeline('10 weeks');
    } else if (type === 'smart-meter') {
      setProjectName('WiFi Smart Grid Power Consumption Meter');
      setDescription('An electricity monitoring node with ESP32 and PZEM-004T sensor to measure real-time voltage, current, and energy consumption. Uploads statistics via WiFi to a cloud IoT broker to track power usage.');
      setHardwareCategory('Home Automation');
      setPreferredController('ESP32');
      setBudgetRange('₹3000–₹5000');
      setConnectivityType('WiFi');
      setPowerSource('Adapter');
      setSkillLevel('Intermediate');
      setTimeline('6 weeks');
    }
    setErrors({});
    setTouched({});
    showToast('Form preset loaded successfully!', 'success');
  };

  // Real-time Validation
  useEffect(() => {
    const newErrors: typeof errors = {};
    
    if (touched.projectName) {
      if (!projectName.trim()) {
        newErrors.projectName = 'Project name is required';
      } else if (projectName.trim().length < 3) {
        newErrors.projectName = 'Project name must be at least 3 characters long';
      }
    }
    
    if (touched.description) {
      if (!description.trim()) {
        newErrors.description = 'Description is required';
      } else if (description.trim().length < 10) {
        newErrors.description = 'Description must be at least 10 characters long';
      }
    }
    
    if (projectType === 'software' && touched.domain) {
      if (!domain) {
        newErrors.domain = 'Project domain is required';
      }
    }
    
    setErrors(newErrors);
  }, [projectName, description, domain, touched, projectType]);

  const validateAll = () => {
    const newErrors: typeof errors = {};
    if (!projectName.trim()) newErrors.projectName = 'Project name is required';
    else if (projectName.trim().length < 3) newErrors.projectName = 'Project name must be at least 3 characters long';
    
    if (!description.trim()) newErrors.description = 'Description is required';
    else if (description.trim().length < 10) newErrors.description = 'Description must be at least 10 characters long';
    
    if (projectType === 'software' && !domain) newErrors.domain = 'Project domain is required';

    setErrors(newErrors);
    setTouched({ projectName: true, description: true, domain: true });
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectType) {
      showToast('Please select a project type before submitting.', 'error');
      return;
    }
    if (!validateAll()) {
      showToast('Please fix validation errors before submitting.', 'error');
      return;
    }
    setIsAnalyzing(true);
  };
  // Call backend API when analysis begins
  useEffect(() => {
    if (!isAnalyzing) return;
    
    let isMounted = true;
    setProgress(0);
    setLoaderMessage('Analyzing project requirements...');

    // Progress bar increment logic (caps at 95% until response returns)
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) return 95;
        return prev + 1;
      });
    }, 100);

    const runAnalysis = async () => {
      try {
        const data = await apiFetch('/projects/analyze', {
          method: 'POST',
          body: JSON.stringify({
            projectName,
            description,
            domain: projectType === 'hardware' ? hardwareCategory : domain,
            skillLevel,
            timeline,
            projectType,
            hardwareCategory,
            preferredController,
            budgetRange,
            connectivityType,
            powerSource,
          }),
        });

        if (!isMounted) return;

        clearInterval(interval);
        setProgress(100);
        setLoaderMessage('Blueprint generation complete!');

        setTimeout(() => {
          if (isMounted) {
            setIsAnalyzing(false);
            onAnalysisComplete(data.project);
          }
        }, 500);
      } catch (err: any) {
        if (!isMounted) return;
        clearInterval(interval);
        setIsAnalyzing(false);
        showToast(err.message || 'Failed to generate project roadmap.', 'error');
      }
    };

    runAnalysis();

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [isAnalyzing, projectName, description, domain, skillLevel, timeline, projectType, hardwareCategory, preferredController, budgetRange, connectivityType, powerSource, onAnalysisComplete]);

  // Update loader messages dynamically
  useEffect(() => {
    if (!isAnalyzing) return;
    if (progress < 20) setLoaderMessage('Analyzing project requirements...');
    else if (progress < 45) setLoaderMessage('Selecting optimized technical stack & programming frameworks...');
    else if (progress < 70) setLoaderMessage('Designing step-by-step developer roadmap milestones...');
    else if (progress < 90) setLoaderMessage('Formulating architecture system nodes & network edges...');
    else if (progress < 98) setLoaderMessage('Aggregating recommended dataset and third-party API reference directories...');
  }, [progress, isAnalyzing]);

  // Check if form is fully valid to enable/disable button
  const isFormValid = projectName.trim().length >= 3 && 
    description.trim().length >= 10 && 
    (projectType === 'hardware' || domain !== '');

  return (
    <div className={`max-w-3xl mx-auto p-6 min-h-[calc(100vh-100px)] flex flex-col justify-center relative ${theme === 'dark' ? 'text-neutral-100' : 'text-slate-900'}`}>
      
      {/* Toast Alert Notifications */}
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

      <AnimatePresence mode="wait">
        {!isAnalyzing ? (
          <motion.div
            key="wizard-form"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className={`backdrop-blur-md border rounded-2xl p-8 shadow-2xl relative overflow-hidden group transition-all duration-500 ${
              projectType === 'hardware' ? 'hover:border-[#06B6D4]/30' : 'hover:border-[#F97316]/30'
            } ${
              theme === 'dark' ? 'bg-[#18181B]/80 border-neutral-800' : 'bg-white border-slate-200'
            }`}
          >
            {/* Ambient glow border */}
            <div className={`absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent to-transparent ${
              projectType === 'hardware' ? 'via-[#06B6D4]/30' : 'via-[#F97316]/30'
            }`} />

            <div className={`flex justify-between items-center mb-6 pb-4 border-b ${theme === 'dark' ? 'border-neutral-850' : 'border-slate-100'}`}>
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 text-[#F97316] animate-pulse" />
                <h2 className={`text-xl font-bold tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>AI Project Analyzer</h2>
              </div>
              <span className={`text-[10px] font-mono tracking-widest uppercase px-2.5 py-1 rounded-md border ${
                theme === 'dark' ? 'text-neutral-500 bg-neutral-900 border-neutral-800' : 'text-slate-500 bg-slate-50 border-slate-200'
              }`}>SaaS Blueprint v1.0</span>
            </div>
{!projectType && (
  <ProjectTypeSelection selected={null} onSelect={setProjectType} />
)}
            {projectType && (
  <form onSubmit={handleSubmit} className="space-y-5">
              {/* Presets Row */}
              {projectType === 'software' && (
                <div className="space-y-2">
                  <label className={`text-[10px] font-bold uppercase tracking-widest block ${theme === 'dark' ? 'text-neutral-400' : 'text-slate-500'}`}>Software Project Presets</label>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => fillMock('diet')}
                      className={`flex items-center justify-center gap-2 py-2 px-3 border hover:border-[#F97316]/40 rounded-lg text-xs transition-all font-medium truncate ${
                        theme === 'dark' ? 'bg-[#09090B] border-neutral-800 text-neutral-300 hover:text-neutral-100' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-950'
                      }`}
                    >
                      <Cpu className="w-3.5 h-3.5 text-[#F97316]/60" />
                      <span>AI Diet Planner</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => fillMock('collab')}
                      className={`flex items-center justify-center gap-2 py-2 px-3 border hover:border-[#F97316]/40 rounded-lg text-xs transition-all font-medium truncate ${
                        theme === 'dark' ? 'bg-[#09090B] border-neutral-800 text-neutral-300 hover:text-neutral-100' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-950'
                      }`}
                    >
                      <Terminal className="w-3.5 h-3.5 text-[#F97316]/60" />
                      <span>Collab Peer IDE</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => fillMock('saas-dash')}
                      className={`flex items-center justify-center gap-2 py-2 px-3 border hover:border-[#F97316]/40 rounded-lg text-xs transition-all font-medium truncate ${
                        theme === 'dark' ? 'bg-[#09090B] border-neutral-800 text-neutral-300 hover:text-neutral-100' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-950'
                      }`}
                    >
                      <Network className="w-3.5 h-3.5 text-[#F97316]/60" />
                      <span>SaaS Dashboard</span>
                    </button>
                  </div>
                </div>
              )}

              {projectType === 'hardware' && (
                <div className="space-y-2">
                  <label className={`text-[10px] font-bold uppercase tracking-widest block ${theme === 'dark' ? 'text-neutral-400' : 'text-slate-500'}`}>Electronics Project Starter Kits</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <button
                      type="button"
                      onClick={() => fillMock('smart-helmet')}
                      className={`flex items-center justify-center gap-1.5 py-1.5 px-2 border hover:border-[#06B6D4]/40 rounded-lg text-[11px] transition-all font-medium truncate ${
                        theme === 'dark' ? 'bg-[#09090B] border-neutral-800 text-neutral-300 hover:text-neutral-100' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-950'
                      }`}
                    >
                      <Cpu className="w-3 h-3 text-[#06B6D4]/60" />
                      <span>Smart Helmet</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => fillMock('blind-stick')}
                      className={`flex items-center justify-center gap-1.5 py-1.5 px-2 border hover:border-[#06B6D4]/40 rounded-lg text-[11px] transition-all font-medium truncate ${
                        theme === 'dark' ? 'bg-[#09090B] border-neutral-800 text-neutral-300 hover:text-neutral-100' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-950'
                      }`}
                    >
                      <Terminal className="w-3 h-3 text-[#06B6D4]/60" />
                      <span>AI Blind Stick</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => fillMock('smart-parking')}
                      className={`flex items-center justify-center gap-1.5 py-1.5 px-2 border hover:border-[#06B6D4]/40 rounded-lg text-[11px] transition-all font-medium truncate ${
                        theme === 'dark' ? 'bg-[#09090B] border-neutral-800 text-neutral-300 hover:text-neutral-100' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-950'
                      }`}
                    >
                      <Network className="w-3 h-3 text-[#06B6D4]/60" />
                      <span>Smart Parking</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => fillMock('smart-agri')}
                      className={`flex items-center justify-center gap-1.5 py-1.5 px-2 border hover:border-[#06B6D4]/40 rounded-lg text-[11px] transition-all font-medium truncate ${
                        theme === 'dark' ? 'bg-[#09090B] border-neutral-800 text-neutral-300 hover:text-neutral-100' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-950'
                      }`}
                    >
                      <Cpu className="w-3 h-3 text-[#06B6D4]/60" />
                      <span>Smart Agri</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => fillMock('fire-detect')}
                      className={`flex items-center justify-center gap-1.5 py-1.5 px-2 border hover:border-[#06B6D4]/40 rounded-lg text-[11px] transition-all font-medium truncate ${
                        theme === 'dark' ? 'bg-[#09090B] border-neutral-800 text-neutral-300 hover:text-neutral-100' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-950'
                      }`}
                    >
                      <Terminal className="w-3 h-3 text-[#06B6D4]/60" />
                      <span>Fire Alarm</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => fillMock('ai-robot')}
                      className={`flex items-center justify-center gap-1.5 py-1.5 px-2 border hover:border-[#06B6D4]/40 rounded-lg text-[11px] transition-all font-medium truncate ${
                        theme === 'dark' ? 'bg-[#09090B] border-neutral-800 text-neutral-300 hover:text-neutral-100' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-950'
                      }`}
                    >
                      <Network className="w-3 h-3 text-[#06B6D4]/60" />
                      <span>AI Robot</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => fillMock('smart-meter')}
                      className={`flex items-center justify-center gap-1.5 py-1.5 px-2 border hover:border-[#06B6D4]/40 rounded-lg text-[11px] transition-all font-medium truncate ${
                        theme === 'dark' ? 'bg-[#09090B] border-neutral-800 text-neutral-300 hover:text-neutral-100' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-950'
                      }`}
                    >
                      <Cpu className="w-3 h-3 text-[#06B6D4]/60" />
                      <span>Energy Meter</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Form Inputs Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                {/* Project Name */}
                <div className="md:col-span-2">
                  <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${theme === 'dark' ? 'text-neutral-300' : 'text-zinc-700'}`}>Project Name</label>
                  <input
                    type="text"
                    value={projectName}
                    onBlur={() => setTouched(prev => ({ ...prev, projectName: true }))}
                    onChange={(e) => {
                      setProjectName(e.target.value);
                      if (touched.projectName) setTouched(prev => ({ ...prev, projectName: false }));
                    }}
                    placeholder="e.g. Smart Plant Irrigation System"
                    className={`w-full border rounded-lg px-4 py-2.5 text-sm outline-none transition-all ${
                      errors.projectName 
                        ? 'border-red-500/50 focus:border-red-500 shadow-xs shadow-red-500/5' 
                        : c.input
                    } ${c.placeholder}`}
                  />
                  {errors.projectName && (
                    <span className="text-red-400 text-[11px] mt-1.5 block font-medium font-sans">{errors.projectName}</span>
                  )}
                </div>

                {/* Project Domain Dropdown (Software) or Hardware Fields (Hardware) */}
                {projectType === 'software' ? (
                  <div>
                    <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${theme === 'dark' ? 'text-neutral-300' : 'text-zinc-700'}`}>Project Domain</label>
                    <select
                      value={domain}
                      onBlur={() => setTouched(prev => ({ ...prev, domain: true }))}
                      onChange={(e) => {
                        setDomain(e.target.value);
                        if (touched.domain) setTouched(prev => ({ ...prev, domain: false }));
                      }}
                      className={`w-full border rounded-lg px-4 py-2.5 text-sm outline-none transition-all ${
                        errors.domain 
                          ? 'border-red-500/50 focus:border-red-500 shadow-xs shadow-red-500/5' 
                          : c.input
                      }`}
                    >
                      <option value="" disabled className="text-black bg-white">Select Project Domain...</option>
                      <option value="AI/ML" className="text-black bg-white">AI/ML</option>
                      <option value="Web Development" className="text-black bg-white">Web Development</option>
                      <option value="Mobile App" className="text-black bg-white">Mobile App</option>
                      <option value="IoT" className="text-black bg-white">IoT</option>
                      <option value="Cybersecurity" className="text-black bg-white">Cybersecurity</option>
                      <option value="Blockchain" className="text-black bg-white">Blockchain</option>
                      <option value="Cloud Computing" className="text-black bg-white">Cloud Computing</option>
                      <option value="Data Science" className="text-black bg-white">Data Science</option>
                    </select>
                    {errors.domain && (
                      <span className="text-red-400 text-[11px] mt-1.5 block font-medium font-sans">{errors.domain}</span>
                    )}
                  </div>
                ) : (
                  <>
                    <div>
                      <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${theme === 'dark' ? 'text-neutral-300' : 'text-zinc-700'}`}>Hardware Category</label>
                      <select
                        value={hardwareCategory}
                        onChange={(e) => setHardwareCategory(e.target.value)}
                        className={`w-full border rounded-lg px-4 py-2.5 text-sm outline-none transition-all ${c.input}`}
                      >
                        <option value="IoT" className="text-black bg-white">IoT</option>
                        <option value="Robotics" className="text-black bg-white">Robotics</option>
                        <option value="Automation" className="text-black bg-white">Automation</option>
                        <option value="Embedded Systems" className="text-black bg-white">Embedded Systems</option>
                        <option value="Smart Agriculture" className="text-black bg-white">Smart Agriculture</option>
                        <option value="Healthcare Devices" className="text-black bg-white">Healthcare Devices</option>
                        <option value="Home Automation" className="text-black bg-white">Home Automation</option>
                      </select>
                    </div>

                    <div>
                      <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${theme === 'dark' ? 'text-neutral-300' : 'text-zinc-700'}`}>Preferred Controller</label>
                      <select
                        value={preferredController}
                        onChange={(e) => setPreferredController(e.target.value)}
                        className={`w-full border rounded-lg px-4 py-2.5 text-sm outline-none transition-all ${c.input}`}
                      >
                        <option value="Arduino" className="text-black bg-white">Arduino</option>
                        <option value="ESP32" className="text-black bg-white">ESP32</option>
                        <option value="Raspberry Pi" className="text-black bg-white">Raspberry Pi</option>
                        <option value="NodeMCU" className="text-black bg-white">NodeMCU</option>
                        <option value="STM32" className="text-black bg-white">STM32</option>
                      </select>
                    </div>

                    <div>
                      <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${theme === 'dark' ? 'text-neutral-300' : 'text-zinc-700'}`}>Budget Range</label>
                      <select
                        value={budgetRange}
                        onChange={(e) => setBudgetRange(e.target.value)}
                        className={`w-full border rounded-lg px-4 py-2.5 text-sm outline-none transition-all ${c.input}`}
                      >
                        <option value="₹1000–₹3000" className="text-black bg-white">₹1000–₹3000</option>
                        <option value="₹3000–₹5000" className="text-black bg-white">₹3000–₹5000</option>
                        <option value="₹5000+" className="text-black bg-white">₹5000+</option>
                      </select>
                    </div>

                    <div>
                      <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${theme === 'dark' ? 'text-neutral-300' : 'text-zinc-700'}`}>Connectivity Type</label>
                      <select
                        value={connectivityType}
                        onChange={(e) => setConnectivityType(e.target.value)}
                        className={`w-full border rounded-lg px-4 py-2.5 text-sm outline-none transition-all ${c.input}`}
                      >
                        <option value="WiFi" className="text-black bg-white">WiFi</option>
                        <option value="Bluetooth" className="text-black bg-white">Bluetooth</option>
                        <option value="GSM" className="text-black bg-white">GSM</option>
                        <option value="LoRa" className="text-black bg-white">LoRa</option>
                        <option value="Offline" className="text-black bg-white">Offline</option>
                      </select>
                    </div>

                    <div>
                      <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${theme === 'dark' ? 'text-neutral-300' : 'text-zinc-700'}`}>Power Source</label>
                      <select
                        value={powerSource}
                        onChange={(e) => setPowerSource(e.target.value)}
                        className={`w-full border rounded-lg px-4 py-2.5 text-sm outline-none transition-all ${c.input}`}
                      >
                        <option value="Battery" className="text-black bg-white">Battery</option>
                        <option value="USB" className="text-black bg-white">USB</option>
                        <option value="Adapter" className="text-black bg-white">Adapter</option>
                        <option value="Solar" className="text-black bg-white">Solar</option>
                      </select>
                    </div>
                  </>
                )}

                {/* Skill Level Dropdown */}
                <div>
                  <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${theme === 'dark' ? 'text-neutral-300' : 'text-zinc-700'}`}>Skill Level</label>
                  <select
                    value={skillLevel}
                    onChange={(e) => setSkillLevel(e.target.value as any)}
                    className={`w-full border rounded-lg px-4 py-2.5 text-sm outline-none transition-all ${c.input}`}
                  >
                    <option value="Beginner" className="text-black bg-white">Beginner</option>
                    <option value="Intermediate" className="text-black bg-white">Intermediate</option>
                    <option value="Advanced" className="text-black bg-white">Advanced</option>
                  </select>
                </div>

                {/* Timeline Input */}
                <div className="md:col-span-2">
                  <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${theme === 'dark' ? 'text-neutral-300' : 'text-zinc-700'}`}>Estimated Timeline</label>
                  <input
                    type="text"
                    value={timeline}
                    onChange={(e) => setTimeline(e.target.value)}
                    placeholder="e.g. 6 weeks, 2 months"
                    className={`w-full border outline-none rounded-lg px-4 py-2.5 text-sm ${c.input} ${c.placeholder}`}
                  />
                </div>

                {/* Detailed Description */}
                <div className="md:col-span-2">
                  <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${theme === 'dark' ? 'text-neutral-300' : 'text-zinc-700'}`}>Project Idea & Core Features</label>
                  <textarea
                    value={description}
                    onBlur={() => setTouched(prev => ({ ...prev, description: true }))}
                    onChange={(e) => {
                      setDescription(e.target.value);
                      if (touched.description) setTouched(prev => ({ ...prev, description: false }));
                    }}
                    rows={4}
                    placeholder="Describe what your project aims to accomplish, the target audience, core features, and hardware/cloud dependencies..."
                    className={`w-full border rounded-lg px-4 py-2.5 text-sm resize-none outline-none transition-all ${
                      errors.description 
                        ? 'border-red-500/50 focus:border-red-500 shadow-xs shadow-red-500/5' 
                        : c.input
                    } ${c.placeholder}`}
                  />
                  {errors.description && (
                    <span className="text-red-400 text-[11px] mt-1.5 block font-medium font-sans">{errors.description}</span>
                  )}
                </div>
              </div>

              {/* Form buttons footer */}
              <div className={`flex justify-end items-center pt-5 border-t ${theme === 'dark' ? 'border-neutral-850' : 'border-slate-200'}`}>
                <button
                  type="submit"
                  disabled={!isFormValid}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold transition-all shadow-md ${
                    isFormValid 
                      ? (projectType === 'hardware' 
                          ? 'bg-[#06B6D4] hover:bg-[#22D3EE] text-neutral-100 shadow-[#06B6D4]/10 cursor-pointer hover:scale-[1.01]' 
                          : 'bg-[#F97316] hover:bg-[#FB923C] text-neutral-100 shadow-[#F97316]/10 cursor-pointer hover:scale-[1.01]')
                      : 'bg-neutral-800 text-neutral-500 cursor-not-allowed border border-neutral-850'
                  }`}
                >
                  <span>Generate Blueprint</span>
                  <Sparkles className="w-4 h-4" />
                </button>
              </div>
            </form>
)}
          </motion.div>
        ) : (
          /* Animated simulated AI loading screen */
          <motion.div
            key="wizard-loading"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className={`border rounded-2xl p-10 text-center max-w-lg mx-auto shadow-2xl relative overflow-hidden flex flex-col justify-center items-center space-y-6 ${
              theme === 'dark' ? 'bg-[#18181B] border-neutral-800' : 'bg-white border-slate-200'
            }`}
            style={
              theme === 'dark' 
                ? { boxShadow: `0 0 50px -10px ${projectType === 'hardware' ? 'rgba(6, 182, 212, 0.2)' : 'rgba(249, 115, 22, 0.2)'}` } 
                : { boxShadow: `0 0 50px -10px ${projectType === 'hardware' ? 'rgba(6, 182, 212, 0.1)' : 'rgba(249, 115, 22, 0.1)'}` }
            }
          >
            {/* Spinning Loader Outer ring */}
            <div className="relative w-24 h-24 flex items-center justify-center">
              <div className={`absolute inset-0 border-4 rounded-full ${theme === 'dark' ? 'border-neutral-850' : 'border-slate-100'}`} />
              <div 
                className={`absolute inset-0 border-4 border-t-transparent rounded-full animate-spin ${
                  projectType === 'hardware' ? 'border-[#06B6D4]' : 'border-[#F97316]'
                }`} 
                style={{ animationDuration: '1s' }}
              />
              <Sparkles className={`w-8 h-8 animate-pulse ${projectType === 'hardware' ? 'text-[#22D3EE]' : 'text-[#FB923C]'}`} />
            </div>

            <div className="space-y-2 max-w-sm">
              <h3 className={`text-xl font-bold animate-pulse ${theme === 'dark' ? 'text-neutral-100' : 'text-slate-800'}`}>Generating Project Blueprint</h3>
              <p className={`text-xs font-mono h-8 leading-relaxed ${theme === 'dark' ? 'text-neutral-400' : 'text-slate-600'}`}>
                {loaderMessage}
              </p>
            </div>

            {/* Percentage Bar tracker */}
            <div className={`w-full border h-2 rounded-full overflow-hidden relative ${
              theme === 'dark' ? 'bg-neutral-900 border-neutral-805' : 'bg-slate-100 border-slate-200'
            }`}>
              <div 
                className={`h-full transition-all duration-300 ${
                  projectType === 'hardware' ? 'bg-gradient-to-r from-[#06B6D4] to-[#22D3EE]' : 'bg-gradient-to-r from-[#F97316] to-[#FB923C]'
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className={`text-xs font-mono ${theme === 'dark' ? 'text-neutral-400' : 'text-slate-500'}`}>{progress}% compiled</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
