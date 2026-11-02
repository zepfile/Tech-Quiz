const router = require("express").Router();
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const authMiddleware = require("../middlewares/authMiddleware");
const memoryStore = require("../config/memoryStore");

const JWT_SECRET = process.env.JWT_SECRET || "quiz_default_secret_key";

// user registration
router.post("/register", async (req, res) => {
  try {
    const isMongoConnected = mongoose.connection.readyState === 1;

    if (isMongoConnected) {
      const userExists = await User.findOne({ email: req.body.email });
      if (userExists) {
        return res
          .status(200)
          .send({ message: "User already exists", success: false });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      req.body.password = hashedPassword;

      const newUser = new User(req.body);
      await newUser.save();
      return res.send({
        message: "User created successfully",
        success: true,
      });
    }

    // Memory Store Fallback
    const userExists = memoryStore.users.find((u) => u.email === req.body.email);
    if (userExists) {
      return res
        .status(200)
        .send({ message: "User already exists", success: false });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const newUser = {
      _id: "user_" + Date.now(),
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      isAdmin: req.body.isAdmin || false,
      createdAt: new Date(),
    };

    memoryStore.users.push(newUser);

    return res.send({
      message: "User created successfully",
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

// user login
router.post("/login", async (req, res) => {
  try {
    const isMongoConnected = mongoose.connection.readyState === 1;

    let user = null;
    if (isMongoConnected) {
      user = await User.findOne({ email: req.body.email });
    } else {
      user = memoryStore.users.find((u) => u.email === req.body.email);
    }

    if (!user) {
      return res
        .status(200)
        .send({ message: "User does not exist", success: false });
    }

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) {
      return res
        .status(200)
        .send({ message: "Invalid password", success: false });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "1d",
    });

    res.send({
      message: "User logged in successfully",
      success: true,
      data: token,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      data: error,
      success: false,
    });
  }
});

// get user info
router.post("/get-user-info", authMiddleware, async (req, res) => {
  try {
    const isMongoConnected = mongoose.connection.readyState === 1;

    let user = null;
    if (isMongoConnected) {
      user = await User.findById(req.body.userId);
    } else {
      user = memoryStore.users.find((u) => u._id === req.body.userId);
    }

    if (!user) {
      return res.status(404).send({
        message: "User not found",
        success: false,
      });
    }

    res.send({
      message: "User info fetched successfully",
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      },
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
