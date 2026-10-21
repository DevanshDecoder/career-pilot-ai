import React from "react";
import { 
  TrendingUp, 
  FileText, 
  MessageSquareCode, 
  Map, 
  CheckCircle2, 
  ArrowRight, 
  Target, 
  Zap, 
  BrainCircuit
} from "lucide-react";

export function Dashboard({ user, onNavigate, resumeScore, interviewScore, roadmapProgress }) {
  const readinessIndex = Math.round((resumeScore + interviewScore + roadmapProgress) / 3);

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/60 to-purple-950/40 p-8 border border-indigo-500/20 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
              <Zap className="w-3.5 h-3.5" />
              <span>AI Career Readiness Assistant</span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
              Welcome back, <span className="gradient-text">{user?.name || "Career Pilot"}</span> 👋
            </h1>
            <p className="text-slate-300 text-sm lg:text-base leading-relaxed">
              Your target role: <strong className="text-indigo-400 font-semibold">{user?.targetRole || "Full Stack Engineer"}</strong>. 
              Let's analyze your resume, practice AI mock interviews, and complete your custom skill roadmap today.
            </p>
          </div>

          {/* Overall Readiness Gauge Card */}
          <div className="w-full md:w-auto glass-panel p-6 rounded-2xl border border-indigo-500/30 flex items-center gap-5 shrink-0 bg-slate-900/90 shadow-xl">
            <div className="relative w-20 h-20 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-800"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-indigo-500"
                  strokeDasharray={`${readinessIndex}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-xl font-black text-white font-outfit">{readinessIndex}%</span>
                <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Ready</span>
              </div>
            </div>

            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Career Readiness</div>
              <div className="text-lg font-bold text-white font-outfit mt-0.5">
                {readinessIndex >= 80 ? "Top Tier Candidate" : readinessIndex >= 65 ? "Market Ready" : "Building Skills"}
              </div>
              <div className="text-xs text-indigo-300 mt-1 flex items-center gap-1 font-medium">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+12% vs last week</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Core Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Metric 1: Resume Score */}
        <div className="glass-panel p-6 rounded-2xl glass-panel-hover border border-slate-800 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <FileText className="w-6 h-6" />
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">
              ATS Optimized
            </span>
          </div>
          <div>
            <div className="text-xs font-medium text-slate-400">Resume Match Score</div>
            <div className="text-3xl font-extrabold text-white font-outfit mt-1">{resumeScore}%</div>
            <p className="text-xs text-slate-400 mt-1">High ATS keywords match for top tech recruiters.</p>
          </div>
          <button
            onClick={() => onNavigate("resume")}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-800 hover:bg-indigo-600/30 text-indigo-300 hover:text-white text-xs font-semibold transition-all border border-slate-700 hover:border-indigo-500/50"
          >
            <span>Scan & Improve Resume</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Metric 2: Interview Performance */}
        <div className="glass-panel p-6 rounded-2xl glass-panel-hover border border-slate-800 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <MessageSquareCode className="w-6 h-6" />
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-300 font-semibold border border-purple-500/20">
              AI Evaluated
            </span>
          </div>
          <div>
            <div className="text-xs font-medium text-slate-400">Mock Interview Grade</div>
            <div className="text-3xl font-extrabold text-white font-outfit mt-1">{interviewScore}%</div>
            <p className="text-xs text-slate-400 mt-1">Evaluated on STAR framework & technical accuracy.</p>
          </div>
          <button
            onClick={() => onNavigate("interview")}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-800 hover:bg-purple-600/30 text-purple-300 hover:text-white text-xs font-semibold transition-all border border-slate-700 hover:border-purple-500/50"
          >
            <span>Launch Mock Interview</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Metric 3: Roadmap Progress */}
        <div className="glass-panel p-6 rounded-2xl glass-panel-hover border border-slate-800 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-400">
              <Map className="w-6 h-6" />
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-pink-500/10 text-pink-300 font-semibold border border-pink-500/20">
              3 Phases
            </span>
          </div>
          <div>
            <div className="text-xs font-medium text-slate-400">Skill Roadmap Progress</div>
            <div className="text-3xl font-extrabold text-white font-outfit mt-1">{roadmapProgress}%</div>
            <p className="text-xs text-slate-400 mt-1">Milestone objectives completed for target role.</p>
          </div>
          <button
            onClick={() => onNavigate("roadmap")}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-800 hover:bg-pink-600/30 text-pink-300 hover:text-white text-xs font-semibold transition-all border border-slate-700 hover:border-pink-500/50"
          >
            <span>View Skill Roadmap</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* AI Recommendations & Quick Launch Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: AI Career Insights */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
                  <BrainCircuit className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white font-outfit">AI Recommended Action Items</h3>
                  <p className="text-xs text-slate-400">Personalized steps based on your current performance</p>
                </div>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 font-medium">3 Priorities</span>
            </div>

            <div className="space-y-3">
              
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-4 hover:border-indigo-500/30 transition-all">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-white">Add System Design & Docker to Resume</h4>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-medium">High Impact</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">Scanning identified Docker and Microservices as top missing keywords for {user?.targetRole || "Fullstack Engineer"}.</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-4 hover:border-indigo-500/30 transition-all">
                <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 mt-0.5">
                  <MessageSquareCode className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-white">Practice STAR Behavioral Response</h4>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-medium">Medium Priority</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">Improve your mock interview score by including quantifiable metrics in your resolution outcomes.</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-4 hover:border-indigo-500/30 transition-all">
                <div className="p-2 rounded-lg bg-pink-500/10 text-pink-400 mt-0.5">
                  <Map className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-white">Complete Phase 2: JWT Security Module</h4>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-pink-500/20 text-pink-300 font-medium">In Progress</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">Finish the express authorization middleware project to bump your roadmap progress to 50%.</p>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Right 1 Col: Quick Pilot Tools */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="font-bold text-base text-white font-outfit flex items-center gap-2">
              <Target className="w-4 h-4 text-indigo-400" /> Quick Launch Studio
            </h3>
            
            <div 
              onClick={() => onNavigate("resume")}
              className="p-4 rounded-xl bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 hover:border-indigo-500/40 cursor-pointer transition-all space-y-2 group"
            >
              <div className="flex items-center justify-between text-indigo-400">
                <span className="text-xs font-bold uppercase tracking-wider">AI Resume Scan</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
              <p className="text-xs text-slate-300 font-medium">Upload resume for instant ATS match & keyword recommendations.</p>
            </div>

            <div 
              onClick={() => onNavigate("interview")}
              className="p-4 rounded-xl bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 hover:border-purple-500/40 cursor-pointer transition-all space-y-2 group"
            >
              <div className="flex items-center justify-between text-purple-400">
                <span className="text-xs font-bold uppercase tracking-wider">Mock Interview AI</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
              <p className="text-xs text-slate-300 font-medium">Practice real technical & system design interview scenarios.</p>
            </div>

            <div 
              onClick={() => onNavigate("roadmap")}
              className="p-4 rounded-xl bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 hover:border-pink-500/40 cursor-pointer transition-all space-y-2 group"
            >
              <div className="flex items-center justify-between text-pink-400">
                <span className="text-xs font-bold uppercase tracking-wider">Adaptive Roadmap</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
              <p className="text-xs text-slate-300 font-medium">Generate a step-by-step 3-month milestone career path.</p>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
