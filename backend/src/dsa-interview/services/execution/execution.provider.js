// ===================================
// Abstract Execution Provider Interface
// ===================================

/**
 * Base Execution Provider Interface.
 * All execution providers (Judge0, Docker sandbox, remote cluster) must implement these methods.
 */
class ExecutionProvider {
  /**
   * Submit and execute a single code snippet with input and limits.
   *
   * @param {Object} params
   * @param {string} params.sourceCode - Complete executable source code
   * @param {string} params.language - Standard language identifier (javascript, python, java, cpp)
   * @param {string} params.stdin - Input provided to stdin
   * @param {Object} [params.limits] - Custom resource limits overrides
   * @returns {Promise<Object>} Provider raw result
   */
  async execute({ sourceCode, language, stdin, limits }) {
    throw new Error("Method execute() must be implemented by ExecutionProvider subclass");
  }

  /**
   * Health check / availability check of the execution provider.
   * @returns {Promise<boolean>}
   */
  async isHealthy() {
    throw new Error("Method isHealthy() must be implemented by ExecutionProvider subclass");
  }
}

module.exports = ExecutionProvider;
