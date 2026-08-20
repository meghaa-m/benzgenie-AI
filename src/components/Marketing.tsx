import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, Megaphone, Check, Copy, Share2, Plus, 
  Trash2, Send, Instagram, Linkedin, Facebook, Mail, FileText, Newspaper, Bot
} from 'lucide-react';
import { store } from '../lib/store';
import { MarketingPost } from '../types';

export default function Marketing() {
  const [posts, setPosts] = useState<MarketingPost[]>([]);
  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState<'instagram' | 'linkedin' | 'facebook' | 'email' | 'seo' | 'ad'>('linkedin');
  const [details, setDetails] = useState('');
  const [tone, setTone] = useState('expert, professional');
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Active Generated Output
  const [generatedContent, setGeneratedContent] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setPosts(store.getMarketingPosts());
    const unsubscribe = store.subscribe(() => {
      setPosts(store.getMarketingPosts());
    });
    return unsubscribe;
  }, []);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic) return;

    setIsGenerating(true);
    setGeneratedContent('');

    try {
      const res = await fetch('/api/gemini/generate-marketing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, platform, details, tone })
      });

      const data = await res.json();
      setGeneratedContent(data.content);
    } catch (err) {
      console.error(err);
      setGeneratedContent("### 🧞‍♂️ Generator Error\n\nFailed to reach the copywriting gateway. Please try reviewing your configuration or try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSavePost = (status: 'draft' | 'scheduled') => {
    if (!generatedContent || !topic) return;

    store.addMarketingPost({
      platform,
      topic,
      content: generatedContent,
      status
    });

    // Reset inputs
    setTopic('');
    setDetails('');
    setGeneratedContent('');
    alert(`Campaign piece successfully stored as ${status}!`);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getPlatformIcon = (plat: string) => {
    switch (plat) {
      case 'linkedin': return <Linkedin className="w-4 h-4 text-sky-400" />;
      case 'instagram': return <Instagram className="w-4 h-4 text-pink-400" />;
      case 'facebook': return <Facebook className="w-4 h-4 text-blue-400" />;
      case 'email': return <Mail className="w-4 h-4 text-amber-400" />;
      case 'seo': return <FileText className="w-4 h-4 text-emerald-400" />;
      default: return <Megaphone className="w-4 h-4 text-fuchsia-400" />;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col lg:grid lg:grid-cols-12 gap-4 sm:gap-6 min-h-0 lg:h-[calc(100vh-140px)]"
    >
      {/* Left Input form panel */}
      <div className="lg:col-span-5 bg-slate-900/60 p-4 sm:p-5 rounded-2xl border border-slate-800/80 flex flex-col justify-between overflow-y-auto">
        <form onSubmit={handleGenerate} className="space-y-3.5 sm:space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800/60">
            <Megaphone className="w-5 h-5 text-violet-400 shrink-0 animate-pulse" />
            <div>
              <h1 className="text-sm sm:text-base font-display font-bold text-white">BizGenie AI Marketing copywriter</h1>
              <p className="text-[10px] text-slate-400">Generate high-conversion campaigns powered by Gemini AI</p>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1.5">Select Campaign Target Platform</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { id: 'linkedin', label: 'LinkedIn', icon: <Linkedin className="w-3.5 h-3.5" /> },
                { id: 'instagram', label: 'Instagram', icon: <Instagram className="w-3.5 h-3.5" /> },
                { id: 'facebook', label: 'Facebook', icon: <Facebook className="w-3.5 h-3.5" /> },
                { id: 'email', label: 'Email', icon: <Mail className="w-3.5 h-3.5" /> },
                { id: 'seo', label: 'SEO Blog', icon: <Newspaper className="w-3.5 h-3.5" /> },
                { id: 'ad', label: 'Google Ad', icon: <Megaphone className="w-3.5 h-3.5" /> }
              ].map((p) => (
                <button
                  id={`btn-marketing-platform-${p.id}`}
                  key={p.id}
                  type="button"
                  onClick={() => setPlatform(p.id as any)}
                  className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-[11px] font-medium border cursor-pointer transition-all min-h-[40px] ${
                    platform === p.id 
                      ? 'bg-violet-600/15 border-violet-500/40 text-violet-300 shadow-sm' 
                      : 'bg-slate-950 border-slate-800/80 text-slate-400 hover:text-slate-300 hover:border-slate-700'
                  }`}
                >
                  {p.icon}
                  <span>{p.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1.5">Campaign Topic / Headline</label>
            <input 
              id="input-marketing-topic"
              type="text"
              required
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Scaling enterprise generative pipelines without leaks"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3 text-white text-xs sm:text-sm focus:outline-none focus:border-violet-500 min-h-[42px]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1.5">Brand Tone Of Voice</label>
              <select
                id="select-marketing-tone"
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3 text-white text-xs sm:text-sm focus:outline-none focus:border-violet-500 min-h-[42px]"
              >
                <option value="professional, authoritative">Authoritative & Expert</option>
                <option value="engaging, playful, creative">Playful & Dynamic</option>
                <option value="bold, direct, minimal">Bold & Conversational</option>
                <option value="educational, value-first">Educational / Value-first</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1.5">Industry</label>
              <input 
                id="input-marketing-industry"
                type="text"
                disabled
                value={store.getProfile().industry}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3 text-slate-500 text-xs sm:text-sm focus:outline-none min-h-[42px]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1.5">Context / Audience details (Optional)</label>
            <textarea 
              id="input-marketing-details"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Key metrics to share, launch date, specific promo codes, etc."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3 text-white text-xs sm:text-sm h-20 sm:h-24 focus:outline-none focus:border-violet-500"
            />
          </div>

          <button
            id="btn-marketing-generate"
            type="submit"
            disabled={isGenerating}
            className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer text-xs uppercase tracking-wider min-h-[44px]"
          >
            {isGenerating ? 'Compiling copy with Gemini...' : 'Synthesize Campaign Copy'}
            <Sparkles className="w-4 h-4 shrink-0" />
          </button>
        </form>

        {/* Existing Drafts/Scheduled posts */}
        <div className="mt-5 pt-4 border-t border-slate-800/60">
          <h2 className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-2.5">Saved Campaign Assets</h2>
          <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
            {posts.length === 0 ? (
              <span className="text-[10px] text-slate-500 block italic">No saved posts. Synthesize and save items above.</span>
            ) : (
              posts.map((p) => (
                <div key={p.id} className="p-2.5 bg-slate-950/40 rounded-lg border border-slate-800 flex justify-between items-center gap-2">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <div className="shrink-0">{getPlatformIcon(p.platform)}</div>
                    <div className="overflow-hidden">
                      <h4 className="text-[11px] font-bold text-white truncate max-w-[130px] sm:max-w-[160px]">{p.topic}</h4>
                      <span className="text-[9px] text-slate-500 font-mono block mt-0.5 uppercase">{p.status} • {p.date}</span>
                    </div>
                  </div>
                  <button
                    id={`btn-marketing-publish-toggle-${p.id}`}
                    onClick={() => {
                      const next = p.status === 'draft' ? 'scheduled' : 'draft';
                      store.updateMarketingPostStatus(p.id, next);
                    }}
                    className="text-[9px] font-mono text-violet-400 hover:text-violet-300 font-semibold cursor-pointer shrink-0 px-2 py-1 bg-violet-500/10 rounded border border-violet-500/20 min-h-[28px] flex items-center"
                  >
                    Set {p.status === 'draft' ? 'Scheduled' : 'Draft'}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Right Generated Preview Output panel */}
      <div className="lg:col-span-7 bg-slate-900/40 rounded-2xl border border-slate-800/60 p-4 sm:p-5 flex flex-col justify-between min-h-[360px] lg:h-full overflow-hidden">
        <div className="flex flex-wrap justify-between items-center gap-2 pb-3 border-b border-slate-800/60 mb-3 sm:mb-4 shrink-0">
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Copyset Output Terminal</span>
          
          {generatedContent && (
            <div className="flex items-center gap-2">
              <button
                id="btn-marketing-copy"
                onClick={handleCopy}
                className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs px-2.5 py-1.5 rounded-lg font-medium border border-slate-700 cursor-pointer min-h-[34px]"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
              <button
                id="btn-marketing-save-draft"
                onClick={() => handleSavePost('draft')}
                className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs px-2.5 py-1.5 rounded-lg font-medium border border-slate-700 cursor-pointer min-h-[34px]"
              >
                Save Draft
              </button>
            </div>
          )}
        </div>

        {/* Display Container */}
        <div className="flex-grow overflow-y-auto bg-slate-950/40 border border-slate-800/60 rounded-xl p-3.5 sm:p-5 font-mono text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-wrap select-text min-h-[220px]">
          {isGenerating ? (
            <div className="h-full min-h-[200px] flex flex-col items-center justify-center text-center space-y-3">
              <Bot className="w-8 h-8 text-violet-400 animate-spin" />
              <div className="space-y-1">
                <p className="text-slate-300 font-semibold text-xs sm:text-sm">Gemini is drafting copy...</p>
                <p className="text-[10px] text-slate-500">Generating targeted hooks and brand calls to action</p>
              </div>
            </div>
          ) : generatedContent ? (
            <div>
              {generatedContent}
            </div>
          ) : (
            <div className="h-full min-h-[200px] flex flex-col items-center justify-center text-center p-4 sm:p-6 text-slate-500">
              <Sparkles className="w-8 h-8 text-slate-700 mb-2.5" />
              <p className="text-xs font-medium">Your generated marketing copy will appear here.</p>
              <p className="text-[10px] text-slate-600 mt-1 max-w-xs">Select target platforms, write campaign themes, and click generate above.</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
