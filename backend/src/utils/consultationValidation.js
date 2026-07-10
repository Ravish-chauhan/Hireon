// utils/consultationValidation.js
const Joi = require("joi");

// --- Package Validation (optional) --- //
const packageSchema = Joi.object({
  name: Joi.string()
    .valid("Basic", "Premium", "Comprehensive")
    .optional(),
  description: Joi.string().max(300).optional(),
  sessionsIncluded: Joi.number().integer().min(1).optional(),
  price: Joi.number().min(0).optional(),
  currency: Joi.string().default("INR").optional(),
  features: Joi.array().items(Joi.string()).optional(),
});

// --- Active Package Validation (optional) --- //
const activePackageSchema = Joi.object({
  packageName: Joi.string().optional(),
  remainingSessions: Joi.number().integer().min(0).optional(),
  expiresAt: Joi.date().iso().optional(),
});

// --- Main Consultation Booking Validation --- //
const bookConsultationSchema = Joi.object({
  consultantId: Joi.string().optional(), //  optional
  
  type: Joi.string()
  .insensitive() // <-- allows Strategy, STRATEGY, etc.
  .valid("strategy", "application review", "mock interview", "career guidance")
  .required()
  .messages({
    "any.only": "Invalid session type selected",
  }),


  scheduledDate: Joi.string()
  .pattern(/^\d{4}-\d{2}-\d{2}$/)
  .required()
  .messages({
    "string.pattern.base": "scheduledDate must be in YYYY-MM-DD format",
  }),

  scheduledTime: Joi.string()
  .pattern(/^([0-1]\d|2[0-3]):([0-5]\d)$/)
  .required()
  .messages({
    "string.pattern.base": "scheduledTime must be in HH:mm format",
  }),

  durationMinutes: Joi.number().integer().min(15).max(120).default(30).optional(),

  mode: Joi.string().valid("video", "chat", "phone").default("video").optional(),

  notes: Joi.string().max(500).allow("", null).optional(),

  timezone: Joi.string().default("Asia/Kolkata").optional(),

  isFirstFree: Joi.boolean().default(false).optional(),

  package: packageSchema.optional(),
  activePackage: activePackageSchema.optional(),
});

// --- Update Status Validation --- //
const updateStatusSchema = Joi.object({
  status: Joi.string()
    .valid("pending", "confirmed", "completed", "cancelled")
    .required()
    .messages({ "any.only": "Invalid status value" }),
});

// --- List / Query Schema (for GET routes) --- //
const listConsultationsQuerySchema = Joi.object({
  status: Joi.string()
    .valid("pending", "confirmed", "completed", "cancelled")
    .optional(),
  type: Joi.string()
    .valid("strategy", "application review", "mock interview", "career guidance")
    .optional(),
  consultantId: Joi.string().optional(),
  fromDate: Joi.date().iso().optional(),
  toDate: Joi.date().iso().optional(),
  sortBy: Joi.string()
    .valid("scheduledDate", "createdAt", "status")
    .default("scheduledDate")
    .optional(),
  order: Joi.string().valid("asc", "desc").default("asc").optional(),
  page: Joi.number().integer().min(1).default(1).optional(),
  limit: Joi.number().integer().min(1).max(100).default(10).optional(),
});

module.exports = {
  bookConsultationSchema,
  updateStatusSchema,
  listConsultationsQuerySchema,
};
