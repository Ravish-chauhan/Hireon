const axios = require("axios");
const ATSProvider = require("../ATSProvider");
const parseJob = require("./parser");

/**
 * Ashby ATS provider connector.
 */
class AshbyProvider extends ATSProvider {
  /**
   * Fetches active job listings for a company from Ashby.
   */
  async fetchJobs(company) {
    const slug = company.slug;
    const url = `https://api.ashbyhq.com/posting-api/job-board/${slug}?includeCompensation=true`;

    try {
      const response = await axios.get(url, {
        timeout: 30000,
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }
      });

      if (response.status !== 200) {
        throw new Error(`Ashby API returned status ${response.status}`);
      }

      const jobs = response.data.jobs || [];
      return jobs.map(item => parseJob(item, slug));
    } catch (error) {
      if (error.response && error.response.status === 404) {
        throw new Error(`Ashby board not found for company slug: ${slug}`);
      }
      throw new Error(`Ashby scraper error: ${error.message}`);
    }
  }
}

module.exports = AshbyProvider;
