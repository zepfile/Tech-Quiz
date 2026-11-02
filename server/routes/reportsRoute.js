const router = require("express").Router();
const mongoose = require("mongoose");
const authMiddleware = require("../middlewares/authMiddleware");
const Exam = require("../models/examModel");
const User = require("../models/userModel");
const Report = require("../models/reportModel");
const memoryStore = require("../config/memoryStore");

// add report
router.post("/add-report", authMiddleware, async (req, res) => {
  try {
    const isMongoConnected = mongoose.connection.readyState === 1;

    if (isMongoConnected) {
      const newReport = new Report(req.body);
      await newReport.save();
      return res.send({
        message: "Attempt added successfully",
        success: true,
      });
    }

    const newReport = {
      _id: "report_" + Date.now(),
      user: req.body.user,
      exam: req.body.exam,
      result: req.body.result,
      createdAt: new Date(),
    };
    memoryStore.reports.unshift(newReport);

    res.send({
      message: "Attempt added successfully",
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      data: error,
      success: false,
    });
  }
});

// get all reports (admin)
router.post("/get-all-reports", authMiddleware, async (req, res) => {
  try {
    const isMongoConnected = mongoose.connection.readyState === 1;

    if (isMongoConnected) {
      const { examName, userName } = req.body;

      const exams = await Exam.find({
        name: {
          $regex: examName || "",
          $options: "i",
        },
      });

      const matchedExamIds = exams.map((exam) => exam._id);

      const users = await User.find({
        name: {
          $regex: userName || "",
          $options: "i",
        },
      });

      const matchedUserIds = users.map((user) => user._id);

      const reports = await Report.find({
        exam: {
          $in: matchedExamIds,
        },
        user: {
          $in: matchedUserIds,
        },
      })
        .populate("exam")
        .populate("user")
        .sort({ createdAt: -1 });

      return res.send({
        message: "Attempts fetched successfully",
        data: reports,
        success: true,
      });
    }

    // Memory Store: populate exam and user
    const { examName = "", userName = "" } = req.body || {};

    const populatedReports = memoryStore.reports
      .map((r) => {
        const examObj = memoryStore.exams.find((e) => e._id === r.exam);
        const userObj = memoryStore.users.find((u) => u._id === r.user);
        return {
          ...r,
          exam: examObj || { name: "Exam" },
          user: userObj ? { name: userObj.name, email: userObj.email } : { name: "Candidate" },
        };
      })
      .filter((r) => {
        const matchesExam = !examName || r.exam.name.toLowerCase().includes(examName.toLowerCase());
        const matchesUser = !userName || r.user.name.toLowerCase().includes(userName.toLowerCase());
        return matchesExam && matchesUser;
      });

    res.send({
      message: "Attempts fetched successfully",
      data: populatedReports,
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      data: error,
      success: false,
    });
  }
});

// get all reports by user
router.post("/get-all-reports-by-user", authMiddleware, async (req, res) => {
  try {
    const isMongoConnected = mongoose.connection.readyState === 1;

    if (isMongoConnected) {
      const reports = await Report.find({ user: req.body.userId })
        .populate("exam")
        .populate("user")
        .sort({ createdAt: -1 });

      return res.send({
        message: "Attempts fetched successfully",
        data: reports,
        success: true,
      });
    }

    const populatedReports = memoryStore.reports
      .filter((r) => r.user === req.body.userId)
      .map((r) => {
        const examObj = memoryStore.exams.find((e) => e._id === r.exam);
        const userObj = memoryStore.users.find((u) => u._id === r.user);
        return {
          ...r,
          exam: examObj || { name: "Exam" },
          user: userObj ? { name: userObj.name, email: userObj.email } : { name: "Candidate" },
        };
      });

      res.send({
        message: "Attempts fetched successfully",
        data: populatedReports,
        success: true,
      });
    } catch (error) {
      res.status(500).send({
        message: error.message,
        data: error,
        success: false,
      });
    }
  });

const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "quiz_secret_jwt_key_2026";

// Optional Auth: enables public viewing of Leaderboard for all visitors
const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(" ")[1];
      if (token && token !== "null" && token !== "undefined") {
        const decodedToken = jwt.verify(token, JWT_SECRET);
        req.body.userId = decodedToken.userId;
      }
    }
  } catch (e) {
    // If token is missing/expired, still allow viewing the leaderboard
  }
  next();
};

// get leaderboard (publicly accessible via POST or GET)
const handleGetLeaderboard = async (req, res) => {
  try {
    const isMongoConnected = mongoose.connection.readyState === 1;
    const examId = req.body?.examId || req.query?.examId;
    const currentUserId = req.body?.userId || req.query?.userId;

    let allExams = [];
    let reports = [];

    if (isMongoConnected) {
      allExams = await Exam.find().select("name category totalMarks passingMarks").sort({ name: 1 });
      const query = {};
      if (examId && examId !== "all") {
        query.exam = examId;
      }
      reports = await Report.find(query)
        .populate("exam", "name category totalMarks passingMarks")
        .populate("user", "name email")
        .sort({ createdAt: -1 });
    } else {
      allExams = memoryStore.exams.map((e) => ({
        _id: e._id,
        name: e.name,
        category: e.category,
        totalMarks: e.totalMarks,
        passingMarks: e.passingMarks,
      }));
      reports = memoryStore.reports
        .filter((r) => (!examId || examId === "all" ? true : r.exam === examId))
        .map((r) => {
          const examObj = memoryStore.exams.find((e) => e._id === r.exam);
          const userObj = memoryStore.users.find((u) => u._id === r.user);
          return {
            ...r,
            exam: examObj || { name: "Exam", totalMarks: 1, passingMarks: 1 },
            user: userObj ? { name: userObj.name, email: userObj.email } : { name: "Candidate" },
          };
        });
    }

    let leaderboard = [];

    if (examId && examId !== "all") {
      // Exam-specific leaderboard
      const userBestMap = {};
      reports.forEach((r) => {
        if (!r.user || !r.user._id) return;
        const uId = r.user._id.toString();
        const score =
          r.result?.obtainedScore !== undefined
            ? r.result.obtainedScore
            : r.result?.correctAnswers?.length || 0;
        const total = r.exam?.totalMarks || 1;
        const accuracy = Math.round((score / total) * 100);
        const isPass = r.result?.verdict?.toLowerCase() === "pass";

        if (!userBestMap[uId] || score > userBestMap[uId].score) {
          userBestMap[uId] = {
            userId: uId,
            userName: r.user.name,
            userEmail: r.user.email,
            examId: r.exam?._id,
            examName: r.exam?.name,
            examCategory: r.exam?.category,
            score,
            totalMarks: total,
            accuracy,
            isPass,
            penaltyDeducted: r.result?.penaltyDeducted || 0,
            attemptDate: r.createdAt,
            reportId: r._id,
          };
        }
      });

      leaderboard = Object.values(userBestMap).sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        if (b.accuracy !== a.accuracy) return b.accuracy - a.accuracy;
        return new Date(a.attemptDate) - new Date(b.attemptDate);
      });
    } else {
      // Global Leaderboard
      const userSummaryMap = {};
      reports.forEach((r) => {
        if (!r.user || !r.user._id) return;
        const uId = r.user._id.toString();
        const exId = r.exam?._id ? r.exam._id.toString() : "unknown";
        const score =
          r.result?.obtainedScore !== undefined
            ? r.result.obtainedScore
            : r.result?.correctAnswers?.length || 0;
        const total = r.exam?.totalMarks || 1;
        const accuracy = Math.round((score / total) * 100);
        const isPass = r.result?.verdict?.toLowerCase() === "pass";

        if (!userSummaryMap[uId]) {
          userSummaryMap[uId] = {
            userId: uId,
            userName: r.user.name,
            userEmail: r.user.email,
            bestExamScores: {},
            totalAttempts: 0,
            latestAttempt: r.createdAt,
          };
        }

        userSummaryMap[uId].totalAttempts += 1;
        if (new Date(r.createdAt) > new Date(userSummaryMap[uId].latestAttempt)) {
          userSummaryMap[uId].latestAttempt = r.createdAt;
        }

        if (
          !userSummaryMap[uId].bestExamScores[exId] ||
          score > userSummaryMap[uId].bestExamScores[exId].score
        ) {
          userSummaryMap[uId].bestExamScores[exId] = {
            score,
            total,
            isPass,
            accuracy,
            examName: r.exam?.name,
          };
        }
      });

      leaderboard = Object.values(userSummaryMap)
        .map((u) => {
          const examsTaken = Object.values(u.bestExamScores);
          const totalScore = examsTaken.reduce((sum, item) => sum + item.score, 0);
          const totalPossible = examsTaken.reduce((sum, item) => sum + item.total, 0);
          const examsPassed = examsTaken.filter((item) => item.isPass).length;
          const overallAccuracy =
            totalPossible > 0 ? Math.round((totalScore / totalPossible) * 100) : 0;

          return {
            userId: u.userId,
            userName: u.userName,
            userEmail: u.userEmail,
            totalScore: Math.round(totalScore * 100) / 100,
            totalMarks: totalPossible,
            examsPassed,
            uniqueExamsCount: examsTaken.length,
            totalAttempts: u.totalAttempts,
            accuracy: overallAccuracy,
            lastActive: u.latestAttempt,
          };
        })
        .sort((a, b) => {
          if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
          if (b.examsPassed !== a.examsPassed) return b.examsPassed - a.examsPassed;
          return b.accuracy - a.accuracy;
        });
    }

    // Attach ranks
    leaderboard = leaderboard.map((item, index) => ({
      ...item,
      rank: index + 1,
    }));

    const currentUserStanding =
      leaderboard.find((item) => item.userId === currentUserId?.toString()) || null;

    res.send({
      message: "Leaderboard fetched successfully",
      data: {
        leaderboard,
        allExams,
        currentUserStanding,
        totalParticipants: leaderboard.length,
      },
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      data: error,
      success: false,
    });
  }
};

router.post("/get-leaderboard", optionalAuth, handleGetLeaderboard);
router.get("/get-leaderboard", optionalAuth, handleGetLeaderboard);

module.exports = router;
