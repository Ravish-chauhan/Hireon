function stripHtmlTags(html) {
  if (!html) return '';
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const INTERVAL_MAP = {
  "HOURLY": "HOUR",
  "DAILY": "DAY",
  "WEEKLY": "WEEK",
  "MONTHLY": "MONTH",
  "ANNUALLY": "YEAR",
  "YEARLY": "YEAR",
  "1 YEAR": "YEAR",
  "1 MONTH": "MONTH",
  "1 WEEK": "WEEK",
  "1 DAY": "DAY",
  "1 HOUR": "HOUR",
};

const EMPLOYMENT_TYPE_MAP = {
  "FULLTIME": "FULL_TIME",
  "FULL_TIME": "FULL_TIME",
  "PARTTIME": "PART_TIME",
  "PART_TIME": "PART_TIME",
  "CONTRACT": "CONTRACT",
  "INTERNSHIP": "INTERN",
  "INTERN": "INTERN",
  "TEMPORARY": "TEMPORARY",
};

function parseComp(comp) {
  if (!comp) return [null, null, null, null];
  const tiers = comp.compensationTiers || [];
  for (const tier of tiers) {
    const components = tier.components || [];
    for (const component of components) {
      if (component.compensationType !== "Salary") continue;
      const interval = INTERVAL_MAP[component.interval] || "YEAR";
      return [
        component.minValue || null,
        component.maxValue || null,
        component.currencyCode || null,
        interval
      ];
    }
  }
  return [null, null, null, null];
}

/**
 * Parses Ashby raw postings into standard Job schema format.
 */
function parseAshbyJob(item, companySlug) {
  const comp = item.compensation || {};
  const [salaryMin, salaryMax, salaryCurrency, salaryPeriod] = parseComp(comp);

  const empType = (item.employmentType || "").toUpperCase();
  const employmentType = EMPLOYMENT_TYPE_MAP[empType] || null;

  let isRemote = false;
  if (item.isRemote === true) {
    isRemote = true;
  } else if (item.workplaceType) {
    const wp = item.workplaceType.trim().toLowerCase().replace("-", "").replace(" ", "");
    if (wp === "remote") {
      isRemote = true;
    }
  }

  const descriptionHtml = item.descriptionHtml || item.descriptionPlain || null;
  const description = descriptionHtml ? stripHtmlTags(descriptionHtml) : null;

  const secondaryLocations = item.secondaryLocations || [];
  const raw = {
    department: item.department,
    team: item.team,
    secondary_locations: secondaryLocations.map(l => l.location).filter(Boolean),
    address: item.address,
    workplace_type: item.workplaceType,
    compensation_tiers: comp.compensationTiers
  };

  const atsId = String(item.id);
  const globalId = `ashby:${atsId}`;

  return {
    global_id: globalId,
    title: item.title,
    location: item.location || null,
    description,
    descriptionHtml,
    salaryMin,
    salaryMax,
    salaryCurrency,
    salaryPeriod,
    employmentType,
    department: typeof item.department === "string" ? item.department : null,
    experience: null,
    remote: isRemote,
    applyUrl: item.jobUrl || item.applyUrl,
    ats: "ashby",
    atsId,
    postedAt: item.publishedAt ? new Date(item.publishedAt) : null,
    fetchedAt: new Date(),
    raw
  };
}

module.exports = parseAshbyJob;
