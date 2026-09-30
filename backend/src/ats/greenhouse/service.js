const axios = require("axios");
const ATSProvider = require("../ATSProvider");
const parseJob = require("./parser");

/**
 * Greenhouse ATS provider implementation.
 * Connects directly to the Greenhouse board API to scrape job openings.
 */
class GreenhouseProvider extends ATSProvider {
  /**
   * Fetches active jobs for a company.
   * @param {Object} company - The Company database model instance.
   * @returns {Promise<Array<Object>>} List of normalized job payloads.
   */
  async fetchJobs(company) {
    const slug = company.slug;
    const url = `https://boards-api.greenhouse.io/v1/boards/${slug}/jobs?content=true`;

    try {
      const response = await axios.get(url, {
        timeout: 30000,
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }
      });

      if (response.status !== 200) {
        throw new Error(`Greenhouse API returned status ${response.status}`);
      }

      const jobs = response.data.jobs || [];
      return jobs.map(item => parseJob(item, slug));
    } catch (error) {
      if (error.response && error.response.status === 404) {
        throw new Error(`Greenhouse board not found for company slug: ${slug}`);
      }
      throw new Error(`Greenhouse scraper error: ${error.message}`);
    }
  }
}

module.exports = GreenhouseProvider;
