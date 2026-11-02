const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const seedMongoDbIfEmpty = async () => {
  try {
    const User = require("../models/userModel");
    const Exam = require("../models/examModel");
    const Question = require("../models/questionModel");

    const usersCount = await User.countDocuments();
    if (usersCount === 0) {
      console.log("[MongoDB Atlas] Initializing default collections and seeding users...");
      const adminHash = await bcrypt.hash("admin123", 10);
      const userHash = await bcrypt.hash("user123", 10);

      await User.create([
        {
          name: "Admin User",
          email: "admin@quiz.com",
          password: adminHash,
          isAdmin: true,
        },
        {
          name: "Candidate User",
          email: "user@quiz.com",
          password: userHash,
          isAdmin: false,
        },
      ]);
      console.log("[MongoDB Atlas] Users seeded successfully (admin@quiz.com & user@quiz.com)");
    }

    const examsCount = await Exam.countDocuments();
    if (examsCount === 0) {
      console.log("[MongoDB Atlas] Seeding starter technical exams and questions...");
      // Exam 1: JavaScript
      const jsExam = await Exam.create({
        name: "JavaScript Fundamentals Exam",
        duration: 180,
        category: "JavaScript",
        totalMarks: 3,
        passingMarks: 2,
        questions: [],
      });

      const q1 = await Question.create({
        name: "Which of the following is NOT a JavaScript primitive data type?",
        correctOption: "C",
        options: {
          A: "String",
          B: "Boolean",
          C: "Object",
          D: "Symbol",
        },
        exam: jsExam._id,
      });

      const q2 = await Question.create({
        name: "What does Array.prototype.map() return in JavaScript?",
        correctOption: "B",
        options: {
          A: "A single boolean value",
          B: "A new array with the results of calling a function on each element",
          C: "Undefined",
          D: "The length of original array",
        },
        exam: jsExam._id,
      });

      const q3 = await Question.create({
        name: "Which keyword declares a block-scoped variable in modern JavaScript?",
        correctOption: "A",
        options: {
          A: "let",
          B: "var",
          C: "global",
          D: "define",
        },
        exam: jsExam._id,
      });

      jsExam.questions = [q1._id, q2._id, q3._id];
      await jsExam.save();

      // Exam 2: React.js
      const reactExam = await Exam.create({
        name: "React.js Developer Assessment",
        duration: 180,
        category: "React.js",
        totalMarks: 2,
        passingMarks: 1,
        questions: [],
      });

      const rq1 = await Question.create({
        name: "What is the primary function of the React Virtual DOM?",
        correctOption: "A",
        options: {
          A: "To optimize DOM manipulations through diffing and reconciliation",
          B: "To execute code inside WebAssembly",
          C: "To provide cloud database storage",
          D: "To eliminate JavaScript",
        },
        exam: reactExam._id,
      });

      const rq2 = await Question.create({
        name: "Which React hook should be used to cache expensive calculated values?",
        correctOption: "D",
        options: {
          A: "useEffect",
          B: "useRef",
          C: "useCallback",
          D: "useMemo",
        },
        exam: reactExam._id,
      });

      reactExam.questions = [rq1._id, rq2._id];
      await reactExam.save();

      console.log("[MongoDB Atlas] Starter exams and questions seeded successfully!");
    }
  } catch (err) {
    console.error("[MongoDB Atlas Seeding Error]:", err.message);
  }
};

const connectDatabase = async () => {
  const mongoUrl = process.env.MONGO_URL;

  if (!mongoUrl || mongoUrl.includes("127.0.0.1") || mongoUrl.includes("localhost")) {
    console.warn(`[Database Notice] No external MongoDB Atlas URL configured in .env`);
    console.log("[Database] Active in-memory fallback enabled for zero-setup execution.");
    console.log("[Database Note] To connect your live MongoDB Atlas, set MONGO_URL in .env");
    return;
  }

  try {
    await mongoose.connect(mongoUrl, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("=================================================");
    console.log(" [MongoDB Atlas] LIVE CLOUD DATABASE CONNECTED! ");
    console.log(" All data is now actively writing to MongoDB!   ");
    console.log("=================================================");
    await seedMongoDbIfEmpty();
  } catch (err) {
    console.warn(`[Database Notice] Could not connect to MongoDB at "${mongoUrl}": ${err.message}`);
    console.log("[Database] Active in-memory fallback enabled for zero-setup execution.");
  }
};

connectDatabase();

module.exports = mongoose.connection;
