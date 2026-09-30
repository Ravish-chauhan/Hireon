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

function stripHtmlTags(html) {
  if (!html) return '';
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const COMMITMENT_TO_EMPLOYMENT_TYPE = {
  "full-time": "FULL_TIME",
  "fulltime": "FULL_TIME",
  "full time": "FULL_TIME",
  "regular": "FULL_TIME",
  "part-time": "PART_TIME",
  "parttime": "PART_TIME",
  "part time": "PART_TIME",
  "contract": "CONTRACT",
  "contractor": "CONTRACT",
  "consultant": "CONTRACT",
  "freelance": "CONTRACT",
  "fixed-term": "CONTRACT",
  "internship": "INTERN",
  "intern": "INTERN",
  "co-op": "INTERN",
  "temporary": "TEMPORARY",
  "temp": "TEMPORARY",
  "seasonal": "TEMPORARY",
};

const LEVER_INTERVAL_MAP = {
  "1-YEAR": "YEAR",
  "PER-YEAR-SALARY": "YEAR",
  "1-MONTH": "MONTH",
  "1-WEEK": "WEEK",
  "1-DAY": "DAY",
  "1-HOUR": "HOUR",
  "PER-HOUR-WAGE": "HOUR",
  "YEAR": "YEAR",
  "MONTH": "MONTH",
  "WEEK": "WEEK",
  "DAY": "DAY",
  "HOUR": "HOUR",
};

/**
 * Parses Lever raw postings into a standard schema structure.
 */
function parseLeverJob(item, companySlug) {
  const categories = item.categories || {};
  const commitment = categories.commitment;
  const salaryRange = item.salaryRange || {};
  
  let employmentType = null;
  if (commitment && typeof commitment === "string") {
    const norm = commitment.trim().toLowerCase();
    for (const [key, val] of Object.entries(COMMITMENT_TO_EMPLOYMENT_TYPE)) {
      if (norm.includes(key)) {
        employmentType = val;
        break;
      }
    }
  }

  // Concatenate HTML description and lists sections
  const introHtml = item.description || "";
  const sections = item.lists || [];
  const parts = [];
  if (introHtml.trim()) {
    parts.push(introHtml);
  }
  for (const section of sections) {
    if (!section || typeof section !== "object") continue;
    const heading = (section.text || "").trim();
    const content = (section.content || "").trim();
    if (!content) continue;
    if (heading) {
      parts.push(`<h3>${heading}</h3>\n${content}`);
    } else {
      parts.push(content);
    }
  }

  let descriptionHtml = null;
  let description = null;
  if (parts.length > 0) {
    descriptionHtml = parts.join("\n\n").trim();
    if (descriptionHtml.length > 25000) {
      descriptionHtml = descriptionHtml.substring(0, 25000);
    }
    description = stripHtmlTags(descriptionHtml);
  } else if (item.descriptionPlain) {
    description = item.descriptionPlain.trim();
    if (description.length > 25000) {
      description = description.substring(0, 25000);
    }
  }

  const raw = {
    categories
  };
  for (const k of ["workplaceType", "country", "tags", "additionalPlain"]) {
    if (item[k]) {
      raw[k] = item[k];
    }
  }

  let isRemote = false;
  const wp = (item.workplaceType || "").toLowerCase();
  if (wp === "remote") {
    isRemote = true;
  }

  const salaryInterval = (salaryRange.interval || "").toUpperCase();
  const salaryPeriod = LEVER_INTERVAL_MAP[salaryInterval] || null;

  const atsId = String(item.id);
  const globalId = `lever:${atsId}`;

  return {
    global_id: globalId,
    title: item.text,
    location: categories.location || null,
    description,
    descriptionHtml,
    salaryMin: salaryRange.min || null,
    salaryMax: salaryRange.max || null,
    salaryCurrency: salaryRange.currency || null,
    salaryPeriod,
    employmentType,
    department: categories.department || null,
    experience: null,
    remote: isRemote,
    applyUrl: item.applyUrl || item.hostedUrl,
    ats: "lever",
    atsId,
    postedAt: item.createdAt ? new Date(item.createdAt) : null,
    fetchedAt: new Date(),
    raw
  };
}

module.exports = parseLeverJob;
