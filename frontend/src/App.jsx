import React, { useState, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { Dashboard } from "./components/Dashboard";
import { ResumeAnalyzer } from "./components/ResumeAnalyzer";
import { MockInterviewStudio } from "./components/MockInterviewStudio";
import { SkillRoadmap } from "./components/SkillRoadmap";
import { AuthGate } from "./components/AuthGate";
import { api } from "./services/api";

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [user, setUser] = useState(null);
  const [loadingInitialAuth, setLoadingInitialAuth] = useState(true);

  // Global state metrics - initialized to 0 and synced with real user account
  const [resumeScore, setResumeScore] = useState(0);
  const [interviewScore, setInterviewScore] = useState(0);
  const [roadmapProgress, setRoadmapProgress] = useState(0);

  useEffect(() => {
    async function loadUserSession() {
      // Check local storage for existing authenticated user session
      const savedUserStr = localStorage.getItem("careerpilot_user");
      const savedToken = localStorage.getItem("careerpilot_token");

      if (savedUserStr && savedToken) {
        try {
          const parsed = JSON.parse(savedUserStr);
          setUser(parsed);
          setResumeScore(parsed.resumeScore || 0);
          setInterviewScore(parsed.interviewScore || 0);
          setRoadmapProgress(parsed.roadmapProgress || 0);

          // Fetch fresh updated user stats from database
          const freshUser = await api.getMe();
          if (freshUser) {
            setUser(freshUser);
            setResumeScore(freshUser.resumeScore || 0);
            setInterviewScore(freshUser.interviewScore || 0);
            setRoadmapProgress(freshUser.roadmapProgress || 0);
            localStorage.setItem("careerpilot_user", JSON.stringify(freshUser));
          }
        } catch (e) {
          console.error("Failed to parse user session", e);
          localStorage.removeItem("careerpilot_user");
          localStorage.removeItem("careerpilot_token");
        }
      }
      setLoadingInitialAuth(false);
    }

    loadUserSession();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("careerpilot_token");
    localStorage.removeItem("careerpilot_user");
    setUser(null);
    setResumeScore(0);
    setInterviewScore(0);
    setRoadmapProgress(0);
    setActiveTab("dashboard");
  };

  const handleAuthSuccess = (authenticatedUser) => {
    setUser(authenticatedUser);
    setResumeScore(authenticatedUser.resumeScore || 0);
    setInterviewScore(authenticatedUser.interviewScore || 0);
    setRoadmapProgress(authenticatedUser.roadmapProgress || 0);
    localStorage.setItem("careerpilot_user", JSON.stringify(authenticatedUser));
    setActiveTab("dashboard");
  };

  const handleResumeScoreUpdate = async (newScore, analysisData) => {
    setResumeScore(newScore);
    const updatedUser = {
      ...user,
      resumeScore: newScore,
      lastResumeAnalysis: analysisData || user?.lastResumeAnalysis
    };
    setUser(updatedUser);
    localStorage.setItem("careerpilot_user", JSON.stringify(updatedUser));
    await api.updateUserStats({
      resumeScore: newScore,
      lastResumeAnalysis: analysisData || user?.lastResumeAnalysis
    });
  };

  const handleInterviewScoreUpdate = async (newScore) => {
    setInterviewScore(newScore);
    const updatedUser = {
      ...user,
      interviewScore: newScore
    };
    setUser(updatedUser);
    localStorage.setItem("careerpilot_user", JSON.stringify(updatedUser));
    await api.updateUserStats({
      interviewScore: newScore
    });
  };

  const handleRoadmapProgressUpdate = async (newProgress, completedNodesList) => {
    setRoadmapProgress(newProgress);
    const updatedUser = {
      ...user,
      roadmapProgress: newProgress,
      completedNodes: completedNodesList || user?.completedNodes || []
    };
    setUser(updatedUser);
    localStorage.setItem("careerpilot_user", JSON.stringify(updatedUser));
    await api.updateUserStats({
      roadmapProgress: newProgress,
      completedNodes: completedNodesList || user?.completedNodes || []
    });
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
      
      {/* Top Navigation */}
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
                onScoreUpdate={handleResumeScoreUpdate}
              />
            )}

            {activeTab === "interview" && (
              <MockInterviewStudio
                user={user}
                onScoreUpdate={handleInterviewScoreUpdate}
              />
            )}

            {activeTab === "roadmap" && (
              <SkillRoadmap
                user={user}
                onProgressUpdate={handleRoadmapProgressUpdate}
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
