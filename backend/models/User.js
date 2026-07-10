const mongoose = require("mongoose");
const { Schema } = mongoose;

const EducationSchema = new Schema({
  level: { type: String, enum: ["10th", "12th", "undergrad", "postgrad"], required: true },
  institution: { type: String, trim: true },
  boardOrUniversity: String,
  yearOfCompletion: Number,
  percentageOrCGPA: String,
  achievements: [String]
});

// Pre-save hook to clean invalid education records
EducationSchema.pre('validate', function() {
  if (!this.level) {
    throw new Error('Education level is required');
  }
});

const ProfessionalExpSchema = new Schema({
  title: String,
  company: String,
  startDate: Date,
  endDate: Date,
  isCurrent: { type: Boolean, default: false },
  description: String
});

const ExtracurricularSchema = new Schema({
  type: String,
  title: String,
  description: String,
  year: Number
});

const TestHistorySchema = new Schema({
  exam: String,
  attemptDate: Date,
  score: String
});

const PreferenceSchema = new Schema({
  preferredLocations: [String],
  budgetMin: Number,
  budgetMax: Number,
  programInterests: [String]
});

const DocumentSchema = new Schema({
  type: String,
  url: String,
  publicId: String,
  verified: { type: Boolean, default: false }
});

const OnboardingSchema = new Schema({
  currentStep: { type: Number, default: 1 },
  completedSteps: [Number],
  lastSavedAt: Date,
  isCompleted: { type: Boolean, default: false }
}, { _id: false });

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true, lowercase: true, index: true },
  password: { type: String, required: function() { return !this.socialLogin.isEnabled; } },
  role: { type: String, enum: ["student", "mentor", "admin"], default: "student" },
  
  // Authentication fields
  isEmailVerified: { type: Boolean, default: false },
  isPhoneVerified: { type: Boolean, default: false },
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  phoneOTP: String,
  phoneOTPExpires: Date,
  phoneOTPAttempts: { type: Number, default: 0 },
  
  // Social login
  socialLogin: {
    isEnabled: { type: Boolean, default: false },
    google: {
      id: String,
      email: String
    },
    facebook: {
      id: String,
      email: String
    }
  },
  
  // Security
  refreshTokens: [{
    token: String,
    createdAt: { type: Date, default: Date.now },
    expiresAt: Date,
    rememberMe: { type: Boolean, default: false }
  }],
  lastLogin: Date,
  loginAttempts: { type: Number, default: 0 },
  lockUntil: Date,
  
  // Password reset
  passwordResetToken: String,
  passwordResetExpires: Date,
  
  // Login logs
  loginLogs: [{
    timestamp: { type: Date, default: Date.now },
    ipAddress: String,
    userAgent: String,
    success: Boolean,
    failureReason: String
  }],

  profile: {
    fullName: { type: String, required: true, trim: true },
    phone: { type: String, match: /^[0-9]{10}$/ },
    dob: Date,
    gender: { type: String, enum: ["male", "female", "other"] },
    location: {
      city: String,
      state: String,
      country: String
    }
  },

  onboarding: OnboardingSchema,
  education: [EducationSchema],
  professionalExperience: [ProfessionalExpSchema],
  extracurriculars: [ExtracurricularSchema],
  testHistory: [TestHistorySchema],
  preferences: PreferenceSchema,
  documents: [DocumentSchema],

  financial: {
    familyIncome: Number,
    scholarshipApplied: { type: Boolean, default: false }
  },

  profilePicture: {
  url: String,
  publicId: String
  },

  privacySettings: {
  showEmail: { type: Boolean, default: false },
  showPhone: { type: Boolean, default: false },
  showEducation: { type: Boolean, default: true },
  showExperience: { type: Boolean, default: true },
  discoverable: { type: Boolean, default: true }
  },

  profileCompletedPercent: { type: Number, default: 0 }, // or calculate dynamically
  isProfileVerified: { type: Boolean, default: false },

  // Free plan usage tracking
  freeUsage: {
    consultations: { type: Number, default: 0 },
    assessments: { type: Number, default: 0 },
    resetDate: { type: Date, default: Date.now }
  },

  schemaVersion: { type: Number, default: 1 }
}, { timestamps: true });

// Account lockout methods
UserSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

UserSchema.methods.incLoginAttempts = function() {
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $unset: { lockUntil: 1 },
      $set: { loginAttempts: 1 }
    });
  }
  const updates = { $inc: { loginAttempts: 1 } };
  if (this.loginAttempts + 1 >= 5 && !this.isLocked) {
    updates.$set = { lockUntil: Date.now() + 15 * 60 * 1000 }; // 15 minutes
  }
  return this.updateOne(updates);
};

UserSchema.methods.resetLoginAttempts = function() {
  return this.updateOne({
    $unset: { loginAttempts: 1, lockUntil: 1 }
  });
};

// Pre-save hook to clean invalid data
UserSchema.pre('save', function(next) {
  // Remove invalid education records
  this.education = this.education.filter(edu => edu.level);
  next();
});

// Useful indexes
UserSchema.index({ "preferences.programInterests": 1 });
UserSchema.index({ "preferences.preferredLocations": 1 });
UserSchema.index({ "education.level": 1 });
UserSchema.index({ passwordResetToken: 1 });
UserSchema.index({ lockUntil: 1 });
UserSchema.index({
  "profile.fullName": "text",
  "education.institution": "text",
  "professionalExperience.company": "text"
});


module.exports = mongoose.model("User", UserSchema);
