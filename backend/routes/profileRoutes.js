const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { authMiddleware } = require("./authRoutes");
const User = require("../models/User");

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf|doc|docx|xls|xlsx|csv/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error("Invalid file type. Allowed: images, PDF, Word, Excel files"));
  },
});

// Apply auth middleware to all routes
router.use(authMiddleware);

// GET: Get user profile
router.get("/", async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json({
      profile: user.profile,
      documents: user.documents,
      isProfileComplete: user.isProfileComplete,
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ error: error.message });
  }
});

// PUT: Update profile information
router.put("/update", async (req, res) => {
  try {
    const { section, data } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update the appropriate section
    if (section && user.profile[section] !== undefined) {
      user.profile[section] = { ...user.profile[section], ...data };
    } else if (data) {
      // If no section specified, merge data into profile
      for (const key in data) {
        if (user.profile[key] !== undefined) {
          user.profile[key] = { ...user.profile[key], ...data[key] };
        }
      }
    }

    // Check if profile is complete (basic check)
    user.isProfileComplete = !!(
      user.profile.personalInfo?.fullName &&
      user.profile.personalInfo?.idPassportNumber &&
      user.profile.bankingDetails?.bankName
    );

    await user.save();
    res.json({ message: "Profile updated successfully", profile: user.profile });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ error: error.message });
  }
});

// POST: Upload document
router.post("/upload", upload.single("document"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const { documentType } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const filePath = `/uploads/${req.file.filename}`;

    // Handle different document types
    if (documentType) {
      if (Array.isArray(user.documents[documentType])) {
        // For array fields, push the new file path
        if (!user.documents[documentType]) {
          user.documents[documentType] = [];
        }
        user.documents[documentType].push(filePath);
      } else {
        // For single file fields, just set the path
        user.documents[documentType] = filePath;
      }
    }

    await user.save();
    res.json({
      message: "Document uploaded successfully",
      filePath,
      documentType,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE: Remove document
router.delete("/document/:docType", async (req, res) => {
  try {
    const { docType } = req.params;
    const { filePath } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (Array.isArray(user.documents[docType])) {
      user.documents[docType] = user.documents[docType].filter((p) => p !== filePath);
    } else {
      user.documents[docType] = undefined;
    }

    // Try to delete the physical file
    if (filePath) {
      const physicalPath = path.join(__dirname, "..", filePath);
      if (fs.existsSync(physicalPath)) {
        fs.unlinkSync(physicalPath);
      }
    }

    await user.save();
    res.json({ message: "Document removed successfully" });
  } catch (error) {
    console.error("Delete document error:", error);
    res.status(500).json({ error: error.message });
  }
});

// GET: List uploaded documents
router.get("/documents", async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("documents");
    res.json({ documents: user.documents });
  } catch (error) {
    console.error("Get documents error:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;