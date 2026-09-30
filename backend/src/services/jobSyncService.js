const Job = require("../../models/Job");
const Company = require("../../models/Company");
const { getProvider } = require("../ats");

/**
 * Service to sync jobs from ATS endpoints and update database state.
 */
class JobSyncService {
  /**
   * Syncs active job listings from the ATS for a set of companies.
   * Marks jobs no longer listed on the ATS as inactive.
   * 
   * @param {Object} options - Sync execution parameters.
   * @param {string} options.ats - The ATS identifier (e.g. 'greenhouse').
   * @param {number} [options.limit] - Limit on the number of companies to sync (development helper).
   * @returns {Promise<Object>} Execution summary log.
   */
  async syncATS(options) {
    const { ats, limit } = options || {};
    if (!ats) {
      throw new Error("ATS type is required for sync.");
    }
    if (ats.toLowerCase().trim() === "all") {
      const registeredAtsNames = ["greenhouse", "lever", "ashby"];
      const totalSummary = {
        companiesProcessed: 0,
        jobsUpserted: 0,
        jobsDeactivated: 0,
        errors: []
      };

      for (const atsName of registeredAtsNames) {
        try {
          const res = await this.syncATS({ ats: atsName, limit });
          totalSummary.companiesProcessed += res.companiesProcessed;
          totalSummary.jobsUpserted += res.jobsUpserted;
          totalSummary.jobsDeactivated += res.jobsDeactivated;
          totalSummary.errors.push(...res.errors);
        } catch (err) {
          totalSummary.errors.push({
            company: `System (${atsName.toUpperCase()})`,
            error: err.message
          });
        }
      }
      return totalSummary;
    }

    // Load active companies for this ATS
    const query = { ats: ats.toLowerCase(), status: "active" };
    let companies = await Company.find(query);

    if (limit && limit > 0) {
      companies = companies.slice(0, limit);
    }

    const summary = {
      companiesProcessed: 0,
      jobsUpserted: 0,
      jobsDeactivated: 0,
      errors: []
    };

    const provider = getProvider(ats);

    for (const company of companies) {
      try {
        // Fetch active jobs from the ATS provider
        const freshJobs = await provider.fetchJobs(company);
        
        const freshGlobalIds = new Set();
        
        if (freshJobs.length > 0) {
          // Prepare bulk write operations to save/update active jobs
          const bulkOps = freshJobs.map(job => {
            freshGlobalIds.add(job.global_id);
            return {
              updateOne: {
                filter: { global_id: job.global_id },
                update: {
                  $set: {
                    ...job,
                    company: company._id, // Ensure reference is saved
                    status: "active"
                  }
                },
                upsert: true
              }
            };
          });

          const result = await Job.bulkWrite(bulkOps);
          summary.jobsUpserted += (result.upsertedCount + result.modifiedCount);
        }

        // Deactivate old jobs: find all currently active jobs in database for this company
        // that were NOT in the fresh scrapings list, and set their status to "inactive".
        const deactivateResult = await Job.updateMany(
          {
            company: company._id,
            status: "active",
            global_id: { $nin: Array.from(freshGlobalIds) }
          },
          {
            $set: { status: "inactive" }
          }
        );

        summary.jobsDeactivated += deactivateResult.modifiedCount;

        // Update company sync metadata
        const activeJobsCount = await Job.countDocuments({ company: company._id, status: "active" });
        await Company.updateOne(
          { _id: company._id },
          {
            $set: {
              totalJobs: activeJobsCount,
              lastSynced: new Date()
            }
          }
        );

        summary.companiesProcessed++;
      } catch (err) {
        summary.errors.push({
          company: company.name,
          slug: company.slug,
          error: err.message
        });
      }
    }

    return summary;
  }

  /**
   * Performs a paginated search/listing query on jobs.
   */
  async getJobs(filterOptions) {
    const { page = 1, limit = 10, remote, ats, location, companyId } = filterOptions;
    const query = { status: "active" };

    if (remote !== undefined) {
      query.remote = remote === "true" || remote === true;
    }
    if (ats) {
      query.ats = ats.toLowerCase();
    }
    if (location) {
      query.location = { $regex: location, $options: "i" };
    }
    if (companyId) {
      query.company = companyId;
    }

    const skip = (page - 1) * limit;
    const jobs = await Job.find(query)
      .populate("company", "name slug careerUrl logo")
      .sort({ postedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Job.countDocuments(query);

    return {
      jobs,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit)
    };
  }

  /**
   * Search jobs using keyword matches on title, description, company name.
   */
  async searchJobs(searchParams) {
    const { q, company, location, remote, ats, employmentType } = searchParams;
    const query = { status: "active" };

    if (q) {
      // Direct text search or title regex
      query.$or = [
        { title: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } }
      ];
    }
    if (company) {
      // Find matching companies first
      const companies = await Company.find({ name: { $regex: company, $options: "i" } });
      const companyIds = companies.map(c => c._id);
      query.company = { $in: companyIds };
    }
    if (location) {
      query.location = { $regex: location, $options: "i" };
    }
    if (remote !== undefined) {
      query.remote = remote === "true" || remote === true;
    }
    if (ats) {
      query.ats = ats.toLowerCase().trim();
    }
    if (employmentType) {
      query.employmentType = { $regex: employmentType, $options: "i" };
    }

    const jobs = await Job.find(query)
      .populate("company", "name slug careerUrl logo")
      .sort({ postedAt: -1, createdAt: -1 });

    return jobs;
  }

  /**
   * Retrieves single job details populated with company information.
   */
  async getJobById(id) {
    return Job.findOne({ _id: id, status: "active" }).populate("company");
  }

  /**
   * Retrieves jobs for a specific company slug.
   */
  async getJobsByCompanySlug(companySlug) {
    const company = await Company.findOne({ slug: companySlug, status: "active" });
    if (!company) return [];
    return Job.find({ company: company._id, status: "active" }).sort({ postedAt: -1 });
  }
}

module.exports = new JobSyncService();
