const fs = require('fs');

const files = [1, 7, 9, 11, 13].map(id => `src/components/resume/templates/ResumeTemplate${id}.tsx`);

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');

  // Find <h3> tags that represent titles (like job titles, degree names, project names)
  // We'll just inject style={{ marginBottom: "var(--spacing-role-company)" }} into ALL <h3> tags to be absolutely sure.
  content = content.replace(/<h3[^>]*>/g, (h3Match) => {
    if (!h3Match.includes('var(--spacing-role-company)')) {
      if (h3Match.includes('style={{')) {
        h3Match = h3Match.replace(/style=\{\{/, 'style={{ marginBottom: "var(--spacing-role-company)", ');
      } else {
        h3Match = h3Match.replace(/>$/, ' style={{ marginBottom: "var(--spacing-role-company)" }}>');
      }
    }
    return h3Match;
  });

  // Make sure ALL <section> tags have var(--spacing-section)
  content = content.replace(/<section[^>]*>/g, (secMatch) => {
    if (!secMatch.includes('var(--spacing-section)')) {
      if (secMatch.includes('style={{')) {
        secMatch = secMatch.replace(/style=\{\{/, 'style={{ marginBottom: "var(--spacing-section)", ');
      } else {
        secMatch = secMatch.replace(/>$/, ' style={{ marginBottom: "var(--spacing-section)" }}>');
      }
    }
    return secMatch;
  });

  fs.writeFileSync(file, content, 'utf8');
  console.log('Patched H3 and Section in', file);
});
