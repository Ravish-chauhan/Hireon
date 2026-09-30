const mongoose = require("mongoose");
const { Schema } = mongoose;

const JobSchema = new Schema(
  {
    global_id: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    company: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true
    },
    title: {
      type: String,
      required: true,
      index: true,
      trim: true
    },
    description: {
      type: String
    },
    descriptionHtml: {
      type: String
    },
    location: {
      type: String,
      index: true,
      trim: true
    },
    country: {
      type: String,
      trim: true
    },
    salaryMin: {
      type: Number
    },
    salaryMax: {
      type: Number
    },
    salaryCurrency: {
      type: String,
      trim: true
    },
    salaryPeriod: {
      type: String,
      trim: true
    },
    employmentType: {
      type: String,
      trim: true
    },
    department: {
      type: String,
      trim: true
    },
    experience: {
      type: String,
      trim: true
    },
    remote: {
      type: Boolean,
      default: false,
      index: true
    },
    applyUrl: {
      type: String,
      trim: true
    },
    ats: {
      type: String,
      required: true,
      index: true
    },
    atsId: {
      type: String,
      required: true
    },
    postedAt: {
      type: Date
    },
    fetchedAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
      index: true
    },
    raw: {
      type: Schema.Types.Mixed
    }
  },
  {
    timestamps: true
  }
);

// Compound index for text searching if needed
JobSchema.index({ title: "text", description: "text" });

module.exports = mongoose.model("Job", JobSchema);
