import React, { useState } from "react";
import { X, Sparkles, User, Lock, Mail, Target, ArrowRight, AlertCircle } from "lucide-react";
import { api } from "../services/api";

export function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [targetRole, setTargetRole] = useState("Fullstack Engineer");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

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
      onClose();
    } catch (err) {
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    try {
      const data = await api.login("alex@careerpilot.ai", "demo123");
      localStorage.setItem("careerpilot_token", data.token);
      localStorage.setItem("careerpilot_user", JSON.stringify(data.user));
      onAuthSuccess(data.user);
      onClose();
    } catch (err) {
      setError("Demo login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md glass-panel p-8 rounded-3xl border border-indigo-500/30 shadow-2xl space-y-6 bg-slate-900/95">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-white font-outfit">
            {isRegister ? "Create CareerPilot Account" : "Welcome Back"}
          </h2>
          <p className="text-xs text-slate-400">
            {isRegister ? "Join thousands of engineers accelerating their career." : "Sign in to access your saved resume scores and AI roadmaps."}
          </p>
        </div>

        {/* Error alert */}
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {isRegister && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Dev"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@careerpilot.ai"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {isRegister && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Target Role</label>
              <div className="relative">
                <Target className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <select
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-indigo-500"
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
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 hover:opacity-95 transition-all"
          >
            <span>{isRegister ? "Create Account & Sign In" : "Sign In"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Button */}
        <div className="pt-2 border-t border-slate-800 flex flex-col gap-3">
          <button
            onClick={handleDemoLogin}
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 font-semibold text-xs transition-all border border-indigo-500/20"
          >
            ⚡ Instant Demo Login (1-Click)
          </button>

          <button
            onClick={() => setIsRegister(!isRegister)}
            className="text-xs text-slate-400 hover:text-slate-200 text-center font-medium"
          >
            {isRegister ? "Already have an account? Sign In" : "Don't have an account? Register now"}
          </button>
        </div>

      </div>
    </div>
  );
}
