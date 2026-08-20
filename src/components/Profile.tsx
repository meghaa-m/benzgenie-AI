import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  User, Building, Landmark, ShieldAlert, Sparkles, Check, 
  CreditCard, Bell, Save, Mail, ShieldCheck, HeartPulse
} from 'lucide-react';
import { store } from '../lib/store';
import { UserProfile } from '../types';

export default function Profile() {
  const [profile, setProfile] = useState<UserProfile>(store.getProfile());
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('');

  // Local notification configs
  const [notifyBudget, setNotifyBudget] = useState(true);
  const [notifyInvoices, setNotifyInvoices] = useState(true);
  const [notifySla, setNotifySla] = useState(false);

  // Active pricing tier
  const [activeTier, setActiveTier] = useState<'free' | 'growth' | 'enterprise'>('growth');

  useEffect(() => {
    const current = store.getProfile();
    setProfile(current);
    setName(current.name);
    setCompanyName(current.companyName);
    setIndustry(current.industry);
  }, []);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !companyName) return;

    store.updateProfile({
      ...profile,
      name,
      companyName,
      industry
    });

    alert("Corporate Profile changes saved successfully!");
  };

  const handleSelectTier = (tier: 'free' | 'growth' | 'enterprise') => {
    setActiveTier(tier);
    alert(`Subscribed to the BizGenie AI ${tier.toUpperCase()} tier!`);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-4 sm:space-y-6"
    >
      <div className="bg-slate-900/40 p-4 sm:p-5 rounded-2xl border border-slate-800/60">
        <h1 className="text-lg sm:text-xl font-display font-bold text-white">Console Settings & Subscription Portal</h1>
        <p className="text-[11px] sm:text-xs text-slate-400">Configure corporate identifiers, fine-tune notification preferences, and toggle licensing tiers</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        
        {/* Profile/Company configuration (2cols) */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          <form onSubmit={handleSaveProfile} className="bg-slate-900/60 p-4 sm:p-5 rounded-2xl border border-slate-800/80 space-y-3.5 sm:space-y-4">
            <div className="flex items-center gap-2 pb-2.5 border-b border-slate-800/60">
              <Building className="w-5 h-5 text-violet-400 shrink-0" />
              <h2 className="text-xs sm:text-sm font-semibold text-slate-200">Corporate Details</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1.5 flex items-center gap-1">
                  <User className="w-3 h-3 text-violet-400" /> Personal Name
                </label>
                <input 
                  id="input-prof-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3 text-white text-xs sm:text-sm focus:outline-none focus:border-violet-500 min-h-[42px]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1.5 flex items-center gap-1">
                  <Building className="w-3 h-3 text-violet-400" /> Company Name
                </label>
                <input 
                  id="input-prof-company"
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3 text-white text-xs sm:text-sm focus:outline-none focus:border-violet-500 min-h-[42px]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1.5 flex items-center gap-1">
                  <Landmark className="w-3 h-3 text-violet-400" /> Industry Vertical
                </label>
                <input 
                  id="input-prof-industry"
                  type="text"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3 text-white text-xs sm:text-sm focus:outline-none focus:border-violet-500 min-h-[42px]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1.5 flex items-center gap-1">
                  <Mail className="w-3 h-3 text-violet-400" /> Admin Email
                </label>
                <input 
                  id="input-prof-email"
                  type="email"
                  disabled
                  value={profile.email}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3 text-slate-500 text-xs sm:text-sm focus:outline-none min-h-[42px]"
                />
              </div>
            </div>

            <button
              id="btn-prof-save"
              type="submit"
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs px-5 py-2.5 rounded-xl transition-all cursor-pointer shadow-lg shadow-violet-950/25 min-h-[42px]"
            >
              <Save className="w-4 h-4" />
              <span>Save Operational Profiles</span>
            </button>
          </form>

          {/* Pricing tiers list models */}
          <div className="bg-slate-900/60 p-4 sm:p-5 rounded-2xl border border-slate-800/80">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800/60 mb-4 sm:mb-5">
              <CreditCard className="w-5 h-5 text-violet-400 shrink-0" />
              <div>
                <h2 className="text-xs sm:text-sm font-semibold text-slate-200">BizGenie AI Subscriptions</h2>
                <p className="text-[10px] text-slate-400">Scale cognitive computing quotas based on transaction volume</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-4">
              {[
                { id: 'free', title: 'Standard Core', price: '₹0', desc: 'SaaS ledger, local models simulation', features: ['Durable storage', 'Local database seed'] },
                { id: 'growth', title: 'Genie Growth', price: '₹3,999/mo', desc: 'High-speed server-side Gemini quotas', features: ['AI Resume Screening', 'Campaign writers', 'OCR document parsers'] },
                { id: 'enterprise', title: 'Sovereign Pro', price: '₹15,999/mo', desc: 'Enterprise SLAs, custom grounding', features: ['Unlimited token buffers', 'Dedicated advisory agents'] }
              ].map((tier) => (
                <div 
                  key={tier.id} 
                  className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                    activeTier === tier.id 
                      ? 'bg-violet-600/10 border-violet-500 shadow-xl' 
                      : 'bg-slate-950 border-slate-800/80'
                  }`}
                >
                  <div className="space-y-3">
                    <div>
                      <span className="text-[9px] uppercase font-mono text-slate-400 tracking-wider font-bold">{tier.title}</span>
                      <h3 className="text-lg sm:text-xl font-display font-extrabold text-white mt-1">{tier.price}</h3>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-normal">{tier.desc}</p>
                    <ul className="space-y-1">
                      {tier.features.map((f, i) => (
                        <li key={i} className="text-[10px] text-slate-300 flex items-center gap-1.5">
                          <Check className="w-3 h-3 text-violet-400 shrink-0" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    id={`btn-tier-select-${tier.id}`}
                    onClick={() => handleSelectTier(tier.id as any)}
                    className={`w-full text-center py-2.5 rounded-lg font-semibold text-[11px] mt-4 transition-all cursor-pointer min-h-[38px] ${
                      activeTier === tier.id 
                        ? 'bg-violet-600 text-white hover:bg-violet-500' 
                        : 'bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    {activeTier === tier.id ? 'Active License' : 'Activate Plan'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Notifications & System state column (1col) */}
        <div className="space-y-4 sm:space-y-6">
          
          {/* Notification toggles */}
          <div className="bg-slate-900/60 p-4 sm:p-5 rounded-2xl border border-slate-800/80 space-y-3.5 sm:space-y-4">
            <div className="flex items-center gap-2 pb-2.5 border-b border-slate-800/60">
              <Bell className="w-4.5 h-4.5 text-violet-400 shrink-0" />
              <h2 className="text-xs sm:text-sm font-semibold text-slate-200">Alert Center Controls</h2>
            </div>

            <div className="space-y-2.5 sm:space-y-3 text-xs">
              <label className="flex items-start gap-3 p-3 sm:p-2.5 bg-slate-950/45 rounded-xl border border-slate-800/60 cursor-pointer min-h-[44px]">
                <input 
                  id="checkbox-notify-budget"
                  type="checkbox"
                  checked={notifyBudget}
                  onChange={(e) => setNotifyBudget(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-slate-800 text-violet-600 focus:ring-violet-500 bg-slate-950 cursor-pointer"
                />
                <div>
                  <span className="font-semibold text-slate-200 block text-xs">Monthly Budget Alarms</span>
                  <span className="text-[10px] text-slate-500">Trigger warnings when allocation exceeds 80% quota limits</span>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 sm:p-2.5 bg-slate-950/45 rounded-xl border border-slate-800/60 cursor-pointer min-h-[44px]">
                <input 
                  id="checkbox-notify-invoices"
                  type="checkbox"
                  checked={notifyInvoices}
                  onChange={(e) => setNotifyInvoices(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-slate-800 text-violet-600 focus:ring-violet-500 bg-slate-950 cursor-pointer"
                />
                <div>
                  <span className="font-semibold text-slate-200 block text-xs">Overdue Invoices reminders</span>
                  <span className="text-[10px] text-slate-500">Signal alerts for pending consulting invoices after due terms</span>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 sm:p-2.5 bg-slate-950/45 rounded-xl border border-slate-800/60 cursor-pointer min-h-[44px]">
                <input 
                  id="checkbox-notify-sla"
                  type="checkbox"
                  checked={notifySla}
                  onChange={(e) => setNotifySla(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-slate-800 text-violet-600 focus:ring-violet-500 bg-slate-950 cursor-pointer"
                />
                <div>
                  <span className="font-semibold text-slate-200 block text-xs">Lead Status Updates</span>
                  <span className="text-[10px] text-slate-500">Log notification cards upon CRM stage promotions</span>
                </div>
              </label>
            </div>
          </div>

          {/* Environmental parameters status cards */}
          <div className="bg-slate-900/60 p-4 sm:p-5 rounded-2xl border border-slate-800/80">
            <h2 className="text-xs font-semibold text-slate-200 mb-3 uppercase font-mono tracking-wider">Device Integration parameters</h2>
            
            <div className="space-y-2.5 sm:space-y-3 text-xs text-slate-300">
              <div className="flex justify-between items-center p-2.5 bg-slate-950/45 rounded-xl border border-slate-800/60">
                <span className="text-slate-400">Microphone Access</span>
                <span className="text-emerald-400 font-mono font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> GRANTED
                </span>
              </div>
              <div className="flex justify-between items-center p-2.5 bg-slate-950/45 rounded-xl border border-slate-800/60">
                <span className="text-slate-400">System Audio</span>
                <span className="text-emerald-400 font-mono font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> ENABLED
                </span>
              </div>
              <div className="flex justify-between items-center p-2.5 bg-slate-950/45 rounded-xl border border-slate-800/60">
                <span className="text-slate-400">Platform Frame</span>
                <span className="text-violet-400 font-mono font-semibold">React Cloud Container</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
