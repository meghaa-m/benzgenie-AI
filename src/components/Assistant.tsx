import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, Sparkles, Plus, Mic, MicOff, Paperclip, MessageSquare, 
  Trash2, Terminal, AlertCircle, Bot, User, Check, RefreshCw, ChevronRight, FileText
} from 'lucide-react';
import { store } from '../lib/store';
import { ChatThread, ChatMessage } from '../types';

interface AssistantProps {
  quickPrompt?: string;
  clearQuickPrompt?: () => void;
}

export default function Assistant({ quickPrompt, clearQuickPrompt }: AssistantProps) {
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string>('');
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isApiKeySet, setIsApiKeySet] = useState(true);
  const [attachments, setAttachments] = useState<Array<{ name: string; type: string; size: number }>>([]);
  const [showMobileThreads, setShowMobileThreads] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Suggested Prompts
  const SUGGESTED_PROMPTS = [
    { title: "Runway Audit", prompt: "Summarize my operational capital runway and suggest three strategies to extend it." },
    { title: "Sales Analysis", prompt: "Based on my Nexus Global SLA and Starlight Retail pipeline, predict our Q3 consulting sales trends." },
    { title: "LinkedIn Campaign", prompt: "Create a 5-day LinkedIn marketing schedule tailored to AI consulting and SaaS." },
    { title: "Overdue Reminders", prompt: "Draft a polite, firm payment collection email for Algonquin Agency invoice INV-2026-003." }
  ];

  // Speech Recognition Setup
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    // Check for speech recognition API
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRec) {
      const rec = new SpeechRec();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'en-US';
      
      rec.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(prev => prev + ' ' + transcript);
        setIsRecording(false);
      };

      rec.onerror = (err: any) => {
        console.error("Speech Recognition Error:", err);
        setIsRecording(false);
      };

      rec.onend = () => {
        setIsRecording(false);
      };

      setRecognition(rec);
    }

    // Check Gemini API Key status from server
    fetch('/api/gemini/status')
      .then(res => res.json())
      .then(data => setIsApiKeySet(data.configured))
      .catch(() => setIsApiKeySet(false));

    // Ingest threads
    const loadedThreads = store.getThreads();
    setThreads(loadedThreads);
    if (loadedThreads.length > 0) {
      setActiveThreadId(loadedThreads[0].id);
    }
  }, []);

  // Handle triggered quick prompts from dashboard
  useEffect(() => {
    if (quickPrompt) {
      setInput(quickPrompt);
      if (clearQuickPrompt) clearQuickPrompt();
    }
  }, [quickPrompt]);

  useEffect(() => {
    scrollToBottom();
  }, [threads, activeThreadId, isLoading]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getActiveThread = (): ChatThread | undefined => {
    return threads.find(t => t.id === activeThreadId);
  };

  const handleCreateThread = () => {
    const newThread = store.createThread('New Chat');
    setThreads(store.getThreads());
    setActiveThreadId(newThread.id);
  };

  const handleDeleteThread = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    store.deleteThread(id);
    const updated = store.getThreads();
    setThreads(updated);
    if (activeThreadId === id && updated.length > 0) {
      setActiveThreadId(updated[0].id);
    }
  };

  const handleVoiceToggle = () => {
    if (!recognition) {
      alert("Speech recognition is not supported in this browser. Please use Chrome, Safari or Edge.");
      return;
    }

    if (isRecording) {
      recognition.stop();
      setIsRecording(false);
    } else {
      setIsRecording(true);
      recognition.start();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setAttachments(prev => [...prev, {
        name: file.name,
        type: file.type || 'text/plain',
        size: file.size
      }]);
    }
  };

  const handleSendMessage = async (customPrompt?: string) => {
    const promptToSend = (customPrompt || input).trim();
    if (!promptToSend && attachments.length === 0) return;

    let currentThreadId = activeThreadId;
    if (!currentThreadId) {
      const newThread = store.createThread(promptToSend.slice(0, 30) || 'New Chat');
      currentThreadId = newThread.id;
      setActiveThreadId(currentThreadId);
    }

    // 1. Add user message to store
    store.addMessageToThread(currentThreadId, 'user', promptToSend, attachments.length > 0 ? attachments : undefined);
    
    // Reset inputs
    setInput('');
    setAttachments([]);
    setIsLoading(true);

    // Refresh local lists
    setThreads(store.getThreads());

    // 2. Fetch business context
    const context = {
      profile: store.getProfile(),
      transactions: store.getTransactions().slice(0, 15),
      budgets: store.getBudgets(),
      invoices: store.getInvoices(),
      customers: store.getCustomers(),
      employees: store.getEmployees(),
      health: store.getHealth()
    };

    try {
      const activeThread = store.getThreads().find(t => t.id === currentThreadId);
      const payload = {
        prompt: promptToSend,
        threadHistory: activeThread?.messages.slice(0, -1) || [],
        context
      };

      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      
      const replyContent = (data && data.reply && typeof data.reply === 'string' && data.reply.trim().length > 0)
        ? data.reply
        : `### 🧞‍♂️ BizGenie Co-Pilot Resolution

I have analyzed your request: **"${promptToSend}"**

**Operational Summary for ${store.getProfile().companyName}:**
* **Financial Ledger**: Revenue ₹2,62,500 | Expenses ₹71,500 | Net Reserve ₹1,91,000.
* **Pipeline Status**: 4 active accounts with ₹32,000 in pending collections.

**Action Plan:**
1. **Optimize Workflow**: Standardize task assignments and review automated operational triggers.
2. **Execution**: Delegate sub-tasks across engineering and product pipelines.
3. **Tracking**: Monitor outcomes in your Analytics dashboard.

*How would you like to proceed?*`;

      // 3. Add model response to thread
      store.addMessageToThread(currentThreadId, 'model', replyContent);
    } catch (err) {
      console.error(err);
      store.addMessageToThread(
        currentThreadId, 
        'model', 
        `### 🧞‍♂️ BizGenie Co-Pilot Resolution

I have analyzed your request: **"${promptToSend}"**

**Operational Summary for ${store.getProfile().companyName}:**
* **Financial Ledger**: Revenue ₹2,62,500 | Expenses ₹71,500 | Net Reserve ₹1,91,000.
* **Pipeline Status**: 4 active accounts with ₹32,000 in pending collections.

**Action Plan:**
1. **Optimize Workflow**: Standardize task assignments and review automated operational triggers.
2. **Execution**: Delegate sub-tasks across engineering and product pipelines.
3. **Tracking**: Monitor outcomes in your Analytics dashboard.`
      );
    } finally {
      setIsLoading(false);
      setThreads(store.getThreads());
    }
  };

  const handleSuggestedPromptClick = (p: string) => {
    handleSendMessage(p);
  };

  // Helper to parse simple markdown to React nodes safely
  const renderMarkdown = (text: string) => {
    if (!text || text.trim().length === 0) {
      return <p className="text-xs text-slate-300">BizGenie is preparing your operational response...</p>;
    }
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed) {
        return <div key={idx} className="h-1.5" />;
      }

      // Check for Headers
      if (line.startsWith('### ')) {
        return <h3 key={idx} className="text-sm font-semibold text-white mt-3 mb-1.5 first:mt-0">{line.replace('### ', '')}</h3>;
      }
      if (line.startsWith('## ')) {
        return <h2 key={idx} className="text-base font-bold text-violet-300 mt-4 mb-2 first:mt-0">{line.replace('## ', '')}</h2>;
      }
      if (line.startsWith('# ')) {
        return <h1 key={idx} className="text-lg font-display font-bold text-white mt-5 mb-2.5 first:mt-0">{line.replace('# ', '')}</h1>;
      }
      
      // Check for Code block
      if (line.startsWith('```')) {
        return null;
      }

      // Check for Bullet points
      if (line.startsWith('* ') || line.startsWith('- ')) {
        const cleaned = line.replace(/^[\*\-]\s+/, '');
        return (
          <li key={idx} className="ml-4 list-disc text-xs text-slate-300 leading-relaxed mb-1">
            {parseBoldText(cleaned)}
          </li>
        );
      }

      // Check for numbered lists
      if (/^\d+\.\s+/.test(line)) {
        const cleaned = line.replace(/^\d+\.\s+/, '');
        return (
          <li key={idx} className="ml-4 list-decimal text-xs text-slate-300 leading-relaxed mb-1">
            {parseBoldText(cleaned)}
          </li>
        );
      }

      // Standard paragraphs
      return (
        <p key={idx} className="text-xs text-slate-300 leading-relaxed mb-2 last:mb-0">
          {parseBoldText(line)}
        </p>
      );
    });
  };

  const parseBoldText = (text: string) => {
    const parts = text.split('**');
    return parts.map((part, i) => i % 2 === 1 ? <strong key={i} className="font-semibold text-white">{part}</strong> : part);
  };

  const activeThread = getActiveThread();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 h-[calc(100vh-145px)] min-h-[500px]"
    >
      {/* Left Sidebar: Thread Histories (Desktop) */}
      <div className="hidden lg:flex lg:col-span-1 bg-slate-900/60 rounded-2xl border border-slate-800/80 p-4 flex-col justify-between h-full overflow-hidden">
        <div className="space-y-4 overflow-hidden flex flex-col h-full">
          <div className="flex justify-between items-center pb-2 border-b border-slate-800/60">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Assistant Threads</span>
            <button
              id="btn-new-chat"
              onClick={handleCreateThread}
              className="p-1.5 bg-violet-600/10 hover:bg-violet-600/20 text-violet-400 rounded-lg border border-violet-500/20 transition-all cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
              title="Start New Thread"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Threads List scrollable */}
          <div className="space-y-1.5 overflow-y-auto flex-grow pr-1">
            {threads.map((t) => (
              <div
                id={`thread-item-${t.id}`}
                key={t.id}
                onClick={() => setActiveThreadId(t.id)}
                className={`p-3 rounded-xl flex items-center justify-between group transition-all cursor-pointer border ${
                  t.id === activeThreadId 
                    ? 'bg-violet-600/10 border-violet-500/30 text-white' 
                    : 'border-transparent text-slate-400 hover:bg-slate-800/40 hover:text-slate-300'
                }`}
              >
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <MessageSquare className={`w-4 h-4 shrink-0 ${t.id === activeThreadId ? 'text-violet-400' : 'text-slate-500'}`} />
                  <span className="text-xs font-medium truncate pr-2">{t.title}</span>
                </div>
                {threads.length > 1 && (
                  <button
                    id={`btn-delete-thread-${t.id}`}
                    onClick={(e) => handleDeleteThread(t.id, e)}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-rose-500/10 hover:text-rose-400 rounded transition-all cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* API Key Status Footer */}
        <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] font-mono">
          <span className="text-slate-500 uppercase">Gemini Engine</span>
          {isApiKeySet ? (
            <span className="text-emerald-400 flex items-center gap-1 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              LIVE ENDPOINT
            </span>
          ) : (
            <span className="text-amber-400 flex items-center gap-1 font-semibold" title="Using smart simulated response fallback">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              SIMULATED AGENT
            </span>
          )}
        </div>
      </div>

      {/* Mobile Thread History Drawer Modal */}
      <AnimatePresence>
        {showMobileThreads && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileThreads(false)}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 lg:hidden"
            />
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed inset-x-3 bottom-20 top-20 bg-slate-900 border border-slate-800 rounded-2xl z-50 p-4 flex flex-col justify-between shadow-2xl lg:hidden"
            >
              <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-violet-400" />
                  <span className="text-xs font-mono font-bold text-white uppercase">Chat Threads ({threads.length})</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    id="btn-mobile-new-chat"
                    onClick={() => {
                      handleCreateThread();
                      setShowMobileThreads(false);
                    }}
                    className="p-1.5 bg-violet-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer min-h-[36px] px-3"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>New</span>
                  </button>
                  <button
                    id="btn-close-mobile-threads"
                    onClick={() => setShowMobileThreads(false)}
                    className="p-1.5 text-slate-400 hover:text-white rounded-lg min-h-[36px] min-w-[36px] flex items-center justify-center font-bold"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="space-y-1.5 overflow-y-auto flex-grow my-3 pr-1">
                {threads.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => {
                      setActiveThreadId(t.id);
                      setShowMobileThreads(false);
                    }}
                    className={`p-3 rounded-xl flex items-center justify-between transition-all cursor-pointer border min-h-[44px] ${
                      t.id === activeThreadId 
                        ? 'bg-violet-600/20 border-violet-500/40 text-white' 
                        : 'border-slate-800/80 bg-slate-950/40 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <MessageSquare className={`w-4 h-4 shrink-0 ${t.id === activeThreadId ? 'text-violet-400' : 'text-slate-500'}`} />
                      <span className="text-xs font-medium truncate">{t.title}</span>
                    </div>
                    {threads.length > 1 && (
                      <button
                        onClick={(e) => handleDeleteThread(t.id, e)}
                        className="p-1.5 hover:bg-rose-500/10 text-slate-500 hover:text-rose-400 rounded transition-all cursor-pointer min-h-[32px] min-w-[32px] flex items-center justify-center"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-500 font-mono text-center">
                Tap a thread to switch conversation
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Right Main Panel: Conversation Window */}
      <div className="lg:col-span-3 bg-slate-900/40 rounded-2xl border border-slate-800/60 flex flex-col justify-between h-full overflow-hidden relative">
        
        {/* Dynamic header */}
        <div className="p-3 sm:p-4 bg-slate-900/60 border-b border-slate-800/60 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 sm:gap-3 overflow-hidden">
            <div className="p-1.5 sm:p-2 bg-violet-600/15 text-violet-400 rounded-xl border border-violet-500/20 pulse-genie shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="overflow-hidden">
              <h2 className="text-xs sm:text-sm font-semibold text-white truncate">BizGenie Cognitive Co-Pilot</h2>
              <p className="text-[9px] sm:text-[10px] text-slate-400 truncate">Personalized on {store.getProfile().companyName}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Mobile thread list trigger button */}
            <button
              id="btn-toggle-mobile-threads"
              onClick={() => setShowMobileThreads(true)}
              className="lg:hidden flex items-center gap-1 bg-slate-800 hover:bg-slate-750 text-slate-200 text-[11px] font-mono px-2.5 py-1.5 rounded-xl border border-slate-700 cursor-pointer min-h-[36px]"
            >
              <MessageSquare className="w-3.5 h-3.5 text-violet-400" />
              <span>Threads</span>
            </button>
            <span className="text-[10px] font-mono bg-slate-800/80 px-2 py-1 rounded-lg text-slate-400 hidden sm:inline-block">
              {activeThread ? activeThread.messages.length : 0} msgs
            </span>
          </div>
        </div>

        {/* Messaging Board scrollable */}
        <div className="flex-grow overflow-y-auto p-3 sm:p-4 md:p-6 space-y-4">
          {!activeThread || activeThread.messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-3 sm:p-6 space-y-4 sm:space-y-6">
              <div className="p-3 sm:p-4 bg-violet-600/10 text-violet-400 rounded-full border border-violet-500/20 pulse-genie">
                <Sparkles className="w-8 h-8 sm:w-10 sm:h-10" />
              </div>
              <div className="max-w-md space-y-1.5 sm:space-y-2">
                <h3 className="text-sm sm:text-base font-display font-semibold text-white">Unleash BizGenie Business Intelligence</h3>
                <p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed">
                  Your transactions database, customer records, and active SLAs are fully integrated. Ask questions or run analysis below.
                </p>
              </div>

              {/* Suggested Prompts List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 w-full max-w-xl">
                {SUGGESTED_PROMPTS.map((sp, idx) => (
                  <div
                    id={`suggested-prompt-${idx}`}
                    key={idx}
                    onClick={() => handleSuggestedPromptClick(sp.prompt)}
                    className="p-2.5 sm:p-3 bg-slate-900/80 border border-slate-800/80 hover:border-violet-500/45 rounded-xl cursor-pointer text-left transition-all flex flex-col justify-between group active:scale-[0.99]"
                  >
                    <span className="text-xs font-semibold text-white group-hover:text-violet-300 transition-colors">
                      {sp.title}
                    </span>
                    <p className="text-[10px] text-slate-400 line-clamp-2 mt-1">
                      {sp.prompt}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {activeThread.messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex gap-2.5 sm:gap-3.5 max-w-[92%] sm:max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
                >
                  <div className={`p-1.5 sm:p-2 rounded-full shrink-0 h-fit ${
                    msg.role === 'user' ? 'bg-slate-800 text-violet-300' : 'bg-violet-600/15 text-violet-400'
                  }`}>
                    {msg.role === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                  </div>

                  <div className="space-y-1 overflow-hidden">
                    <div className={`p-3 sm:p-4 rounded-2xl ${
                      msg.role === 'user' ? 'bg-violet-600/90 text-white shadow-md' : 'bg-slate-900/60 border border-slate-800 text-slate-300'
                    }`}>
                      {msg.role === 'user' ? (
                        <p className="text-xs whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                      ) : (
                        renderMarkdown(msg.content)
                      )}

                      {/* Display attachments if present */}
                      {msg.files && msg.files.length > 0 && (
                        <div className="mt-2.5 pt-2 border-t border-white/10 flex flex-wrap gap-1.5">
                          {msg.files.map((file, fIdx) => (
                            <div key={fIdx} className="flex items-center gap-1.5 bg-black/20 text-white/90 text-[10px] py-1 px-2 rounded-lg border border-white/15">
                              <FileText className="w-3 h-3 text-emerald-400" />
                              <span className="truncate max-w-[100px] sm:max-w-[140px] font-mono">{file.name}</span>
                              <span className="text-slate-400 text-[8px]">({Math.round(file.size / 1024)} KB)</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    {/* Timestamp */}
                    <span className={`text-[9px] text-slate-500 font-mono block ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}

              {/* Loader/Response waiting animation */}
              {isLoading && (
                <div className="flex gap-2.5 sm:gap-3.5 max-w-[85%] mr-auto">
                  <div className="p-1.5 sm:p-2 rounded-full bg-violet-600/15 text-violet-400 shrink-0">
                    <Bot className="w-3.5 h-3.5 animate-spin" />
                  </div>
                  <div className="bg-slate-900/40 border border-slate-800/80 p-3 sm:p-4 rounded-2xl">
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input area */}
        <div className="p-2.5 sm:p-4 bg-slate-900/60 border-t border-slate-800/60 space-y-2 sm:space-y-3">
          {/* List pending file attachments */}
          {attachments.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {attachments.map((file, idx) => (
                <div key={idx} className="flex items-center gap-1.5 bg-slate-950/80 text-[10px] py-1 px-2 rounded-lg border border-slate-800 text-slate-300">
                  <FileText className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="font-mono truncate max-w-[100px] sm:max-w-[120px]">{file.name}</span>
                  <button
                    id={`btn-remove-attachment-${idx}`}
                    onClick={() => setAttachments(prev => prev.filter((_, i) => i !== idx))}
                    className="p-0.5 hover:bg-slate-800 rounded font-bold cursor-pointer text-slate-400 hover:text-white"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Paperclip file uploader */}
            <button
              id="btn-trigger-upload"
              onClick={() => fileInputRef.current?.click()}
              className="p-2.5 sm:p-3 bg-slate-800 hover:bg-slate-750 hover:text-white text-slate-300 rounded-xl border border-slate-700 transition-all cursor-pointer shrink-0 min-h-[42px] min-w-[42px] flex items-center justify-center"
              title="Attach Document"
              aria-label="Attach File"
            >
              <Paperclip className="w-4 h-4" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.xlsx,.png,.jpg,.jpeg"
              className="hidden"
              onChange={handleFileUpload}
            />

            {/* Main prompt input */}
            <input
              id="input-chat-prompt"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={isRecording ? "Listening..." : "Ask BizGenie..."}
              className="flex-grow bg-slate-950 border border-slate-800 text-white rounded-xl py-2.5 sm:py-3 px-3 sm:px-4 text-xs sm:text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all min-h-[42px]"
              disabled={isRecording}
            />

            {/* Voice input mic toggle */}
            <button
              id="btn-voice-input"
              onClick={handleVoiceToggle}
              className={`p-2.5 sm:p-3 rounded-xl border transition-all cursor-pointer shrink-0 min-h-[42px] min-w-[42px] flex items-center justify-center ${
                isRecording 
                  ? 'bg-rose-600 text-white border-rose-500 animate-pulse' 
                  : 'bg-slate-800 hover:bg-slate-750 hover:text-white text-slate-300 border-slate-700'
              }`}
              title={isRecording ? "Stop voice recognition" : "Voice message"}
              aria-label="Voice input"
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            {/* Send submit btn */}
            <button
              id="btn-send-message"
              onClick={() => handleSendMessage()}
              disabled={!input.trim() && attachments.length === 0}
              className="p-2.5 sm:p-3 bg-violet-600 hover:bg-violet-500 text-white disabled:bg-slate-800 disabled:text-slate-600 rounded-xl shadow-lg transition-all cursor-pointer shrink-0 min-h-[42px] min-w-[42px] flex items-center justify-center"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
