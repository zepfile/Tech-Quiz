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

// Get all users and admin directory (Only for Admins, superadmin view)
router.post("/get-all-users", authMiddleware, async (req, res) => {
  try {
    const isMongoConnected = mongoose.connection.readyState === 1;
    const userId = req.body.userId;

    let caller = null;
    if (isMongoConnected) {
      caller = await User.findById(userId);
    } else {
      caller = memoryStore.users.find((u) => u._id === userId);
    }

    if (!caller || !caller.isAdmin) {
      return res.status(403).send({
        message: "Access Denied: Administrator role required to view admin directory",
        success: false,
      });
    }

    const superAdminEmail = (process.env.ADMIN_EMAIL || "admin@quiz.com").toLowerCase();

    let users = [];
    if (isMongoConnected) {
      const dbUsers = await User.find({}, "name email isAdmin createdAt").sort({
        isAdmin: -1,
        createdAt: -1,
      });
      users = dbUsers.map((u) => ({
        _id: u._id,
        name: u.name,
        email: u.email,
        isAdmin: Boolean(u.isAdmin),
        isSuperAdmin: (u.email || "").toLowerCase() === superAdminEmail,
        createdAt: u.createdAt,
      }));
    } else {
      users = memoryStore.users.map((u) => ({
        _id: u._id,
        name: u.name,
        email: u.email,
        isAdmin: Boolean(u.isAdmin),
        isSuperAdmin: (u.email || "").toLowerCase() === superAdminEmail,
        createdAt: u.createdAt,
      }));
    }

    res.send({
      message: "Admin directory fetched successfully",
      success: true,
      data: users,
      superAdminEmail,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      data: error,
      success: false,
    });
  }
});

// Update user role (Promote to Admin or Demote to User)
router.post("/update-user-role", authMiddleware, async (req, res) => {
  try {
    const isMongoConnected = mongoose.connection.readyState === 1;
    const { targetUserId, newIsAdmin } = req.body;
    const callerId = req.body.userId;

    let caller = null;
    if (isMongoConnected) {
      caller = await User.findById(callerId);
    } else {
      caller = memoryStore.users.find((u) => u._id === callerId);
    }

    if (!caller || !caller.isAdmin) {
      return res.status(403).send({
        message: "Access Denied: Only Admins can modify account roles",
        success: false,
      });
    }

    const superAdminEmail = (process.env.ADMIN_EMAIL || "admin@quiz.com").toLowerCase();

    let targetUser = null;
    if (isMongoConnected) {
      targetUser = await User.findById(targetUserId);
    } else {
      targetUser = memoryStore.users.find((u) => u._id === targetUserId);
    }

    if (!targetUser) {
      return res.status(404).send({
        message: "Target user not found",
        success: false,
      });
    }

    // Protect Super Admin from being demoted
    if ((targetUser.email || "").toLowerCase() === superAdminEmail && !newIsAdmin) {
      return res.status(400).send({
        message: "Primary Super Admin account role cannot be revoked",
        success: false,
      });
    }

    targetUser.isAdmin = Boolean(newIsAdmin);

    if (isMongoConnected) {
      await targetUser.save();
    }

    res.send({
      message: `Role successfully updated for ${targetUser.email}: ${
        targetUser.isAdmin ? "Promoted to Admin" : "Demoted to User"
      }`,
      success: true,
      data: {
        _id: targetUser._id,
        email: targetUser.email,
        isAdmin: targetUser.isAdmin,
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
