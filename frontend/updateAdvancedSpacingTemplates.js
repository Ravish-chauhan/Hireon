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

// Tailwinds templates (1, 11, 13)
function updateTailwindTemplate(c) {
  // 1. Spacing Section (mb-6 on main sections)
  // Usually <section ... className="mb-6"> or similar
  c = c.replace(/className="mb-6"/g, 'style={{ marginBottom: "var(--spacing-section)" }}');
  c = c.replace(/className="mb-6 /g, 'style={{ marginBottom: "var(--spacing-section)" }} className="');
  c = c.replace(/className="([^"]*)mb-6([^"]*)"/g, 'className="$1$2" style={{ marginBottom: "var(--spacing-section)" }}');

  // 2. Spacing Section Heading (mb-3 on h2s)
  c = c.replace(/className="([^"]*)mb-3([^"]*)"/g, 'className="$1$2" style={{ marginBottom: "var(--spacing-section-heading)" }}');

  // 3. Spacing Item (mb-5 on items like experience blocks)
  c = c.replace(/className="([^"]*)mb-5([^"]*)"/g, 'className="$1$2" style={{ marginBottom: "var(--spacing-item)" }}');
  
  // 4. Spacing Role/Company (mb-1 or mb-2 inside experience blocks between title and company)
  // Example in T1: mb-2 on the flex container wrapping h3 and p
  c = c.replace(/<div className="flex justify-between items-start mb-2">/g, '<div className="flex justify-between items-start" style={{ marginBottom: "var(--spacing-role-company)" }}>');

  // 5. Spacing Role/Description 
  // It's usually the margin bottom of the company text, or we can just apply a gap to the whole item if we restructure it, 
  // but let's look for specific patterns or just leave it relying on item gaps.
  // In T1, company is a `<p>` inside the above flex container. The list comes right after.
  // Let's add `--spacing-role-description` to the `<ul>` margin top.
  c = c.replace(/<ul className="([^"]*)list-outside([^"]*)"/g, '<ul className="$1list-outside$2" style={{ marginTop: "var(--spacing-role-description)" }}');

  // 6. Spacing List Items (space-y-1)
  // Remove space-y-1 and add flex col + gap
  c = c.replace(/className="([^"]*)space-y-1([^"]*)"/g, 'className="$1flex flex-col$2" style={{ gap: "var(--spacing-list-items)" }}');

  // Also replace mb-3 on education/projects if they use it instead of mb-5
  c = c.replace(/<div key=\{([^}]+)\} className="mb-3">/g, '<div key={$1} style={{ marginBottom: "var(--spacing-item)" }}>');

  return c;
}

// Inline styles templates (7, 9)
function updateInlineTemplate(c) {
  // 1. Spacing Section
  // mb: 15px or 20px
  c = c.replace(/marginBottom:\s*'15px'/g, "marginBottom: 'var(--spacing-section)'");
  c = c.replace(/marginBottom:\s*'20px'/g, "marginBottom: 'var(--spacing-section)'");

  // 2. Spacing Section Heading
  c = c.replace(/marginBottom:\s*'8px'/g, "marginBottom: 'var(--spacing-section-heading)'");
  c = c.replace(/marginBottom:\s*'12px'/g, "marginBottom: 'var(--spacing-section-heading)'");

  // 3. Spacing Item
  // Usually mb: 12px or 10px on experience items
  c = c.replace(/marginBottom:\s*'12px'/g, "marginBottom: 'var(--spacing-item)'");
  c = c.replace(/marginBottom:\s*'10px'/g, "marginBottom: 'var(--spacing-item)'");

  // 4. Spacing Role/Company
  // mb: 2px, 3px, 4px
  c = c.replace(/marginBottom:\s*'2px'/g, "marginBottom: 'var(--spacing-role-company)'");
  c = c.replace(/marginBottom:\s*'3px'/g, "marginBottom: 'var(--spacing-role-company)'");

  // 5. Spacing List Items
  // mb: 2px or 4px on list items
  // Often on `bulletItem` or `li`
  c = c.replace(/marginBottom:\s*'4px'/g, "marginBottom: 'var(--spacing-list-items)'");
  
  // 6. Spacing Role Description
  // Usually margin top on ul
  c = c.replace(/margin:\s*'4px\s+0\s+0\s+0'/g, "marginTop: 'var(--spacing-role-description)'");
  c = c.replace(/margin:\s*'6px\s+0\s+0\s+0'/g, "marginTop: 'var(--spacing-role-description)'");

  return c;
}

// Apply updates
updateFile('ResumeTemplate1.tsx', updateTailwindTemplate);
updateFile('ResumeTemplate11.tsx', updateTailwindTemplate);
updateFile('ResumeTemplate13.tsx', updateTailwindTemplate);
updateFile('ResumeTemplate7.tsx', updateInlineTemplate);
updateFile('ResumeTemplate9.tsx', updateInlineTemplate);

console.log('Finished refactoring remaining templates.');
