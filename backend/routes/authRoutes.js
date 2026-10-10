const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const User = require("../models/User");
const { users } = require("../store/mockStore");
const { JWT_SECRET, authenticateToken } = require("../middleware/authMiddleware");

const router = express.Router();

function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}

// Register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, targetRole } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ error: "Name, email and password are required" });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check if user already exists
    if (isMongoConnected()) {
      const existingUser = await User.findOne({ email: cleanEmail });
      if (existingUser) {
        return res.status(409).json({ error: "User already exists with this email" });
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const newUser = await User.create({
        name,
        email: cleanEmail,
        passwordHash,
        targetRole: targetRole || "Fullstack Engineer"
      });

      const token = jwt.sign(
        { id: newUser._id.toString(), email: newUser.email, name: newUser.name },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      return res.status(201).json({
        message: "User registered successfully",
        token,
        user: {
          id: newUser._id.toString(),
          name: newUser.name,
          email: newUser.email,
          targetRole: newUser.targetRole
        }
      });
    } else {
      // Memory Store Fallback
      const existingUser = users.find(u => u.email.toLowerCase() === cleanEmail);
      if (existingUser) {
        return res.status(409).json({ error: "User already exists with this email" });
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const newUser = {
        id: "usr_" + Date.now(),
        name,
        email: cleanEmail,
        passwordHash,
        targetRole: targetRole || "Fullstack Engineer",
        createdAt: new Date().toISOString()
      };

      users.push(newUser);

      const token = jwt.sign(
        { id: newUser.id, email: newUser.email, name: newUser.name },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      return res.status(201).json({
        message: "User registered successfully",
        token,
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          targetRole: newUser.targetRole
        }
      });
    }
  } catch (err) {
    console.error("Registration error:", err);
    return res.status(500).json({ error: "Server error during registration" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const cleanEmail = email.toLowerCase().trim();

    if (isMongoConnected()) {
      const user = await User.findOne({ email: cleanEmail });
      if (!user) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      const token = jwt.sign(
        { id: user._id.toString(), email: user.email, name: user.name },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      return res.json({
        message: "Login successful",
        token,
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          targetRole: user.targetRole || "Fullstack Engineer"
        }
      });
    } else {
      // Memory Store Fallback
      const user = users.find(u => u.email.toLowerCase() === cleanEmail);
      if (!user) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      const isMatch = user.passwordHash.includes("mockhash")
        ? true
        : await bcrypt.compare(password, user.passwordHash);

      if (!isMatch) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, name: user.name },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      return res.json({
        message: "Login successful",
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          targetRole: user.targetRole || "Fullstack Engineer"
        }
      });
    }
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Server error during login" });
  }
});

// Get Current User Profile
router.get("/me", authenticateToken, async (req, res) => {
  try {
    if (isMongoConnected()) {
      const user = await User.findById(req.user.id).select("-passwordHash");
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      return res.json({
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          targetRole: user.targetRole,
          createdAt: user.createdAt
        }
      });
    } else {
      const user = users.find(u => u.id === req.user.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      return res.json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          targetRole: user.targetRole || "Fullstack Engineer",
          createdAt: user.createdAt
        }
      });
    }
  } catch (err) {
    return res.status(500).json({ error: "Server error fetching user profile" });
  }
});

module.exports = router;
