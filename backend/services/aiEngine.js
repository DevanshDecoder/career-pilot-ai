/**
 * CareerPilot AI Engine - Advanced NLP Resume Parser & Interview Evaluator
 * Performs multi-dimensional ATS parsing, keyword mapping, action verb analysis,
 * metric quantification detection, and section-by-section breakdown.
 */

const ROLE_TAXONOMY = {
  "fullstack": {
    coreKeywords: ["React", "Node.js", "Express", "MongoDB", "TypeScript", "JavaScript", "REST API", "Git", "Docker", "Tailwind CSS", "JWT", "PostgreSQL", "Next.js", "HTML5", "CSS3", "CI/CD", "State Management", "Microservices", "System Design"],
    secondaryKeywords: ["Redux", "GraphQL", "Redis", "AWS", "Jest", "Webpack", "Vite", "SQL", "NoSQL", "Python"]
  },
  "frontend": {
    coreKeywords: ["React", "JavaScript", "TypeScript", "Tailwind CSS", "CSS3", "HTML5", "Next.js", "Redux", "Web Performance", "Accessibility (a11y)", "Vite", "Responsive Design", "Vue", "Angular", "Jest", "Core Web Vitals", "Lighthouse", "Cypress"],
    secondaryKeywords: ["Webpack", "SASS", "Zustand", "GraphQL", "REST API", "Git", "UI/UX", "Figma"]
  },
  "backend": {
    coreKeywords: ["Node.js", "Express", "Python", "MongoDB", "PostgreSQL", "System Design", "Microservices", "Docker", "Redis", "REST APIs", "GraphQL", "JWT", "SQL", "Java", "Spring Boot", "AWS", "Kubernetes", "gRPC", "Kafka"],
    secondaryKeywords: ["RabbitMQ", "Go", "C#", "FastAPI", "Django", "MySQL", "Elasticsearch", "CI/CD", "Linux"]
  },
  "datascientist": {
    coreKeywords: ["Python", "SQL", "Pandas", "NumPy", "Scikit-Learn", "TensorFlow", "PyTorch", "Data Visualization", "Machine Learning", "Statistics", "Deep Learning", "NLP", "Tableau", "Power BI", "Data Mining", "Big Data", "Spark"],
    secondaryKeywords: ["R", "Keras", "A/B Testing", "Jupyter", "AWS SageMaker", "Computer Vision", "ETL"]
  },
  "devops": {
    coreKeywords: ["Docker", "Kubernetes", "AWS", "Terraform", "CI/CD", "Linux", "Bash", "Prometheus", "Grafana", "GitOps", "Python", "Ansible", "Jenkins", "GitHub Actions", "Nginx", "Shell Scripting", "Helm"],
    secondaryKeywords: ["GCP", "Azure", "ELK Stack", "Networking", "Security", "CloudFormation", "OpenShift"]
  }
};

const ACTION_VERBS = [
  "engineered", "architected", "spearheaded", "developed", "implemented", 
  "optimized", "scaled", "refactored", "built", "designed", "deployed", 
  "automated", "integrated", "managed", "led", "boosted", "reduced", 
  "increased", "transformed", "streamlined", "orchestrated", "pioneered"
];

const RECOGNIZED_SECTIONS = [
  { name: "Summary / Objective", regex: /\b(summary|profile|objective|about me)\b/i },
  { name: "Work Experience", regex: /\b(experience|work history|employment|career history)\b/i },
  { name: "Technical Skills", regex: /\b(skills|technical skills|technologies|proficiencies|stack)\b/i },
  { name: "Education", regex: /\b(education|academic|degree|university|college)\b/i },
  { name: "Projects", regex: /\b(projects|key projects|portfolio)\b/i },
  { name: "Certifications", regex: /\b(certifications|certificates|licenses)\b/i }
];

/**
 * Deep multi-dimensional ATS resume analyzer
 */
function analyzeResume(resumeText, targetRole = "Fullstack Engineer") {
  if (!resumeText || typeof resumeText !== "string" || resumeText.trim().length < 15) {
    return {
      score: 20,
      atsCompatibility: "Poor",
      matchedKeywords: [],
      missingKeywords: [],
      feedback: [{ type: "critical", title: "Insufficient Text", detail: "Please provide a complete resume document to analyze." }]
    };
  }

  const textLower = resumeText.toLowerCase();
  const roleKey = Object.keys(ROLE_TAXONOMY).find(k => targetRole.toLowerCase().includes(k)) || "fullstack";
  const taxonomy = ROLE_TAXONOMY[roleKey];

  // 1. Keyword & Skill Analysis
  const matchedKeywords = [];
  const missingKeywords = [];

  taxonomy.coreKeywords.forEach(kw => {
    if (textLower.includes(kw.toLowerCase())) {
      matchedKeywords.push(kw);
    } else {
      missingKeywords.push(kw);
    }
  });

  taxonomy.secondaryKeywords.forEach(kw => {
    if (textLower.includes(kw.toLowerCase()) && !matchedKeywords.includes(kw)) {
      matchedKeywords.push(kw);
    }
  });

  const keywordScore = Math.min(40, Math.round((matchedKeywords.length / (taxonomy.coreKeywords.length + 3)) * 40));

  // 2. Action Verbs Audit
  const foundVerbs = ACTION_VERBS.filter(verb => textLower.includes(verb));
  const verbScore = Math.min(15, Math.round((foundVerbs.length / 5) * 15));

  // 3. Quantifiable Impact & Metrics Check
  const metricRegex = /\b(\d+%\s*|\$\d+[\d,.]*|\b\d+\s+(users|clients|projects|ms|sec|x|fold|requests|team members)\b)/gi;
  const metricsFound = resumeText.match(metricRegex) || [];
  const impactScore = Math.min(20, Math.round((metricsFound.length / 3) * 20));

  // 4. Contact & Online Presence Audit
  const hasEmail = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/.test(resumeText);
  const hasPhone = /\b(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/.test(resumeText);
  const hasGithubOrLinkedin = /(github\.com|linkedin\.com|portfolio|\.dev|\.io)/i.test(resumeText);
  const contactScore = (hasEmail ? 6 : 0) + (hasPhone ? 4 : 0) + (hasGithubOrLinkedin ? 5 : 0);

  // 5. Structure & Section Coverage
  const detectedSections = RECOGNIZED_SECTIONS.filter(sec => sec.regex.test(resumeText)).map(s => s.name);
  const wordCount = resumeText.trim().split(/\s+/).length;
  const structureScore = Math.min(10, Math.round((detectedSections.length / 4) * 10));

  // Final Composite Score (0 - 100)
  const totalScore = Math.min(98, Math.max(30, keywordScore + verbScore + impactScore + contactScore + structureScore));
  const atsCompatibility = totalScore >= 80 ? "Excellent" : totalScore >= 65 ? "Good" : totalScore >= 50 ? "Moderate" : "Needs Improvement";

  // Build Granular Feedback
  const feedback = [];

  if (metricsFound.length >= 3) {
    feedback.push({
      type: "positive",
      title: "Strong Quantified Achievements",
      detail: `Great job! Found ${metricsFound.length} measurable metric indicators (e.g., "${metricsFound.slice(0, 2).join('", "')}"). Recruiter callbacks increase significantly with metric-driven accomplishments.`
    });
  } else {
    feedback.push({
      type: "warning",
      title: "Increase Metric Impact",
      detail: "Only found " + metricsFound.length + " quantified metric(s). Add numbers, percentages, or scale indicators (e.g., 'Reduced API latency by 35% across 50k active users')."
    });
  }

  if (matchedKeywords.length >= 6) {
    feedback.push({
      type: "positive",
      title: "High Core Skill Keyword Alignment",
      detail: `Successfully matched ${matchedKeywords.length} key technical terms required for ${targetRole}.`
    });
  }

  if (missingKeywords.length > 0) {
    feedback.push({
      type: "missing_skills",
      title: "Critical Keyword Gaps",
      detail: `Missing expected ATS industry keywords for ${targetRole}: ${missingKeywords.slice(0, 6).join(", ")}.`
    });
  }

  if (foundVerbs.length < 3) {
    feedback.push({
      type: "suggestion",
      title: "Use Stronger Action Verbs",
      detail: "Incorporate impactful action verbs such as 'Architected', 'Spearheaded', 'Optimized', or 'Engineered' at the start of work accomplishment bullet points."
    });
  }

  if (!hasGithubOrLinkedin) {
    feedback.push({
      type: "warning",
      title: "Missing Professional Profile Links",
      detail: "No LinkedIn, GitHub, or portfolio URL detected. Including professional links increases recruiter response rates by up to 40%."
    });
  }

  return {
    score: totalScore,
    atsCompatibility,
    matchedKeywords,
    missingKeywords: missingKeywords.slice(0, 8),
    detectedVerbs: foundVerbs,
    detectedMetrics: metricsFound.slice(0, 4),
    detectedSections,
    wordCount,
    sectionBreakdown: {
      keywordScore: `${keywordScore} / 40`,
      impactScore: `${impactScore} / 20`,
      verbScore: `${verbScore} / 15`,
      contactScore: `${contactScore} / 15`,
      structureScore: `${structureScore} / 10`
    },
    feedback,
    summary: `Resume parsed with ${totalScore}% ATS readiness rating. Found ${matchedKeywords.length} matched skills, ${foundVerbs.length} action verbs, and ${metricsFound.length} metric indicators.`
  };
}

// Generate Mock Interview Questions
function generateInterviewQuestions(role = "Fullstack Engineer", category = "All", count = 4) {
  const questionPool = [
    {
      id: "q1",
      category: "Technical",
      question: `How do you optimize state management and rendering performance in a large-scale ${role} application?`,
      hint: "Discuss React memoization, state colocation, virtual lists, or database query indexes.",
      idealAnswerKeywords: ["memo", "useCallback", "state colocation", "indexing", "caching", "lazy loading"]
    },
    {
      id: "q2",
      category: "System Design",
      question: "Design a high-throughput authentication system using JWTs and Refresh Tokens. How do you handle token revocation?",
      hint: "Explain short-lived access tokens, stored refresh tokens in Redis / HTTP-only cookies, and blacklist strategies.",
      idealAnswerKeywords: ["refresh token", "HTTP-only", "Redis", "expiry", "revoke", "short-lived"]
    },
    {
      id: "q3",
      category: "Behavioral",
      question: "Describe a complex bug or performance bottleneck you encountered. How did you diagnose and resolve it under pressure?",
      hint: "Use the STAR method (Situation, Task, Action, Result) with specific metrics.",
      idealAnswerKeywords: ["STAR", "profiling", "root cause", "metrics", "team communication", "resolution"]
    },
    {
      id: "q4",
      category: "System Design",
      question: "How would you architect an AI-driven background processing pipeline that scales asynchronously?",
      hint: "Discuss message queues (RabbitMQ/BullMQ), worker threads, rate limiting, and exponential backoff.",
      idealAnswerKeywords: ["queue", "asynchronous", "worker", "rate limit", "backoff", "resilience"]
    }
  ];

  return questionPool;
}

// Evaluate Interview Answer
function evaluateAnswer(questionId, questionText, userAnswer) {
  const answerLength = userAnswer.trim().split(/\s+/).length;
  const textLower = userAnswer.toLowerCase();

  const starComponents = {
    situation: /\b(when|project|at my previous|faced|situation)\b/i.test(userAnswer),
    task: /\b(goal|task|needed to|responsibility|objective)\b/i.test(userAnswer),
    action: /\b(implemented|built|refactored|designed|fixed|used|wrote)\b/i.test(userAnswer),
    result: /\b(result|led to|improved|reduced|increased|outcome|achieved|%)\b/i.test(userAnswer)
  };

  let score = 50;
  if (answerLength > 40) score += 20;
  if (answerLength > 80) score += 10;
  if (starComponents.action) score += 10;
  if (starComponents.result) score += 10;
  score = Math.min(96, Math.max(40, score));

  const strengths = [];
  const improvements = [];

  if (starComponents.action) strengths.push("Clear technical actions described.");
  if (starComponents.result) strengths.push("Quantified or outcome-oriented conclusion.");
  if (answerLength < 30) improvements.push("Elaborate further with concrete examples and technical details.");
  if (!starComponents.result) improvements.push("Mention the outcome or impact of your resolution (e.g. improved speed by 25%).");

  return {
    score,
    grade: score >= 85 ? "A+" : score >= 75 ? "A" : score >= 65 ? "B" : "C",
    strengths,
    improvements,
    modelAnswerHint: "An ideal response follows the STAR framework: outline the technical problem, list specific tools used (e.g., Chrome DevTools, Express middleware), and conclude with measurable impact."
  };
}

// Generate Roadmap
function generateRoadmap(role = "Fullstack Engineer", timeframe = "3 Months") {
  return {
    role,
    timeframe,
    totalProgress: 25,
    phases: [
      {
        id: "phase1",
        title: "Phase 1: Modern Frontend Core & Architecture",
        duration: "Weeks 1 - 3",
        status: "completed",
        nodes: [
          { name: "Advanced React Patterns & Custom Hooks", status: "completed", type: "Core Skill" },
          { name: "Tailwind CSS & Responsive Design System", status: "completed", type: "Styling" },
          { name: "Client-side State Management & Context", status: "completed", type: "State" }
        ],
        project: "Build an Interactive Dashboard with dynamic widgets and dark mode."
      },
      {
        id: "phase2",
        title: "Phase 2: Scalable Backend Services & Security",
        duration: "Weeks 4 - 7",
        status: "in-progress",
        nodes: [
          { name: "Express RESTful APIs & Middleware Architecture", status: "completed", type: "Backend" },
          { name: "JWT Auth & Password Security (bcrypt)", status: "in-progress", type: "Security" },
          { name: "MongoDB Schema Design & Mongoose ORM", status: "upcoming", type: "Database" }
        ],
        project: "Build a JWT Authenticated User Management & Role Service."
      },
      {
        id: "phase3",
        title: "Phase 3: AI Integration & Production Operations",
        duration: "Weeks 8 - 12",
        status: "upcoming",
        nodes: [
          { name: "LLM API Integration & Prompt Engineering", status: "upcoming", type: "AI" },
          { name: "Docker Containerization & Render/Vercel Deployment", status: "upcoming", type: "DevOps" },
          { name: "System Monitoring, Logs & CWV Performance", status: "upcoming", type: "Production" }
        ],
        project: "Deploy CareerPilot AI Platform to Cloud with Production CI/CD."
      }
    ]
  };
}

module.exports = {
  analyzeResume,
  generateInterviewQuestions,
  evaluateAnswer,
  generateRoadmap
};
