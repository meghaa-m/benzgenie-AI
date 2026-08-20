import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, Plus, Mail, Phone, Building, MessageSquare, ChevronRight, 
  TrendingUp, ShoppingBag, CheckCircle, Search, UserCheck, AlertCircle
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid 
} from 'recharts';
import { store } from '../lib/store';
import { Customer, Order } from '../types';

export default function SalesCRM() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState('');

  // Add Customer Form states
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [custName, setCustName] = useState('');
  const [custEmail, setCustEmail] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [custCompany, setCustCompany] = useState('');
  const [custStatus, setCustStatus] = useState<'lead' | 'contacted' | 'customer'>('lead');
  const [custNotes, setCustNotes] = useState('');

  // Add Order Form states
  const [showAddOrder, setShowAddOrder] = useState(false);
  const [selectedCustId, setSelectedCustId] = useState('');
  const [orderProduct, setOrderProduct] = useState('Workflow Automation Setup');
  const [orderAmount, setOrderAmount] = useState('');

  useEffect(() => {
    setCustomers(store.getCustomers());
    setOrders(store.getOrders());

    const unsubscribe = store.subscribe(() => {
      setCustomers(store.getCustomers());
      setOrders(store.getOrders());
    });
    return unsubscribe;
  }, []);

  const handleAddCustomerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!custName || !custEmail || !custCompany) return;

    store.addCustomer({
      name: custName,
      email: custEmail,
      phone: custPhone,
      company: custCompany,
      status: custStatus,
      notes: custNotes
    });

    // Reset Form
    setCustName('');
    setCustEmail('');
    setCustPhone('');
    setCustCompany('');
    setCustStatus('lead');
    setCustNotes('');
    setShowAddCustomer(false);
  };

  const handleAddOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustId || !orderAmount) return;

    const customer = customers.find(c => c.id === selectedCustId);
    if (!customer) return;

    store.addOrder({
      customerId: selectedCustId,
      customerName: customer.name,
      product: orderProduct,
      amount: parseFloat(orderAmount),
      status: 'completed' // Immediate complete
    });

    // Reset Form
    setSelectedCustId('');
    setOrderAmount('');
    setShowAddOrder(false);
  };

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.company.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  // Sales Forecasting Chart Data representing AI-predicted sales path in INR
  const forecastData = [
    { name: 'Jan', Sales: 180000, Projected: 180000 },
    { name: 'Feb', Sales: 245000, Projected: 245000 },
    { name: 'Mar', Sales: 310000, Projected: 310000 },
    { name: 'Apr', Sales: 280000, Projected: 280000 },
    { name: 'May', Sales: 340000, Projected: 340000 },
    { name: 'Jun', Sales: 420000, Projected: 420000 },
    { name: 'Jul', Sales: 495000, Projected: 495000 }, // Current month
    { name: 'Aug', Projected: 560000 }, // Forecast
    { name: 'Sep', Projected: 615000 },
    { name: 'Oct', Projected: 680000 },
    { name: 'Nov', Projected: 730000 },
    { name: 'Dec', Projected: 820000 }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-4 sm:space-y-6"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 bg-slate-900/40 p-4 sm:p-5 rounded-2xl border border-slate-800/60">
        <div>
          <h1 className="text-lg sm:text-xl font-display font-bold text-white">Sales & Customer Relations</h1>
          <p className="text-[11px] sm:text-xs text-slate-400">Track prospective leads, execute completed orders, and analyze AI sales projections</p>
        </div>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <button
            id="btn-crm-add-customer"
            onClick={() => setShowAddCustomer(true)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-violet-600 hover:bg-violet-500 text-white font-medium text-xs px-3.5 sm:px-4 py-2.5 rounded-xl shadow-lg cursor-pointer min-h-[42px]"
          >
            <Plus className="w-4 h-4" />
            <span>Add Lead</span>
          </button>
          <button
            id="btn-crm-create-order"
            onClick={() => setShowAddOrder(true)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs px-3.5 sm:px-4 py-2.5 rounded-xl border border-slate-700 cursor-pointer min-h-[42px]"
          >
            <ShoppingBag className="w-4 h-4 text-emerald-400" />
            <span>Log Sale</span>
          </button>
        </div>
      </div>

      {/* Grid: CRM Directory + Sales Forecasting */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        
        {/* CRM Leads directory (wider) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-900/60 p-4 sm:p-5 rounded-2xl border border-slate-800/80">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 sm:mb-5">
              <h2 className="text-xs sm:text-sm font-semibold text-slate-200">Customer & Leads Directory</h2>
              
              {/* Search bar */}
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <input
                  id="input-crm-search"
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search leads, name, company..."
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-2 pl-9 pr-4 text-xs focus:outline-none focus:border-violet-500 min-h-[38px]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 max-h-[500px] overflow-y-auto pr-1">
              {filteredCustomers.map((cust) => (
                <div key={cust.id} className="p-3.5 sm:p-4 bg-slate-950/45 rounded-xl border border-slate-800 hover:border-violet-500/35 transition-all flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="text-xs sm:text-sm font-bold text-white truncate">{cust.name}</h3>
                      <span className={`text-[9px] uppercase font-mono px-2 py-0.5 rounded shrink-0 font-semibold ${
                        cust.status === 'customer' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' : 
                        cust.status === 'contacted' ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20' : 
                        'bg-blue-500/15 text-blue-300 border border-blue-500/20'
                      }`}>
                        {cust.status}
                      </span>
                    </div>

                    <div className="space-y-1 text-[11px] text-slate-400">
                      <p className="flex items-center gap-1.5">
                        <Building className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span className="truncate">{cust.company}</span>
                      </p>
                      <p className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span className="truncate">{cust.email}</span>
                      </p>
                      {cust.phone && (
                        <p className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          <span>{cust.phone}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {cust.notes && (
                    <p className="text-[10px] text-slate-500 italic mt-2.5 bg-slate-900/30 p-2 rounded border border-slate-800/40">
                      "{cust.notes}"
                    </p>
                  )}

                  <div className="mt-3.5 pt-2.5 border-t border-slate-800/40 flex justify-between items-center text-[10px] font-mono">
                    <span className="text-slate-500 text-[9px] truncate max-w-[130px] sm:max-w-none">{cust.lastInteraction}</span>
                    <button
                      id={`btn-crm-toggle-status-${cust.id}`}
                      onClick={() => {
                        const nextStatus = cust.status === 'lead' ? 'contacted' : cust.status === 'contacted' ? 'customer' : 'lead';
                        store.updateCustomerStatus(cust.id, nextStatus);
                      }}
                      className="text-violet-400 hover:text-violet-300 font-semibold cursor-pointer px-2 py-1 rounded bg-violet-500/10 border border-violet-500/20 min-h-[30px] flex items-center"
                    >
                      Cycle Status
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right side: Sales Forecasting and Orders ledger */}
        <div className="space-y-4 sm:space-y-6">
          
          {/* Recharts Projections */}
          <div className="bg-slate-900/60 p-4 sm:p-5 rounded-2xl border border-slate-800/80">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h2 className="text-xs font-semibold text-slate-200">AI-Powered Sales Forecast</h2>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 py-0.5 px-2 rounded-full border border-emerald-500/20 font-mono font-bold">
                +18.5% Growth
              </span>
            </div>

            <div className="h-40 sm:h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={forecastData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorProjected" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ec4899" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#475569" fontSize={9} tickLine={false} />
                  <YAxis 
                    stroke="#475569" 
                    fontSize={9} 
                    tickLine={false} 
                    tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`} 
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }} 
                    labelStyle={{ color: '#94a3b8', fontSize: '10px' }}
                    itemStyle={{ color: '#fff', fontSize: '10px' }}
                    formatter={(value: any) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Revenue']}
                  />
                  <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" vertical={false} />
                  <Area type="monotone" dataKey="Sales" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#colorSales)" />
                  <Area type="monotone" dataKey="Projected" stroke="#ec4899" strokeWidth={1.5} strokeDasharray="3 3" fillOpacity={1} fill="url(#colorProjected)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-3 flex items-center gap-1.5 p-2 bg-slate-950/65 rounded-xl border border-slate-800/80 text-[10px] text-slate-400 leading-normal">
              <AlertCircle className="w-4 h-4 text-violet-400 shrink-0" />
              <span>Gemini projection anticipates increased contract conversion from August.</span>
            </div>
          </div>

          {/* Orders ledger list */}
          <div className="bg-slate-900/60 p-4 sm:p-5 rounded-2xl border border-slate-800/80">
            <h2 className="text-xs sm:text-sm font-semibold text-slate-200 mb-3 sm:mb-4 font-display">Sales Orders Ledger</h2>
            
            <div className="space-y-2.5 sm:space-y-3">
              {orders.slice(0, 4).map((o) => (
                <div key={o.id} className="p-3 bg-slate-950/45 rounded-xl border border-slate-800 flex justify-between items-center">
                  <div className="overflow-hidden pr-2">
                    <h4 className="text-xs font-semibold text-white truncate max-w-[130px] sm:max-w-[160px]">{o.product}</h4>
                    <span className="text-[10px] text-slate-400 mt-0.5 block truncate">{o.customerName}</span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold text-emerald-400 block">+₹{o.amount.toLocaleString('en-IN')}</span>
                    <span className="text-[9px] text-slate-500 font-mono block mt-0.5">{o.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CRM Add Customer Modal */}
      <AnimatePresence>
        {showAddCustomer && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-slate-800/85 w-full max-w-md rounded-2xl p-4 sm:p-6 shadow-2xl max-h-[92vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center pb-3 sm:pb-4 border-b border-slate-800/60 mb-4 sm:mb-6">
                <h2 className="text-sm sm:text-base font-display font-bold text-white">Register Prospective Lead</h2>
                <button 
                  id="btn-close-crm-add-customer"
                  onClick={() => setShowAddCustomer(false)}
                  className="text-slate-400 hover:text-white font-bold cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center text-xl"
                  aria-label="Close"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleAddCustomerSubmit} className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1.5">Contact Name</label>
                  <input 
                    id="input-crm-name"
                    type="text"
                    required
                    value={custName}
                    onChange={(e) => setCustName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3 text-white text-xs sm:text-sm focus:outline-none focus:border-violet-500 min-h-[42px]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1.5">Company</label>
                    <input 
                      id="input-crm-company"
                      type="text"
                      required
                      value={custCompany}
                      onChange={(e) => setCustCompany(e.target.value)}
                      placeholder="e.g. Innovate India Tech"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3 text-white text-xs sm:text-sm focus:outline-none focus:border-violet-500 min-h-[42px]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1.5">Lead Status</label>
                    <select
                      id="select-crm-status"
                      value={custStatus}
                      onChange={(e: any) => setCustStatus(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3 text-white text-xs sm:text-sm focus:outline-none focus:border-violet-500 min-h-[42px]"
                    >
                      <option value="lead">New Lead</option>
                      <option value="contacted">Contacted</option>
                      <option value="customer">Customer</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1.5">Email</label>
                    <input 
                      id="input-crm-email"
                      type="email"
                      required
                      value={custEmail}
                      onChange={(e) => setCustEmail(e.target.value)}
                      placeholder="e.g. rahul@domain.in"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3 text-white text-xs sm:text-sm focus:outline-none focus:border-violet-500 min-h-[42px]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1.5">Phone Number</label>
                    <input 
                      id="input-crm-phone"
                      type="text"
                      value={custPhone}
                      onChange={(e) => setCustPhone(e.target.value)}
                      placeholder="e.g. +91 98765 43210"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3 text-white text-xs sm:text-sm focus:outline-none focus:border-violet-500 min-h-[42px]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1.5">Internal Notes / Context</label>
                  <textarea 
                    id="input-crm-notes"
                    value={custNotes}
                    onChange={(e) => setCustNotes(e.target.value)}
                    placeholder="Specific requests, initial budget size in INR, etc."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3 text-white text-xs sm:text-sm h-20 focus:outline-none focus:border-violet-500"
                  />
                </div>

                <button
                  id="btn-crm-add-submit"
                  type="submit"
                  className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition-all cursor-pointer min-h-[44px]"
                >
                  Create Lead Card
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Log Order Modal */}
      <AnimatePresence>
        {showAddOrder && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-slate-800/85 w-full max-w-md rounded-2xl p-4 sm:p-6 shadow-2xl max-h-[92vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center pb-3 sm:pb-4 border-b border-slate-800/60 mb-4 sm:mb-6">
                <h2 className="text-sm sm:text-base font-display font-bold text-white">Log Completed Order</h2>
                <button 
                  id="btn-close-crm-add-order"
                  onClick={() => setShowAddOrder(false)}
                  className="text-slate-400 hover:text-white font-bold cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center text-xl"
                  aria-label="Close"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleAddOrderSubmit} className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1.5">Select Client / Customer</label>
                  <select
                    id="select-crm-order-customer"
                    required
                    value={selectedCustId}
                    onChange={(e) => setSelectedCustId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3 text-white text-xs sm:text-sm focus:outline-none focus:border-violet-500 min-h-[42px]"
                  >
                    <option value="">Select a Customer...</option>
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>{c.name} ({c.company})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1.5">Product / SLA Deliverable</label>
                  <input 
                    id="input-crm-order-product"
                    type="text"
                    required
                    value={orderProduct}
                    onChange={(e) => setOrderProduct(e.target.value)}
                    placeholder="e.g. Generative Pipeline integration"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3 text-white text-xs sm:text-sm focus:outline-none focus:border-violet-500 min-h-[42px]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1.5">Contract Amount (INR - ₹)</label>
                  <input 
                    id="input-crm-order-amount"
                    type="number"
                    required
                    value={orderAmount}
                    onChange={(e) => setOrderAmount(e.target.value)}
                    placeholder="e.g. 125000"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3 text-white text-xs sm:text-sm focus:outline-none focus:border-violet-500 min-h-[42px]"
                  />
                </div>

                <button
                  id="btn-crm-order-submit"
                  type="submit"
                  className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition-all cursor-pointer min-h-[44px]"
                >
                  Log Order & Cash
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
