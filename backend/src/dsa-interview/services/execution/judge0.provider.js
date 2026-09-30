// ===================================
// Judge0 Execution Provider
// ===================================
const ExecutionProvider = require("./execution.provider");
const { JUDGE0_LANGUAGE_IDS, RESOURCE_LIMITS } = require("./execution.constants");

class Judge0Provider extends ExecutionProvider {
  constructor(options = {}) {
    super();
    this.apiUrl = (
      options.apiUrl ||
      process.env.JUDGE0_API_URL ||
      "https://ce.judge0.com"
    ).replace(/\/$/, "");
    this.apiKey = options.apiKey || process.env.JUDGE0_API_KEY || process.env.RAPIDAPI_KEY || null;
    this.apiHost = options.apiHost || process.env.RAPIDAPI_HOST || null;
  }

  /**
   * Build request headers including API keys if configured.
   */
  getHeaders() {
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    if (this.apiKey) {
      if (this.apiHost) {
        // RapidAPI style headers
        headers["X-RapidAPI-Key"] = this.apiKey;
        headers["X-RapidAPI-Host"] = this.apiHost;
      } else {
        // Direct Judge0 auth
        headers["X-Auth-Token"] = this.apiKey;
      }
    }

    return headers;
  }

  /**
   * Submit and execute code synchronously with timeout protection.
   */
  async execute({ sourceCode, language, stdin = "", limits = {} }) {
    const langKey = (language || "javascript").toLowerCase();
    const languageId = JUDGE0_LANGUAGE_IDS[langKey];

    if (!languageId) {
      throw new Error(`Unsupported programming language for Judge0: ${language}`);
    }

    const payload = {
      source_code: sourceCode,
      language_id: languageId,
      stdin: stdin,
      cpu_time_limit: limits.cpuTimeLimit || RESOURCE_LIMITS.CPU_TIME_LIMIT,
      wall_time_limit: limits.wallTimeLimit || RESOURCE_LIMITS.WALL_TIME_LIMIT,
      memory_limit: limits.memoryLimit || RESOURCE_LIMITS.MEMORY_LIMIT,
      max_file_size: limits.maxOutputSize || RESOURCE_LIMITS.MAX_OUTPUT_SIZE,
      enable_network: limits.enableNetwork !== undefined ? limits.enableNetwork : RESOURCE_LIMITS.NETWORK_ENABLED,
    };

    const endpoint = `${this.apiUrl}/submissions?wait=true&base64_encoded=false`;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000); // 12s overall HTTP timeout

      const response = await fetch(endpoint, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text().catch(() => "");
        return {
          status: { id: 13, description: `Judge0 HTTP ${response.status}` },
          stderr: `Execution provider error: ${errorText || response.statusText}`,
        };
      }

      const result = await response.json();
      return result;
    } catch (err) {
      if (err.name === "AbortError") {
        return {
          status: { id: 5, description: "Time Limit Exceeded" },
          stderr: "Execution provider request timed out",
        };
      }
      return {
        status: { id: 13, description: "System Error" },
        stderr: `Network / Provider error: ${err.message}`,
      };
    }
  }

  /**
   * Health check
   */
  async isHealthy() {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);
      const res = await fetch(`${this.apiUrl}/about`, {
        headers: this.getHeaders(),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return res.ok;
    } catch {
      return false;
    }
  }
}

module.exports = Judge0Provider;
