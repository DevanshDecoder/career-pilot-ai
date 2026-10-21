import React, { useState } from "react";
import { 
  Sparkles, 
  User, 
  Lock, 
  Mail, 
  Target, 
  ArrowRight, 
  AlertCircle, 
  FileText, 
  MessageSquareCode, 
  Map, 
  ShieldCheck, 
  Zap,
  LogIn,
  UserPlus,
  UserCheck
} from "lucide-react";
import { api } from "../services/api";

export function AuthGate({ onAuthSuccess }) {
  // Default to Register first as requested by the user
  const [isRegister, setIsRegister] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [targetRole, setTargetRole] = useState("Fullstack Engineer");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showAlreadyRegisteredModal, setShowAlreadyRegisteredModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isRegister) {
        const data = await api.register(name, email, password, targetRole);
        localStorage.setItem("careerpilot_token", data.token);
        localStorage.setItem("careerpilot_user", JSON.stringify(data.user));
        onAuthSuccess(data.user);
      } else {
        const data = await api.login(email, password);
        localStorage.setItem("careerpilot_token", data.token);
        localStorage.setItem("careerpilot_user", JSON.stringify(data.user));
        onAuthSuccess(data.user);
      }
    } catch (err) {
      if (isRegister && (err.code === "USER_ALREADY_EXISTS" || err.message?.toLowerCase().includes("already registered") || err.message?.toLowerCase().includes("already exists"))) {
        setShowAlreadyRegisteredModal(true);
      } else {
        setError(err.message || (isRegister ? "Registration failed" : "Login failed"));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await api.login("alex@careerpilot.ai", "demo123");
      localStorage.setItem("careerpilot_token", data.token);
      localStorage.setItem("careerpilot_user", JSON.stringify(data.user));
      onAuthSuccess(data.user);
    } catch (err) {
      setError("Demo login failed");
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: FileText,
      color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
      title: "AI ATS Resume Scanner",
      desc: "Instant ATS score calculation, keyword match audit & PDF text parser."
    },
    {
      icon: MessageSquareCode,
      color: "text-purple-400 bg-purple-500/10 border-purple-500/20",
      title: "Interactive Mock Interview AI",
      desc: "Real-time STAR behavioral & technical answers evaluation with scoring."
    },
    {
      icon: Map,
      color: "text-pink-400 bg-pink-500/10 border-pink-500/20",
      title: "Adaptive Career Roadmaps",
      desc: "Visual milestone progression graph tailored to your target engineering role."
    }
  ];

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-6 px-4">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Column: Platform Showcase Banner */}
        <div className="lg:col-span-6 space-y-6 text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold shadow-lg shadow-indigo-500/10">
            <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
            <span>Authentication Gateway</span>
          </div>

          <div className="space-y-3">
            <h1 className="text-4xl sm:text-5xl font-black text-white font-outfit tracking-tight leading-tight">
              Unlock Your <span className="gradient-text">AI Career Copilot</span>
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Please register or sign in to access your personalized ATS resume scanner, AI mock interview studio, and skill roadmaps.
            </p>
          </div>

          {/* Feature Highlights Cards */}
          <div className="space-y-3 pt-2">
            {features.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div 
                  key={idx}
                  className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-start gap-3.5 hover:border-indigo-500/30 transition-all"
                >
                  <div className={`p-2 rounded-xl border ${item.color} shrink-0 mt-0.5`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white">{item.title}</h3>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400 pt-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Encrypted with JWT Authentication & MongoDB Atlas Cloud</span>
          </div>
        </div>

        {/* Right Column: Register / Sign In Card */}
        <div className="lg:col-span-6">
          <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-indigo-500/30 shadow-2xl space-y-6 bg-slate-900/90 relative overflow-hidden">
            
            {/* Top Auth Tab Toggle */}
            <div className="flex items-center p-1 rounded-2xl bg-slate-950 border border-slate-800">
              <button
                type="button"
                onClick={() => { setIsRegister(true); setError(""); }}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isRegister
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/30"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <UserPlus className="w-4 h-4" />
                <span>Register (New User)</span>
              </button>

              <button
                type="button"
                onClick={() => { setIsRegister(false); setError(""); }}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  !isRegister
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/30"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In (Existing User)</span>
              </button>
            </div>

            {/* Form Title */}
            <div className="space-y-1">
              <h2 className="text-2xl font-extrabold text-white font-outfit">
                {isRegister ? "Create Your Account" : "Welcome Back"}
              </h2>
              <p className="text-xs text-slate-400">
                {isRegister 
                  ? "Enter your details below to create your account and unlock access." 
                  : "Sign in with your email and password to continue."}
              </p>
            </div>

            {/* Error Message Alert */}
            {error && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5 animate-shake">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {isRegister && (
                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-semibold text-slate-300">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Devansh Sharma"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5 text-left">
                <label className="text-xs font-semibold text-slate-300">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. devansh@example.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5 text-left">
                <label className="text-xs font-semibold text-slate-300">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>

              {isRegister && (
                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-semibold text-slate-300">Target Role</label>
                  <div className="relative">
                    <Target className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                    <select
                      value={targetRole}
                      onChange={(e) => setTargetRole(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
                    >
                      <option value="Fullstack Engineer">Fullstack Engineer</option>
                      <option value="Frontend Engineer">Frontend Engineer</option>
                      <option value="Backend Engineer">Backend Engineer</option>
                      <option value="Data Scientist">Data Scientist</option>
                      <option value="DevOps Engineer">DevOps Engineer</option>
                    </select>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 hover:opacity-95 transition-all mt-2 disabled:opacity-50 cursor-pointer"
              >
                <span>{loading ? "Processing..." : isRegister ? "Create Account & Unlock Access" : "Sign In & Access Platform"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Quick Demo Login Option */}
            <div className="pt-2 border-t border-slate-800/80 flex flex-col gap-3">
              <button
                type="button"
                onClick={handleDemoLogin}
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 font-semibold text-xs transition-all border border-indigo-500/20 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Instant 1-Click Demo Login</span>
              </button>

              <p className="text-xs text-slate-400 text-center">
                {isRegister ? (
                  <>
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => { setIsRegister(false); setError(""); }}
                      className="text-indigo-400 hover:underline font-bold"
                    >
                      Sign In here
                    </button>
                  </>
                ) : (
                  <>
                    Don't have an account yet?{" "}
                    <button
                      type="button"
                      onClick={() => { setIsRegister(true); setError(""); }}
                      className="text-indigo-400 hover:underline font-bold"
                    >
                      Register now
                    </button>
                  </>
                )}
              </p>
            </div>

          </div>
        </div>

      </div>

      {/* Already Registered Pop-up Modal */}
      {showAlreadyRegisteredModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md p-6 sm:p-8 rounded-3xl bg-slate-900 border border-amber-500/40 shadow-2xl space-y-5 text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <UserCheck className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-extrabold text-white font-outfit">
                Account Already Registered!
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                An account with email <strong className="text-amber-400 underline">{email}</strong> already exists in CareerPilot AI.
              </p>
              <p className="text-xs text-slate-400">
                You do not need to register again. Would you like to sign in directly?
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowAlreadyRegisteredModal(false);
                  setIsRegister(false);
                  setError("");
                }}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 hover:opacity-95 transition-all cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In to Your Account</span>
              </button>

              <button
                type="button"
                onClick={() => setShowAlreadyRegisteredModal(false)}
                className="py-3 px-4 rounded-xl bg-slate-800 text-slate-400 hover:text-white text-xs font-semibold transition-all cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
