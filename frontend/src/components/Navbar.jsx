import React from "react";
import { 
  Sparkles, 
  FileText, 
  MessageSquareCode, 
  Map, 
  BarChart3, 
  LogOut, 
  ShieldCheck, 
  Lock,
  Menu,
  X
} from "lucide-react";

export function Navbar({ activeTab, setActiveTab, user, onOpenAuth, onLogout }) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "resume", label: "Resume Analyzer", icon: FileText, badge: "AI Scored" },
    { id: "interview", label: "Mock Interview AI", icon: MessageSquareCode, badge: "Interactive" },
    { id: "roadmap", label: "Skill Roadmap", icon: Map, badge: "Adaptive" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#0b0f19] border-b border-slate-800 shadow-md shadow-black/30 px-4 lg:px-8 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo */}
        <div 
          onClick={() => { if (user) setActiveTab("dashboard"); }} 
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-0.5 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-indigo-400 group-hover:rotate-12 transition-transform duration-300" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-white font-outfit">CareerPilot</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 font-semibold tracking-wider">AI</span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block font-medium">Accelerate Your Career Trajectory</p>
          </div>
        </div>

        {/* Desktop Navigation Tabs (Only shown when user is logged in) */}
        {user ? (
          <nav className="hidden md:flex items-center gap-1.5 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                    isActive 
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/20" 
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                  {item.badge && !isActive && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-800 text-indigo-400 border border-indigo-500/20 font-sans">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        ) : (
          <div className="hidden md:flex items-center gap-2 text-xs text-slate-400 font-medium px-4 py-1.5 rounded-full bg-slate-900/60 border border-slate-800">
            <Lock className="w-3.5 h-3.5 text-indigo-400" />
            <span>Sign in to unlock Dashboard, Resume Analyzer & Interview Studio</span>
          </div>
        )}

        {/* User Auth Controls */}
        <div className="hidden sm:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
                <div className="w-8 h-8 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-300 font-bold text-sm">
                  {user.name ? user.name[0].toUpperCase() : "U"}
                </div>
                <div className="text-left">
                  <div className="text-xs font-semibold text-white flex items-center gap-1">
                    {user.name}
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <div className="text-[10px] text-slate-400">{user.targetRole || "Fullstack Engineer"}</div>
                </div>
              </div>
              <button
                onClick={onLogout}
                title="Log Out"
                className="p-2.5 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span>Guest Mode (Not Registered)</span>
            </div>
          )}
        </div>

        {/* Mobile Menu Button (Only when user logged in) */}
        {user && (
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-300 hover:bg-slate-800"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        )}
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && user && (
        <div className="md:hidden mt-3 pt-3 border-t border-slate-800 flex flex-col gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive 
                    ? "bg-indigo-600 text-white font-semibold" 
                    : "text-slate-300 hover:bg-slate-800"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
          <div className="pt-2 border-t border-slate-800">
            <button
              onClick={() => {
                onLogout();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-rose-400 bg-rose-500/10 text-sm font-medium"
            >
              <LogOut className="w-4 h-4" /> Log Out ({user.name})
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
