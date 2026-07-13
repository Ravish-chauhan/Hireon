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

// ─────────────────────────────────────────────────────────────
// Template 1 (Tailwind)
// ─────────────────────────────────────────────────────────────
updateFile('ResumeTemplate1.tsx', (c) => {
  // Update header line spacing
  c = c.replace(/className="bg-slate-800 text-white[^"]*"/, match => {
    if (match.includes('line-spacing-header')) return match;
    return match.replace('className="', 'className="[line-height:var(--line-spacing-header)] ');
  });

  // Update subheading for job titles and company names
  // In T1, job titles are h3, company is div with text-emerald-600
  // Let's target the exact structures
  c = c.replace(/<h3 className="text-\[length:calc\(var\(--font-size-body\)\*1\.167\)\]/g, 
                '<h3 className="text-[length:var(--font-size-subheading)]');
  c = c.replace(/<div className="text-emerald-600 font-medium text-\[length:calc\(var\(--font-size-body\)\*0\.917\)\]/g, 
                '<div className="text-emerald-600 font-medium text-[length:var(--font-size-subheading)]');
  c = c.replace(/<div className="text-emerald-600 font-medium text-\[length:calc\(var\(--font-size-body\)\*1\.000\)\]/g, 
                '<div className="text-emerald-600 font-medium text-[length:var(--font-size-subheading)]');
  return c;
});

// ─────────────────────────────────────────────────────────────
// Template 7 (Inline styles)
// ─────────────────────────────────────────────────────────────
updateFile('ResumeTemplate7.tsx', (c) => {
  // Add header line spacing to header div
  c = c.replace(/<div\s+style=\{\{\s*display:\s*'flex',\s*justifyContent:\s*'space-between',\s*alignItems:\s*'flex-end',\s*borderBottom:\s*'2px solid #1e3a5f',\s*paddingBottom:\s*'12px',\s*marginBottom:\s*'15px'\s*\}\}/,
    `<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '2px solid #1e3a5f', paddingBottom: '12px', marginBottom: '15px', lineHeight: 'var(--line-spacing-header)' }}`
  );
  
  // Job titles and company names
  // Job title: fontSize: '10pt', fontWeight: 600, color: '#1e3a5f'
  c = c.replace(/fontSize:\s*'10pt',\s*\n\s*fontWeight:\s*600,\s*\n\s*color:\s*'#1e3a5f'/g, 
                `fontSize: 'var(--font-size-subheading, 10pt)',\n                          fontWeight: 600,\n                          color: '#1e3a5f'`);
  
  // Company: fontSize: '9pt', color: '#4a5568', fontWeight: 500
  c = c.replace(/fontSize:\s*'9pt',\s*\n\s*color:\s*'#4a5568',\s*\n\s*fontWeight:\s*500/g, 
                `fontSize: 'var(--font-size-subheading, 9pt)',\n                          color: '#4a5568',\n                          fontWeight: 500`);
                
  return c;
});

// ─────────────────────────────────────────────────────────────
// Template 9 (Inline styles)
// ─────────────────────────────────────────────────────────────
updateFile('ResumeTemplate9.tsx', (c) => {
  // Add header line spacing to sidebar header section
  // Since it's inline text in sidebar, we'll just add it to the sidebar container
  c = c.replace(/<div\s+style=\{\{\s*width:\s*'32%',\s*backgroundColor:\s*primaryColor,\s*padding:\s*'var\(--margin-y,\s*25px\)\s*var\(--margin-x,\s*25px\)',\s*color:\s*'#ffffff'\s*\}\}/,
    `<div style={{ width: '32%', backgroundColor: primaryColor, padding: 'var(--margin-y, 25px) var(--margin-x, 25px)', color: '#ffffff', lineHeight: 'var(--line-spacing-header)' }}`
  );

  // Job titles: fontSize: '10pt', fontWeight: 600, color: '#1f2937'
  c = c.replace(/fontSize:\s*'10pt',\s*\n\s*fontWeight:\s*600,\s*\n\s*color:\s*'#1f2937'/g, 
                `fontSize: 'var(--font-size-subheading, 10pt)',\n                          fontWeight: 600,\n                          color: '#1f2937'`);
  
  // Company: fontSize: '9pt', color: accentColor, fontWeight: 500
  c = c.replace(/fontSize:\s*'9pt',\s*\n\s*color:\s*accentColor,\s*\n\s*fontWeight:\s*500/g, 
                `fontSize: 'var(--font-size-subheading, 9pt)',\n                          color: accentColor,\n                          fontWeight: 500`);

  return c;
});

// ─────────────────────────────────────────────────────────────
// Template 11 (Tailwind)
// ─────────────────────────────────────────────────────────────
updateFile('ResumeTemplate11.tsx', (c) => {
  // Add header line spacing
  c = c.replace(/className="bg-gradient-to-r from-purple-700 to-indigo-800 text-white[^"]*"/, match => {
    if (match.includes('line-spacing-header')) return match;
    return match.replace('className="', 'className="[line-height:var(--line-spacing-header)] ');
  });

  // Update subheading (Job titles / company)
  c = c.replace(/<h3 className="text-\[length:calc\(var\(--font-size-body\)\*1\.167\)\]/g, 
                '<h3 className="text-[length:var(--font-size-subheading)]');
  c = c.replace(/<div className="text-purple-600 font-medium text-\[length:calc\(var\(--font-size-body\)\*0\.917\)\]/g, 
                '<div className="text-purple-600 font-medium text-[length:var(--font-size-subheading)]');
  c = c.replace(/<div className="text-purple-600 font-medium text-\[length:calc\(var\(--font-size-body\)\*1\.000\)\]/g, 
                '<div className="text-purple-600 font-medium text-[length:var(--font-size-subheading)]');
  return c;
});

// ─────────────────────────────────────────────────────────────
// Template 13 (Tailwind)
// ─────────────────────────────────────────────────────────────
updateFile('ResumeTemplate13.tsx', (c) => {
  // Add header line spacing
  c = c.replace(/className="bg-slate-900 text-white border-b-4 border-emerald-500[^"]*"/, match => {
    if (match.includes('line-spacing-header')) return match;
    return match.replace('className="', 'className="[line-height:var(--line-spacing-header)] ');
  });

  // Update subheading
  c = c.replace(/<h3 className="text-\[length:calc\(var\(--font-size-body\)\*1\.167\)\]/g, 
                '<h3 className="text-[length:var(--font-size-subheading)]');
  // Template 13 projects use heading var for project titles. Experience uses:
  // <div className="text-emerald-600 font-medium text-[length:calc(var(--font-size-body)*0.917)]">
  c = c.replace(/<div className="text-emerald-600 font-medium text-\[length:calc\(var\(--font-size-body\)\*0\.917\)\]/g, 
                '<div className="text-emerald-600 font-medium text-[length:var(--font-size-subheading)]');
  c = c.replace(/<div className="text-emerald-600 font-medium text-\[length:calc\(var\(--font-size-body\)\*1\.000\)\]/g, 
                '<div className="text-emerald-600 font-medium text-[length:var(--font-size-subheading)]');
  return c;
});

console.log('Done replacing templates.');
