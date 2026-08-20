import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, ShieldCheck, TrendingUp, Cpu, Landmark, User, Building } from 'lucide-react';
import { store } from '../lib/store';
import { UserProfile } from '../types';

interface OnboardingProps {
  onComplete: () => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [slide, setSlide] = useState(0);
  const [name, setName] = useState('Meghaa Raj');
  const [company, setCompany] = useState('Zenith Tech Solutions');
  const [industry, setIndustry] = useState('AI & Software Services');

  const slides = [
    {
      title: "Welcome to BizGenie AI",
      tagline: "Your Intelligent Business Companion",
      description: "BizGenie merges deep financial tracking, client management, automated marketing, and cognitive document analytics into a single command center.",
      icon: <Sparkles className="w-16 h-16 text-violet-400" />
    },
    {
      title: "Full-Stack Security By Default",
      tagline: "Data Sovereignty & Encryption",
      description: "Your operational records, invoices, and employee logs are safely persisted locally. All API gateways route server-side to prevent client-side credential exposure.",
      icon: <ShieldCheck className="w-16 h-16 text-emerald-400" />
    },
    {
      title: "Harness Gemini Intelligence",
      tagline: "Unify Document OCR & FinOps Insights",
      description: "From generating high-conversion campaign copyset to screen resumes and predicting cash flow runways, the Gen-AI agent is integrated in every module.",
      icon: <Cpu className="w-16 h-16 text-fuchsia-400" />
    }
  ];

  const handleNext = () => {
    if (slide < slides.length) {
      setSlide(slide + 1);
    } else {
      // Save details to store and complete onboarding
      const currentProfile = store.getProfile();
      store.updateProfile({
        ...currentProfile,
        name,
        companyName: company,
        industry
      });
      onComplete();
    }
  };

  return (
    <div id="onboarding-root" className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4 overflow-hidden relative font-sans">
      {/* Background ambient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-fuchsia-600/10 rounded-full blur-[100px]" />

      <AnimatePresence mode="wait">
        {slide < slides.length ? (
          <motion.div
            key={`slide-${slide}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-lg glass-panel p-5 sm:p-8 rounded-2xl relative border border-slate-800/80 shadow-2xl flex flex-col items-center text-center max-h-[92vh] overflow-y-auto"
          >
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 rounded-full bg-slate-900/80 border border-slate-800 pulse-genie">
              {slides[slide].icon}
            </div>

            <span className="text-[10px] sm:text-xs font-mono tracking-widest text-violet-400 uppercase mb-1.5 sm:mb-2">
              Step {slide + 1} of 4
            </span>
            <h1 className="text-xl sm:text-3xl font-display font-bold tracking-tight text-white mb-1.5 sm:mb-2">
              {slides[slide].title}
            </h1>
            <p className="text-violet-300/90 font-medium text-xs sm:text-sm mb-3 sm:mb-4">
              {slides[slide].tagline}
            </p>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-6 sm:mb-8 max-w-sm">
              {slides[slide].description}
            </p>

            <button
              id={`btn-onboarding-next-${slide}`}
              onClick={handleNext}
              className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-medium py-3 px-6 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer min-h-[44px] text-xs sm:text-sm"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="slide-setup"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-lg glass-panel p-5 sm:p-8 rounded-2xl relative border border-slate-800/80 shadow-2xl max-h-[92vh] overflow-y-auto"
          >
            <div className="flex items-center gap-3 mb-5 sm:mb-6">
              <div className="p-2 sm:p-2.5 bg-violet-600/20 text-violet-400 rounded-xl border border-violet-500/30 shrink-0">
                <Sparkles className="w-5 sm:w-6 h-5 sm:h-6" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-display font-bold text-white">Setup Your Console</h1>
                <p className="text-[11px] sm:text-xs text-slate-400">Customize BizGenie for your business sector</p>
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
              <div>
                <label className="block text-[10px] sm:text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-violet-400" />
                  Your Full Name
                </label>
                <input
                  id="input-onboarding-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 sm:py-3 px-3.5 sm:px-4 text-white text-xs sm:text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all min-h-[42px]"
                  placeholder="Enter name"
                />
              </div>

              <div>
                <label className="block text-[10px] sm:text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-violet-400" />
                  Company Name
                </label>
                <input
                  id="input-onboarding-company"
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 sm:py-3 px-3.5 sm:px-4 text-white text-xs sm:text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all min-h-[42px]"
                  placeholder="Zenith Tech Solutions"
                />
              </div>

              <div>
                <label className="block text-[10px] sm:text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
                  <Landmark className="w-3.5 h-3.5 text-violet-400" />
                  Industry Sector
                </label>
                <input
                  id="input-onboarding-industry"
                  type="text"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 sm:py-3 px-3.5 sm:px-4 text-white text-xs sm:text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all min-h-[42px]"
                  placeholder="AI & Software Services"
                />
              </div>
            </div>

            <button
              id="btn-onboarding-submit"
              onClick={handleNext}
              className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-semibold py-3 sm:py-3.5 px-6 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-xs sm:text-sm uppercase tracking-wider cursor-pointer min-h-[44px]"
            >
              <span>Enter BizGenie Console</span>
              <Sparkles className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
