import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, TrendingDown, HeartPulse, Sparkles, 
  ArrowUpRight, AlertCircle, Calendar, Plus, MessageSquare, 
  FileSpreadsheet, FileText, CheckCircle2, ChevronRight, UserPlus
} from 'lucide-react';
import { store } from '../lib/store';
import { Transaction, BusinessHealth, AppNotification, CalendarEvent } from '../types';
import { formatINR, CURRENCY_SYMBOL } from '../lib/utils';

interface DashboardProps {
  setActiveTab: (tab: string) => void;
  onQuickMessage?: (prompt: string) => void;
}

export default function Dashboard({ setActiveTab, onQuickMessage }: DashboardProps) {
  const [profile, setProfile] = useState(store.getProfile());
  const [transactions, setTransactions] = useState(store.getTransactions());
  const [health, setHealth] = useState(store.getHealth());
  const [notifications, setNotifications] = useState(store.getNotifications());
  const [events, setEvents] = useState(store.getEvents());

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setProfile(store.getProfile());
      setTransactions(store.getTransactions());
      setHealth(store.getHealth());
      setNotifications(store.getNotifications());
      setEvents(store.getEvents());
    });
    return unsubscribe;
  }, []);

  // Compute stats aggregates
  const incomeTransactions = transactions.filter(t => t.type === 'income');
  const expenseTransactions = transactions.filter(t => t.type === 'expense');
  const totalIncome = incomeTransactions.reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);
  const netBalance = totalIncome - totalExpense;
  const netMargin = totalIncome > 0 ? ((netBalance / totalIncome) * 100).toFixed(1) : '0.0';

  const unreadAlerts = notifications.filter(n => !n.read);

  // Trigger quick recommendations
  const handleRecommendationAction = (rec: any) => {
    if (onQuickMessage) {
      if (rec.id === 'rec-2') {
        onQuickMessage(`Algonquin Agency's payment of ₹32,000 is overdue. Draft a high-impact, polite but firm, collection notice reminder email.`);
      } else if (rec.id === 'rec-1') {
        onQuickMessage(`Provide a specialized breakdown of operational expense reduction strategies for my AWS cloud infrastructure spending which is increasing at 12% MoM.`);
      } else {
        onQuickMessage(`Let's talk about recommendation: "${rec.title}" for zenith tech solutions: ${rec.description}`);
      }
      setActiveTab('assistant');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/40 p-4 sm:p-6 rounded-2xl border border-slate-800/60">
        <div>
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <span className="text-[10px] sm:text-xs font-mono bg-violet-500/20 text-violet-300 py-0.5 sm:py-1 px-2 sm:px-2.5 rounded-full border border-violet-500/30 font-medium">
              Console v1.4
            </span>
            <span className="text-[10px] sm:text-xs font-mono bg-emerald-500/20 text-emerald-300 py-0.5 sm:py-1 px-2 sm:px-2.5 rounded-full border border-emerald-500/30 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              PRO ACTIVE
            </span>
            <span className="text-[10px] sm:text-xs font-mono bg-amber-500/20 text-amber-300 py-0.5 sm:py-1 px-2 sm:px-2.5 rounded-full border border-amber-500/30 font-medium">
              INR (₹)
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-white mt-2">
            Welcome back, {profile.name}
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Real-time insights for <strong className="text-slate-200">{profile.companyName}</strong> ({profile.industry})
          </p>
        </div>
        
        {/* Quick Action bar */}
        <div className="flex flex-wrap gap-2 sm:gap-2.5 w-full sm:w-auto">
          <button 
            id="quick-act-invoice"
            onClick={() => setActiveTab('finance')}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-violet-600 hover:bg-violet-500 text-white font-medium text-xs px-3.5 sm:px-4 py-2.5 rounded-xl shadow-lg shadow-violet-950/40 transition-all cursor-pointer min-h-[42px]"
          >
            <Plus className="w-4 h-4" />
            <span>Create Invoice</span>
          </button>
          <button 
            id="quick-act-crm"
            onClick={() => setActiveTab('sales')}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs px-3.5 sm:px-4 py-2.5 rounded-xl border border-slate-700 transition-all cursor-pointer min-h-[42px]"
          >
            <UserPlus className="w-4 h-4 text-violet-400" />
            <span>Add Lead</span>
          </button>
          <button 
            id="quick-act-document"
            onClick={() => setActiveTab('documents')}
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs px-3.5 sm:px-4 py-2.5 rounded-xl border border-slate-700 transition-all cursor-pointer min-h-[42px]"
          >
            <FileText className="w-4 h-4 text-emerald-400" />
            <span>Ingest Document</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Cash balance */}
        <div className="bg-slate-900/60 p-4 sm:p-5 rounded-2xl border border-slate-800/80 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[11px] sm:text-xs font-mono uppercase tracking-wider text-slate-400">Net Operating Profit</span>
            <div className="p-2 bg-violet-500/10 text-violet-400 rounded-xl border border-violet-500/20 font-bold text-sm font-display">
              ₹
            </div>
          </div>
          <div className="mt-3 sm:mt-4">
            <h3 className="text-xl sm:text-2xl font-display font-bold text-white">
              ₹{netBalance.toLocaleString('en-IN')}
            </h3>
            <div className="flex items-center gap-1 text-xs text-emerald-400 font-medium mt-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+15.4% YoY growth</span>
            </div>
          </div>
        </div>

        {/* Total Inflow */}
        <div className="bg-slate-900/60 p-4 sm:p-5 rounded-2xl border border-slate-800/80 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[11px] sm:text-xs font-mono uppercase tracking-wider text-slate-400">Total Income</span>
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 sm:mt-4">
            <h3 className="text-xl sm:text-2xl font-display font-bold text-white">
              ₹{totalIncome.toLocaleString('en-IN')}
            </h3>
            <span className="text-[11px] sm:text-xs text-slate-400 block mt-1">
              Accumulated revenue
            </span>
          </div>
        </div>

        {/* Total Outflow */}
        <div className="bg-slate-900/60 p-4 sm:p-5 rounded-2xl border border-slate-800/80 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[11px] sm:text-xs font-mono uppercase tracking-wider text-slate-400">Operating Expenses</span>
            <div className="p-2 bg-rose-500/10 text-rose-400 rounded-xl border border-rose-500/20">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 sm:mt-4">
            <h3 className="text-xl sm:text-2xl font-display font-bold text-white">
              ₹{totalExpense.toLocaleString('en-IN')}
            </h3>
            <span className="text-[11px] sm:text-xs text-slate-400 block mt-1">
              AWS bills, contractor payouts
            </span>
          </div>
        </div>

        {/* Profit margin */}
        <div className="bg-slate-900/60 p-4 sm:p-5 rounded-2xl border border-slate-800/80 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[11px] sm:text-xs font-mono uppercase tracking-wider text-slate-400">Net Profit Margin</span>
            <div className="p-2 bg-fuchsia-500/10 text-fuchsia-400 rounded-xl border border-fuchsia-500/20">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 sm:mt-4">
            <h3 className="text-xl sm:text-2xl font-display font-bold text-white">
              {netMargin}%
            </h3>
            <span className="text-[11px] sm:text-xs text-emerald-400 block mt-1 font-medium">
              Exceptional efficiency tier
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Health Indicator + AI Recommendations & Events */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Business Health and Runway Column */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-gradient-to-b from-slate-900 to-slate-950 p-6 rounded-2xl border border-slate-800/80 relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600/5 rounded-full blur-2xl" />
            
            <div className="flex items-center gap-2 mb-6">
              <HeartPulse className="w-5 h-5 text-violet-400" />
              <h2 className="text-lg font-display font-bold text-white">Genie Business Health</h2>
            </div>

            {/* Health Meter Radial representation */}
            <div className="flex flex-col items-center justify-center py-4">
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="72"
                    cy="72"
                    r="60"
                    className="stroke-slate-800 fill-none"
                    strokeWidth="10"
                  />
                  <circle
                    cx="72"
                    cy="72"
                    r="60"
                    className="stroke-violet-500 fill-none transition-all duration-1000 ease-out"
                    strokeWidth="10"
                    strokeDasharray={2 * Math.PI * 60}
                    strokeDashoffset={2 * Math.PI * 60 * (1 - health.score / 100)}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-4xl font-display font-extrabold text-white">
                    {health.score}
                  </span>
                  <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">
                    Score Index
                  </span>
                </div>
              </div>
              <span className="mt-4 text-xs font-semibold px-3 py-1 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20">
                Excellent Health Standing
              </span>
            </div>

            {/* Sub Health stats */}
            <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-800/60">
              <div className="text-center">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Capital Runway</span>
                <span className="text-lg font-display font-bold text-white block mt-0.5">{health.runwayMonths} Mos</span>
              </div>
              <div className="text-center">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Growth Rate MoM</span>
                <span className="text-lg font-display font-bold text-emerald-400 block mt-0.5">+{health.growthRate}%</span>
              </div>
            </div>
          </div>

          {/* Calendar Agenda Events */}
          <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800/80">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-400" />
                <h2 className="text-sm font-display font-semibold text-slate-200">Operational Agenda</h2>
              </div>
              <span className="text-[10px] font-mono bg-slate-800 px-2 py-0.5 rounded text-slate-400">
                {events.length} Upcoming
              </span>
            </div>
            
            <div className="space-y-3">
              {events.slice(0, 3).map((ev) => (
                <div key={ev.id} className="p-3 bg-slate-950/45 rounded-xl border border-slate-800/40 flex items-start justify-between">
                  <div>
                    <h4 className="text-xs font-semibold text-slate-200">{ev.title}</h4>
                    <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1.5">
                      <span>{ev.date}</span>
                      <span className="text-slate-600">•</span>
                      <span>{ev.time}</span>
                    </p>
                  </div>
                  <span className={`text-[9px] uppercase font-mono px-2 py-0.5 rounded ${
                    ev.category === 'deadline' ? 'bg-rose-500/15 text-rose-300 border border-rose-500/20' : 
                    ev.category === 'finance' ? 'bg-amber-500/15 text-amber-300 border border-amber-500/20' : 
                    'bg-emerald-500/15 text-emerald-300 border border-emerald-500/20'
                  }`}>
                    {ev.category}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Recommendations Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800/80 flex flex-col h-full">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-violet-400" />
                <h2 className="text-lg font-display font-bold text-white">Cognitive Advisor Recommendations</h2>
              </div>
              <span className="text-xs text-slate-400 flex items-center gap-1.5 bg-slate-800/80 px-3 py-1 rounded-full border border-slate-700/60 font-medium">
                <AlertCircle className="w-3.5 h-3.5 text-violet-400" />
                Gemini Grounded
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow">
              {health.recommendations.map((rec) => (
                <div 
                  key={rec.id} 
                  className="p-5 bg-slate-950/50 rounded-xl border border-slate-800/80 flex flex-col justify-between hover:border-violet-500/35 transition-all group"
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <span className={`text-[9px] uppercase font-mono px-2 py-0.5 rounded font-semibold ${
                        rec.priority === 'high' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                        rec.priority === 'medium' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                        'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      }`}>
                        {rec.priority} Priority
                      </span>
                      <span className="text-[10px] font-mono text-slate-500 uppercase">{rec.category}</span>
                    </div>
                    <h3 className="text-sm font-semibold text-white group-hover:text-violet-300 transition-colors">
                      {rec.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {rec.description}
                    </p>
                  </div>
                  
                  <button
                    id={`btn-dashboard-rec-${rec.id}`}
                    onClick={() => handleRecommendationAction(rec)}
                    className="mt-4 flex items-center justify-end gap-1 text-[11px] font-semibold text-violet-400 hover:text-violet-300 cursor-pointer self-end"
                  >
                    Resolve with Agent
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Recent transactions */}
      <div className="bg-slate-900/60 p-4 sm:p-6 rounded-2xl border border-slate-800/80">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-sm sm:text-base font-display font-semibold text-white">Recent Transactions</h2>
            <p className="text-[11px] sm:text-xs text-slate-400">Cash Flow Activity ledger (last 5 operations)</p>
          </div>
          <button 
            id="btn-dashboard-view-all-tx"
            onClick={() => setActiveTab('finance')}
            className="text-xs text-violet-400 font-semibold hover:text-violet-300 flex items-center gap-1 cursor-pointer p-1"
          >
            <span>Ledger</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile Card List for small screens (< sm) */}
        <div className="space-y-2.5 sm:hidden">
          {transactions.slice(0, 5).map((tx) => (
            <div key={tx.id} className="p-3 bg-slate-950/50 rounded-xl border border-slate-800/60 flex items-center justify-between">
              <div className="overflow-hidden pr-2">
                <h4 className="text-xs font-semibold text-white truncate">{tx.description}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] font-mono text-slate-400">{tx.date}</span>
                  <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-semibold ${
                    tx.type === 'income' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                  }`}>
                    {tx.category}
                  </span>
                </div>
              </div>
              <div className={`text-xs font-display font-bold shrink-0 ${
                tx.type === 'income' ? 'text-emerald-400' : 'text-slate-100'
              }`}>
                {tx.type === 'income' ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN')}
              </div>
            </div>
          ))}
        </div>

        {/* Table for Tablet & Desktop */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                <th className="pb-3 font-semibold">Date</th>
                <th className="pb-3 font-semibold">Description</th>
                <th className="pb-3 font-semibold">Category</th>
                <th className="pb-3 font-semibold">Type</th>
                <th className="pb-3 font-semibold text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 text-xs">
              {transactions.slice(0, 5).map((tx) => (
                <tr key={tx.id} className="text-slate-300 hover:bg-slate-900/20 transition-all">
                  <td className="py-3 font-mono text-slate-400 whitespace-nowrap">{tx.date}</td>
                  <td className="py-3 font-semibold text-white">{tx.description}</td>
                  <td className="py-3 text-slate-400">{tx.category}</td>
                  <td className="py-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-mono text-[10px] font-semibold ${
                      tx.type === 'income' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 
                      'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}>
                      {tx.type === 'income' ? 'INFLOW' : 'OUTFLOW'}
                    </span>
                  </td>
                  <td className={`py-3 text-right font-display font-bold whitespace-nowrap ${
                    tx.type === 'income' ? 'text-emerald-400' : 'text-slate-100'
                  }`}>
                    {tx.type === 'income' ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
