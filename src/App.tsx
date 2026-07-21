import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, Bot, DollarSign, Users, Megaphone, ShieldAlert, HeartPulse,
  User, Settings, LayoutDashboard, FileText, BarChart3, Bell, Check, 
  Menu, X, LogOut, HeartHandshake, Mic
} from 'lucide-react';
import { store } from './lib/store';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import Assistant from './components/Assistant';
import Finance from './components/Finance';
import SalesCRM from './components/SalesCRM';
import Marketing from './components/Marketing';
import HRM from './components/HRM';
import Documents from './components/Documents';
import Analytics from './components/Analytics';
import Profile from './components/Profile';

export default function App() {
  const [isOnboarding, setIsOnboarding] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [profile, setProfile] = useState(store.getProfile());
  const [notifications, setNotifications] = useState(store.getNotifications());
  const [showNotifications, setShowNotifications] = useState(false);
  const [assistantQuickPrompt, setAssistantQuickPrompt] = useState<string>('');
  
  // Mobile nav state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Check if onboarding completed is true
    const complete = localStorage.getItem('bizgenie_onboarding_done');
    if (complete === 'true') {
      setIsOnboarding(false);
    }

    const unsubscribe = store.subscribe(() => {
      setProfile(store.getProfile());
      setNotifications(store.getNotifications());
    });
    return unsubscribe;
  }, []);

  const handleOnboardingComplete = () => {
    localStorage.setItem('bizgenie_onboarding_done', 'true');
    setIsOnboarding(false);
  };

  const handleQuickMessage = (prompt: string) => {
    setAssistantQuickPrompt(prompt);
    setActiveTab('assistant');
  };

  const handleDismissNotification = (id: string) => {
    store.markNotificationAsRead(id);
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'assistant', name: 'AI Co-Pilot', icon: <Bot className="w-4 h-4" /> },
    { id: 'finance', name: 'FinOps Suite', icon: <DollarSign className="w-4 h-4" /> },
    { id: 'sales', name: 'CRM & Projections', icon: <Users className="w-4 h-4" /> },
    { id: 'marketing', name: 'Copywriter', icon: <Megaphone className="w-4 h-4" /> },
    { id: 'hrm', name: 'HRM & Screener', icon: <HeartHandshake className="w-4 h-4" /> },
    { id: 'documents', name: 'Doc OCR Scan', icon: <FileText className="w-4 h-4" /> },
    { id: 'analytics', name: 'Analytics Curves', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'profile', name: 'Settings', icon: <Settings className="w-4 h-4" /> }
  ];

  if (isOnboarding) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <div id="app-shell" className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans relative antialiased selection:bg-violet-600/30 selection:text-white">
      {/* Background radial overlays */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-violet-950/20 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-10 right-10 w-[400px] h-[400px] bg-violet-600/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Top Header Navigation */}
      <header id="app-header" className="sticky top-0 z-40 bg-slate-950/70 backdrop-blur-xl border-b border-slate-900 px-4 md:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-gradient-to-tr from-violet-600 to-fuchsia-600 rounded-xl shadow-lg shadow-violet-900/30 flex items-center justify-center pulse-genie text-white">
            <Sparkles className="w-5 h-5 shrink-0" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-sm font-display font-black tracking-tight text-white uppercase">BizGenie AI</h1>
              <span className="text-[10px] font-mono bg-violet-500/10 text-violet-400 py-0.5 px-2 rounded-full border border-violet-500/15">SaaS PRO</span>
            </div>
            <p className="text-[10px] text-slate-400 hidden sm:block">Your Intelligent Business Companion</p>
          </div>
        </div>

        {/* Center Nav tabs for Desktop */}
        <nav className="hidden lg:flex items-center bg-slate-900/40 p-1 rounded-xl border border-slate-900 gap-0.5">
          {tabs.map((tab) => (
            <button
              id={`tab-btn-${tab.id}`}
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                activeTab === tab.id 
                  ? 'bg-violet-600 text-white shadow-md' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              {tab.icon}
              {tab.name}
            </button>
          ))}
        </nav>

        {/* Right side Profile & Notification widgets */}
        <div className="flex items-center gap-3">
          {/* Notifications Trigger */}
          <div className="relative">
            <button
              id="btn-trigger-notification-drawer"
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2.5 bg-slate-900 hover:bg-slate-850 hover:text-white text-slate-300 rounded-xl border border-slate-800 transition-all cursor-pointer relative"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-4 ring-slate-950 animate-bounce" />
              )}
            </button>

            {/* In-app notification dropdown drawer popup */}
            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-3 w-80 bg-slate-900 border border-slate-800/95 rounded-2xl shadow-2xl p-4 z-50 space-y-3"
                >
                  <div className="flex justify-between items-center pb-2 border-b border-slate-800/60">
                    <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Alert Center ({unreadNotificationsCount})</span>
                    {unreadNotificationsCount > 0 && (
                      <button
                        id="btn-dismiss-all-notify"
                        onClick={() => store.markAllNotificationsAsRead()}
                        className="text-[10px] text-violet-400 font-semibold hover:text-violet-300 cursor-pointer"
                      >
                        Dismiss All
                      </button>
                    )}
                  </div>

                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                    {notifications.length === 0 ? (
                      <span className="text-[10px] text-slate-500 block text-center py-4 italic">No pending notifications.</span>
                    ) : (
                      notifications.map((n) => (
                        <div 
                          key={n.id} 
                          className={`p-2.5 rounded-xl border flex gap-2.5 items-start justify-between ${
                            n.read 
                              ? 'bg-slate-950/30 border-slate-900/60 text-slate-400' 
                              : 'bg-violet-600/5 border-violet-500/20 text-slate-200'
                          }`}
                        >
                          <div className="space-y-1 overflow-hidden pr-2">
                            <span className="text-[10px] font-bold block leading-snug">{n.title}</span>
                            <p className="text-[9px] text-slate-400 leading-normal">{n.message}</p>
                          </div>
                          {!n.read && (
                            <button
                              id={`btn-read-notify-${n.id}`}
                              onClick={() => handleDismissNotification(n.id)}
                              className="p-1 hover:bg-violet-500/10 hover:text-violet-300 rounded text-violet-400 cursor-pointer shrink-0"
                            >
                              <Check className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User profile capsule */}
          <div 
            onClick={() => setActiveTab('profile')}
            className="flex items-center gap-2 p-1.5 bg-slate-900/80 border border-slate-850 rounded-xl cursor-pointer hover:bg-slate-800 transition-all"
          >
            <div className="w-7 h-7 bg-violet-600 text-white rounded-lg flex items-center justify-center text-xs font-bold font-mono">
              {profile.name ? profile.name.slice(0, 2).toUpperCase() : 'Z'}
            </div>
            <div className="hidden md:block pr-2 text-left">
              <span className="text-[11px] font-bold text-white block leading-none">{profile.name}</span>
              <span className="text-[9px] text-slate-400 block mt-1 truncate max-w-[100px]">{profile.companyName}</span>
            </div>
          </div>

          {/* Mobile hamburger menu */}
          <button
            id="btn-mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 bg-slate-900 text-slate-300 rounded-xl border border-slate-800 lg:hidden cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Mobile side-bar Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="fixed inset-y-0 left-0 w-64 bg-slate-950 border-r border-slate-900 z-50 p-5 flex flex-col justify-between lg:hidden"
          >
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-slate-900">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-violet-400" />
                  <span className="text-sm font-display font-extrabold text-white">BizGenie AI</span>
                </div>
                <button 
                  id="btn-mobile-menu-close"
                  onClick={() => setMobileMenuOpen(false)} 
                  className="text-slate-400 font-bold"
                >
                  ×
                </button>
              </div>

              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    id={`mobile-tab-btn-${tab.id}`}
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      activeTab === tab.id 
                        ? 'bg-violet-600 text-white' 
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                    }`}
                  >
                    {tab.icon}
                    {tab.name}
                  </button>
                ))}
              </nav>
            </div>

            <div className="pt-4 border-t border-slate-900 text-[10px] text-slate-500 font-mono">
              <span>ADMIN: {profile.email}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Core Viewport Container */}
      <main id="app-viewport" className="flex-grow p-4 md:p-8 max-w-7xl mx-auto w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="h-full"
          >
            {activeTab === 'dashboard' && (
              <Dashboard 
                setActiveTab={setActiveTab} 
                onQuickMessage={handleQuickMessage}
              />
            )}
            {activeTab === 'assistant' && (
              <Assistant 
                quickPrompt={assistantQuickPrompt}
                clearQuickPrompt={() => setAssistantQuickPrompt('')}
              />
            )}
            {activeTab === 'finance' && <Finance />}
            {activeTab === 'sales' && <SalesCRM />}
            {activeTab === 'marketing' && <Marketing />}
            {activeTab === 'hrm' && <HRM />}
            {activeTab === 'documents' && <Documents />}
            {activeTab === 'analytics' && <Analytics />}
            {activeTab === 'profile' && <Profile />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Humble Footer */}
      <footer id="app-footer" className="mt-auto py-5 px-4 md:px-8 bg-slate-950 border-t border-slate-900 text-center text-[10px] text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          <span>© 2026 BizGenie AI – Your Intelligent Business Companion</span>
          <div className="flex gap-4">
            <span>Server Proxy Node: Active</span>
            <span>Region: Node-US-1</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
