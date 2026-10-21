/**
 * CareerPilot AI Engine - Advanced Multi-Factor ATS Resume Analyzer
 * Features robust tokenization, regex boundary matching, section detection,
 * quantification metric analysis, and domain taxonomy mapping.
 */

// Comprehensive skills taxonomy across modern engineering & tech domains
const SKILLS_TAXONOMY = {
  // Languages
  languages: [
    { name: "JavaScript", regex: /\b(JavaScript|JS|ES6\+?)\b/i },
    { name: "TypeScript", regex: /\b(TypeScript|TS)\b/i },
    { name: "Python", regex: /\b(Python|Py)\b/i },
    { name: "Java", regex: /\b(Java)\b/i },
    { name: "C++", regex: /\b(C\+\+)\b/i },
    { name: "C#", regex: /\b(C#|\.NET)\b/i },
    { name: "Golang", regex: /\b(Golang|Go\s+language|\bGo\b(?!\s+(to|for|with|back|into|through)))\b/i },
    { name: "Rust", regex: /\b(Rust)\b/i },
    { name: "PHP", regex: /\b(PHP)\b/i },
    { name: "Ruby", regex: /\b(Ruby|Rails)\b/i },
    { name: "SQL", regex: /\b(SQL)\b/i },
    { name: "HTML5", regex: /\b(HTML5?)\b/i },
    { name: "CSS3", regex: /\b(CSS3?)\b/i }
  ],

  // Frontend
  frontend: [
    { name: "React", regex: /\b(React|React\.?js|ReactJS)\b/i },
    { name: "Next.js", regex: /\b(Next|Next\.?js|NextJS)\b/i },
    { name: "Vue.js", regex: /\b(Vue|Vue\.?js|VueJS)\b/i },
    { name: "Angular", regex: /\b(Angular|AngularJS)\b/i },
    { name: "Tailwind CSS", regex: /\b(Tailwind|Tailwind\s*CSS)\b/i },
    { name: "Redux", regex: /\b(Redux|Redux\s*Toolkit)\b/i },
    { name: "Zustand", regex: /\b(Zustand)\b/i },
    { name: "Web Performance", regex: /\b(Web\s*Performance|Core\s*Web\s*Vitals|Lighthouse|LCP|FID|CLS|INP)\b/i },
    { name: "Accessibility (a11y)", regex: /\b(Accessibility|a11y|WCAG|ARIA)\b/i },
    { name: "Vite", regex: /\b(Vite|ViteJS)\b/i },
    { name: "Webpack", regex: /\b(Webpack)\b/i },
    { name: "Responsive Design", regex: /\b(Responsive\s*Design|Mobile-first)\b/i }
  ],

  // Backend & APIs
  backend: [
    { name: "Node.js", regex: /\b(Node|Node\.?js|NodeJS)\b/i },
    { name: "Express.js", regex: /\b(Express|Express\.?js)\b/i },
    { name: "NestJS", regex: /\b(Nest|NestJS)\b/i },
    { name: "FastAPI", regex: /\b(FastAPI)\b/i },
    { name: "Django", regex: /\b(Django)\b/i },
    { name: "Spring Boot", regex: /\b(Spring\s*Boot|Spring\s*Framework)\b/i },
    { name: "REST APIs", regex: /\b(REST|RESTful|REST\s*APIs?)\b/i },
    { name: "GraphQL", regex: /\b(GraphQL|Apollo)\b/i },
    { name: "gRPC", regex: /\b(gRPC)\b/i },
    { name: "Microservices", regex: /\b(Microservices?|Microservice\s*architecture)\b/i },
    { name: "System Design", regex: /\b(System\s*Design|Distributed\s*Systems)\b/i }
  ],

  // Databases & Caching
  databases: [
    { name: "MongoDB", regex: /\b(MongoDB|Mongo|Mongoose)\b/i },
    { name: "PostgreSQL", regex: /\b(PostgreSQL|Postgres)\b/i },
    { name: "MySQL", regex: /\b(MySQL)\b/i },
    { name: "Redis", regex: /\b(Redis)\b/i },
    { name: "Elasticsearch", regex: /\b(Elasticsearch|ELK)\b/i },
    { name: "Firebase", regex: /\b(Firebase|Firestore)\b/i },
    { name: "Prisma", regex: /\b(Prisma|TypeORM)\b/i }
  ],

  // DevOps & Cloud
  devops: [
    { name: "Docker", regex: /\b(Docker|Containerization)\b/i },
    { name: "Kubernetes", regex: /\b(Kubernetes|K8s)\b/i },
    { name: "AWS", regex: /\b(AWS|Amazon\s*Web\s*Services|EC2|S3|Lambda)\b/i },
    { name: "Google Cloud (GCP)", regex: /\b(GCP|Google\s*Cloud)\b/i },
    { name: "Azure", regex: /\b(Azure)\b/i },
    { name: "CI/CD", regex: /\b(CI\/CD|Continuous\s*Integration|GitHub\s*Actions|Jenkins)\b/i },
    { name: "Terraform", regex: /\b(Terraform)\b/i },
    { name: "Linux", regex: /\b(Linux|Ubuntu|CentOS|Bash|Shell\s*scripting)\b/i },
    { name: "Git", regex: /\b(Git|GitHub|GitLab)\b/i }
  ],

  // AI & Data Science
  aiData: [
    { name: "Machine Learning", regex: /\b(Machine\s*Learning|ML)\b/i },
    { name: "Deep Learning", regex: /\b(Deep\s*Learning|Neural\s*Networks)\b/i },
    { name: "TensorFlow", regex: /\b(TensorFlow)\b/i },
    { name: "PyTorch", regex: /\b(PyTorch)\b/i },
    { name: "Pandas", regex: /\b(Pandas)\b/i },
    { name: "NumPy", regex: /\b(NumPy)\b/i },
    { name: "Scikit-Learn", regex: /\b(Scikit-Learn|sklearn)\b/i },
    { name: "NLP", regex: /\b(NLP|Natural\s*Language\s*Processing|LLMs?)\b/i },
    { name: "Data Visualization", regex: /\b(Data\s*Visualization|Tableau|Power\s*BI|Matplotlib|Seaborn)\b/i }
  ],

  // Security & Testing
  securityAndTesting: [
    { name: "JWT", regex: /\b(JWT|JSON\s*Web\s*Tokens?)\b/i },
    { name: "OAuth", regex: /\b(OAuth|OAuth2|Auth0)\b/i },
    { name: "Jest", regex: /\b(Jest)\b/i },
    { name: "Cypress", regex: /\b(Cypress)\b/i },
    { name: "Unit Testing", regex: /\b(Unit\s*Test(ing)?|TDD|Integration\s*Test(ing)?)\b/i }
  ]
};

// Target Role Requirements Mapping
const ROLE_REQUIREMENTS = {
  "fullstack": {
    name: "Full Stack Engineer",
    mustHave: ["React", "Node.js", "Express.js", "MongoDB", "JavaScript", "TypeScript", "REST APIs", "Git"],
    goodToHave: ["Docker", "PostgreSQL", "Tailwind CSS", "JWT", "CI/CD", "Next.js", "System Design", "Redis", "Microservices"]
  },
  "frontend": {
    name: "Frontend Engineer",
    mustHave: ["React", "JavaScript", "TypeScript", "HTML5", "CSS3", "Tailwind CSS", "Responsive Design", "Git"],
    goodToHave: ["Next.js", "Redux", "Web Performance", "Accessibility (a11y)", "Vite", "Jest", "GraphQL"]
  },
  "backend": {
    name: "Backend Engineer",
    mustHave: ["Node.js", "Express.js", "Python", "SQL", "MongoDB", "REST APIs", "Git", "System Design"],
    goodToHave: ["PostgreSQL", "Docker", "Redis", "Microservices", "JWT", "AWS", "GraphQL", "Java", "CI/CD"]
  },
  "datascientist": {
    name: "Data Scientist",
    mustHave: ["Python", "SQL", "Pandas", "NumPy", "Scikit-Learn", "Machine Learning", "Git"],
    goodToHave: ["TensorFlow", "PyTorch", "Data Visualization", "Deep Learning", "NLP", "Tableau", "AWS"]
  },
  "devops": {
    name: "DevOps Engineer",
    mustHave: ["Docker", "Kubernetes", "AWS", "CI/CD", "Linux", "Git", "Terraform"],
    goodToHave: ["Python", "Bash", "Prometheus", "Grafana", "Google Cloud (GCP)", "Azure", "Security"]
  }
};

const ACTION_VERBS = [
  "engineered", "architected", "spearheaded", "developed", "implemented", 
  "optimized", "scaled", "refactored", "built", "designed", "deployed", 
  "automated", "integrated", "managed", "led", "boosted", "reduced", 
  "increased", "transformed", "streamlined", "orchestrated", "pioneered",
  "created", "achieved", "delivered", "mentored", "collaborated"
];

const SECTIONS = [
  { name: "Contact Information", regex: /\b(contact|email|phone|linkedin|github)\b/i },
  { name: "Summary / Objective", regex: /\b(summary|objective|profile|about\s*me)\b/i },
  { name: "Technical Skills", regex: /\b(skills|technical\s*skills|technologies|tech\s*stack|proficiencies)\b/i },
  { name: "Work Experience", regex: /\b(experience|work\s*history|employment|professional\s*experience)\b/i },
  { name: "Education", regex: /\b(education|academic|degree|university|college)\b/i },
  { name: "Projects", regex: /\b(projects|portfolio|personal\s*projects)\b/i },
  { name: "Certifications", regex: /\b(certifications?|certificates?|credentials?)\b/i }
];

/**
 * Deep, multi-dimensional ATS Resume Analysis Function
 */
function analyzeResume(resumeText, targetRole = "Fullstack Engineer") {
  if (!resumeText || typeof resumeText !== "string" || resumeText.trim().length < 20) {
    return {
      score: 15,
      atsCompatibility: "Incomplete Resume",
      matchedKeywords: [],
      missingKeywords: [],
      detectedVerbs: [],
      detectedMetrics: [],
      detectedSections: [],
      wordCount: 0,
      sectionBreakdown: {
        keywordScore: "0 / 35",
        impactScore: "0 / 25",
        verbScore: "0 / 15",
        contactScore: "0 / 15",
        structureScore: "0 / 10"
      },
      feedback: [{
        type: "warning",
        title: "Insufficient Resume Content",
        detail: "Please upload or paste a complete resume document to generate an accurate ATS analysis."
      }],
      summary: "Resume contains insufficient text for ATS evaluation."
    };
  }

  const rawText = resumeText;
  const words = rawText.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  // Determine target role key
  const roleLower = targetRole.toLowerCase();
  let roleKey = "fullstack";
  if (roleLower.includes("front")) roleKey = "frontend";
  else if (roleLower.includes("back")) roleKey = "backend";
  else if (roleLower.includes("data") || roleLower.includes("ai") || roleLower.includes("ml")) roleKey = "datascientist";
  else if (roleLower.includes("devops") || roleLower.includes("cloud") || roleLower.includes("sre")) roleKey = "devops";

  const roleConfig = ROLE_REQUIREMENTS[roleKey];

  // 1. Scan for ALL Detected Skills across taxonomy using strict regex
  const allDetectedSkills = new Set();
  Object.values(SKILLS_TAXONOMY).forEach(categorySkills => {
    categorySkills.forEach(skill => {
      if (skill.regex.test(rawText)) {
        allDetectedSkills.add(skill.name);
      }
    });
  });

  // Calculate matched vs missing for target role
  const matchedCoreSkills = [];
  const missingCoreSkills = [];

  roleConfig.mustHave.forEach(skillName => {
    if (allDetectedSkills.has(skillName)) {
      matchedCoreSkills.push(skillName);
    } else {
      missingCoreSkills.push(skillName);
    }
  });

  const matchedGoodToHave = [];
  const missingGoodToHave = [];

  roleConfig.goodToHave.forEach(skillName => {
    if (allDetectedSkills.has(skillName)) {
      matchedGoodToHave.push(skillName);
    } else {
      missingGoodToHave.push(skillName);
    }
  });

  // Pillar 1: Keywords & Skills Score (0 - 35)
  // mustHave counts for 25 points, goodToHave counts for 10 points
  const mustHaveRatio = matchedCoreSkills.length / roleConfig.mustHave.length;
  const goodToHaveRatio = matchedGoodToHave.length / roleConfig.goodToHave.length;
  const keywordScore = Math.min(35, Math.round((mustHaveRatio * 25) + (goodToHaveRatio * 10)));

  // Pillar 2: Quantifiable Impact & Metrics Score (0 - 25)
  const metricRegex = /\b(\d+%\s*|\$\s*[\d,.]+[kmb]?|\b\d+\s*(users|clients|customers|projects|ms|sec|x|fold|requests|engineers|team members|pages|stars)\b)/gi;
  const detectedMetrics = Array.from(new Set(rawText.match(metricRegex) || [])).slice(0, 6);
  
  let impactScore = 5;
  if (detectedMetrics.length >= 4) impactScore = 25;
  else if (detectedMetrics.length === 3) impactScore = 20;
  else if (detectedMetrics.length === 2) impactScore = 15;
  else if (detectedMetrics.length === 1) impactScore = 10;

  // Pillar 3: Action Verbs Score (0 - 15)
  const textLower = rawText.toLowerCase();
  const detectedVerbs = Array.from(new Set(ACTION_VERBS.filter(verb => textLower.includes(verb)))).slice(0, 8);
  const verbScore = Math.min(15, Math.round((detectedVerbs.length / 5) * 15));

  // Pillar 4: Contact & Professional Online Presence (0 - 15)
  const hasEmail = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/.test(rawText);
  const hasPhone = /\b(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/.test(rawText);
  const hasLinkedIn = /(linkedin\.com\/in\/|linkedin\.com)/i.test(rawText);
  const hasGitHub = /(github\.com\/|gitlab\.com\/)/i.test(rawText);
  const hasPortfolio = /(portfolio|\.dev|\.io|\.me|behance|dribbble)/i.test(rawText);

  let contactScore = 0;
  if (hasEmail) contactScore += 5;
  if (hasPhone) contactScore += 3;
  if (hasLinkedIn) contactScore += 4;
  if (hasGitHub || hasPortfolio) contactScore += 3;
  contactScore = Math.min(15, contactScore);

  // Pillar 5: Structure & Section Completeness (0 - 10)
  const detectedSections = SECTIONS.filter(s => s.regex.test(rawText)).map(s => s.name);
  let structureScore = 4;
  if (detectedSections.length >= 5) structureScore = 10;
  else if (detectedSections.length >= 3) structureScore = 7;

  // Word count penalty or bonus
  if (wordCount < 120) {
    structureScore = Math.max(2, structureScore - 3);
  }

  // Composite Total Score (0 - 100)
  const totalScore = Math.min(98, Math.max(20, keywordScore + impactScore + verbScore + contactScore + structureScore));

  let atsCompatibility = "Needs Improvement";
  if (totalScore >= 82) atsCompatibility = "Excellent (Top 5% Candidate)";
  else if (totalScore >= 68) atsCompatibility = "Good (Strong ATS Pass Rate)";
  else if (totalScore >= 50) atsCompatibility = "Moderate (Average Match)";

  // Build Granular Feedback
  const feedback = [];

  // Feedback 1: Metrics
  if (detectedMetrics.length >= 3) {
    feedback.push({
      type: "positive",
      title: "Strong Metric-Driven Accomplishments",
      detail: `Identified ${detectedMetrics.length} measurable metrics (e.g., "${detectedMetrics.slice(0, 2).join('", "')}"). Recruiter callbacks improve by over 40% when accomplishments are quantified.`
    });
  } else {
    feedback.push({
      type: "warning",
      title: "Add More Quantifiable Metrics",
      detail: `Only found ${detectedMetrics.length} metric(s). Quantify your bullet points with concrete numbers (e.g. "Reduced API latency by 35%", "Engineered dashboard used by 20k active users").`
    });
  }

  // Feedback 2: Core Skills
  if (matchedCoreSkills.length >= Math.ceil(roleConfig.mustHave.length * 0.75)) {
    feedback.push({
      type: "positive",
      title: "High Core Skill Keyword Alignment",
      detail: `Your resume matches ${matchedCoreSkills.length} out of ${roleConfig.mustHave.length} core competencies for ${roleConfig.name}.`
    });
  } else {
    feedback.push({
      type: "missing_skills",
      title: "Critical Keyword Gaps Detected",
      detail: `Missing ${missingCoreSkills.length} required keywords for ${roleConfig.name}: ${missingCoreSkills.slice(0, 5).join(", ")}. Add these to your Skills and Experience sections.`
    });
  }

  // Feedback 3: Action Verbs
  if (detectedVerbs.length >= 4) {
    feedback.push({
      type: "positive",
      title: "Impactful Action Verbs Used",
      detail: `Found strong action verbs: "${detectedVerbs.slice(0, 4).join('", "')}". Demonstrates ownership and technical leadership.`
    });
  } else {
    feedback.push({
      type: "suggestion",
      title: "Strengthen Bullet Point Verbs",
      detail: `Start your bullet points with high-impact engineering verbs such as "Architected", "Spearheaded", "Optimized", or "Engineered" rather than passive phrasing.`
    });
  }

  // Feedback 4: Professional links
  if (!hasLinkedIn || (!hasGitHub && !hasPortfolio)) {
    const missingLinks = [];
    if (!hasLinkedIn) missingLinks.push("LinkedIn");
    if (!hasGitHub && !hasPortfolio) missingLinks.push("GitHub/Portfolio");

    feedback.push({
      type: "warning",
      title: "Missing Online Portfolio Links",
      detail: `No ${missingLinks.join(" or ")} link found. Tech recruiters actively check GitHub profiles and LinkedIn URLs before shortlisting.`
    });
  }

  // Compile combined matched list
  const allMatchedSkills = [...matchedCoreSkills, ...matchedGoodToHave];
  const allMissingSkills = [...missingCoreSkills, ...missingGoodToHave];

  return {
    score: totalScore,
    atsCompatibility,
    matchedKeywords: allMatchedSkills,
    missingKeywords: allMissingSkills.slice(0, 8),
    detectedVerbs,
    detectedMetrics,
    detectedSections,
    wordCount,
    sectionBreakdown: {
      keywordScore: `${keywordScore} / 35`,
      impactScore: `${impactScore} / 25`,
      verbScore: `${verbScore} / 15`,
      contactScore: `${contactScore} / 15`,
      structureScore: `${structureScore} / 10`
    },
    feedback,
    summary: `Resume parsed for ${roleConfig.name} with ${totalScore}% ATS readiness rating. Found ${allMatchedSkills.length} skills, ${detectedMetrics.length} metrics, and ${detectedVerbs.length} action verbs.`
  };
}

// Comprehensive Mock Interview Question Library across engineering roles & categories
const INTERVIEW_QUESTIONS_DATABASE = [
  // Fullstack Questions
  {
    id: "fs_1",
    roles: ["Fullstack Engineer"],
    category: "Technical",
    difficulty: "Mid-Level",
    question: "How do you optimize state management and rendering performance in a large-scale React and Node.js application?",
    hint: "Discuss React memoization, selective re-renders, state colocation, server-side caching, and database query indexing.",
    idealAnswerKeywords: ["memo", "useCallback", "colocation", "indexing", "caching", "lazy loading"]
  },
  {
    id: "fs_2",
    roles: ["Fullstack Engineer", "Backend Engineer"],
    category: "System Design",
    difficulty: "Senior",
    question: "Design a high-throughput authentication system using JWTs and Refresh Tokens. How do you handle token revocation and CSRF protection?",
    hint: "Explain short-lived access tokens, stored refresh tokens in Redis or HTTP-only SameSite cookies, and token blacklist strategies.",
    idealAnswerKeywords: ["refresh token", "HTTP-only", "SameSite", "Redis", "expiry", "blacklist"]
  },
  {
    id: "fs_3",
    roles: ["Fullstack Engineer", "Frontend Engineer", "Backend Engineer"],
    category: "Behavioral",
    difficulty: "All Levels",
    question: "Describe a critical production bug or performance outage you resolved under tight time pressure. How did you diagnose and prevent recurrence?",
    hint: "Use the STAR method: describe the root cause analysis, logging/monitoring tools used, team communication, and the permanent automated fix.",
    idealAnswerKeywords: ["STAR", "profiling", "logs", "root cause", "post-mortem", "metrics"]
  },
  {
    id: "fs_4",
    roles: ["Fullstack Engineer", "Backend Engineer"],
    category: "System Design",
    difficulty: "Senior",
    question: "How would you architect an AI-driven background processing pipeline that handles 10,000 asynchronous resume parsings concurrently?",
    hint: "Discuss message queues (BullMQ/RabbitMQ/Kafka), worker node clustering, rate limiting, and exponential retry backoff.",
    idealAnswerKeywords: ["message queue", "BullMQ", "workers", "rate limiting", "backoff", "dead letter queue"]
  },
  {
    id: "fs_5",
    roles: ["Fullstack Engineer"],
    category: "Technical",
    difficulty: "Junior",
    question: "Explain the difference between SQL and NoSQL databases. When would you choose MongoDB over PostgreSQL in a project?",
    hint: "Compare relational schemas, ACID transactions, vs flexible document hierarchies, horizontal sharding, and rapid prototyping.",
    idealAnswerKeywords: ["ACID", "schema", "relational", "document", "sharding", "MongoDB", "Postgres"]
  },

  // Frontend Questions
  {
    id: "fe_1",
    roles: ["Frontend Engineer"],
    category: "Technical",
    difficulty: "Senior",
    question: "How do you optimize Core Web Vitals, specifically Largest Contentful Paint (LCP) and Interaction to Next Paint (INP), in a modern web application?",
    hint: "Cover image fetchpriority, critical CSS inlining, font-display optional, reducing main thread blocking, and React transitions.",
    idealAnswerKeywords: ["LCP", "INP", "fetchpriority", "code splitting", "useTransition", "main thread"]
  },
  {
    id: "fe_2",
    roles: ["Frontend Engineer"],
    category: "Technical",
    difficulty: "Mid-Level",
    question: "Explain the React reconciliation algorithm and how the Virtual DOM uses keys to diff elements efficiently.",
    hint: "Discuss fiber tree traversal, stable key identifiers, avoiding array index as key, and component unmount/remount triggers.",
    idealAnswerKeywords: ["Fiber", "reconciliation", "keys", "diffing", "virtual dom", "re-render"]
  },
  {
    id: "fe_3",
    roles: ["Frontend Engineer"],
    category: "Technical",
    difficulty: "Junior",
    question: "What are the key accessibility (a11y) considerations when building a custom accessible Modal or Dialog component from scratch?",
    hint: "Mention focus trapping, ARIA roles (role='dialog', aria-modal='true'), Esc key listener, and restoring previous focus.",
    idealAnswerKeywords: ["focus trap", "ARIA", "aria-modal", "Esc key", "keyboard navigation", "screen reader"]
  },
  {
    id: "fe_4",
    roles: ["Frontend Engineer", "Fullstack Engineer"],
    category: "Behavioral",
    difficulty: "Mid-Level",
    question: "Tell me about a time you disagreed with a UI/UX designer's proposal due to technical or performance constraints. How did you align?",
    hint: "Focus on proactive collaboration, presenting user-first benchmark data, prototyping a middle ground, and achieving stakeholder buy-in.",
    idealAnswerKeywords: ["collaboration", "trade-off", "performance data", "prototype", "alignment"]
  },

  // Backend Questions
  {
    id: "be_1",
    roles: ["Backend Engineer"],
    category: "Technical",
    difficulty: "Senior",
    question: "How does the Node.js Event Loop handle asynchronous I/O? What happens when you execute CPU-intensive computation on the main thread?",
    hint: "Explain the libuv thread pool, phases of event loop (timers, poll, check), thread blocking, and offloading with Worker Threads.",
    idealAnswerKeywords: ["libuv", "event loop", "worker threads", "thread pool", "non-blocking", "cluster"]
  },
  {
    id: "be_2",
    roles: ["Backend Engineer"],
    category: "System Design",
    difficulty: "Senior",
    question: "Design a distributed rate-limiter that allows 100 requests per minute per IP address across 10 API server instances.",
    hint: "Discuss sliding window counters vs token bucket in Redis, Lua scripts for atomicity, and handling clock drift.",
    idealAnswerKeywords: ["sliding window", "token bucket", "Redis", "Lua script", "distributed", "atomic"]
  },
  {
    id: "be_3",
    roles: ["Backend Engineer"],
    category: "Technical",
    difficulty: "Mid-Level",
    question: "How do database indexes work internally (B-Trees vs Hash indexes), and what are the trade-offs of adding multiple indexes to a table?",
    hint: "Explain B-Tree search complexity O(log N), composite indexes, column cardinality, and the penalty on INSERT/UPDATE/DELETE operations.",
    idealAnswerKeywords: ["B-Tree", "composite index", "cardinality", "write penalty", "O(log n)", "table scan"]
  },

  // Data Science & AI Questions
  {
    id: "ds_1",
    roles: ["Data Scientist"],
    category: "Technical",
    difficulty: "Senior",
    question: "How do you detect and mitigate overfitting in deep neural networks and tree-based gradient boosted models?",
    hint: "Discuss L1/L2 regularization, dropout, early stopping, cross-validation, pruning, and hyperparameter tuning.",
    idealAnswerKeywords: ["regularization", "dropout", "early stopping", "cross-validation", "pruning", "bias-variance"]
  },
  {
    id: "ds_2",
    roles: ["Data Scientist"],
    category: "System Design",
    difficulty: "Mid-Level",
    question: "How would you design a real-time recommendation engine that serves personalized results with under 50ms latency?",
    hint: "Explain candidate retrieval (approximate nearest neighbor / Vector DBs), two-stage ranking, and feature store caching.",
    idealAnswerKeywords: ["vector database", "embeddings", "ANN", "two-stage ranking", "latency", "caching"]
  },

  // DevOps Questions
  {
    id: "do_1",
    roles: ["DevOps Engineer"],
    category: "Technical",
    difficulty: "Senior",
    question: "Explain the architecture of a Kubernetes cluster. What role do etcd, the kube-apiserver, and kube-scheduler play in pod lifecycle?",
    hint: "Detail control plane components, consensus in etcd, state reconciliation loop, and node kubelet interactions.",
    idealAnswerKeywords: ["etcd", "kube-apiserver", "scheduler", "kubelet", "control plane", "reconciliation"]
  },
  {
    id: "do_2",
    roles: ["DevOps Engineer"],
    category: "System Design",
    difficulty: "Mid-Level",
    question: "How do you design a zero-downtime CI/CD deployment pipeline using Blue/Green or Canary deployment strategies?",
    hint: "Compare Blue/Green routing vs gradual Canary traffic shifting, automated rollback upon error budget degradation, and health checks.",
    idealAnswerKeywords: ["Canary", "Blue-Green", "traffic shifting", "health check", "rollback", "Prometheus"]
  }
];

// Generate Mock Interview Questions with dynamic filtering and random shuffling
function generateInterviewQuestions(role = "Fullstack Engineer", category = "All", difficulty = "All", count = 4) {
  const roleLower = (role || "").toLowerCase();

  // Filter pool matching role
  let matchingPool = INTERVIEW_QUESTIONS_DATABASE.filter(q => {
    const matchesRole = q.roles.some(r => r.toLowerCase().includes(roleLower) || roleLower.includes(r.toLowerCase())) ||
      q.roles.includes("Fullstack Engineer");

    const matchesCategory = (!category || category === "All" || category === "All Categories") 
      ? true 
      : q.category.toLowerCase() === category.toLowerCase();

    const matchesDiff = (!difficulty || difficulty === "All" || difficulty === "All Levels")
      ? true
      : q.difficulty === "All Levels" || q.difficulty.toLowerCase().includes(difficulty.toLowerCase());

    return matchesRole && matchesCategory && matchesDiff;
  });

  // Fallback to broader pool if too few
  if (matchingPool.length < count) {
    matchingPool = INTERVIEW_QUESTIONS_DATABASE.filter(q => {
      if (!category || category === "All" || category === "All Categories") return true;
      return q.category.toLowerCase() === category.toLowerCase();
    });
  }

  // Shuffle array randomly
  const shuffled = [...matchingPool].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// Evaluate Interview Answer
function evaluateAnswer(questionId, questionText, userAnswer) {
  const answerLength = userAnswer.trim().split(/\s+/).length;

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
