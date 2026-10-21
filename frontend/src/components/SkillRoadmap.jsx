import React, { useState, useEffect } from "react";
import { 
  Map, 
  CheckCircle2, 
  Circle, 
  FolderGit2, 
  Clock,
  RefreshCw
} from "lucide-react";
import { api } from "../services/api";

export function SkillRoadmap({ user, onProgressUpdate }) {
  const [targetRole, setTargetRole] = useState(user?.targetRole || "Fullstack Engineer");
  const [timeframe, setTimeframe] = useState("3 Months");
  const [loading, setLoading] = useState(false);
  const [roadmapData, setRoadmapData] = useState(null);
  const [completedNodes, setCompletedNodes] = useState(() => {
    if (user?.completedNodes && Array.isArray(user.completedNodes) && user.completedNodes.length > 0) {
      return new Set(user.completedNodes);
    }
    return new Set(["phase1-node0", "phase1-node1"]);
  });

  useEffect(() => {
    if (user?.completedNodes && Array.isArray(user.completedNodes)) {
      setCompletedNodes(new Set(user.completedNodes));
    }
  }, [user?.completedNodes]);

  useEffect(() => {
    fetchRoadmap(targetRole, timeframe);
  }, [targetRole, timeframe]);

  const fetchRoadmap = async (role, tf) => {
    setLoading(true);
    try {
      const res = await api.generateRoadmap(role, tf);
      setRoadmapData(res.roadmap);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleNode = (nodeId) => {
    const next = new Set(completedNodes);
    if (next.has(nodeId)) {
      next.delete(nodeId);
    } else {
      next.add(nodeId);
    }
    setCompletedNodes(next);

    // Calculate updated progress
    if (roadmapData?.phases) {
      const totalCount = roadmapData.phases.reduce((acc, p) => acc + p.nodes.length, 0);
      const newProgress = Math.round((next.size / totalCount) * 100);
      if (onProgressUpdate) {
        onProgressUpdate(newProgress, Array.from(next));
      }
    }
  };

  const totalNodesCount = roadmapData?.phases?.reduce((acc, p) => acc + p.nodes.length, 0) || 9;
  const progressPercent = Math.round((completedNodes.size / totalNodesCount) * 100);

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Top Controls Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-pink-500/10 text-pink-400">
              <Map className="w-5 h-5" />
            </span>
            <h2 className="text-2xl font-extrabold text-white font-outfit">Adaptive Skill Roadmap Engine</h2>
          </div>
          <p className="text-slate-400 text-xs md:text-sm">
            Step-by-step career progression graph tailored to target role and milestones.
          </p>
        </div>

        {/* Customization controls */}
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            className="bg-slate-900 border border-pink-500/30 text-pink-300 text-xs font-semibold rounded-xl px-3 py-2 outline-none"
          >
            <option value="Fullstack Engineer">Fullstack Engineer</option>
            <option value="Frontend Engineer">Frontend Engineer</option>
            <option value="Backend Engineer">Backend Engineer</option>
            <option value="Data Scientist">Data Scientist</option>
            <option value="DevOps Engineer">DevOps Engineer</option>
          </select>

          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-slate-300 text-xs font-semibold rounded-xl px-3 py-2 outline-none"
          >
            <option value="1 Month">1 Month Fast-track</option>
            <option value="3 Months">3 Months Standard</option>
            <option value="6 Months">6 Months Comprehensive</option>
          </select>
        </div>
      </div>

      {/* Progress Overview Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-pink-500/20 bg-gradient-to-r from-slate-950 via-slate-900 to-pink-950/30 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-pink-400">Overall Skill Mastery</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 font-semibold">{timeframe}</span>
          </div>
          <h3 className="text-2xl font-black text-white font-outfit">{targetRole} Career Path</h3>
          <p className="text-xs text-slate-400">Check off nodes as you learn to update your global readiness score.</p>
        </div>

        {/* Progress bar */}
        <div className="w-full md:w-72 space-y-2">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-slate-400">Roadmap Progress</span>
            <span className="text-pink-400 font-outfit">{progressPercent}%</span>
          </div>
          <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden p-0.5 border border-slate-700">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Roadmap Timeline Nodes */}
      {loading ? (
        <div className="glass-panel p-12 rounded-3xl border border-slate-800 flex items-center justify-center text-center space-y-3">
          <RefreshCw className="w-6 h-6 text-pink-400 animate-spin" />
          <span className="text-sm font-semibold text-slate-300">Generating Adaptive Career Roadmap...</span>
        </div>
      ) : (
        <div className="space-y-8">
          {roadmapData?.phases.map((phase, pIdx) => (
            <div 
              key={phase.id} 
              className="glass-panel p-6 md:p-8 rounded-3xl border border-slate-800 space-y-6 relative overflow-hidden"
            >
              {/* Phase Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-600 to-purple-600 flex items-center justify-center text-white font-extrabold font-outfit text-sm shadow-md shadow-pink-500/20">
                    0{pIdx + 1}
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-white font-outfit">{phase.title}</h3>
                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-pink-400" /> {phase.duration}</span>
                      <span>•</span>
                      <span className="text-pink-300 font-semibold">{phase.nodes.length} Key Skill Modules</span>
                    </div>
                  </div>
                </div>

                <span className="text-xs px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-slate-300 font-semibold self-start md:self-auto">
                  Phase {pIdx + 1}
                </span>
              </div>

              {/* Node Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {phase.nodes.map((node, nIdx) => {
                  const nodeId = `${phase.id}-node${nIdx}`;
                  const isChecked = completedNodes.has(nodeId);

                  return (
                    <div
                      key={nodeId}
                      onClick={() => toggleNode(nodeId)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                        isChecked 
                          ? "bg-slate-900/90 border-emerald-500/40 shadow-lg shadow-emerald-500/10" 
                          : "bg-slate-950/60 border-slate-800 hover:border-slate-700"
                      }`}
                    >
                      <button className="mt-0.5">
                        {isChecked ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                        ) : (
                          <Circle className="w-5 h-5 text-slate-600 shrink-0" />
                        )}
                      </button>
                      <div className="space-y-1">
                        <div className={`text-xs font-bold ${isChecked ? "text-emerald-300 line-through decoration-emerald-500/50" : "text-white"}`}>
                          {node.name}
                        </div>
                        <span className="inline-block text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                          {node.type}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Capstone Milestone Project for Phase */}
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-indigo-500/30 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
                    <FolderGit2 className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400">Capstone Portfolio Project</span>
                    <p className="text-xs text-white font-medium mt-0.5">{phase.project}</p>
                  </div>
                </div>

                <span className="text-xs px-3 py-1.5 rounded-xl bg-indigo-600 text-white font-bold shrink-0 hidden sm:inline-block">
                  Build & Add to GitHub
                </span>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
