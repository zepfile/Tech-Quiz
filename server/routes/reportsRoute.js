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

module.exports = router;
