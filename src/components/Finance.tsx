import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  TrendingUp, TrendingDown, DollarSign, Plus, Trash2, Calendar, 
  Layers, ShoppingBag, FileText, Check, Sparkles, Download, Printer, AlertTriangle
} from 'lucide-react';
import { store } from '../lib/store';
import { Transaction, Budget, Invoice, InvoiceItem } from '../types';

export default function Finance() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  // Form states
  const [showAddTx, setShowAddTx] = useState(false);
  const [txDesc, setTxDesc] = useState('');
  const [txType, setTxType] = useState<'income' | 'expense'>('income');
  const [txAmount, setTxAmount] = useState('');
  const [txCategory, setTxCategory] = useState('Consulting');

  // Invoice creator states
  const [showInvoiceCreator, setShowInvoiceCreator] = useState(false);
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([{ description: '', quantity: 1, unitPrice: 0, amount: 0 }]);
  const [activeInvoicePreview, setActiveInvoicePreview] = useState<Invoice | null>(null);

  useEffect(() => {
    setTransactions(store.getTransactions());
    setBudgets(store.getBudgets());
    setInvoices(store.getInvoices());

    const unsubscribe = store.subscribe(() => {
      setTransactions(store.getTransactions());
      setBudgets(store.getBudgets());
      setInvoices(store.getInvoices());
    });
    return unsubscribe;
  }, []);

  const handleAddTransactionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!txDesc || !txAmount) return;

    store.addTransaction({
      date: new Date().toISOString().split('T')[0],
      description: txDesc,
      type: txType,
      amount: parseFloat(txAmount),
      category: txCategory
    });

    // Reset Form
    setTxDesc('');
    setTxAmount('');
    setTxCategory('Consulting');
    setShowAddTx(false);
  };

  const handleDeleteTransaction = (id: string) => {
    if (confirm("Are you sure you want to delete this transaction from the ledger?")) {
      store.deleteTransaction(id);
    }
  };

  const handleAddInvoiceItem = () => {
    setInvoiceItems(prev => [...prev, { description: '', quantity: 1, unitPrice: 0, amount: 0 }]);
  };

  const handleInvoiceItemChange = (index: number, field: keyof InvoiceItem, value: any) => {
    const updated = [...invoiceItems];
    updated[index] = { ...updated[index], [field]: value };
    
    // Auto-compute item total
    if (field === 'quantity' || field === 'unitPrice') {
      const q = field === 'quantity' ? value : updated[index].quantity;
      const p = field === 'unitPrice' ? value : updated[index].unitPrice;
      updated[index].amount = q * p;
    }
    setInvoiceItems(updated);
  };

  const handleRemoveInvoiceItem = (index: number) => {
    setInvoiceItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleGenerateInvoiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientEmail || !dueDate) {
      alert("Please fill in client details and due date.");
      return;
    }

    const totalAmount = invoiceItems.reduce((sum, item) => sum + item.amount, 0);
    const invoiceNo = `INV-2026-00${invoices.length + 1}`;
    
    const newInvoice: Invoice = {
      id: `inv-${Date.now()}`,
      invoiceNo,
      clientName,
      clientEmail,
      amount: totalAmount,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate,
      status: 'pending',
      items: invoiceItems
    };

    store.addInvoice(newInvoice);

    // Reset creator states
    setClientName('');
    setClientEmail('');
    setDueDate('');
    setInvoiceItems([{ description: '', quantity: 1, unitPrice: 0, amount: 0 }]);
    setShowInvoiceCreator(false);
    
    // Set for direct preview modal
    setActiveInvoicePreview(newInvoice);
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-4 sm:space-y-6"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 bg-slate-900/40 p-4 sm:p-5 rounded-2xl border border-slate-800/60">
        <div>
          <h1 className="text-lg sm:text-xl font-display font-bold text-white">BizGenie Capital Suite</h1>
          <p className="text-[11px] sm:text-xs text-slate-400">Manage invoices, allocate expense budgets, and audit cash ledger records</p>
        </div>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <button
            id="btn-trigger-add-tx"
            onClick={() => setShowAddTx(true)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs px-3.5 sm:px-4 py-2.5 rounded-xl border border-slate-700 cursor-pointer min-h-[42px]"
          >
            <Plus className="w-4 h-4 text-violet-400" />
            <span>Add Transaction</span>
          </button>
          <button
            id="btn-trigger-create-invoice"
            onClick={() => setShowInvoiceCreator(true)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-violet-600 hover:bg-violet-500 text-white font-medium text-xs px-3.5 sm:px-4 py-2.5 rounded-xl shadow-lg transition-all cursor-pointer min-h-[42px]"
          >
            <Sparkles className="w-4 h-4" />
            <span>Create Invoice</span>
          </button>
        </div>
      </div>

      {/* Grid: Ledger + Budgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        
        {/* Ledger column (larger) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-900/60 p-4 sm:p-5 rounded-2xl border border-slate-800/80">
            <h2 className="text-xs sm:text-sm font-semibold text-slate-200 mb-3 sm:mb-4">Cash Flow Transactions Ledger</h2>
            
            <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
              {transactions.map((tx) => (
                <div key={tx.id} className="p-3 bg-slate-950/45 rounded-xl border border-slate-800/40 flex items-center justify-between hover:border-slate-700/60 transition-all group">
                  <div className="flex items-center gap-2.5 sm:gap-3 overflow-hidden">
                    <div className={`p-2 rounded-xl border shrink-0 ${
                      tx.type === 'income' 
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/15' 
                        : 'bg-rose-500/10 text-rose-400 border-rose-500/15'
                    }`}>
                      {tx.type === 'income' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    </div>
                    <div className="overflow-hidden">
                      <h4 className="text-xs font-semibold text-white truncate pr-2">{tx.description}</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1.5 font-mono">
                        <span>{tx.date}</span>
                        <span>•</span>
                        <span className="uppercase text-slate-500">{tx.category}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                    <span className={`text-xs font-bold font-display ${tx.type === 'income' ? 'text-emerald-400' : 'text-slate-100'}`}>
                      {tx.type === 'income' ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN')}
                    </span>
                    <button
                      id={`btn-delete-tx-${tx.id}`}
                      onClick={() => handleDeleteTransaction(tx.id)}
                      className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 p-1.5 hover:bg-rose-500/15 text-slate-400 hover:text-rose-400 rounded transition-all cursor-pointer min-h-[32px] min-w-[32px] flex items-center justify-center"
                      title="Delete Transaction"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Budgets & Invoices columns */}
        <div className="space-y-4 sm:space-y-6">
          
          {/* Monthly budgets */}
          <div className="bg-slate-900/60 p-4 sm:p-5 rounded-2xl border border-slate-800/80">
            <h2 className="text-xs sm:text-sm font-semibold text-slate-200 mb-3 sm:mb-4">Monthly Allocation Budgets (INR)</h2>
            
            <div className="space-y-3 sm:space-y-4">
              {budgets.map((b) => {
                const ratio = Math.min(b.spent / b.limit, 1);
                const pct = Math.round(ratio * 100);
                return (
                  <div key={b.id} className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-slate-300">{b.name}</span>
                      <span className="font-mono text-[11px] sm:text-xs text-slate-400">
                        ₹{b.spent.toLocaleString('en-IN')} / <strong className="text-white">₹{b.limit.toLocaleString('en-IN')}</strong>
                      </span>
                    </div>
                    <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800/80">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          pct >= 90 ? 'bg-rose-500' : pct >= 75 ? 'bg-amber-500' : 'bg-violet-500'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-slate-500">
                      <span>{pct}% Consumed</span>
                      {pct >= 80 && (
                        <span className="text-rose-400 font-semibold flex items-center gap-0.5">
                          <AlertTriangle className="w-3 h-3" /> Near Limit
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Customer Invoice List */}
          <div className="bg-slate-900/60 p-4 sm:p-5 rounded-2xl border border-slate-800/80">
            <h2 className="text-xs sm:text-sm font-semibold text-slate-200 mb-3 sm:mb-4 font-display">Client Invoices</h2>
            <div className="space-y-2.5 sm:space-y-3">
              {invoices.map((inv) => (
                <div 
                  key={inv.id} 
                  onClick={() => setActiveInvoicePreview(inv)}
                  className="p-3 bg-slate-950/50 rounded-xl border border-slate-800 hover:border-violet-500/35 transition-all cursor-pointer flex justify-between items-center"
                >
                  <div className="overflow-hidden pr-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-white font-mono">{inv.invoiceNo}</span>
                      <span className={`text-[9px] uppercase px-1.5 py-0.2 rounded font-semibold ${
                        inv.status === 'paid' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' : 
                        inv.status === 'pending' ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20' : 
                        'bg-rose-500/15 text-rose-400 border border-rose-500/20'
                      }`}>
                        {inv.status}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1 truncate">{inv.clientName}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold text-white block">₹{inv.amount.toLocaleString('en-IN')}</span>
                    <span className="text-[9px] text-slate-500 font-mono block mt-0.5">Due {inv.dueDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Generator Modal/Popup */}
      <AnimatePresence>
        {showInvoiceCreator && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-slate-800/85 w-full max-w-2xl rounded-2xl p-4 sm:p-6 shadow-2xl overflow-y-auto max-h-[92vh]"
            >
              <div className="flex justify-between items-center pb-3 sm:pb-4 border-b border-slate-800/60 mb-4 sm:mb-6">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-violet-400" />
                  <h2 className="text-sm sm:text-base font-display font-bold text-white">Create Pro-forma Client Invoice</h2>
                </div>
                <button 
                  id="btn-close-invoice-creator"
                  onClick={() => setShowInvoiceCreator(false)}
                  className="text-slate-400 hover:text-white font-bold cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center text-xl"
                  aria-label="Close modal"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleGenerateInvoiceSubmit} className="space-y-4 sm:space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1.5">Client Full Name / Company</label>
                    <input 
                      id="input-inv-client-name"
                      type="text"
                      required
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="e.g. Nexus Global Inc."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3 text-white text-xs sm:text-sm focus:outline-none focus:border-violet-500 min-h-[42px]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1.5">Client Billing Email</label>
                    <input 
                      id="input-inv-client-email"
                      type="email"
                      required
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      placeholder="e.g. finance@client.com"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3 text-white text-xs sm:text-sm focus:outline-none focus:border-violet-500 min-h-[42px]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1.5">Due Date</label>
                    <input 
                      id="input-inv-due-date"
                      type="date"
                      required
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3 text-white text-xs sm:text-sm focus:outline-none focus:border-violet-500 min-h-[42px]"
                    />
                  </div>
                </div>

                {/* Items line list */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono uppercase text-slate-400">Invoice Items / Scope of Work</span>
                    <button
                      id="btn-add-inv-item"
                      type="button"
                      onClick={handleAddInvoiceItem}
                      className="text-xs font-semibold text-violet-400 hover:text-violet-300 flex items-center gap-1 cursor-pointer py-1 px-2 rounded-lg bg-violet-600/10 border border-violet-500/20"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Item
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {invoiceItems.map((item, idx) => (
                      <div key={idx} className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800 flex flex-col sm:grid sm:grid-cols-12 gap-2 sm:gap-3 items-center">
                        <div className="w-full sm:col-span-6">
                          <label className="text-[9px] text-slate-500 sm:hidden block mb-1">Description</label>
                          <input 
                            id={`input-item-desc-${idx}`}
                            type="text"
                            required
                            placeholder="Description of deliverable..."
                            value={item.description}
                            onChange={(e) => handleInvoiceItemChange(idx, 'description', e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2 px-2.5 text-white text-xs focus:outline-none min-h-[38px]"
                          />
                        </div>
                        <div className="w-full sm:col-span-2 flex items-center gap-2 sm:block">
                          <label className="text-[9px] text-slate-500 sm:hidden block shrink-0 w-12">Qty:</label>
                          <input 
                            id={`input-item-qty-${idx}`}
                            type="number"
                            required
                            min="1"
                            value={item.quantity}
                            onChange={(e) => handleInvoiceItemChange(idx, 'quantity', parseInt(e.target.value) || 1)}
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2 px-2 text-white text-center text-xs focus:outline-none min-h-[38px]"
                          />
                        </div>
                        <div className="w-full sm:col-span-2 flex items-center gap-2 sm:block">
                          <label className="text-[9px] text-slate-500 sm:hidden block shrink-0 w-12">Rate (₹):</label>
                          <input 
                            id={`input-item-price-${idx}`}
                            type="number"
                            required
                            placeholder="Unit Price"
                            value={item.unitPrice || ''}
                            onChange={(e) => handleInvoiceItemChange(idx, 'unitPrice', parseFloat(e.target.value) || 0)}
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2 px-2 text-white text-xs focus:outline-none min-h-[38px]"
                          />
                        </div>
                        <div className="w-full sm:col-span-2 flex justify-between sm:justify-center items-center pt-1 sm:pt-0 border-t sm:border-t-0 border-slate-800/60">
                          <span className="sm:hidden text-[10px] text-slate-400 font-mono">Amount:</span>
                          <span className="font-display font-semibold text-white text-xs">
                            ₹{item.amount.toLocaleString('en-IN')}
                          </span>
                          {invoiceItems.length > 1 && (
                            <button
                              id={`btn-remove-item-${idx}`}
                              type="button"
                              onClick={() => handleRemoveInvoiceItem(idx)}
                              className="text-slate-400 hover:text-rose-400 font-bold cursor-pointer text-sm p-1 min-h-[32px] min-w-[32px] flex items-center justify-center"
                              aria-label="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 sm:pt-4 border-t border-slate-800 flex justify-between items-center">
                  <span className="text-xs font-semibold text-slate-400">Total Invoice:</span>
                  <span className="text-lg sm:text-xl font-display font-bold text-white">
                    ₹{invoiceItems.reduce((sum, i) => sum + i.amount, 0).toLocaleString('en-IN')}
                  </span>
                </div>

                <button
                  id="btn-invoice-submit"
                  type="submit"
                  className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition-all cursor-pointer min-h-[44px]"
                >
                  Generate Invoice PDF
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Invoice Viewer and PDF Printable Frame */}
      <AnimatePresence>
        {activeInvoicePreview && (
          <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white text-slate-900 w-full max-w-xl rounded-2xl p-4 sm:p-8 shadow-2xl overflow-y-auto max-h-[92vh] border border-slate-200"
            >
              {/* Controls bar hidden in print */}
              <div className="flex flex-wrap justify-between items-center gap-2 pb-3 sm:pb-4 border-b border-slate-200 mb-4 sm:mb-6 print:hidden">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Invoice PDF Portal</span>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <button
                    id="btn-print-invoice"
                    onClick={handlePrintInvoice}
                    className="flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs px-2.5 sm:px-3 py-1.5 rounded-lg font-medium cursor-pointer min-h-[36px]"
                  >
                    <Printer className="w-3.5 h-3.5" /> Print
                  </button>
                  <button
                    id="btn-invoice-status-toggle"
                    onClick={() => {
                      const next = activeInvoicePreview.status === 'paid' ? 'pending' : 'paid';
                      store.updateInvoiceStatus(activeInvoicePreview.id, next);
                      setActiveInvoicePreview(prev => prev ? { ...prev, status: next } : null);
                    }}
                    className={`text-xs px-2.5 sm:px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1 cursor-pointer min-h-[36px] ${
                      activeInvoicePreview.status === 'paid' 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" /> 
                    {activeInvoicePreview.status === 'paid' ? 'Paid' : 'Pending'}
                  </button>
                  <button 
                    id="btn-close-invoice-preview"
                    onClick={() => setActiveInvoicePreview(null)}
                    className="text-slate-400 hover:text-slate-900 font-bold ml-1 text-xl cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
                    aria-label="Close"
                  >
                    ×
                  </button>
                </div>
              </div>

              {/* Printable Invoice document */}
              <div id="printable-invoice" className="space-y-4 sm:space-y-6">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <h1 className="text-base sm:text-lg font-bold text-slate-900 font-display">Zenith Tech Solutions</h1>
                    <p className="text-xs text-slate-500 mt-1">meghaaraj7882@gmail.com</p>
                    <p className="text-xs text-slate-500">Industry: AI & SaaS Consulting</p>
                  </div>
                  <div className="text-right">
                    <h2 className="text-xl sm:text-2xl font-display font-extrabold text-slate-800">INVOICE</h2>
                    <span className="text-xs font-mono text-slate-500 block mt-1">{activeInvoicePreview.invoiceNo}</span>
                    <span className={`inline-block text-[10px] uppercase font-bold mt-1 px-2 py-0.5 rounded ${
                      activeInvoicePreview.status === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {activeInvoicePreview.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-slate-200">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase block">Billed To:</span>
                    <strong className="text-xs sm:text-sm font-semibold text-slate-800 block mt-1">{activeInvoicePreview.clientName}</strong>
                    <span className="text-xs text-slate-500 block mt-0.5 truncate">{activeInvoicePreview.clientEmail}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono text-slate-400 uppercase block">Dates & Terms:</span>
                    <span className="text-xs text-slate-500 block mt-1">Issued: {activeInvoicePreview.issueDate}</span>
                    <strong className="text-xs font-semibold text-rose-600 block">Due: {activeInvoicePreview.dueDate}</strong>
                  </div>
                </div>

                {/* Items Invoice Table */}
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse mt-4 sm:mt-8 min-w-[340px]">
                    <thead>
                      <tr className="border-b-2 border-slate-300 text-[10px] font-mono text-slate-400 uppercase text-left">
                        <th className="pb-2">Deliverable</th>
                        <th className="pb-2 text-center">Qty</th>
                        <th className="pb-2 text-right">Unit Cost</th>
                        <th className="pb-2 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                      {activeInvoicePreview.items.map((item, index) => (
                        <tr key={index}>
                          <td className="py-2.5 sm:py-3 font-medium text-slate-900">{item.description}</td>
                          <td className="py-2.5 sm:py-3 text-center font-mono">{item.quantity}</td>
                          <td className="py-2.5 sm:py-3 text-right font-mono">₹{item.unitPrice.toLocaleString('en-IN')}</td>
                          <td className="py-2.5 sm:py-3 text-right font-semibold text-slate-900 font-mono">₹{item.amount.toLocaleString('en-IN')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-between items-center pt-4 sm:pt-6 border-t-2 border-slate-300 mt-4 sm:mt-8">
                  <span className="text-xs font-semibold text-slate-500">Balance Due:</span>
                  <strong className="text-lg sm:text-xl font-display font-black text-slate-900">
                    ₹{activeInvoicePreview.amount.toLocaleString('en-IN')}
                  </strong>
                </div>

                <div className="pt-4 sm:pt-8 text-center text-[10px] text-slate-400 border-t border-slate-100 font-medium">
                  Thank you for your business. For any invoice queries, contact accounting@zenithtech.io
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
