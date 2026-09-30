const axios = require("axios");
const ATSProvider = require("../ATSProvider");
const parseJob = require("./parser");

/**
 * Lever ATS provider connector.
 */
class LeverProvider extends ATSProvider {
  /**
   * Fetches active job listings for a company from Lever.
   */
  async fetchJobs(company) {
    const slug = company.slug;
    const url = `https://api.lever.co/v0/postings/${slug}?mode=json`;

    try {
      const response = await axios.get(url, {
        timeout: 30000,
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }
      });

      if (response.status !== 200) {
        throw new Error(`Lever API returned status ${response.status}`);
      }

      const jobs = response.data || [];
      return jobs.map(item => parseJob(item, slug));
    } catch (error) {
      if (error.response && error.response.status === 404) {
        throw new Error(`Lever board not found for company slug: ${slug}`);
      }
      throw new Error(`Lever scraper error: ${error.message}`);
    }
  }
}

module.exports = LeverProvider;
