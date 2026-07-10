/**
 * Usage:
 *   app.use('/api/user', require('./routes/userProfile'));
 */

const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const User = require("../../models/User");
const { authenticateToken } = require("../middleware/auth");
const { uploadProfile, uploadDocuments } = require("../middleware/multer");
const { createNotification } = require("../../services/notificationService");
let cloudinary;
try { cloudinary = require("../config/cloudinary").cloudinary; } catch (e) { cloudinary = null; }
const { updateUserProgress } = require("../utils/userProgress");





// Joi validation (use your provided file)
const {
  profileSchema,
  educationSchema,
  educationArraySchema,
  experienceSchema,
  experienceArraySchema,
  extracurricularSchema,
  extracurricularArraySchema,
  testHistorySchema,
  testHistoryArraySchema,
  preferencesSchema,
  financialSchema,
  privacySchema,
  documentSchema,
  documentsArraySchema,
  onboardingSchema,
  formatJoiError
} = require("../utils/profileValidation");

// -------------------------- Helpers --------------------------

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

/**
 * Safely deep merges two objects.
 * - Preserves nested fields (e.g. location)
 * - Replaces arrays entirely
 * - Skips undefined values
 * Used across all routes for consistent behavior.
 */
function deepMergeObjects(target = {}, source = {}) {
  // Clone target to avoid mutation
  const output = { ...target };

  for (const key of Object.keys(source)) {
    const sourceValue = source[key];
    const targetValue = target[key];

    // Ignore undefined values 
    if (sourceValue === undefined) continue;

    // Arrays: Replace completely (like Education, Experience)
    if (Array.isArray(sourceValue)) {
      output[key] = sourceValue;
    }
    // Nested objects: Merge deeply (e.g. location, preferences)
    else if (sourceValue && typeof sourceValue === "object" && !(sourceValue instanceof Date)) {
      output[key] = deepMergeObjects(
        targetValue && typeof targetValue === "object" ? targetValue : {},
        sourceValue
      );
    }
    // Primitive values: Replace directly
    else {
      output[key] = sourceValue;
    }
  }

  return output;
}

/**
 * sanitizeForResponse(userDoc) - removes sensitive fields before sending to frontend
 */
function sanitizeForResponse(userDoc) {
  if (!userDoc) return null;
  const u = userDoc.toObject ? userDoc.toObject() : JSON.parse(JSON.stringify(userDoc));
  delete u.password;
  delete u.refreshTokens;
  delete u.emailVerificationToken;
  delete u.emailVerificationExpires;
  delete u.phoneOTP;
  delete u.phoneOTPExpires;
  delete u.phoneOTPAttempts;
  return u;
}



// uniform error sender
function sendError(res, code = 500, msg = "Internal server error", details = null) {
  const payload = { success: false, error: msg };
  if (details) payload.details = details;
  return res.status(code).json(payload);
}

// -------------------------- ROUTES --------------------------

/**
 * GET /api/user/profile
 * Purpose: Fetch full user profile (for pre-filling edit forms / placeholders)
 * Auth: required
 */
router.get("/profile", authenticateToken,  async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return sendError(res, 404, "User not found");
    return res.json({ success: true, data: sanitizeForResponse(user) });
  } catch (err) {
    console.error("GET /profile:", err);
    return sendError(res);
  }
});

/**
 * PUT /api/user/profile
 * Purpose: Update profile fields including arrays (education, experience, etc.)
 * Auth: required
 */
router.put("/profile", authenticateToken, async (req, res) => {
  try {
    // 1 Find user
    const user = await User.findById(req.user._id);
    if (!user) return sendError(res, 404, "User not found");

    // 2 Ensure profile exists
    if (!user.profile) user.profile = {};

    // 3 Handle different field types
    const { 
      profile, 
      profilePicture, 
      education, 
      professionalExperience, 
      extracurriculars, 
      testHistory, 
      preferences, 
      documents,
      ...otherFields 
    } = req.body;

    // Update profile fields
    if (profile) {
      for (const key of Object.keys(profile)) {
        if (typeof profile[key] === "object" && !Array.isArray(profile[key]) && profile[key] !== null) {
          // Nested object (like location)
          user.profile[key] = {
            ...user.profile[key],
            ...profile[key],
          };
        } else {
          // Simple key (string, number, etc.)
          user.profile[key] = profile[key];
        }
      }
    }

    // Update profile picture
    if (profilePicture) {
      user.profilePicture = profilePicture;
    }

    // Update arrays - replace entirely only if provided
    if (education !== undefined) {
      user.education = education;
    }
    if (professionalExperience !== undefined) {
      user.professionalExperience = professionalExperience;
    }
    if (extracurriculars !== undefined) {
      user.extracurriculars = extracurriculars;
    }
    if (testHistory !== undefined) {
      user.testHistory = testHistory;
    }
    if (documents !== undefined) {
      user.documents = documents;
    }

    // Update preferences
    if (preferences) {
      user.preferences = deepMergeObjects(user.preferences || {}, preferences);
    }

    // Update other fields
    for (const key of Object.keys(otherFields)) {
      user[key] = otherFields[key];
    }

    // 4 Save user with updated profile
    await updateUserProgress(user);

    // Create notification
    await createNotification(
      req.user._id,
      "success",
      "Profile updated successfully",
      "profile_update"
    );

    // 5 Respond
    return res.json({
      success: true,
      message: "Profile updated successfully",
      data: sanitizeForResponse(user),
    });
  } catch (err) {
    console.error("PUT /profile:", err);
    return sendError(res, 500, "Failed to update profile");
  }
});


/**
 * POST /api/user/profile-picture
 * Purpose: Upload profile picture 
 *  - Deletes previous image on Cloudinary.
 * Auth: required
 */
router.post("/profile-picture",authenticateToken,  uploadProfile.single("profileImage"), async (req, res) => {
  try {
    console.log("receivedfile:",req.file)
    if (!req.file || !req.file.path) return sendError(res, 400, "No file uploaded");

    const user = await User.findById(req.user._id);
    if (!user) return sendError(res, 404, "User not found");

    // delete previous image (if present)
    if (user.profilePicture && user.profilePicture.publicId && cloudinary && cloudinary.uploader) {
      try { await cloudinary.uploader.destroy(user.profilePicture.publicId); } catch (e) { console.warn("cloudinary destroy fail", e); }
    }

    user.profilePicture = {
      url: req.file.path || req.file.secure_url || null,
      publicId: req.file.filename || req.file.public_id || null
    };

    // Save progress (auto-validates onboarding + saves)
    await updateUserProgress(user);

    return res.json({ success: true, message: "Profile picture updated", data: { profilePicture: user.profilePicture, profileCompletedPercent: user.profileCompletedPercent } });
  } catch (err) {
    console.error("POST /profile-picture:", err);
    return sendError(res);
  }
});

router.get("/profile/completion", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select("profileCompletedPercent") // only fetch this field
      .lean();

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.json({
      success: true,
      profileCompletedPercent: user.profileCompletedPercent || 0,
    });
  } catch (err) {
    console.error("Profile Completion Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* =========================
   EDUCATION 
   - POST /education       -> add one new education entry
   - PUT /education/:id    -> update specific education entry (frontend sends only changed fields)
   - DELETE /education/:id -> remove specific education entry
   ========================= */

/**
 * POST /api/user/education
 * Body: education object validated by educationSchema
 * Adds one education entry (push)
 */
router.post("/education",authenticateToken,  async (req, res) => {
  try {
    const { error, value } = educationSchema.validate(req.body, { abortEarly: false, stripUnknown: true });
    if (error) return sendError(res, 400, formatJoiError(error));

    const user = await User.findById(req.user._id);
    if (!user) return sendError(res, 404, "User not found");

    user.education.push(value);
    // Save progress (auto-validates onboarding + saves)
    await updateUserProgress(user);

    return res.status(201).json({ success: true, message: "Education added", data: { education: user.education } });
  } catch (err) {
    console.error("POST /education:", err);
    return sendError(res);
  }
});

/**
 * PUT /api/user/education/:id
 * Body: partial/full education object (validated)
 * Merges with existing subdocument 
 */
router.put("/education/:id",authenticateToken,  async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return sendError(res, 400, "Invalid education id");

    const { error, value } = educationSchema.validate(req.body, { abortEarly: false, stripUnknown: true });
    if (error) return sendError(res, 400, formatJoiError(error));

    const user = await User.findById(req.user._id);
    if (!user) return sendError(res, 404, "User not found");

    const idx = user.education.findIndex((e) => e._id && e._id.toString() === id);
    if (idx === -1) return sendError(res, 404, "Education entry not found");

    const existing = user.education[idx].toObject ? user.education[idx].toObject() : user.education[idx];
    user.education[idx] = deepMergeObjects(existing, value);

    user.markModified("education");
    // Save progress (auto-validates onboarding + saves)
    await updateUserProgress(user);

    return res.json({ success: true, message: "Education updated", data: { educationEntry: user.education[idx], profileCompletedPercent: user.profileCompletedPercent } });
  } catch (err) {
    console.error("PUT /education/:id:", err);
    return sendError(res);
  }
});

/**
 * DELETE /api/user/education/:id
 * Deletes a single education entry by its _id.
 */
router.delete("/education/:id",authenticateToken,  async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return sendError(res, 400, "Invalid education id");

    const user = await User.findById(req.user._id);
    if (!user) return sendError(res, 404, "User not found");

    const before = user.education.length;
    user.education = user.education.filter((e) => !(e._id && e._id.toString() === id));
    if (user.education.length === before) return sendError(res, 404, "Education entry not found");

    // Save progress (auto-validates onboarding + saves)
    await updateUserProgress(user);

    return res.json({ success: true, message: "Education removed", data: { education: user.education, profileCompletedPercent: user.profileCompletedPercent } });
  } catch (err) {
    console.error("DELETE /education/:id:", err);
    return sendError(res);
  }
});

/* =========================
   EXPERIENCE (Similar to Education)
   ========================= */

/**
 * POST /api/user/experience
 * Adds single experience
 */
router.post("/experience",authenticateToken,  async (req, res) => {
  try {
    const { error, value } = experienceSchema.validate(req.body, { abortEarly: false, stripUnknown: true });
    if (error) return sendError(res, 400, formatJoiError(error));

    const user = await User.findById(req.user._id);
    user.professionalExperience.push(value);
    // Save progress (auto-validates onboarding + saves)
    await updateUserProgress(user);

    return res.status(201).json({ success: true, message: "Experience added", data: { professionalExperience: user.professionalExperience } });
  } catch (err) {
    console.error("POST /experience:", err);
    return sendError(res);
  }
});

/**
 * PUT /api/user/experience/:id
 * Update one experience entry
 */
router.put("/experience/:id",authenticateToken,  async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return sendError(res, 400, "Invalid experience id");

    const { error, value } = experienceSchema.validate(req.body, { abortEarly: false, stripUnknown: true });
    if (error) return sendError(res, 400, formatJoiError(error));

    const user = await User.findById(req.user._id);
    const idx = user.professionalExperience.findIndex((e) => e._id && e._id.toString() === id);
    if (idx === -1) return sendError(res, 404, "Experience entry not found");

    const existing = user.professionalExperience[idx].toObject ? user.professionalExperience[idx].toObject() : user.professionalExperience[idx];
    user.professionalExperience[idx] = deepMergeObjects(existing, value);

    user.markModified("professionalExperience");
    // Save progress (auto-validates onboarding + saves)
    await updateUserProgress(user);

    return res.json({ success: true, message: "Experience updated", data: { experienceEntry: user.professionalExperience[idx], profileCompletedPercent: user.profileCompletedPercent } });
  } catch (err) {
    console.error("PUT /experience/:id:", err);
    return sendError(res);
  }
});

/**
 * DELETE /api/user/experience/:id
 */
router.delete("/experience/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return sendError(res, 400, "Invalid experience id");

    const user = await User.findById(req.user._id);
    const before = user.professionalExperience.length;
    user.professionalExperience = user.professionalExperience.filter((e) => !(e._id && e._id.toString() === id));
    if (user.professionalExperience.length === before) return sendError(res, 404, "Experience entry not found");

    // Save progress (auto-validates onboarding + saves)
    await updateUserProgress(user);

    return res.json({ success: true, message: "Experience removed", data: { professionalExperience: user.professionalExperience, profileCompletedPercent: user.profileCompletedPercent } });
  } catch (err) {
    console.error("DELETE /experience/:id:", err);
    return sendError(res);
  }
});

/* =========================
   EXTRACURRICULARS
   - POST /extracurriculars
   - PUT /extracurriculars/:id
   - DELETE /extracurriculars/:id
   ========================= */

router.post("/extracurriculars", authenticateToken,  async (req, res) => {
  try {
    const { error, value } = extracurricularSchema.validate(req.body, { abortEarly: false, stripUnknown: true });
    if (error) return sendError(res, 400, formatJoiError(error));

    const user = await User.findById(req.user._id);
    user.extracurriculars.push(value);
    // Save progress (auto-validates onboarding + saves)
    await updateUserProgress(user);

    return res.status(201).json({ success: true, message: "Extracurricular added", data: { extracurriculars: user.extracurriculars } });
  } catch (err) {
    console.error("POST /extracurriculars:", err);
    return sendError(res);
  }
});

router.put("/extracurriculars/:id", authenticateToken,  async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return sendError(res, 400, "Invalid id");

    const { error, value } = extracurricularSchema.validate(req.body, { abortEarly: false, stripUnknown: true });
    if (error) return sendError(res, 400, formatJoiError(error));

    const user = await User.findById(req.user._id);
    const idx = user.extracurriculars.findIndex((e) => e._id && e._id.toString() === id);
    if (idx === -1) return sendError(res, 404, "Extracurricular not found");

    const existing = user.extracurriculars[idx].toObject ? user.extracurriculars[idx].toObject() : user.extracurriculars[idx];
    user.extracurriculars[idx] = deepMergeObjects(existing, value);

    user.markModified("extracurriculars");
    // Save progress (auto-validates onboarding + saves)
    await updateUserProgress(user);

    return res.json({ success: true, message: "Extracurricular updated", data: { extracurricular: user.extracurriculars[idx], profileCompletedPercent: user.profileCompletedPercent } });
  } catch (err) {
    console.error("PUT /extracurriculars/:id:", err);
    return sendError(res);
  }
});

router.delete("/extracurriculars/:id", authenticateToken,  async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return sendError(res, 400, "Invalid id");

    const user = await User.findById(req.user._id);
    const before = user.extracurriculars.length;
    user.extracurriculars = user.extracurriculars.filter((e) => !(e._id && e._id.toString() === id));
    if (user.extracurriculars.length === before) return sendError(res, 404, "Extracurricular not found");

    // Save progress (auto-validates onboarding + saves)
    await updateUserProgress(user);

    return res.json({ success: true, message: "Extracurricular removed", data: { extracurriculars: user.extracurriculars, profileCompletedPercent: user.profileCompletedPercent } });
  } catch (err) {
    console.error("DELETE /extracurriculars/:id:", err);
    return sendError(res);
  }
});

/* =========================
   TEST HISTORY
   - POST /test-history
   - PUT /test-history/:id
   - DELETE /test-history/:id
   ========================= */

router.post("/test-history", authenticateToken, async (req, res) => {
  try {
    const { error, value } = testHistorySchema.validate(req.body, { abortEarly: false, stripUnknown: true });
    if (error) return sendError(res, 400, formatJoiError(error));

    const user = await User.findById(req.user._id);
    user.testHistory.push(value);
    // Save progress (auto-validates onboarding + saves)
    await updateUserProgress(user);

    return res.status(201).json({ success: true, message: "Test history added", data: { testHistory: user.testHistory } });
  } catch (err) {
    console.error("POST /test-history:", err);
    return sendError(res);
  }
});

router.put("/test-history/:id",authenticateToken,  async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return sendError(res, 400, "Invalid id");

    const { error, value } = testHistorySchema.validate(req.body, { abortEarly: false, stripUnknown: true });
    if (error) return sendError(res, 400, formatJoiError(error));

    const user = await User.findById(req.user._id);
    const idx = user.testHistory.findIndex((e) => e._id && e._id.toString() === id);
    if (idx === -1) return sendError(res, 404, "Test entry not found");

    const existing = user.testHistory[idx].toObject ? user.testHistory[idx].toObject() : user.testHistory[idx];
    user.testHistory[idx] = deepMergeObjects(existing, value);

    user.markModified("testHistory");
    // Save progress (auto-validates onboarding + saves)
    await updateUserProgress(user);

    return res.json({ success: true, message: "Test entry updated", data: { testEntry: user.testHistory[idx], profileCompletedPercent: user.profileCompletedPercent } });
  } catch (err) {
    console.error("PUT /test-history/:id:", err);
    return sendError(res);
  }
});

router.delete("/test-history/:id",authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return sendError(res, 400, "Invalid id");

    const user = await User.findById(req.user._id);
    const before = user.testHistory.length;
    user.testHistory = user.testHistory.filter((e) => !(e._id && e._id.toString() === id));
    if (user.testHistory.length === before) return sendError(res, 404, "Test entry not found");

    // Save progress (auto-validates onboarding + saves)
    await updateUserProgress(user);

    return res.json({ success: true, message: "Test history removed", data: { testHistory: user.testHistory, profileCompletedPercent: user.profileCompletedPercent } });
  } catch (err) {
    console.error("DELETE /test-history/:id:", err);
    return sendError(res);
  }
});

/* =========================
   PREFERENCES (single object)
   - PUT /preferences
   ========================= */
router.put("/preferences",authenticateToken,  async (req, res) => {
  try {
    const { error, value } = preferencesSchema.validate(req.body, { abortEarly: false, stripUnknown: true });
    if (error) return sendError(res, 400, formatJoiError(error));

    const user = await User.findById(req.user._id);
    user.preferences = deepMergeObjects(user.preferences || {}, value);
    // Save progress (auto-validates onboarding + saves)
    await updateUserProgress(user);

    // Create notification
    await createNotification(
      req.user._id,
      "success",
      "Preferences updated successfully",
      "profile_update"
    );

    return res.json({ success: true, message: "Preferences updated", data: { preferences: user.preferences, profileCompletedPercent: user.profileCompletedPercent } });
  } catch (err) {
    console.error("PUT /preferences:", err);
    return sendError(res);
  }
});

/* =========================
   FINANCIAL (single object)
   - PUT /financial
   ========================= */
router.put("/financial",authenticateToken,  async (req, res) => {
  try {
    const { error, value } = financialSchema.validate(req.body, { abortEarly: false, stripUnknown: true });
    if (error) return sendError(res, 400, formatJoiError(error));

    const user = await User.findById(req.user._id);
    user.financial = deepMergeObjects(user.financial || {}, value);
    // Save progress (auto-validates onboarding + saves)
    await updateUserProgress(user);

    return res.json({ success: true, message: "Financial info updated", data: { financial: user.financial, profileCompletedPercent: user.profileCompletedPercent } });
  } catch (err) {
    console.error("PUT /financial:", err);
    return sendError(res);
  }
});

/* =========================
   DOCUMENTS
   - PUT /documents           -> replace documents array (JSON)
   - POST /documents/upload   -> upload one file via multer (field: document)
   - DELETE /documents/:id
   ========================= */

/**
 * PUT /api/user/documents
 * Body: { documents: [ { type, url, verified } ] }
 */
router.put("/documents/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return sendError(res, 400, "Invalid document id");

    const { error, value } = documentSchema.validate(req.body, { abortEarly: false, stripUnknown: true });
    if (error) return sendError(res, 400, formatJoiError(error));

    const user = await User.findById("68ed637be307cafef7748a60"); // Replace with req.user._id
    if (!user) return sendError(res, 404, "User not found");

    const docIndex = user.documents.findIndex((d) => d._id.toString() === id);
    if (docIndex === -1) return sendError(res, 404, "Document not found");

    // merge new data with old document
    user.documents[docIndex] = {
      ...user.documents[docIndex].toObject(),
      ...value
    };

    user.markModified("documents");
    await updateUserProgress(user);

    return res.json({
      success: true,
      message: "Document updated successfully",
      data: {
        document: user.documents[docIndex],
        profileCompletedPercent: user.profileCompletedPercent
      }
    });
  } catch (err) {
    console.error("PUT /documents/:id:", err);
    return sendError(res, 500, "Failed to update document");
  }
});

/**
 * POST /api/user/documents/upload
 * Upload single document using multer (field: document)
 * req.file.path / req.file.secure_url expected
 */
router.post("/documents/upload",authenticateToken,  uploadDocuments.single("document"), async (req, res) => {
  try {
    if (!req.file || !req.file.path) return sendError(res, 400, "No file uploaded");

    const user = await User.findById(req.user._id);
    user.documents.push({
      type: req.body.type || "other",
      url: req.file.path || req.file.secure_url || null,
      publicId: req.file.filename || req.file.public_id || null,
      verified: false
    });

    // Save progress (auto-validates onboarding + saves)
    await updateUserProgress(user);

    const last = user.documents[user.documents.length - 1];
    return res.status(201).json({ success: true, message: "Document uploaded", data: { document: last, profileCompletedPercent: user.profileCompletedPercent } });
  } catch (err) {
    console.error("POST /documents/upload:", err);
    return sendError(res);
  }
});

/**
 * DELETE /api/user/documents/:id
 */
router.delete("/documents/:id",authenticateToken,  async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return sendError(res, 400, "Invalid document id");

    const user = await User.findById(req.user._id);
    const doc = user.documents.find((d) => d._id && d._id.toString() === id);
    if (!doc) return sendError(res, 404, "Document not found");

    // delete from cloudinary 
    if (doc.publicId && cloudinary && cloudinary.uploader) {
      try { await cloudinary.uploader.destroy(doc.publicId); } catch (e) { console.warn("cloudinary destroy failed", e); }
    }

    user.documents = user.documents.filter((d) => !(d._id && d._id.toString() === id));
    // Save progress (auto-validates onboarding + saves)
    await updateUserProgress(user);

    return res.json({ success: true, message: "Document removed", data: { documents: user.documents, profileCompletedPercent: user.profileCompletedPercent } });
  } catch (err) {
    console.error("DELETE /documents/:id:", err);
    return sendError(res);
  }
});



/* ---------------------------------------
   Route: PATCH /onboarding
   --------------------------------------- */
   
router.patch("/onboarding",authenticateToken,  async (req, res) => {
  try {
    // Step 1 - Validate incoming data
    const { error, value } = onboardingSchema.validate(req.body, { abortEarly: false, stripUnknown: true });
    if (error) return sendError(res, 400, formatJoiError(error));

    // Step 2 - Find the user
    const user = await User.findById(req.user._id);
    if (!user) return sendError(res, 404, "User not found");

    // Step 3 - Merge new onboarding data
    user.onboarding = deepMergeObjects(user.onboarding || {}, value);

    
    await updateUserProgress(user);


   

    // Step 7 - Send response with alert message
    let alertMessage = "Onboarding updated successfully.";
    if (user.onboarding.isCompleted) {
      alertMessage = "🎉 Onboarding completed! Your profile setup is now 100%.";
    } else if (user.onboarding?.currentStep < 7) {
  alertMessage = `You’ve completed ${user.onboarding.completedSteps?.length || 0} of 7 steps. Continue from step ${user.onboarding.currentStep}.`;
}

    return res.json({
      success: true,
      message: alertMessage,
      data: {
        onboarding: user.onboarding,
        profileCompletedPercent: user.profileCompletedPercent
      }
    });

  } catch (err) {
    console.error("PATCH /onboarding:", err);
    return sendError(res, 500, "Failed to update onboarding progress");
  }
});


/* =========================
   PRIVACY SETTINGS
   - PUT /privacy
   ========================= */
router.put("/privacy",authenticateToken,  async (req, res) => {
  try {
    const { error, value } = privacySchema.validate(req.body, { abortEarly: false, stripUnknown: true });
    if (error) return sendError(res, 400, formatJoiError(error));

    const user = await User.findById(req.user._id);
    user.privacySettings = deepMergeObjects(user.privacySettings || {}, value);
    await user.save();

    return res.json({ success: true, message: "Privacy settings updated", data: { privacySettings: user.privacySettings } });
  } catch (err) {
    console.error("PUT /privacy:", err);
    return sendError(res);
  }
});

/* =========================
   USER DISCOVERY & SEARCH
   - GET /search
   Public (or authenticated)
   Query params:
     ?q=keyword
     &page=1
     &limit=10
     &program=CS
     &city=Delhi
     &minCompletion=50
   ========================= */
router.get("/search",  async (req, res) => {
  try {
    // Step 1 — Extract and sanitize query params
    const {
      q = "",
      page = 1,
      limit = 10,
      program,
      city,
      minCompletion = 0,
    } = req.query;

    const pageNum = Math.max(parseInt(page), 1);
    const pageSize = Math.min(parseInt(limit), 50); // hard limit for performance

    // Step 2 — Build MongoDB query
    const query = {
      "privacySettings.discoverable": { $ne: false }, // only discoverable users
      profileCompletedPercent: { $gte: parseInt(minCompletion) || 0 },
    };

    // If text query exists
    if (q && q.trim() !== "") {
      query.$text = { $search: q.trim() };
    }

    // Apply city filter
    if (city) {
      query["profile.location.city"] = new RegExp(city.trim(), "i");
    }

    // Apply program filter (if user added in preferences)
    if (program) {
      query["preferences.programInterests"] = { $in: [new RegExp(program, "i")] };
    }

    // Step 3️⃣ — Select only safe public fields
    const projection = {
      _id: 1,
      "profile.fullName": 1,
      "profile.location": 1,
      "profile.gender": 1,
      "profile.dob": 1,
      "profilePicture": 1,
      "education": 1,
      "professionalExperience": 1,
      "profileCompletedPercent": 1,
      "privacySettings": 1,
    };

    // Step 4 — Query database with pagination
    const skip = (pageNum - 1) * pageSize;
    const users = await User.find(query, projection)
      .sort({ profileCompletedPercent: -1, "profile.fullName": 1 })
      .skip(skip)
      .limit(pageSize)
      .lean();

    // Step 5 — Filter out sensitive sections according to privacy settings
    const safeResults = users.map((u) => {
      const publicUser = {
        _id: u._id,
        fullName: u.profile?.fullName || null,
        profilePicture: u.profilePicture || null,
        location: u.profile?.location || null,
        profileCompletedPercent: u.profileCompletedPercent || 0,
      };

      // Respect privacy preferences
      if (u.privacySettings?.showEducation !== false) {
        publicUser.education = u.education || [];
      }
      if (u.privacySettings?.showExperience !== false) {
        publicUser.professionalExperience = u.professionalExperience || [];
      }

      return publicUser;
    });

    // Step 6 — Count total results (for pagination metadata)
    const totalResults = await User.countDocuments(query);
    const totalPages = Math.ceil(totalResults / pageSize);

    // Step 7 — Return response
    return res.json({
      success: true,
      data: safeResults,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalResults,
        pageSize,
      },
    });
  } catch (err) {
    console.error("GET /search:", err);
    return sendError(res, 500, "Failed to fetch search results");
  }
});


module.exports = router;
