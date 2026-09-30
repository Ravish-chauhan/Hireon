const mongoose = require("mongoose");
const { Schema } = mongoose;

const CompanySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    ats: {
      type: String,
      required: true,
      index: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true
    },
    careerUrl: {
      type: String,
      trim: true
    },
    website: {
      type: String,
      trim: true
    },
    industry: {
      type: String,
      trim: true
    },
    country: {
      type: String,
      trim: true
    },
    logo: {
      type: String,
      trim: true
    },
    totalJobs: {
      type: Number,
      default: 0
    },
    lastSynced: {
      type: Date
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
      index: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Company", CompanySchema);
