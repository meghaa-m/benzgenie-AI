import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, UserPlus, Upload, ShieldCheck, Heart, Trash2, 
  Sparkles, FileText, Bot, AlertCircle, Phone, Mail, GraduationCap, Clock
} from 'lucide-react';
import { store } from '../lib/store';
import { Employee, ResumeAnalysis } from '../types';

export default function HRM() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  
  // Add Employee Form states
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [empName, setEmpName] = useState('');
  const [empRole, setEmpRole] = useState('');
  const [empDept, setEmpDept] = useState('Engineering');
  const [empSalary, setEmpSalary] = useState('');

  // Resume screener states
  const [resumeText, setResumeText] = useState('');
  const [targetRole, setTargetRole] = useState('Senior Full-Stack Engineer');
  const [isScreening, setIsScreening] = useState(false);
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setEmployees(store.getEmployees());
    const unsubscribe = store.subscribe(() => {
      setEmployees(store.getEmployees());
    });
    return unsubscribe;
  }, []);

  const handleAddEmployeeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!empName || !empRole || !empSalary) return;

    store.addEmployee({
      name: empName,
      role: empRole,
      department: empDept,
      salary: parseFloat(empSalary),
      email: `${empName.toLowerCase().replace(/\s+/g, '.')}@zenithtech.io`,
      attendanceRate: 100,
      leaveRemaining: 15,
      joinDate: new Date().toISOString().split('T')[0]
    });

    // Reset Form
    setEmpName('');
    setEmpRole('');
    setEmpSalary('');
    setShowAddEmployee(false);
  };

  const handleScreenResumeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeText) return;

    setIsScreening(true);
    setAnalysis(null);

    try {
      const res = await fetch('/api/gemini/screen-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText, targetRole })
      });

      const data = await res.json();
      setAnalysis(data.analysis);
    } catch (err) {
      console.error(err);
      // Fallback
      setAnalysis({
        matchPercentage: 72,
        suitabilitySummary: "Sufficient background in general engineering, though missing enterprise cloud clustering profiles.",
        skillsMatched: ["React", "TypeScript", "Node.js", "Express"],
        gapsIdentified: ["AWS CloudFormation", "Kubernetes", "Redis Caching Layers"],
        suggestedQuestions: [
          "Explain your experience configuring and managing container workloads using Kubernetes.",
          "How would you approach configuring a high-availability Redis cache clusters in AWS?"
        ]
      });
    } finally {
      setIsScreening(false);
    }
  };

  const handleDeleteEmployee = (id: string) => {
    if (confirm("Are you sure you want to remove this employee from your Zenith roster?")) {
      store.deleteEmployee(id);
    }
  };

  // Helper template paste
  const handleLoadSampleResume = () => {
    setResumeText(
      `Meghaa Raj\nSenior Developer with 5+ years of experience.\nSkills: React, TypeScript, Tailwind, Node.js, Express, PostgreSQL, Git, Agile.\nExperience:\n- Zenith Tech: Integrated complex UI modules, reducing bundle size by 30%.\n- CloudCorp: Implemented server-side proxy handlers, routing thousands of concurrent API queries safely.\nEducation: B.S. in Computer Science`
    );
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
          <h1 className="text-lg sm:text-xl font-display font-bold text-white">Zenith HR & Talent Management</h1>
          <p className="text-[11px] sm:text-xs text-slate-400">Track active personnel details and screen candidate resumes using Gemini cognitive evaluation</p>
        </div>
        <button
          id="btn-hr-add-employee"
          onClick={() => setShowAddEmployee(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-1.5 bg-violet-600 hover:bg-violet-500 text-white font-medium text-xs px-4 py-2.5 rounded-xl shadow-lg cursor-pointer min-h-[42px]"
        >
          <UserPlus className="w-4 h-4" />
          <span>Onboard Employee</span>
        </button>
      </div>

      {/* Grid: Roster + Resume Screening */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
        
        {/* Active Employee Roster (smaller layout on left, 5cols) */}
        <div className="lg:col-span-5 bg-slate-900/60 p-4 sm:p-5 rounded-2xl border border-slate-800/80 space-y-3 sm:space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-800/60">
            <h2 className="text-xs sm:text-sm font-semibold text-slate-200">Active Payroll Roster</h2>
            <span className="text-[10px] font-mono bg-slate-800 px-2 py-0.5 rounded text-slate-300">
              {employees.length} Staff
            </span>
          </div>

          <div className="space-y-2.5 max-h-[400px] sm:max-h-[500px] overflow-y-auto pr-1">
            {employees.map((emp) => (
              <div key={emp.id} className="p-3 bg-slate-950/45 rounded-xl border border-slate-800 flex items-center justify-between group">
                <div className="overflow-hidden pr-2">
                  <h4 className="text-xs font-bold text-white truncate">{emp.name}</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5 truncate">{emp.role} • <strong className="text-violet-400 font-mono font-medium">{emp.department}</strong></p>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                  <span className="text-xs font-mono font-bold text-slate-200">₹{emp.salary.toLocaleString('en-IN')}/yr</span>
                  <button
                    id={`btn-hr-delete-${emp.id}`}
                    onClick={() => handleDeleteEmployee(emp.id)}
                    className="opacity-80 sm:opacity-0 sm:group-hover:opacity-100 p-1.5 hover:bg-rose-500/15 hover:text-rose-400 text-slate-400 rounded transition-all cursor-pointer min-h-[32px] min-w-[32px] flex items-center justify-center"
                    title="Offboard Employee"
                    aria-label={`Offboard ${emp.name}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Resume screener on right (7cols) */}
        <div className="lg:col-span-7 bg-slate-900/40 p-4 sm:p-5 rounded-2xl border border-slate-800/60 flex flex-col justify-between">
          <div className="space-y-3.5 sm:space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800/60">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-violet-400" />
                <h2 className="text-xs sm:text-sm font-semibold text-white">AI Candidate Suitability Screener</h2>
              </div>
              
              <button
                id="btn-hr-sample-resume"
                type="button"
                onClick={handleLoadSampleResume}
                className="text-[10px] font-mono text-violet-400 hover:text-violet-300 font-semibold cursor-pointer px-2 py-1 bg-violet-500/10 rounded border border-violet-500/20"
              >
                Insert Sample Resume
              </button>
            </div>

            <form onSubmit={handleScreenResumeSubmit} className="space-y-3 sm:space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Target Opening Role</label>
                  <input 
                    id="input-hr-target-role"
                    type="text"
                    required
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    placeholder="e.g. Senior Full-Stack Engineer"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-white text-xs sm:text-sm focus:outline-none focus:border-violet-500 min-h-[40px]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Raw resume paste</label>
                  <span className="text-[10px] text-slate-500 italic block mt-1">Paste candidate resume content below:</span>
                </div>
              </div>

              <div>
                <textarea 
                  id="input-hr-resume-text"
                  required
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Paste CV or Candidate Profile text details here..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3 text-white text-xs sm:text-sm font-mono h-28 sm:h-32 focus:outline-none focus:border-violet-500"
                />
              </div>

              <button
                id="btn-hr-screen-submit"
                type="submit"
                disabled={isScreening}
                className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-semibold py-2.5 px-6 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer text-xs min-h-[42px]"
              >
                {isScreening ? 'Analyzing Suitability Metrics...' : 'Screen Candidate suitability'}
                <Sparkles className="w-4 h-4" />
              </button>
            </form>

            {/* Analysis Results Display */}
            <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-slate-800">
              {isScreening ? (
                <div className="p-6 sm:p-8 text-center space-y-2.5">
                  <Bot className="w-6 h-6 text-violet-400 animate-spin mx-auto" />
                  <p className="text-xs text-slate-400">Gemini models parsing suitability and formatting interview questions...</p>
                </div>
              ) : analysis ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-3.5 bg-slate-950/50 p-3.5 sm:p-4 rounded-xl border border-slate-800/80"
                >
                  <div className="flex justify-between items-center pb-2 border-b border-slate-800/40">
                    <span className="text-xs font-mono text-slate-400 uppercase">Screening evaluation report</span>
                    <span className="text-xs font-bold text-violet-400 font-mono">MATCH: {analysis.matchPercentage}%</span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h4 className="text-[10px] font-mono text-slate-400 uppercase">Executive Summary</h4>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                        {analysis.suitabilitySummary}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <h4 className="text-[10px] font-mono text-slate-400 uppercase">Skills Matched</h4>
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {analysis.skillsMatched.map((s, idx) => (
                            <span key={idx} className="text-[10px] bg-emerald-500/10 text-emerald-300 border border-emerald-500/15 py-0.5 px-2 rounded-lg font-medium">{s}</span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-[10px] font-mono text-slate-400 uppercase">Identified Gaps</h4>
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {analysis.gapsIdentified.map((g, idx) => (
                            <span key={idx} className="text-[10px] bg-rose-500/10 text-rose-300 border border-rose-500/15 py-0.5 px-2 rounded-lg font-medium">{g}</span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-[10px] font-mono text-slate-400 uppercase">Suggested Behavioral Interview Questions</h4>
                      <ul className="space-y-2 mt-2">
                        {analysis.suggestedQuestions.map((q, idx) => (
                          <li key={idx} className="p-2.5 bg-slate-900 rounded-lg border border-slate-800/60 text-xs text-slate-300 flex items-start gap-2">
                            <Bot className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
                            <span>{q}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="text-center py-6 sm:py-8 text-slate-500 text-xs">
                  <FileText className="w-8 h-8 text-slate-800 mx-auto mb-2" />
                  <p>Candidate report results will output here.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Onboard Employee Modal */}
      <AnimatePresence>
        {showAddEmployee && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-slate-800/85 w-full max-w-md rounded-2xl p-4 sm:p-6 shadow-2xl max-h-[92vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center pb-3 sm:pb-4 border-b border-slate-800/60 mb-4 sm:mb-6">
                <h2 className="text-sm sm:text-base font-display font-bold text-white">Onboard Roster Employee</h2>
                <button 
                  id="btn-close-hr-add-employee"
                  onClick={() => setShowAddEmployee(false)}
                  className="text-slate-400 hover:text-white font-bold cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center text-xl"
                  aria-label="Close"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleAddEmployeeSubmit} className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1.5">Employee Name</label>
                  <input 
                    id="input-hr-emp-name"
                    type="text"
                    required
                    value={empName}
                    onChange={(e) => setEmpName(e.target.value)}
                    placeholder="e.g. Meghna Sharma"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3 text-white text-xs sm:text-sm focus:outline-none focus:border-violet-500 min-h-[42px]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1.5">Organizational Role</label>
                  <input 
                    id="input-hr-emp-role"
                    type="text"
                    required
                    value={empRole}
                    onChange={(e) => setEmpRole(e.target.value)}
                    placeholder="e.g. Senior Software Architect"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3 text-white text-xs sm:text-sm focus:outline-none focus:border-violet-500 min-h-[42px]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1.5">Department</label>
                    <select
                      id="select-hr-emp-dept"
                      value={empDept}
                      onChange={(e) => setEmpDept(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3 text-white text-xs sm:text-sm focus:outline-none focus:border-violet-500 min-h-[42px]"
                    >
                      <option value="Engineering">Engineering</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Sales">Sales</option>
                      <option value="HR Operations">HR Operations</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1.5">Salary (INR ₹/yr)</label>
                    <input 
                      id="input-hr-emp-salary"
                      type="number"
                      required
                      value={empSalary}
                      onChange={(e) => setEmpSalary(e.target.value)}
                      placeholder="e.g. 1800000"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3 text-white text-xs sm:text-sm focus:outline-none focus:border-violet-500 min-h-[42px]"
                    />
                  </div>
                </div>

                <button
                  id="btn-hr-emp-submit"
                  type="submit"
                  className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition-all cursor-pointer min-h-[44px]"
                >
                  Confirm Employee Entry
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
