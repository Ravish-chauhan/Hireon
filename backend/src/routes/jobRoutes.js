const express = require("express");
const router = express.Router();
const companyService = require("../services/companyService");
const jobSyncService = require("../services/jobSyncService");

/**
 * POST /api/admin/import-companies
 * Imports company metadata from CSV files.
 */
router.post("/admin/import-companies", async (req, res, next) => {
  try {
    const { ats = "greenhouse", limit = 500 } = req.body;
    
    if (typeof ats !== "string") {
      return res.status(400).json({ error: "Invalid 'ats' parameter." });
    }

    let result;
    if (ats.toLowerCase().trim() === "all") {
      result = await companyService.importAllCompanies(Number(limit));
    } else {
      result = await companyService.importCompaniesFromCSV(ats, Number(limit));
    }

    res.json({ message: "Companies imported successfully", stats: result });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/admin/sync
 * Syncs job openings for a given ATS.
 */
router.post("/admin/sync", async (req, res, next) => {
  try {
    const { ats = "greenhouse", limit } = req.body;

    if (typeof ats !== "string") {
      return res.status(400).json({ error: "Invalid 'ats' parameter." });
    }

    const options = {
      ats: ats.trim(),
      limit: limit ? Number(limit) : undefined
    };

    const result = await jobSyncService.syncATS(options);
    res.json({ message: "Sync execution completed", result });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/jobs
 * Lists active jobs (supports pagination & general filters).
 */
router.get("/jobs", async (req, res, next) => {
  try {
    const { page = 1, limit = 10, remote, ats, location, companyId } = req.query;
    const filterOptions = { page, limit, remote, ats, location, companyId };
    
    const result = await jobSyncService.getJobs(filterOptions);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/search
 * Searches active job postings by query text, company name, location, remote, ATS, etc.
 */
router.get("/search", async (req, res, next) => {
  try {
    const { q, company, location, remote, ats, employmentType } = req.query;
    const searchParams = { q, company, location, remote, ats, employmentType };
    
    const result = await jobSyncService.searchJobs(searchParams);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/jobs/:id
 * Fetches details of a specific job posting.
 */
router.get("/jobs/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const job = await jobSyncService.getJobById(id);
    if (!job) {
      return res.status(404).json({ error: "Job opening not found." });
    }
    res.json(job);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/companies
 * Lists all active synced companies.
 */
router.get("/companies", async (req, res, next) => {
  try {
    const companies = await companyService.getCompanies();
    res.json(companies);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/company/:slug
 * Fetches details for a company and all of its active job postings.
 */
router.get("/company/:slug", async (req, res, next) => {
  try {
    const { slug } = req.params;
    const company = await companyService.getCompanyBySlug(slug);
    if (!company) {
      return res.status(404).json({ error: "Company not found." });
    }
    const jobs = await jobSyncService.getJobsByCompanySlug(slug);
    res.json({ company, jobs });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
