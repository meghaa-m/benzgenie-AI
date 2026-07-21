import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, TrendingDown, DollarSign, PieChart as PieIcon, 
  Sparkles, Calendar, Activity, RefreshCw, AlertCircle
} from 'lucide-react';
import { 
  ResponsiveContainer, BarChart, Bar, AreaChart, Area, XAxis, YAxis, 
  Tooltip, CartesianGrid, Legend, Cell, RadarChart, PolarGrid, PolarAngleAxis, Radar
} from 'recharts';
import { store } from '../lib/store';

export default function Analytics() {
  const [transactions, setTransactions] = useState(store.getTransactions());
  const [health, setHealth] = useState(store.getHealth());

  useEffect(() => {
    setTransactions(store.getTransactions());
    setHealth(store.getHealth());

    const unsubscribe = store.subscribe(() => {
      setTransactions(store.getTransactions());
      setHealth(store.getHealth());
    });
    return unsubscribe;
  }, []);

  // Prepare monthly aggregate datasets
  const cashflowTrendData = [
    { month: 'Jan', Inflow: 24000, Outflow: 12000, Balance: 12000 },
    { month: 'Feb', Inflow: 28500, Outflow: 14500, Balance: 26000 },
    { month: 'Mar', Inflow: 32000, Outflow: 16000, Balance: 42000 },
    { month: 'Apr', Inflow: 29000, Outflow: 18500, Balance: 52500 },
    { month: 'May', Inflow: 38000, Outflow: 19000, Balance: 71500 },
    { month: 'Jun', Inflow: 45000, Outflow: 22000, Balance: 94500 },
    { month: 'Jul', Inflow: 52000, Outflow: 24500, Balance: 122000 }
  ];

  // Category expense distribution
  const expenseBreakdown = [
    { name: 'SaaS & AWS Infrastructure', value: 8500, color: '#8b5cf6' },
    { name: 'Contractor Salaries', value: 12000, color: '#a78bfa' },
    { name: 'Corporate Events & Perks', value: 2500, color: '#ec4899' },
    { name: 'Operational Logistics', value: 1500, color: '#f43f5e' }
  ];

  // Radar metric assessment for SaaS health metrics
  const radarData = [
    { subject: 'Cash Runway', A: 90, fullMark: 100 },
    { subject: 'SaaS Traction', A: 82, fullMark: 100 },
    { subject: 'Conversion Rate', A: 75, fullMark: 100 },
    { subject: 'Marketing Reach', A: 68, fullMark: 100 },
    { subject: 'Customer Lifetime Value', A: 85, fullMark: 100 }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-800/60">
        <h1 className="text-xl font-display font-bold text-white">BizGenie Cognitive FinOps Analytics</h1>
        <p className="text-xs text-slate-400">Deep mathematical analysis of cache-balances, AWS expense clusters, and forecast trajectories</p>
      </div>

      {/* Row 1: Flow comparison (Barchart) + Category distributions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Inflow vs Outflow comparison */}
        <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800/80">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-sm font-semibold text-slate-200">Capital Cash Inflow vs Outflow</h2>
              <span className="text-[10px] text-slate-400">Aggregated monthly corporate cash flow velocity</span>
            </div>
            <div className="flex gap-4 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2.5 h-2.5 rounded bg-emerald-500" />
                Inflow
              </span>
              <span className="flex items-center gap-1.5 text-rose-400">
                <span className="w-2.5 h-2.5 rounded bg-rose-500" />
                Outflow
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cashflowTrendData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <XAxis dataKey="month" stroke="#475569" fontSize={9} tickLine={false} />
                <YAxis stroke="#475569" fontSize={9} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                  labelStyle={{ color: '#94a3b8', fontSize: '10px' }}
                  itemStyle={{ fontSize: '10px' }}
                />
                <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" vertical={false} />
                <Bar dataKey="Inflow" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Outflow" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Operating Balance Runway over time */}
        <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800/80">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-sm font-semibold text-slate-200">Cumulative Net Working Capital</h2>
              <span className="text-[10px] text-slate-400">Historical curve of net corporate cash bank deposits</span>
            </div>
            <span className="text-xs font-mono text-violet-400 bg-violet-500/10 border border-violet-500/20 py-0.5 px-2 rounded-full">
              Runway: {health.runwayMonths} mos
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={cashflowTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="balanceGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.35}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#475569" fontSize={9} tickLine={false} />
                <YAxis stroke="#475569" fontSize={9} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                  labelStyle={{ color: '#94a3b8', fontSize: '10px' }}
                  itemStyle={{ color: '#8b5cf6', fontSize: '10px' }}
                />
                <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" vertical={false} />
                <Area type="monotone" dataKey="Balance" stroke="#8b5cf6" strokeWidth={2.5} fillOpacity={1} fill="url(#balanceGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 2: Expense category breakdown (Horizontal Bars) & Radar metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Expense Category distribution bars (7cols) */}
        <div className="lg:col-span-7 bg-slate-900/60 p-5 rounded-2xl border border-slate-800/80 space-y-4">
          <div>
            <h2 className="text-sm font-semibold text-slate-200">Operational Spending Distribution</h2>
            <span className="text-[10px] text-slate-400">Structural allocations of operating expenses</span>
          </div>

          <div className="space-y-3.5">
            {expenseBreakdown.map((item, idx) => {
              const totalExp = expenseBreakdown.reduce((sum, item) => sum + item.value, 0);
              const pct = Math.round((item.value / totalExp) * 100);
              return (
                <div key={idx} className="p-3.5 bg-slate-950/45 rounded-xl border border-slate-800/60 flex items-center justify-between">
                  <div className="flex-grow space-y-1.5 mr-6">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-slate-300 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                        {item.name}
                      </span>
                      <span className="font-mono text-slate-400">${item.value.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: item.color }} />
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-white shrink-0 bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-800/60">
                    {pct}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Corporate Performance index radar chart (5cols) */}
        <div className="lg:col-span-5 bg-slate-900/60 p-5 rounded-2xl border border-slate-800/80 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-200">SaaS Health Competency Index</h2>
            <span className="text-[10px] text-slate-400">Radar vectors comparing baseline benchmarks</span>
          </div>

          <div className="h-56 w-full flex items-center justify-center mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                <PolarGrid stroke="#1e293b" />
                <PolarAngleAxis dataKey="subject" stroke="#64748b" fontSize={8} />
                <Radar name="Zenith Solutions" dataKey="A" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.2} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                  itemStyle={{ fontSize: '10px', color: '#8b5cf6' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
