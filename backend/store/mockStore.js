// Simple in-memory / local persistent state store for CareerPilot AI backend

const users = [
  {
    id: "usr_demo_1",
    name: "Alex Dev",
    email: "alex@careerpilot.ai",
    passwordHash: "$2a$10$e7K52e6lM..mockhash..", // bcrypt hash stub for demo
    createdAt: new Date().toISOString(),
    targetRole: "Full Stack Engineer"
  }
];

const resumes = [];
const interviewSessions = [];
const roadmaps = [];

module.exports = {
  users,
  resumes,
  interviewSessions,
  roadmaps
};
