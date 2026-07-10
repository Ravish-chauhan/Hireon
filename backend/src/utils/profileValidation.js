const Joi = require("joi");

// =============================
// 1 Profile Info
// =============================
const profileSchema = Joi.object({
  fullName: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .regex(/^[a-zA-Z\s]+$/)
    .message("Full name must only contain letters and spaces")
    .required(),
  phone: Joi.string()
    .trim()
    .pattern(/^[0-9]{10}$/)
    .message("Phone number must be a valid 10-digit number")
    .optional(),
  dob: Joi.date()
    .iso()
    .max("now")
    .message("Date of birth must be in the past")
    .optional(),
  gender: Joi.string().valid("male", "female", "other").optional(),
  location: Joi.object({
    city: Joi.string().max(50).optional(),
    state: Joi.string().max(50).optional(),
    country: Joi.string().max(50).optional(),
  }).optional(),
});

// =============================
// 2 Education
// =============================
const educationSchema = Joi.object({
  institution: Joi.string().trim().max(100).required(),
  degree: Joi.string().trim().max(100).required(),
  fieldOfStudy: Joi.string().trim().max(100).optional(),
  startYear: Joi.number().integer().min(1950).max(new Date().getFullYear() + 1).optional(),
  endYear: Joi.number().integer().min(1950).max(new Date().getFullYear() + 1).optional(),
  grade: Joi.string().trim().max(20).optional(),
});

const educationArraySchema = Joi.array().items(educationSchema);

// =============================
// 3 Professional Experience
// =============================
const experienceSchema = Joi.object({
  position: Joi.string().trim().max(100).required(),
  company: Joi.string().trim().max(100).required(),
  location: Joi.string().trim().max(100).optional(),
  startDate: Joi.date().iso().optional(),
  endDate: Joi.date().iso().optional(),
  description: Joi.string().trim().max(500).optional(),
});

const experienceArraySchema = Joi.array().items(experienceSchema);

// =============================
// 4 Extracurricular Activities
// =============================
const extracurricularSchema = Joi.object({
  title: Joi.string().trim().max(100).required(),
  organization: Joi.string().trim().max(100).optional(),
  role: Joi.string().trim().max(100).optional(),
  startDate: Joi.date().iso().optional(),
  endDate: Joi.date().iso().optional(),
  description: Joi.string().trim().max(500).optional(),
});

const extracurricularArraySchema = Joi.array().items(extracurricularSchema);

// =============================
// 5 Test History
// =============================
const testHistorySchema = Joi.object({
  testName: Joi.string().trim().max(50).required(),
  testDate: Joi.date().iso().optional(),
  score: Joi.number().optional(),
  maxScore: Joi.number().optional(),
  percentile: Joi.number().min(0).max(100).optional(),
});

const testHistoryArraySchema = Joi.array().items(testHistorySchema);

// =============================
// 6 Preferences
// =============================
const preferencesSchema = Joi.object({
  programInterests: Joi.array().items(Joi.string().trim().max(100)).optional(),
  preferredLocations: Joi.array().items(Joi.string().trim().max(50)).optional(),
  budgetRange: Joi.string().trim().max(50).optional(),
  careerGoals: Joi.string().trim().max(1000).optional(),
  specializations: Joi.array().items(Joi.string().trim().max(100)).optional(),
});

// =============================
// 7 Financial Info
// =============================
const financialSchema = Joi.object({
  familyIncome: Joi.number().min(0).optional(),
  scholarshipApplied: Joi.boolean().optional(),
});

// =============================
// 8 Privacy Settings
// =============================
const privacySchema = Joi.object({
  showEmail: Joi.boolean().optional(),
  showPhone: Joi.boolean().optional(),
  showEducation: Joi.boolean().optional(),
  showExperience: Joi.boolean().optional(),
  discoverable: Joi.boolean().optional(),
}).min(1);

// =============================
// 9 Documents
// =============================
const documentSchema = Joi.object({
  type: Joi.string()
    .valid("transcript", "id_proof", "recommendation", "certificate", "other")
    .required(),
  url: Joi.string().uri().required(),
  verified: Joi.boolean().optional(),
});

const documentsArraySchema = Joi.array().items(documentSchema);

// =============================
// 10 Onboarding
// =============================
const onboardingSchema = Joi.object({
  currentStep: Joi.number().min(1).max(10).optional(),
  completedSteps: Joi.array().items(Joi.number().min(1).max(10)).optional(),
  lastSavedAt: Joi.date().optional(),
  isCompleted: Joi.boolean().optional(),
});

// =============================
// Helper for cleaner errors
// =============================
const formatJoiError = (error) => {
  if (!error || !error.details) return "Invalid input";
  return error.details.map((d) => d.message.replace(/["]/g, "")).join(", ");
};

// =============================
// Exporting 
// =============================
module.exports = {
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
  formatJoiError,
};
