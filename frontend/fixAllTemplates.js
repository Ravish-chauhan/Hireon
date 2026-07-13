/**
 * fixAllTemplates.js
 * 
 * Comprehensive script to add CSS variable support to ALL resume templates.
 * This handles both Tailwind-based and inline-style-based templates.
 */

const fs = require('fs');
const path = require('path');

const TEMPLATES_DIR = path.join(__dirname, 'src/components/resume/templates');

// ─────────────────────────────────────────────────────────────
// Template 4 - Inline styles object
// ─────────────────────────────────────────────────────────────
function fixTemplate4() {
  const fp = path.join(TEMPLATES_DIR, 'ResumeTemplate4.tsx');
  let c = fs.readFileSync(fp, 'utf8');

  // Add lucide-react import if missing
  if (!c.includes("from 'lucide-react'")) {
    c = c.replace(
      "import { TemplateResumeData } from '@/types/resume';",
      "import { Linkedin, Github, Globe, Twitter, Link } from 'lucide-react';\nimport { TemplateResumeData } from '@/types/resume';"
    );
  }

  // Add resume-page class
  if (!c.includes('resume-page')) {
    c = c.replace(
      /className="([^"]*flex flex-col[^"]*)"/,
      'className="resume-page $1"'
    );
    // If that didn't work, try adding it to the div with styles.page
    if (!c.includes('resume-page')) {
      c = c.replace(
        '<div style={styles.page}',
        '<div style={styles.page} className="resume-page"'
      );
    }
  }

  // Fix page style
  c = c.replace(
    /fontFamily:\s*"'Inter',\s*'Segoe UI',\s*sans-serif"/,
    `fontFamily: "var(--font-family-body, 'Inter'), sans-serif"`
  );
  c = c.replace(
    /fontSize:\s*"9pt",\s*\n(\s*)lineHeight:\s*"1\.4"/,
    `fontSize: "var(--font-size-body, 9pt)",\n$1lineHeight: "var(--line-spacing, 1.4)"`
  );

  // Fix name style
  c = c.replace(
    /name:\s*\{\s*\n\s*fontSize:\s*"18pt",\s*\n\s*fontWeight:\s*700,\s*\n\s*color:\s*"#111827",\s*\n\s*lineHeight:\s*"1\.1",\s*\n\s*\}/,
    `name: {\n      fontSize: "var(--font-size-name, 18pt)",\n      fontFamily: "var(--font-family-name, 'Inter'), sans-serif",\n      textAlign: "var(--align-name, left)" as any,\n      fontWeight: 700,\n      color: "#111827",\n      lineHeight: "1.1",\n    }`
  );

  // Fix title style
  c = c.replace(
    /title:\s*\{\s*\n\s*fontSize:\s*"10pt",\s*\n\s*color:\s*primaryColor,\s*\n\s*fontWeight:\s*500,\s*\n\s*marginTop:\s*"3px",\s*\n\s*\}/,
    `title: {\n      fontSize: "var(--font-size-heading, 10pt)",\n      fontFamily: "var(--font-family-heading, 'Inter'), sans-serif",\n      color: primaryColor,\n      fontWeight: 500,\n      marginTop: "3px",\n    }`
  );

  // Fix sectionTitle style
  c = c.replace(
    /sectionTitle:\s*\{\s*\n\s*fontSize:\s*"10pt",\s*\n\s*fontWeight:\s*700,\s*\n\s*color:\s*primaryColor,/,
    `sectionTitle: {\n      fontSize: "var(--font-size-heading, 10pt)",\n      fontFamily: "var(--font-family-heading, 'Inter'), sans-serif",\n      textAlign: "var(--align-heading, left)" as any,\n      fontWeight: 700,\n      color: primaryColor,`
  );

  fs.writeFileSync(fp, c, 'utf8');
  console.log('✅ Template4 fixed');
}

// ─────────────────────────────────────────────────────────────
// Template 6 - Inline styles, minimalist
// ─────────────────────────────────────────────────────────────
function fixTemplate6() {
  const fp = path.join(TEMPLATES_DIR, 'ResumeTemplate6.tsx');
  let c = fs.readFileSync(fp, 'utf8');

  // Add resume-page class
  if (!c.includes('resume-page')) {
    c = c.replace(
      'className="w-[850px] min-h-[1100px] bg-white overflow-hidden"',
      'className="resume-page w-[850px] min-h-[1100px] bg-white overflow-hidden"'
    );
  }

  // Fix root fontFamily
  c = c.replace(
    /fontFamily:\s*"'Inter',\s*'Segoe UI',\s*sans-serif"/,
    `fontFamily: "var(--font-family-body, 'Inter'), sans-serif"`
  );
  // Fix root fontSize and lineHeight
  c = c.replace(
    /fontSize:\s*'10pt',\s*\n\s*lineHeight:\s*'1\.5'/,
    `fontSize: 'var(--font-size-body, 10pt)',\n        lineHeight: 'var(--line-spacing, 1.5)'`
  );

  // Fix name div (24pt)
  c = c.replace(
    /fontSize:\s*'24pt',\s*\n\s*fontWeight:\s*300,\s*\n\s*color:\s*'#111827'/,
    `fontSize: 'var(--font-size-name, 24pt)',\n          fontFamily: "var(--font-family-name, 'Inter'), sans-serif",\n          textAlign: 'var(--align-name, left)' as any,\n          fontWeight: 300,\n          color: '#111827'`
  );

  // Fix title div (11pt under name)
  c = c.replace(
    /fontSize:\s*'11pt',\s*\n\s*color:\s*'#6b7280',\s*\n\s*fontWeight:\s*400/,
    `fontSize: 'var(--font-size-heading, 11pt)',\n            fontFamily: "var(--font-family-heading, 'Inter'), sans-serif",\n            color: '#6b7280',\n            fontWeight: 400`
  );

  // Fix section heading divs (11pt, fontWeight 600, uppercase)
  c = c.replace(
    /fontSize:\s*'11pt',\s*\n\s*fontWeight:\s*600,\s*\n\s*color:\s*'#111827',\s*\n\s*textTransform:\s*'uppercase' as const,\s*\n\s*letterSpacing:\s*'2px'/g,
    `fontSize: 'var(--font-size-heading, 11pt)',\n        fontFamily: "var(--font-family-heading, 'Inter'), sans-serif",\n        textAlign: 'var(--align-heading, left)' as any,\n        fontWeight: 600,\n        color: '#111827',\n        textTransform: 'uppercase' as const,\n        letterSpacing: '2px'`
  );

  fs.writeFileSync(fp, c, 'utf8');
  console.log('✅ Template6 fixed');
}

// ─────────────────────────────────────────────────────────────
// Template 7 - Inline styles, navy theme
// ─────────────────────────────────────────────────────────────
function fixTemplate7() {
  const fp = path.join(TEMPLATES_DIR, 'ResumeTemplate7.tsx');
  let c = fs.readFileSync(fp, 'utf8');

  // Add resume-page class
  if (!c.includes('resume-page')) {
    c = c.replace(
      'className="w-[850px] min-h-[1100px] bg-white overflow-hidden"',
      'className="resume-page w-[850px] min-h-[1100px] bg-white overflow-hidden"'
    );
  }

  // Fix root fontFamily
  c = c.replace(
    /fontFamily:\s*"'Inter',\s*'Segoe UI',\s*sans-serif"/,
    `fontFamily: "var(--font-family-body, 'Inter'), sans-serif"`
  );
  // Fix root fontSize & lineHeight
  c = c.replace(
    /fontSize:\s*'9pt',\s*\n\s*lineHeight:\s*'1\.4'/,
    `fontSize: 'var(--font-size-body, 9pt)',\n        lineHeight: 'var(--line-spacing, 1.4)'`
  );

  // Fix name div (18pt)
  c = c.replace(
    /fontSize:\s*'18pt',\s*\n\s*fontWeight:\s*700,\s*\n\s*color:\s*'#1e3a5f'/,
    `fontSize: 'var(--font-size-name, 18pt)',\n          fontFamily: "var(--font-family-name, 'Inter'), sans-serif",\n          textAlign: 'var(--align-name, center)' as any,\n          fontWeight: 700,\n          color: '#1e3a5f'`
  );

  // Fix title div (10pt under name)
  c = c.replace(
    /fontSize:\s*'10pt',\s*\n\s*color:\s*'#4a5568',\s*\n\s*marginBottom:\s*'6px'/,
    `fontSize: 'var(--font-size-heading, 10pt)',\n            fontFamily: "var(--font-family-heading, 'Inter'), sans-serif",\n            color: '#4a5568',\n            marginBottom: '6px'`
  );

  // Fix section heading divs (10pt, fontWeight 700, uppercase)
  c = c.replace(
    /fontSize:\s*'10pt',\s*\n\s*fontWeight:\s*700,\s*\n\s*color:\s*'#1e3a5f',\s*\n\s*borderBottom/g,
    `fontSize: 'var(--font-size-heading, 10pt)',\n            fontFamily: "var(--font-family-heading, 'Inter'), sans-serif",\n            textAlign: 'var(--align-heading, left)' as any,\n            fontWeight: 700,\n            color: '#1e3a5f',\n            borderBottom`
  );

  fs.writeFileSync(fp, c, 'utf8');
  console.log('✅ Template7 fixed');
}

// ─────────────────────────────────────────────────────────────
// Template 8 - Green banner theme
// ─────────────────────────────────────────────────────────────
function fixTemplate8() {
  const fp = path.join(TEMPLATES_DIR, 'ResumeTemplate8.tsx');
  let c = fs.readFileSync(fp, 'utf8');

  // Add resume-page class
  if (!c.includes('resume-page')) {
    c = c.replace(
      'className="w-[850px] min-h-[1100px] bg-white overflow-hidden"',
      'className="resume-page w-[850px] min-h-[1100px] bg-white overflow-hidden"'
    );
  }

  // Fix root fontFamily
  c = c.replace(
    /fontFamily:\s*"'Inter',\s*'Segoe UI',\s*sans-serif"/,
    `fontFamily: "var(--font-family-body, 'Inter'), sans-serif"`
  );
  // Fix root fontSize & lineHeight
  c = c.replace(
    /fontSize:\s*'9pt',\s*\n\s*lineHeight:\s*'1\.4'/,
    `fontSize: 'var(--font-size-body, 9pt)',\n        lineHeight: 'var(--line-spacing, 1.4)'`
  );

  // Fix name div (18pt in banner)
  c = c.replace(
    /fontSize:\s*'18pt',\s*\n\s*fontWeight:\s*700,\s*\n\s*marginBottom:\s*'2px'/,
    `fontSize: 'var(--font-size-name, 18pt)',\n          fontFamily: "var(--font-family-name, 'Inter'), sans-serif",\n          textAlign: 'var(--align-name, left)' as any,\n          fontWeight: 700,\n          marginBottom: '2px'`
  );

  // Fix title div (10pt)
  c = c.replace(
    /fontSize:\s*'10pt',\s*\n\s*opacity:\s*0\.9,\s*\n\s*fontWeight:\s*400/,
    `fontSize: 'var(--font-size-heading, 10pt)',\n            fontFamily: "var(--font-family-heading, 'Inter'), sans-serif",\n            opacity: 0.9,\n            fontWeight: 400`
  );

  // Fix section heading divs (9pt, fontWeight 700, textTransform uppercase with primaryColor)
  c = c.replace(
    /fontSize:\s*'9pt',\s*\n\s*fontWeight:\s*700,\s*\n\s*textTransform:\s*'uppercase' as const,\s*\n\s*letterSpacing:\s*'1\.5px',\s*\n\s*color:\s*primaryColor/g,
    `fontSize: 'var(--font-size-heading, 9pt)',\n          fontFamily: "var(--font-family-heading, 'Inter'), sans-serif",\n          textAlign: 'var(--align-heading, left)' as any,\n          fontWeight: 700,\n          textTransform: 'uppercase' as const,\n          letterSpacing: '1.5px',\n          color: primaryColor`
  );

  fs.writeFileSync(fp, c, 'utf8');
  console.log('✅ Template8 fixed');
}

// ─────────────────────────────────────────────────────────────
// Template 9 - Sidebar theme, teal
// ─────────────────────────────────────────────────────────────
function fixTemplate9() {
  const fp = path.join(TEMPLATES_DIR, 'ResumeTemplate9.tsx');
  let c = fs.readFileSync(fp, 'utf8');

  // Add resume-page class
  if (!c.includes('resume-page')) {
    c = c.replace(
      'className="w-[850px] min-h-[1100px] bg-white overflow-hidden flex"',
      'className="resume-page w-[850px] min-h-[1100px] bg-white overflow-hidden flex"'
    );
  }

  // Fix root fontFamily
  c = c.replace(
    /fontFamily:\s*"'Inter',\s*'Segoe UI',\s*sans-serif"/,
    `fontFamily: "var(--font-family-body, 'Inter'), sans-serif"`
  );
  // Fix root fontSize & lineHeight
  c = c.replace(
    /fontSize:\s*'9pt',\s*\n\s*lineHeight:\s*'1\.4'/,
    `fontSize: 'var(--font-size-body, 9pt)',\n        lineHeight: 'var(--line-spacing, 1.4)'`
  );

  // Fix name div (14pt in sidebar)
  c = c.replace(
    /fontSize:\s*'14pt',\s*\n\s*fontWeight:\s*700,\s*\n\s*marginBottom:\s*'3px',\s*\n\s*color:\s*'#ffffff'/,
    `fontSize: 'var(--font-size-name, 14pt)',\n          fontFamily: "var(--font-family-name, 'Inter'), sans-serif",\n          textAlign: 'var(--align-name, left)' as any,\n          fontWeight: 700,\n          marginBottom: '3px',\n          color: '#ffffff'`
  );

  // Fix title div (9pt)
  c = c.replace(
    /fontSize:\s*'9pt',\s*\n\s*color:\s*accentColor,\s*\n\s*marginBottom:\s*'15px'/,
    `fontSize: 'var(--font-size-heading, 9pt)',\n            fontFamily: "var(--font-family-heading, 'Inter'), sans-serif",\n            color: accentColor,\n            marginBottom: '15px'`
  );

  // Fix sidebar section headings (8pt uppercase with accentColor)
  c = c.replace(
    /fontSize:\s*'8pt',\s*\n\s*fontWeight:\s*700,\s*\n\s*textTransform:\s*'uppercase',\s*\n\s*letterSpacing:\s*'1\.5px',\s*\n\s*color:\s*accentColor/g,
    `fontSize: 'var(--font-size-heading, 8pt)',\n            fontFamily: "var(--font-family-heading, 'Inter'), sans-serif",\n            fontWeight: 700,\n            textTransform: 'uppercase',\n            letterSpacing: '1.5px',\n            color: accentColor`
  );

  // Fix main section headings (10pt with accentColor)
  c = c.replace(
    /fontSize:\s*'10pt',\s*\n\s*fontWeight:\s*700,\s*\n\s*color:\s*accentColor,\s*\n\s*textTransform:\s*'uppercase'/g,
    `fontSize: 'var(--font-size-heading, 10pt)',\n            fontFamily: "var(--font-family-heading, 'Inter'), sans-serif",\n            textAlign: 'var(--align-heading, left)' as any,\n            fontWeight: 700,\n            color: accentColor,\n            textTransform: 'uppercase'`
  );

  fs.writeFileSync(fp, c, 'utf8');
  console.log('✅ Template9 fixed');
}

// ─────────────────────────────────────────────────────────────
// Templates 12-15 - Add --font-size-heading to h2 elements
// These use Tailwind CSS vars but use --font-size-body for headings
// ─────────────────────────────────────────────────────────────
function fixTailwindTemplate(filename) {
  const fp = path.join(TEMPLATES_DIR, filename);
  let c = fs.readFileSync(fp, 'utf8');

  // Fix h2 elements: change font-size-body references to font-size-heading
  // Pattern: <h2 ... text-[length:calc(var(--font-size-body)*0.917)] ...
  c = c.replace(
    /(<h2[^>]*?)text-\[length:calc\(var\(--font-size-body\)\*[0-9.]+\)\]/g,
    '$1text-[length:var(--font-size-heading)]'
  );

  // Fix h2 font-family: change font-family-body to font-family-heading
  c = c.replace(
    /(<h2[^>]*?)font-\[family-name:var\(--font-family-body\)\]/g,
    '$1font-[family-name:var(--font-family-heading)]'
  );

  // Add align-heading to h2 if missing
  c = c.replace(
    /(<h2\s+className="[^"]*font-\[family-name:var\(--font-family-heading\)\])([^"]*")/g,
    (match, before, after) => {
      if (match.includes('align-heading')) return match;
      return `${before} [text-align:var(--align-heading)]${after}`;
    }
  );

  // For h3 section headings that use font-size-body, switch to font-size-heading
  c = c.replace(
    /(<h3[^>]*?)text-\[length:calc\(var\(--font-size-body\)\*[0-9.]+\)\]/g,
    '$1text-[length:var(--font-size-heading)]'
  );
  c = c.replace(
    /(<h3[^>]*?)font-\[family-name:var\(--font-family-body\)\]/g,
    '$1font-[family-name:var(--font-family-heading)]'
  );

  fs.writeFileSync(fp, c, 'utf8');
  console.log(`✅ ${filename} fixed`);
}

// ─────────────────────────────────────────────────────────────
// Fix FinalDraftPage.tsx <style> block
// ─────────────────────────────────────────────────────────────
function fixFinalDraftPage() {
  const fp = path.join(__dirname, 'src/pages/FinalDraftPage.tsx');
  let c = fs.readFileSync(fp, 'utf8');

  // Find and replace the style block
  const styleRegex = /<style>\{\`[\s\S]*?\`\}<\/style>/;
  const newStyleBlock = `<style>{\`
                  /* ── Global Font & Line-Spacing Override ── */
                  .resume-page {
                    font-family: var(--font-family-body) !important;
                    line-height: var(--line-spacing) !important;
                  }
                  /* ── Name (h1) ── */
                  .resume-page h1 {
                    font-family: var(--font-family-name) !important;
                    font-size: var(--font-size-name) !important;
                    text-align: var(--align-name) !important;
                  }
                  /* ── Section Headings (h2, h3) ── */
                  .resume-page h2,
                  .resume-page h3 {
                    font-family: var(--font-family-heading) !important;
                    font-size: var(--font-size-heading) !important;
                    text-align: var(--align-heading) !important;
                  }
                  /* ── Body Text (paragraphs, list items) ── */
                  .resume-page p,
                  .resume-page li {
                    font-family: var(--font-family-body) !important;
                    font-size: var(--font-size-body) !important;
                  }
                \`}</style>`;

  if (styleRegex.test(c)) {
    c = c.replace(styleRegex, newStyleBlock);
    fs.writeFileSync(fp, c, 'utf8');
    console.log('✅ FinalDraftPage.tsx style block fixed');
  } else {
    console.log('❌ Could not find style block in FinalDraftPage.tsx');
  }
}

// ─────────────────────────────────────────────────────────────
// Run all fixes
// ─────────────────────────────────────────────────────────────
console.log('=== Fixing inline-style templates ===');
fixTemplate4();
fixTemplate6();
fixTemplate7();
fixTemplate8();
fixTemplate9();

console.log('\n=== Fixing Tailwind templates (12-15) ===');
fixTailwindTemplate('ResumeTemplate12.tsx');
fixTailwindTemplate('ResumeTemplate13.tsx');
fixTailwindTemplate('ResumeTemplate14.tsx');
fixTailwindTemplate('ResumeTemplate15.tsx');

console.log('\n=== Fixing FinalDraftPage ===');
fixFinalDraftPage();

// ─────────────────────────────────────────────────────────────
// Final verification
// ─────────────────────────────────────────────────────────────
console.log('\n=== Verification ===');
const files = fs.readdirSync(TEMPLATES_DIR).filter(f => f.endsWith('.tsx'));
files.forEach(f => {
  const content = fs.readFileSync(path.join(TEMPLATES_DIR, f), 'utf8');
  const checks = {
    name: content.includes('var(--font-size-name'),
    heading: content.includes('var(--font-size-heading'),
    body: content.includes('var(--font-size-body'),
    resumePage: content.includes('resume-page'),
  };
  const status = Object.values(checks).every(v => v) ? '✅' : '⚠️';
  console.log(`${status} ${f}: name=${checks.name} heading=${checks.heading} body=${checks.body} rp=${checks.resumePage}`);
});
