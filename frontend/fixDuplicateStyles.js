const fs = require('fs');
const path = require('path');

const TEMPLATES_DIR = path.join(__dirname, 'src/components/resume/templates');

// Helper to safely replace in file
function updateFile(filename, replaceFn) {
  const fp = path.join(TEMPLATES_DIR, filename);
  let content = fs.readFileSync(fp, 'utf8');
  content = replaceFn(content);
  fs.writeFileSync(fp, content, 'utf8');
  console.log(`✅ ${filename} updated`);
}

function fixDuplicateStyles(c) {
  // We want to find: style={{ ... }} style={{ marginBottom: ... }}
  // and merge them into: style={{ ..., marginBottom: ... }}

  // Case 1: The script added style={{ marginBottom: "var(--spacing-section)" }}
  c = c.replace(/style=\{\{\s*order:\s*(data\.sectionOrder\?\.indexOf\('[^']+'\)\s*\?\?\s*99)\s*\}\}\s*style=\{\{\s*marginBottom:\s*"([^"]+)"\s*\}\}/g, 
    'style={{ order: $1, marginBottom: "$2" }}');

  // Case 2: In case it added style={{ marginBottom: "var(--spacing-item)" }} next to an existing style
  c = c.replace(/style=\{\{(.*?)\}\}\s*style=\{\{(.*?)\}\}/g, 'style={{$1, $2}}');

  // In case there are triple styles: style={{...}} style={{...}} style={{...}}
  c = c.replace(/style=\{\{(.*?)\}\}\s*style=\{\{(.*?)\}\}/g, 'style={{$1, $2}}');

  return c;
}

// Apply fixes
['ResumeTemplate1.tsx', 'ResumeTemplate11.tsx', 'ResumeTemplate13.tsx'].forEach(file => {
  updateFile(file, fixDuplicateStyles);
});

console.log('Finished fixing duplicate styles.');
