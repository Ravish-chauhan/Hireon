/**
 * Utility to decode basic HTML entities without external dependencies.
 * @param {string} str - The string containing encoded entities.
 * @returns {string} The decoded string.
 */
function decodeHtmlEntities(str) {
  if (!str) return '';
  return str
    .replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec))
    .replace(/&#x([0-9a-fA-F]+);/g, (match, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ');
}

/**
 * Utility to strip HTML tags to produce plain text.
 * @param {string} html - HTML string.
 * @returns {string} Clean plain text.
 */
function stripHtmlTags(html) {
  if (!html) return '';
  return html
    .replace(/<[^>]+>/g, ' ') // Replace tags with spaces
    .replace(/\s+/g, ' ')     // Normalize whitespaces
    .trim();
}

/**
 * Parser for Greenhouse job entries.
 * Normalizes Greenhouse job payload into a standard schema structure.
 * 
 * @param {Object} item - Raw Greenhouse job object.
 * @param {string} companySlug - The unique slug of the company.
 * @returns {Object} Normalized job payload.
 */
function parseGreenhouseJob(item, companySlug) {
  const offices = item.offices || [];
  const departments = item.departments || [];
  
  // Greenhouse's first department
  const firstDept = departments.length > 0 && typeof departments[0] === 'object' 
    ? departments[0].name 
    : null;

  // Extract raw details to store in `raw` field
  const raw = {
    metadata: item.metadata || [],
    departments: departments.map(d => d.name || d),
    offices: offices.map(o => o.name || o),
    internal_job_id: item.internal_job_id
  };

  // Clean description: Greenhouse content is escaped HTML
  let descriptionHtml = null;
  let description = null;
  if (item.content) {
    descriptionHtml = decodeHtmlEntities(item.content).trim();
    if (descriptionHtml.length > 25000) {
      descriptionHtml = descriptionHtml.substring(0, 25000);
    }
    description = stripHtmlTags(descriptionHtml);
  }

  // Handle requisition ID mapping
  let requisitionId = null;
  if (item.requisition_id) {
    const reqStr = String(item.requisition_id).trim();
    if (reqStr && !['see opening id', 'tbd', 'n/a', 'tba'].includes(reqStr.toLowerCase())) {
      requisitionId = reqStr;
    }
  }

  const location = item.location ? item.location.name : null;
  const isRemote = !!(location && location.toLowerCase().includes('remote'));

  // Dates: Greenhouse first_published is creation timestamp
  const postedAt = item.first_published || item.updated_at || null;

  const atsId = String(item.id);
  const globalId = `greenhouse:${atsId}`;

  return {
    global_id: globalId,
    title: item.title,
    location: location,
    description: description,
    descriptionHtml: descriptionHtml,
    salaryMin: null,
    salaryMax: null,
    salaryCurrency: null,
    salaryPeriod: null,
    employmentType: null,
    department: firstDept,
    experience: null,
    remote: isRemote,
    applyUrl: item.absolute_url,
    ats: 'greenhouse',
    atsId: atsId,
    postedAt: postedAt ? new Date(postedAt) : null,
    fetchedAt: new Date(),
    raw: raw
  };
}

module.exports = parseGreenhouseJob;
