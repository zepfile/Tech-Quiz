const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dns = require("dns");

try {
  dns.setServers(["8.8.8.8", "1.1.1.1", "8.8.4.4"]);
} catch (e) {
  // ignore
}

const seedMongoDbIfEmpty = async () => {
  // In serverless production environments (Vercel), Atlas is already permanently populated.
  // Never run heavy bcrypt hashing or document counts on cold starts.
  if (process.env.VERCEL) {
    return;
  }
  try {
    const User = require("../models/userModel");
    const Exam = require("../models/examModel");
    const Question = require("../models/questionModel");

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    // Sync admin account from .env to database if configured
    if (adminEmail && adminPassword) {
      const existingAdmin = await User.findOne({ email: adminEmail });
      if (!existingAdmin) {
        const hashedAdminPassword = await bcrypt.hash(adminPassword, 10);
        await User.create({
          name: "Administrator",
          email: adminEmail,
          password: hashedAdminPassword,
          isAdmin: true,
        });
        console.log(`[MongoDB Atlas] Admin account synced from .env (${adminEmail})`);
      } else if (!existingAdmin.isAdmin) {
        existingAdmin.isAdmin = true;
        await existingAdmin.save();
      }
    }

    const usersCount = await User.countDocuments();
    if (usersCount === 0) {
      console.log("[MongoDB Atlas] Initializing default collections and seeding users...");
      const finalAdminEmail = adminEmail || "admin@example.com";
      const finalAdminPass = adminPassword || "admin_initial_secret";
      const adminHash = await bcrypt.hash(finalAdminPass, 10);
      const userHash = await bcrypt.hash("user123", 10);

      await User.create([
        {
          name: "Admin User",
          email: finalAdminEmail,
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
      console.log(`[MongoDB Atlas] Users seeded successfully (${finalAdminEmail} & user@quiz.com)`);
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

let cachedPromise = null;

const connectDatabase = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  const mongoUrl = process.env.MONGO_URL;

  if (!mongoUrl || mongoUrl.includes("127.0.0.1") || mongoUrl.includes("localhost")) {
    console.warn(`[Database Notice] No external MongoDB Atlas URL configured in .env`);
    return null;
  }

  if (cachedPromise) {
    return cachedPromise;
  }

  try {
    cachedPromise = mongoose
      .connect(mongoUrl, {
        serverSelectionTimeoutMS: 4000,
        maxPoolSize: 10,
        bufferCommands: false,
      })
      .then((conn) => {
        // Run seed asynchronously in the background so it never blocks HTTP responses!
        seedMongoDbIfEmpty().catch((err) =>
          console.warn("[Background Seed Notice]:", err.message)
        );
        return conn;
      })
      .catch((err) => {
        cachedPromise = null;
        throw err;
      });

    return await cachedPromise;
  } catch (err) {
    cachedPromise = null;
    console.warn(`[Database Notice] Could not connect to MongoDB: ${err.message}`);
    return null;
  }
};

if (!process.env.VERCEL) {
  connectDatabase().catch((e) => {
    console.warn("[Database Init Catch]:", e.message);
  });
}

module.exports = {
  connection: mongoose.connection,
  connectDatabase,
};
