import React, { useState, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { Dashboard } from "./components/Dashboard";
import { ResumeAnalyzer } from "./components/ResumeAnalyzer";
import { MockInterviewStudio } from "./components/MockInterviewStudio";
import { SkillRoadmap } from "./components/SkillRoadmap";
import { AuthGate } from "./components/AuthGate";

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [user, setUser] = useState(null);
  const [loadingInitialAuth, setLoadingInitialAuth] = useState(true);

  // Global state metrics
  const [resumeScore, setResumeScore] = useState(82);
  const [interviewScore, setInterviewScore] = useState(88);
  const [roadmapProgress, setRoadmapProgress] = useState(35);

  useEffect(() => {
    // Check local storage for existing authenticated user session
    const savedUser = localStorage.getItem("careerpilot_user");
    const savedToken = localStorage.getItem("careerpilot_token");

    if (savedUser && savedToken) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Failed to parse user session", e);
        localStorage.removeItem("careerpilot_user");
        localStorage.removeItem("careerpilot_token");
      }
    }
    setLoadingInitialAuth(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("careerpilot_token");
    localStorage.removeItem("careerpilot_user");
    setUser(null);
    setActiveTab("dashboard");
  };

  const handleAuthSuccess = (authenticatedUser) => {
    setUser(authenticatedUser);
    setActiveTab("dashboard");
  };

  if (loadingInitialAuth) {
    return (
      <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center text-slate-400">
        <div className="animate-pulse flex items-center gap-2">
          <span>Loading CareerPilot AI...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* Top Glass Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        onOpenAuth={() => {}}
        onLogout={handleLogout}
      />

      {/* Main Container Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-8">
        {!user ? (
          /* Authentication Gate: User MUST register or sign in first */
          <AuthGate onAuthSuccess={handleAuthSuccess} />
        ) : (
          /* Full Application Functionality unlocked after sign in */
          <>
            {activeTab === "dashboard" && (
              <Dashboard
                user={user}
                onNavigate={setActiveTab}
                resumeScore={resumeScore}
                interviewScore={interviewScore}
                roadmapProgress={roadmapProgress}
              />
            )}

            {activeTab === "resume" && (
              <ResumeAnalyzer
                user={user}
                onScoreUpdate={(score) => setResumeScore(score)}
              />
            )}

            {activeTab === "interview" && (
              <MockInterviewStudio
                user={user}
                onScoreUpdate={(score) => setInterviewScore(score)}
              />
            )}

            {activeTab === "roadmap" && (
              <SkillRoadmap
                user={user}
                onProgressUpdate={(prog) => setRoadmapProgress(prog)}
              />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-8 px-4 lg:px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white font-outfit">CareerPilot AI</span>
            <span>• Full-Stack AI Career Advancement Platform</span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-indigo-400 font-mono">React + Vite</span>
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-purple-400 font-mono">Tailwind CSS</span>
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-pink-400 font-mono">Node.js + Express</span>
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-emerald-400 font-mono">MongoDB Atlas + JWT</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
