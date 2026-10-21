import React, { useState, useEffect } from "react";
import { 
  MessageSquareCode, 
  Sparkles, 
  Send, 
  CheckCircle2, 
  HelpCircle, 
  Award, 
  RefreshCw, 
  BookOpen,
  TrendingUp,
  Brain
} from "lucide-react";
import { api } from "../services/api";

export function MockInterviewStudio({ user, onScoreUpdate }) {
  const [role, setRole] = useState(user?.targetRole || "Fullstack Engineer");
  const [category, setCategory] = useState("All");
  const [difficulty, setDifficulty] = useState("All");
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [evaluating, setEvaluating] = useState(false);
  const [evalResult, setEvalResult] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [loadingQuestions, setLoadingQuestions] = useState(false);

  useEffect(() => {
    loadQuestions(role, category, difficulty);
  }, [role, category, difficulty]);

  const loadQuestions = async (targetRole = role, targetCategory = category, targetDifficulty = difficulty) => {
    setLoadingQuestions(true);
    try {
      const qList = await api.getInterviewQuestions(targetRole, targetCategory, targetDifficulty);
      setQuestions(qList || []);
      setCurrentIdx(0);
      setUserAnswer("");
      setEvalResult(null);
      setShowHint(false);
    } catch (err) {
      console.error("Failed to load interview questions:", err);
    } finally {
      setLoadingQuestions(false);
    }
  };

  const handleEvaluate = async () => {
    if (!userAnswer || userAnswer.trim().length === 0) return;
    setEvaluating(true);

    try {
      const q = questions[currentIdx];
      const data = await api.evaluateAnswer(q.id, q.question, userAnswer);
      setEvalResult(data.evaluation);
      if (onScoreUpdate && data.evaluation?.score) {
        onScoreUpdate(data.evaluation.score);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setEvaluating(false);
    }
  };

  const currentQ = questions[currentIdx] || {
    question: "Loading question prompt...",
    category: "Technical",
    difficulty: "Mid-Level",
    hint: "Think about architecture, state, and edge cases."
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Top Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <MessageSquareCode className="w-5 h-5" />
            </span>
            <h2 className="text-2xl font-extrabold text-white font-outfit">AI Mock Interview Studio</h2>
          </div>
          <p className="text-slate-400 text-xs md:text-sm">
            Practice real technical & behavioral questions with real-time AI scoring and model answer hints.
          </p>
        </div>

        {/* Question Selector & Role */}
        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="bg-slate-900 border border-purple-500/30 text-purple-300 text-xs font-semibold rounded-xl px-3 py-2 outline-none cursor-pointer hover:border-purple-500/50 transition-colors"
          >
            <option value="Fullstack Engineer">Fullstack Engineer</option>
            <option value="Frontend Engineer">Frontend Engineer</option>
            <option value="Backend Engineer">Backend Engineer</option>
            <option value="Data Scientist">Data Scientist</option>
          </select>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-slate-300 text-xs font-semibold rounded-xl px-3 py-2 outline-none cursor-pointer hover:border-slate-600 transition-colors"
          >
            <option value="All">All Categories</option>
            <option value="Technical">Technical</option>
            <option value="System Design">System Design</option>
            <option value="Behavioral">Behavioral</option>
          </select>

          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-slate-300 text-xs font-semibold rounded-xl px-3 py-2 outline-none cursor-pointer hover:border-slate-600 transition-colors"
          >
            <option value="All">All Difficulties</option>
            <option value="Junior">Junior</option>
            <option value="Mid-Level">Mid-Level</option>
            <option value="Senior">Senior</option>
          </select>
          
          <button
            onClick={() => loadQuestions(role, category, difficulty)}
            disabled={loadingQuestions}
            className="px-3 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 transition-all border border-purple-500/30 flex items-center gap-1.5 text-xs font-bold"
            title="Shuffle & Get New Questions"
          >
            <Sparkles className={`w-3.5 h-3.5 ${loadingQuestions ? "animate-spin" : ""}`} />
            <span>Shuffle</span>
          </button>
        </div>
      </div>

      {/* Main Studio Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Question Card & Answer Workspace */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Question Box */}
          <div className="glass-panel p-6 rounded-3xl border border-purple-500/30 space-y-4 bg-slate-900/90 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30">
                  Question {currentIdx + 1} of {questions.length || 1}
                </span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 font-medium border border-slate-700/50">
                  {currentQ.category || "General"}
                </span>
                {currentQ.difficulty && (
                  <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold border ${
                    currentQ.difficulty === "Senior" 
                      ? "bg-rose-500/15 text-rose-300 border-rose-500/30" 
                      : currentQ.difficulty === "Mid-Level"
                      ? "bg-amber-500/15 text-amber-300 border-amber-500/30"
                      : "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                  }`}>
                    {currentQ.difficulty}
                  </span>
                )}
              </div>
              <button
                onClick={() => setShowHint(!showHint)}
                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>{showHint ? "Hide Hint" : "View AI Hint"}</span>
              </button>
            </div>

            <h3 className="text-lg md:text-xl font-bold text-white leading-relaxed font-outfit">
              "{currentQ.question}"
            </h3>

            {showHint && (
              <div className="p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-xs text-indigo-200 leading-relaxed animate-fade-in">
                <strong className="text-indigo-300">AI Prompt Hint:</strong> {currentQ.hint}
              </div>
            )}
          </div>

          {/* Answer Input Area */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Brain className="w-4 h-4 text-purple-400" /> Your Response (Text / Speech STAR Method)
              </label>
              <span className="text-[11px] text-slate-500 font-mono">
                {userAnswer.trim().split(/\s+/).filter(Boolean).length} words
              </span>
            </div>

            <textarea
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              rows={6}
              placeholder="Type your response here using the STAR method (Situation, Task, Action, Result)..."
              className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl p-4 text-xs font-sans text-slate-200 placeholder-slate-600 focus:outline-none focus:border-purple-500/50 resize-none leading-relaxed"
            />

            <div className="flex items-center justify-between pt-2">
              <div className="flex gap-2">
                {questions.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setCurrentIdx(i);
                      setEvalResult(null);
                    }}
                    className={`w-8 h-8 rounded-xl text-xs font-bold transition-all ${
                      currentIdx === i
                        ? "bg-purple-600 text-white shadow-md shadow-purple-500/30"
                        : "bg-slate-900 text-slate-400 hover:bg-slate-800 border border-slate-800"
                    }`}
                  >
                    Q{i + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={handleEvaluate}
                disabled={evaluating || !userAnswer.trim()}
                className={`px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs shadow-lg shadow-purple-500/25 flex items-center gap-2 transition-all ${
                  evaluating ? "opacity-75 cursor-wait" : "hover:opacity-95"
                }`}
              >
                {evaluating ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Evaluating Response...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit & Score Answer</span>
                  </>
                )}
              </button>
            </div>

          </div>

        </div>

        {/* Right 1 Col: AI Evaluation Scorecard */}
        <div className="space-y-6">
          {evalResult ? (
            <div className="glass-panel p-6 rounded-3xl border border-purple-500/40 space-y-6 animate-fade-in">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900 border border-purple-500/30">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Response Rating</span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-3xl font-black text-white font-outfit">{evalResult.score}%</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-extrabold border border-purple-500/40">
                      Grade {evalResult.grade}
                    </span>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-purple-500/20 text-purple-400">
                  <Award className="w-6 h-6" />
                </div>
              </div>

              {/* Strengths */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Strong Points
                </h4>
                <ul className="space-y-1.5 pl-1">
                  {evalResult.strengths.map((s, i) => (
                    <li key={i} className="text-xs text-slate-300 leading-relaxed flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 mt-1.5" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Areas to Improve */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4" /> Recommended Adjustments
                </h4>
                <ul className="space-y-1.5 pl-1">
                  {evalResult.improvements.map((imp, i) => (
                    <li key={i} className="text-xs text-slate-300 leading-relaxed flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-1.5" />
                      <span>{imp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Model Answer Hint */}
              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5">
                <div className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5" /> Ideal Model Response Guide
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {evalResult.modelAnswerHint}
                </p>
              </div>

            </div>
          ) : (
            <div className="h-full glass-panel p-8 rounded-3xl border border-slate-800 flex flex-col items-center justify-center text-center space-y-4 min-h-[350px]">
              <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <MessageSquareCode className="w-7 h-7" />
              </div>
              <div className="space-y-1 max-w-xs">
                <h3 className="text-base font-bold text-white font-outfit">AI Interview Evaluator</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Type your answer to Question {currentIdx + 1} and click <strong>"Submit & Score Answer"</strong> to view your detailed score breakdown.
                </p>
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
