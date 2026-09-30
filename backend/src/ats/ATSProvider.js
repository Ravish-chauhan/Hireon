/**
 * Abstract base class for Applicant Tracking System (ATS) providers.
 * All ATS connectors must extend this class and implement the abstract methods.
 */
class ATSProvider {
  /**
   * Fetches active job listings for a specific company from the ATS.
   * @param {Object} company - The Company mongoose document.
   * @returns {Promise<Array<Object>>} A promise that resolves to an array of normalized job payload objects.
   * @abstract
   */
  async fetchJobs(company) {
    throw new Error("Method 'fetchJobs()' must be implemented.");
  }
}

module.exports = ATSProvider;
