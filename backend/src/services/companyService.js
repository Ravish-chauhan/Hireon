const fs = require("fs");
const path = require("path");
const Company = require("../../models/Company");

/**
 * Parses raw CSV content into array of company objects.
 * Handles quoted columns and header lookup.
 * @param {string} content - Raw CSV file content.
 * @returns {Array<Object>} Parsed companies array.
 */
function parseCSV(content) {
  const lines = content.split(/\r?\n/);
  if (lines.length === 0) return [];

  const header = lines[0].split(",");
  const nameIdx = header.findIndex(h => h.trim().toLowerCase() === "name");
  const slugIdx = header.findIndex(h => h.trim().toLowerCase() === "slug");
  const urlIdx = header.findIndex(h => h.trim().toLowerCase() === "url");

  const results = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Handle quoted fields
    const cols = [];
    let current = "";
    let inQuotes = false;
    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === "," && !inQuotes) {
        cols.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }
    cols.push(current.trim());

    const name = nameIdx !== -1 ? cols[nameIdx] : "";
    let slug = slugIdx !== -1 ? cols[slugIdx] : "";
    const url = urlIdx !== -1 ? cols[urlIdx] : "";

    // Legacy fallback
    if (slugIdx === -1 && url) {
      slug = url;
    }

    if (name) {
      results.push({
        name: name.replace(/^"|"$/g, "").trim(),
        slug: (slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-")).replace(/^"|"$/g, "").trim(),
        careerUrl: url.replace(/^"|"$/g, "").trim()
      });
    }
  }
  return results;
}

/**
 * Service to manage company metadata and import procedures.
 */
class CompanyService {
  /**
   * Imports companies from ATS-specific CSV files into MongoDB.
   * Performs bulk upserts on company slug.
   * 
   * @param {string} ats - ATS name (e.g. 'greenhouse').
   * @param {number} [limit] - Optional limit on number of imported companies (used for development).
   * @returns {Promise<Object>} Import execution summary statistics.
   */
  async importCompaniesFromCSV(ats, limit) {
    if (!ats) {
      throw new Error("ATS type is required for importing companies.");
    }

    const csvPath = path.resolve(__dirname, `../../../jobhive/ats-companies/${ats.toLowerCase()}.csv`);
    if (!fs.existsSync(csvPath)) {
      throw new Error(`CSV file not found at path: ${csvPath}`);
    }

    const fileContent = fs.readFileSync(csvPath, "utf8");
    let companies = parseCSV(fileContent);

    // Apply limit if specified
    if (limit && limit > 0) {
      companies = companies.slice(0, limit);
    }

    if (companies.length === 0) {
      return { total: 0, inserted: 0, updated: 0 };
    }

    // Execute bulk write operation to upsert records based on the slug
    const bulkOps = companies.map(company => ({
      updateOne: {
        filter: { slug: company.slug },
        update: {
          $set: {
            name: company.name,
            ats: ats.toLowerCase(),
            careerUrl: company.careerUrl,
            status: "active"
          }
        },
        upsert: true
      }
    }));

    const result = await Company.bulkWrite(bulkOps);

    return {
      total: companies.length,
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
      upsertedCount: result.upsertedCount
    };
  }

  /**
   * Imports the top companies across all available ATS CSV files.
   * 
   * @param {number} limit - The number of companies to import per ATS.
   * @returns {Promise<Object>} Import execution summary statistics.
   */
  async importAllCompanies(limit = 500) {
    const csvDir = path.resolve(__dirname, "../../../jobhive/ats-companies/");
    if (!fs.existsSync(csvDir)) {
      throw new Error(`ATS companies folder not found at: ${csvDir}`);
    }

    const files = fs.readdirSync(csvDir).filter(f => f.endsWith(".csv"));
    const totalStats = {
      total: 0,
      matchedCount: 0,
      modifiedCount: 0,
      upsertedCount: 0,
      atsImports: []
    };

    for (const file of files) {
      const atsName = file.replace(".csv", "").toLowerCase();
      try {
        const stats = await this.importCompaniesFromCSV(atsName, limit);
        totalStats.total += stats.total;
        totalStats.matchedCount += (stats.matchedCount || 0);
        totalStats.modifiedCount += (stats.modifiedCount || 0);
        totalStats.upsertedCount += (stats.upsertedCount || 0);
        totalStats.atsImports.push({ ats: atsName, success: true, count: stats.total });
      } catch (err) {
        totalStats.atsImports.push({ ats: atsName, success: false, error: err.message });
      }
    }

    return totalStats;
  }

  /**
   * Retrieves list of all active companies.
   */
  async getCompanies() {
    return Company.find({ status: "active" }).sort({ name: 1 });
  }

  /**
   * Retrieves specific company by slug.
   */
  async getCompanyBySlug(slug) {
    return Company.findOne({ slug, status: "active" });
  }
}

module.exports = new CompanyService();
