const router = require("express").Router();
const mongoose = require("mongoose");
const Exam = require("../models/examModel");
const Question = require("../models/questionModel");
const authMiddleware = require("../middlewares/authMiddleware");
const memoryStore = require("../config/memoryStore");

// add exam
router.post("/add", authMiddleware, async (req, res) => {
  try {
    const isMongoConnected = mongoose.connection.readyState === 1;

    if (isMongoConnected) {
      const examExists = await Exam.findOne({ name: req.body.name });
      if (examExists) {
        return res
          .status(200)
          .send({ message: "Exam already exists", success: false });
      }
      req.body.questions = [];
      const newExam = new Exam(req.body);
      await newExam.save();
      return res.send({
        message: "Exam added successfully",
        success: true,
      });
    }

    // Memory Store
    const examExists = memoryStore.exams.find((e) => e.name === req.body.name);
    if (examExists) {
      return res
        .status(200)
        .send({ message: "Exam already exists", success: false });
    }

    const newExam = {
      _id: "exam_" + Date.now(),
      name: req.body.name,
      duration: req.body.duration,
      category: req.body.category,
      totalMarks: req.body.totalMarks,
      passingMarks: req.body.passingMarks,
      questions: [],
      createdAt: new Date(),
    };
    memoryStore.exams.push(newExam);

    res.send({
      message: "Exam added successfully",
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

// get all exams
router.post("/get-all-exams", authMiddleware, async (req, res) => {
  try {
    const isMongoConnected = mongoose.connection.readyState === 1;

    if (isMongoConnected) {
      const exams = await Exam.find({});
      return res.send({
        message: "Exams fetched successfully",
        data: exams,
        success: true,
      });
    }

    res.send({
      message: "Exams fetched successfully",
      data: memoryStore.exams,
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

// get exam by id (with populated questions)
router.post("/get-exam-by-id", authMiddleware, async (req, res) => {
  try {
    const isMongoConnected = mongoose.connection.readyState === 1;

    if (isMongoConnected) {
      const exam = await Exam.findById(req.body.examId).populate("questions");
      return res.send({
        message: "Exam fetched successfully",
        data: exam,
        success: true,
      });
    }

    const exam = memoryStore.exams.find((e) => e._id === req.body.examId);
    if (!exam) {
      return res.status(404).send({ message: "Exam not found", success: false });
    }

    // Populate questions
    const populatedQuestions = memoryStore.questions.filter((q) =>
      exam.questions.includes(q._id)
    );

    res.send({
      message: "Exam fetched successfully",
      data: {
        ...exam,
        questions: populatedQuestions,
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
});

// edit exam by id
router.post("/edit-exam-by-id", authMiddleware, async (req, res) => {
  try {
    const isMongoConnected = mongoose.connection.readyState === 1;

    if (isMongoConnected) {
      await Exam.findByIdAndUpdate(req.body.examId, req.body);
      return res.send({
        message: "Exam edited successfully",
        success: true,
      });
    }

    const idx = memoryStore.exams.findIndex((e) => e._id === req.body.examId);
    if (idx !== -1) {
      memoryStore.exams[idx] = { ...memoryStore.exams[idx], ...req.body };
    }

    res.send({
      message: "Exam edited successfully",
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

// delete exam by id
router.post("/delete-exam-by-id", authMiddleware, async (req, res) => {
  try {
    const isMongoConnected = mongoose.connection.readyState === 1;

    if (isMongoConnected) {
      await Exam.findByIdAndDelete(req.body.examId);
      return res.send({
        message: "Exam deleted successfully",
        success: true,
      });
    }

    memoryStore.exams = memoryStore.exams.filter((e) => e._id !== req.body.examId);
    res.send({
      message: "Exam deleted successfully",
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

// add question to exam
router.post("/add-question-to-exam", authMiddleware, async (req, res) => {
  try {
    const isMongoConnected = mongoose.connection.readyState === 1;

    if (isMongoConnected) {
      const newQuestion = new Question(req.body);
      const question = await newQuestion.save();

      const exam = await Exam.findById(req.body.exam);
      exam.questions.push(question._id);
      await exam.save();
      return res.send({
        message: "Question added successfully",
        success: true,
      });
    }

    const newQ = {
      _id: "q_" + Date.now(),
      name: req.body.name,
      correctOption: req.body.correctOption,
      options: req.body.options,
      exam: req.body.exam,
      createdAt: new Date(),
    };
    memoryStore.questions.push(newQ);

    const exam = memoryStore.exams.find((e) => e._id === req.body.exam);
    if (exam) {
      exam.questions.push(newQ._id);
    }

    res.send({
      message: "Question added successfully",
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

// edit question in exam
router.post("/edit-question-in-exam", authMiddleware, async (req, res) => {
  try {
    const isMongoConnected = mongoose.connection.readyState === 1;

    if (isMongoConnected) {
      await Question.findByIdAndUpdate(req.body.questionId, req.body);
      return res.send({
        message: "Question edited successfully",
        success: true,
      });
    }

    const idx = memoryStore.questions.findIndex((q) => q._id === req.body.questionId);
    if (idx !== -1) {
      memoryStore.questions[idx] = { ...memoryStore.questions[idx], ...req.body };
    }

    res.send({
      message: "Question edited successfully",
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

// delete question in exam
router.post("/delete-question-in-exam", authMiddleware, async (req, res) => {
  try {
    const isMongoConnected = mongoose.connection.readyState === 1;

    if (isMongoConnected) {
      await Question.findByIdAndDelete(req.body.questionId);
      const exam = await Exam.findById(req.body.examId);
      exam.questions = exam.questions.filter(
        (question) => question._id != req.body.questionId
      );
      await exam.save();
      return res.send({
        message: "Question deleted successfully",
        success: true,
      });
    }

    memoryStore.questions = memoryStore.questions.filter((q) => q._id !== req.body.questionId);
    const exam = memoryStore.exams.find((e) => e._id === req.body.examId);
    if (exam) {
      exam.questions = exam.questions.filter((id) => id !== req.body.questionId);
    }

    res.send({
      message: "Question deleted successfully",
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

// bulk add questions to exam (from CSV / Excel import)
router.post("/bulk-add-questions-to-exam", authMiddleware, async (req, res) => {
  try {
    const isMongoConnected = mongoose.connection.readyState === 1;
    const { examId, questions } = req.body;

    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return res.status(200).send({
        message: "No questions provided for bulk import",
        success: false,
      });
    }

    if (isMongoConnected) {
      const exam = await Exam.findById(examId);
      if (!exam) {
        return res.status(404).send({
          message: "Target exam not found",
          success: false,
        });
      }

      const questionsToInsert = questions.map((q) => ({
        name: q.name,
        correctOption: q.correctOption.toUpperCase().trim(),
        options: {
          A: q.options?.A || "",
          B: q.options?.B || "",
          C: q.options?.C || "",
          D: q.options?.D || "",
        },
        explanation: q.explanation || "",
        exam: examId,
      }));

      const createdQuestions = await Question.insertMany(questionsToInsert);
      const questionIds = createdQuestions.map((q) => q._id);

      exam.questions.push(...questionIds);
      if (exam.totalMarks < exam.questions.length) {
        exam.totalMarks = exam.questions.length;
      }
      await exam.save();

      return res.send({
        message: `Successfully imported ${createdQuestions.length} questions into "${exam.name}"!`,
        success: true,
        count: createdQuestions.length,
      });
    }

    // In-memory fallback
    const exam = memoryStore.exams.find((e) => e._id === examId);
    if (!exam) {
      return res.status(404).send({
        message: "Target exam not found",
        success: false,
      });
    }

    let addedCount = 0;
    questions.forEach((q, idx) => {
      const newQ = {
        _id: "q_bulk_" + Date.now() + "_" + idx,
        name: q.name,
        correctOption: q.correctOption.toUpperCase().trim(),
        options: {
          A: q.options?.A || "",
          B: q.options?.B || "",
          C: q.options?.C || "",
          D: q.options?.D || "",
        },
        exam: examId,
        createdAt: new Date(),
      };
      memoryStore.questions.push(newQ);
      exam.questions.push(newQ._id);
      addedCount++;
    });

    if (exam.totalMarks < exam.questions.length) {
      exam.totalMarks = exam.questions.length;
    }

    res.send({
      message: `Successfully imported ${addedCount} questions into "${exam.name}"!`,
      success: true,
      count: addedCount,
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
