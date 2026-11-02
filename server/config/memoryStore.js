const bcrypt = require("bcryptjs");

const adminEmail = process.env.ADMIN_EMAIL || "admin@quiz.com";
const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

const defaultAdminPasswordHash = bcrypt.hashSync(adminPassword, 10);
const defaultUserPasswordHash = bcrypt.hashSync("user123", 10);

const memoryStore = {
  users: [
    {
      _id: "user_admin_001",
      name: "Admin User",
      email: adminEmail,
      password: defaultAdminPasswordHash,
      isAdmin: true,
      createdAt: new Date(),
    },
    {
      _id: "user_cand_002",
      name: "Candidate User",
      email: "user@quiz.com",
      password: defaultUserPasswordHash,
      isAdmin: false,
      createdAt: new Date(),
    },
  ],

  exams: [
    {
      _id: "exam_js_001",
      name: "JavaScript Fundamentals Exam",
      duration: 180, // 3 minutes
      category: "JavaScript",
      totalMarks: 4,
      passingMarks: 2,
      questions: ["q_js_001", "q_js_002", "q_js_003", "q_js_004"],
      createdAt: new Date(),
    },
    {
      _id: "exam_react_002",
      name: "React.js Developer Assessment",
      duration: 180, // 3 minutes
      category: "React.js",
      totalMarks: 3,
      passingMarks: 2,
      questions: ["q_react_001", "q_react_002", "q_react_003"],
      createdAt: new Date(),
    },
  ],

  questions: [
    {
      _id: "q_js_001",
      name: "Which of the following is NOT a JavaScript primitive data type?",
      correctOption: "C",
      options: {
        A: "String",
        B: "Boolean",
        C: "Object",
        D: "Symbol",
      },
      exam: "exam_js_001",
    },
    {
      _id: "q_js_002",
      name: "What does Array.prototype.map() return in JavaScript?",
      correctOption: "B",
      options: {
        A: "A single boolean value",
        B: "A new array with the results of calling a provided function on every element",
        C: "Undefined",
        D: "The length of the original array",
      },
      exam: "exam_js_001",
    },
    {
      _id: "q_js_003",
      name: "Which keyword is used to declare a block-scoped variable in modern JavaScript?",
      correctOption: "A",
      options: {
        A: "let",
        B: "var",
        C: "global",
        D: "define",
      },
      exam: "exam_js_001",
    },
    {
      _id: "q_js_004",
      name: "What will `typeof NaN` evaluate to in JavaScript?",
      correctOption: "B",
      options: {
        A: "undefined",
        B: "number",
        C: "NaN",
        D: "null",
      },
      exam: "exam_js_001",
    },
    {
      _id: "q_react_001",
      name: "What is the primary function of the React Virtual DOM?",
      correctOption: "A",
      options: {
        A: "To optimize DOM manipulations through diffing and reconciliation",
        B: "To directly execute code inside WebAssembly",
        C: "To provide cloud database storage for state",
        D: "To eliminate the need for JavaScript in the browser",
      },
      exam: "exam_react_002",
    },
    {
      _id: "q_react_002",
      name: "Which React hook should be used to cache expensive calculation values?",
      correctOption: "D",
      options: {
        A: "useEffect",
        B: "useRef",
        C: "useCallback",
        D: "useMemo",
      },
      exam: "exam_react_002",
    },
    {
      _id: "q_react_003",
      name: "In React, keys should be unique among:",
      correctOption: "C",
      options: {
        A: "All components across the entire application",
        B: "Parent and child components",
        C: "Siblings inside an array or list",
        D: "Global window objects",
      },
      exam: "exam_react_002",
    },
  ],

  reports: [],
};

module.exports = memoryStore;

