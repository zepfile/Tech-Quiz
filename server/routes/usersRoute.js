const router = require("express").Router();
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const authMiddleware = require("../middlewares/authMiddleware");
const memoryStore = require("../config/memoryStore");

const JWT_SECRET = process.env.JWT_SECRET || "quiz_secret_jwt_key_2026";

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

      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        isAdmin: false, // All public registrations are regular candidate accounts
      });
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
      isAdmin: false, // All registrations are candidate users
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

    const token = jwt.sign({ userId: user._id, isAdmin: user.isAdmin }, JWT_SECRET, {
      expiresIn: "1d",
    });

    res.send({
      message: "User logged in successfully",
      success: true,
      data: token,
      isAdmin: Boolean(user.isAdmin),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: Boolean(user.isAdmin),
        createdAt: user.createdAt,
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
        createdAt: user.createdAt,
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

// update user profile (name and/or password)
router.post("/update-profile", authMiddleware, async (req, res) => {
  try {
    const isMongoConnected = mongoose.connection.readyState === 1;
    const { name, oldPassword, newPassword } = req.body;
    const userId = req.body.userId;

    let user = null;
    if (isMongoConnected) {
      user = await User.findById(userId);
    } else {
      user = memoryStore.users.find((u) => u._id === userId);
    }

    if (!user) {
      return res.status(404).send({ message: "User not found", success: false });
    }

    // Update name
    if (name && name.trim()) {
      user.name = name.trim();
    }

    // Update password if oldPassword is provided
    if (oldPassword && newPassword) {
      const validPassword = await bcrypt.compare(oldPassword, user.password);
      if (!validPassword) {
        return res.status(200).send({
          message: "Current password does not match",
          success: false,
        });
      }

      if (newPassword.length < 6) {
        return res.status(200).send({
          message: "New password must be at least 6 characters",
          success: false,
        });
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    if (isMongoConnected) {
      await user.save();
    }

    res.send({
      message: "Profile updated successfully",
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        createdAt: user.createdAt,
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
