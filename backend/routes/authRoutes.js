const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");

// JWT Secret Key
const JWT_SECRET = process.env.JWT_SECRET || "icbp-secret-key-change-in-production";

// Password reset tokens storage (in production, use Redis or database)
const resetTokens = new Map();

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: "7d" });
};

// Middleware to verify token
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ error: "Invalid token" });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};

// POST: Register new user
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Create new user
    const user = new User({ email, password });
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: error.message });
  }
});

// POST: Login user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Compare password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        isProfileComplete: user.isProfileComplete,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: error.message });
  }
});

// GET: Get current user profile
router.get("/me", authMiddleware, async (req, res) => {
  try {
    res.json({
      user: {
        id: req.user._id,
        email: req.user.email,
        profile: req.user.profile,
        documents: req.user.documents,
        isProfileComplete: req.user.isProfileComplete,
        createdAt: req.user.createdAt,
      },
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ error: error.message });
  }
});

// POST: Forgot Password - Generate reset token
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal if user exists or not
      return res.json({ message: "If the email exists, a reset link has been sent" });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour

    // Store token (in production, save to database)
    resetTokens.set(resetToken, { userId: user._id, expiry: resetTokenExpiry });

    // In production, send email with reset link
    // For now, return the token for testing
    res.json({
      message: "Password reset link generated",
      resetToken, // Remove in production
      resetLink: `${process.env.FRONTEND_URL || "http://localhost:3000"}/reset-password?token=${resetToken}`,
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ error: error.message });
  }
});

// POST: Reset Password - Validate token and reset password
router.post("/reset-password", async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ error: "Token and new password are required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    // Verify token
    const tokenData = resetTokens.get(token);
    if (!tokenData) {
      return res.status(400).json({ error: "Invalid or expired reset token" });
    }

    if (Date.now() > tokenData.expiry) {
      resetTokens.delete(token);
      return res.status(400).json({ error: "Reset token has expired" });
    }

    // Update password
    const user = await User.findById(tokenData.userId);
    if (!user) {
      resetTokens.delete(token);
      return res.status(404).json({ error: "User not found" });
    }

    user.password = newPassword;
    await user.save();

    // Clean up token
    resetTokens.delete(token);

    res.json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ error: error.message });
  }
});

// POST: Google Sign-In / OAuth
router.post("/google-auth", async (req, res) => {
  try {
    const { email, googleId, name, picture } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    // Find or create user
    let user = await User.findOne({ email });

    if (!user) {
      // Create new user with Google auth
      user = new User({
        email,
        googleId,
        name,
        picture,
        isGoogleUser: true,
      });
      await user.save();
    } else if (!user.googleId && googleId) {
      // Link Google account to existing user
      user.googleId = googleId;
      user.name = name;
      user.picture = picture;
      user.isGoogleUser = true;
      await user.save();
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      message: "Google authentication successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        picture: user.picture,
        isProfileComplete: user.isProfileComplete,
      },
    });
  } catch (error) {
    console.error("Google auth error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Export middleware for use in other routes
module.exports = router;
module.exports.authMiddleware = authMiddleware;
module.exports.JWT_SECRET = JWT_SECRET;
