import React, { useState, useRef } from "react";
import { 
  FileText, 
  Sparkles, 
  CheckCircle, 
  AlertTriangle, 
  UploadCloud, 
  RefreshCw, 
  Award, 
  Check, 
  X,
  Target,
  FileCheck,
  Zap,
  Paperclip,
  BarChart2,
  TrendingUp,
  Sliders
} from "lucide-react";
import confetti from "canvas-confetti";
import * as pdfjsLib from "pdfjs-dist";
import { api } from "../services/api";

// Set up pdf.js worker URL
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

const SAMPLE_RESUMES = {
  "Fullstack Engineer": `Alex Dev
Email: alex@careerpilot.ai | Phone: (555) 019-2834 | GitHub: github.com/alexdev | LinkedIn: linkedin.com/in/alexdev

SUMMARY
Proactive Full Stack Engineer with 3+ years of experience engineering responsive web applications using React, Node.js, Express, and JavaScript. Skilled in building REST APIs, managing database integrations, and implementing automated testing.

TECHNICAL SKILLS
- Frontend: React, JavaScript, HTML5, CSS3, Tailwind CSS, Redux, Next.js, TypeScript
- Backend: Node.js, Express.js, REST APIs, JWT Authentication, MongoDB, PostgreSQL
- DevOps & Tools: Docker, Git, Web Performance, CI/CD

EXPERIENCE
Software Engineer | TechScale Solutions (2023 - Present)
- Engineered responsive React dashboard applications, reducing initial bundle render load time by 35%.
- Built Node.js and Express REST API endpoints serving over 50,000 active monthly requests.
- Integrated JWT authentication and user role-based access control middleware.
- Refactored PostgreSQL queries and added Redis caching, boosting database query throughput by 45%.`,

  "Frontend Engineer": `Sarah Lin
Email: sarah@frontend.io | Portfolio: sarahlin.dev | GitHub: github.com/sarahlin | Phone: (555) 392-1049

SUMMARY
Frontend Engineer specializing in React, TypeScript, Tailwind CSS, and Web Vitals optimization. Focused on crafting accessible, performant user interfaces with high visual polish.

TECHNICAL SKILLS
React, TypeScript, JavaScript, Tailwind CSS, Next.js, HTML5, CSS3, Redux, Web Vitals, Jest, Vite, Accessibility (a11y)

EXPERIENCE
Frontend Developer | PixelCraft Studio (2022 - Present)
- Refactored legacy web app to Next.js and Tailwind CSS, improving Largest Contentful Paint (LCP) by 45%.
- Implemented accessible (a11y) component design system across 20+ core product pages, serving 100,000+ monthly active users.
- Automated Cypress e2e integration testing, reducing regression bugs by 60%.`
};

export function ResumeAnalyzer({ user, onScoreUpdate }) {
  const [targetRole, setTargetRole] = useState(user?.targetRole || "Fullstack Engineer");
  const [resumeText, setResumeText] = useState(SAMPLE_RESUMES["Fullstack Engineer"]);
  const [uploadedFileName, setUploadedFileName] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [extractingPdf, setExtractingPdf] = useState(false);
  const [result, setResult] = useState(null);

  const fileInputRef = useRef(null);

  const handleRoleChange = (newRole) => {
    setTargetRole(newRole);
    if (SAMPLE_RESUMES[newRole] && !uploadedFileName) {
      setResumeText(SAMPLE_RESUMES[newRole]);
    }
  };

  // Real PDF & Document Text Extraction
  const extractPdfText = async (file) => {
    setExtractingPdf(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = "";

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item) => item.str).join(" ");
        fullText += pageText + "\n";
      }

      if (fullText.trim().length > 30) {
        setResumeText(fullText.trim());
      } else {
        throw new Error("Empty text extracted from PDF");
      }
    } catch (err) {
      console.warn("PDF extraction fallback:", err);
      // Read plain file fallback
      const reader = new FileReader();
      reader.onload = (e) => setResumeText(e.target.result || SAMPLE_RESUMES[targetRole]);
      reader.readAsText(file);
    } finally {
      setExtractingPdf(false);
    }
  };

  const handleFileProcess = async (file) => {
    if (!file) return;
    setUploadedFileName(file.name);

    if (file.name.endsWith(".pdf")) {
      await extractPdfText(file);
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target.result) {
          setResumeText(e.target.result);
        }
      };
      reader.readAsText(file);
    }
  };

  // Drag & Drop Handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileProcess(e.target.files[0]);
    }
  };

  const clearUploadedFile = () => {
    setUploadedFileName(null);
    setResumeText(SAMPLE_RESUMES[targetRole] || SAMPLE_RESUMES["Fullstack Engineer"]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleAnalyze = async () => {
    if (!resumeText || resumeText.trim().length < 20) return;
    setAnalyzing(true);

    try {
      const data = await api.analyzeResume(resumeText, targetRole);
      setResult(data);
      if (onScoreUpdate && data.analysis?.score) {
        onScoreUpdate(data.analysis.score);
      }

      if (data.analysis?.score >= 80) {
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.6 }
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <FileText className="w-5 h-5" />
            </span>
            <h2 className="text-2xl font-extrabold text-white font-outfit">AI ATS Resume Scanner & Deep NLP Audit</h2>
          </div>
          <p className="text-slate-400 text-xs md:text-sm">
            Drag & drop your real resume PDF or paste text to perform a multi-factor ATS keyword & metric analysis.
          </p>
        </div>

        {/* Target Role Selector */}
        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold text-slate-300">Target Role:</label>
          <select
            value={targetRole}
            onChange={(e) => handleRoleChange(e.target.value)}
            className="bg-slate-900 border border-indigo-500/30 text-indigo-300 text-xs font-semibold rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="Fullstack Engineer">Fullstack Engineer</option>
            <option value="Frontend Engineer">Frontend Engineer</option>
            <option value="Backend Engineer">Backend Engineer</option>
            <option value="Data Scientist">Data Scientist</option>
            <option value="DevOps Engineer">DevOps Engineer</option>
          </select>
        </div>
      </div>

      {/* Main Grid: Input Form vs AI Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column: Drag & Drop Zone + Resume Text Editor */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            
            {/* Drag & Drop Dropzone */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative p-6 rounded-2xl border-2 border-dashed text-center cursor-pointer transition-all duration-300 ${
                dragActive
                  ? "border-indigo-400 bg-indigo-500/20 scale-[1.01]"
                  : uploadedFileName
                  ? "border-emerald-500/40 bg-emerald-500/5"
                  : "border-slate-800 bg-slate-950/60 hover:border-indigo-500/40 hover:bg-slate-900/60"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.txt,.md"
                onChange={handleFileSelect}
                className="hidden"
              />

              {extractingPdf ? (
                <div className="flex flex-col items-center justify-center space-y-2 py-2">
                  <RefreshCw className="w-6 h-6 text-indigo-400 animate-spin" />
                  <span className="text-xs font-bold text-slate-200">Extracting Text from PDF...</span>
                </div>
              ) : uploadedFileName ? (
                <div className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-3 text-left">
                    <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400">
                      <Paperclip className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span>{uploadedFileName}</span>
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                      </div>
                      <p className="text-[10px] text-slate-400">PDF text parsed & loaded into editor below</p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      clearUploadedFile();
                    }}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-all"
                    title="Remove File"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="space-y-2 py-2">
                  <div className="w-12 h-12 mx-auto rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white">Drag & drop your PDF / Resume file here</span>
                    <span className="text-xs text-slate-400"> or </span>
                    <span className="text-xs font-semibold text-indigo-400 underline">browse device</span>
                  </div>
                  <p className="text-[10px] text-slate-500">Supports PDF, DOCX, TXT, and Markdown files</p>
                </div>
              )}
            </div>

            {/* Resume Text Editor */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-indigo-400" /> Extracted Text Content ({resumeText.split(/\s+/).filter(Boolean).length} words)
                </label>
                <button
                  onClick={() => {
                    setUploadedFileName(null);
                    setResumeText(SAMPLE_RESUMES[targetRole] || SAMPLE_RESUMES["Fullstack Engineer"]);
                  }}
                  className="text-[11px] text-indigo-400 hover:text-indigo-300 hover:underline flex items-center gap-1 font-medium"
                >
                  <RefreshCw className="w-3 h-3" /> Load Sample Resume
                </button>
              </div>

              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                rows={10}
                placeholder="Paste or edit your resume text here..."
                className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl p-4 text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 resize-none leading-relaxed"
              />
            </div>

          </div>

          <button
            onClick={handleAnalyze}
            disabled={analyzing || !resumeText.trim()}
            className={`w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-bold text-sm shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-2 transition-all mt-4 ${
              analyzing ? "opacity-75 cursor-wait" : "hover:opacity-95"
            }`}
          >
            {analyzing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Running Deep Multi-Factor ATS Engine...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Analyze & Score Resume</span>
              </>
            )}
          </button>
        </div>

        {/* Right Column: AI Analysis Result Display */}
        <div className="space-y-6">
          {result ? (
            <div className="glass-panel p-6 rounded-3xl border border-indigo-500/30 space-y-6 animate-fade-in">
              
              {/* Score Header Card */}
              <div className="flex items-center justify-between p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950/80 border border-indigo-500/30">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">ATS Match Readiness</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-4xl font-black text-white font-outfit">{result.analysis.score}%</span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                      {result.analysis.atsCompatibility}
                    </span>
                  </div>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                  <Award className="w-7 h-7" />
                </div>
              </div>

              {/* 5-Factor Score Breakdown */}
              {result.analysis.sectionBreakdown && (
                <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
                  <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5 uppercase tracking-wider">
                    <Sliders className="w-4 h-4 text-indigo-400" /> Multi-Factor Breakdown
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block font-medium">Core Keywords</span>
                      <span className="text-sm font-extrabold text-indigo-300 font-outfit">{result.analysis.sectionBreakdown.keywordScore}</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block font-medium">Quantified Impact</span>
                      <span className="text-sm font-extrabold text-emerald-300 font-outfit">{result.analysis.sectionBreakdown.impactScore}</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block font-medium">Action Verbs</span>
                      <span className="text-sm font-extrabold text-purple-300 font-outfit">{result.analysis.sectionBreakdown.verbScore}</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block font-medium">Contact / Profile</span>
                      <span className="text-sm font-extrabold text-pink-300 font-outfit">{result.analysis.sectionBreakdown.contactScore}</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 col-span-2 sm:col-span-1">
                      <span className="text-[10px] text-slate-400 block font-medium">Structure</span>
                      <span className="text-sm font-extrabold text-amber-300 font-outfit">{result.analysis.sectionBreakdown.structureScore}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Matched vs Missing Keywords */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Matched Keywords */}
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                  <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <Check className="w-4 h-4" /> Matched Skills ({result.analysis.matchedKeywords.length})
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {result.analysis.matchedKeywords.length > 0 ? (
                      result.analysis.matchedKeywords.map((kw, i) => (
                        <span key={i} className="text-[11px] px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-medium">
                          {kw}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-500">No core tech skills matched</span>
                    )}
                  </div>
                </div>

                {/* Missing Keywords */}
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                  <div className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                    <X className="w-4 h-4" /> Missing Target Skills ({result.analysis.missingKeywords.length})
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {result.analysis.missingKeywords.length > 0 ? (
                      result.analysis.missingKeywords.map((kw, i) => (
                        <span key={i} className="text-[11px] px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-300 border border-rose-500/20 font-medium">
                          {kw}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-400 font-medium">All core target skills present!</span>
                    )}
                  </div>
                </div>

              </div>

              {/* Actionable Feedback Bullet Points */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" /> Tailored Audit & Action Items
                </h4>

                <div className="space-y-2.5">
                  {result.analysis.feedback.map((fb, idx) => (
                    <div 
                      key={idx}
                      className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3"
                    >
                      {fb.type === "positive" ? (
                        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      ) : fb.type === "warning" ? (
                        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      ) : (
                        <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <div className="text-xs font-bold text-white">{fb.title}</div>
                        <div className="text-xs text-slate-400 mt-0.5 leading-relaxed">{fb.detail}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <div className="h-full glass-panel p-8 rounded-3xl border border-slate-800 flex flex-col items-center justify-center text-center space-y-4 min-h-[350px]">
              <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Target className="w-8 h-8" />
              </div>
              <div className="space-y-1 max-w-sm">
                <h3 className="text-lg font-bold text-white font-outfit">Ready to Scan Your Resume</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Upload your PDF or paste plain text, then click <strong>"Analyze & Score Resume"</strong> to generate your real-time 5-factor ATS audit.
                </p>
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
