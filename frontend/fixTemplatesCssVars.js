/**
 * fixTemplatesCssVars.js
 * 
 * This script rewrites ALL 14 resume templates to consistently use CSS variables
 * for font family, font size, alignment, and margins.
 * 
 * Strategy:
 * - For templates using inline style objects (4, 6, 7, 8, 9):
 *   Replace hardcoded fontFamily/fontSize with CSS var() references
 * - For templates partially using vars (12, 13, 14, 15):
 *   Add missing heading CSS vars
 * - Add 'resume-page' class to root divs that don't have it
 */

const fs = require('fs');
const path = require('path');

const TEMPLATES_DIR = path.join(__dirname, 'src/components/resume/templates');

function processTemplate(filename) {
  const filepath = path.join(TEMPLATES_DIR, filename);
  let content = fs.readFileSync(filepath, 'utf8');
  const original = content;

  // ────────────────────────────────────────────────────────────────────────────
  // 1. Add 'resume-page' class to the root div if missing
  // ────────────────────────────────────────────────────────────────────────────
  if (!content.includes('resume-page')) {
    // Match the root div's className and add resume-page
    content = content.replace(
      /className="(w-\[850px\][^"]*?)"/,
      'className="resume-page $1"'
    );
  }

  // ────────────────────────────────────────────────────────────────────────────
  // 2. For inline-style templates, replace hardcoded fontFamily on root div
  //    with CSS var reference so the user's font choice applies
  // ────────────────────────────────────────────────────────────────────────────
  // Root-level fontFamily → CSS var
  content = content.replace(
    /fontFamily:\s*"'Inter',\s*'Segoe UI',\s*sans-serif"/g,
    "fontFamily: \"var(--font-family-body, 'Inter'), sans-serif\""
  );
  content = content.replace(
    /fontFamily:\s*"'Georgia',\s*serif"/g,
    "fontFamily: \"var(--font-family-body, 'Georgia'), serif\""
  );

  // ────────────────────────────────────────────────────────────────────────────
  // 3. For inline-style templates: replace hardcoded font sizes for
  //    NAME, HEADING/SECTION-TITLE, and BODY text with CSS var() references.
  //
  //    We use specific context patterns to avoid breaking contact/small text.
  // ────────────────────────────────────────────────────────────────────────────

  // --- NAME font size (the biggest text: 18pt, 24pt, 14pt for sidebars) ---
  // Find the name div: look for the div right before {data.personalInfo?.name
  // Replace fontSize in that specific style block
  content = content.replace(
    /(fontSize:\s*['"])(18pt|24pt|14pt)(['"])([\s\S]{0,120}?personalInfo\?\.(name|\.name))/g,
    (match, prefix, oldSize, suffix, rest) => {
      return `${prefix}var(--font-size-name, ${oldSize})${suffix}${rest}`;
    }
  );

  // --- TITLE font size (under the name: 10pt, 11pt, 9pt) ---
  content = content.replace(
    /(fontSize:\s*['"])(10pt|11pt|9pt)(['"])([\s\S]{0,120}?personalInfo\.title)/g,
    (match, prefix, oldSize, suffix, rest) => {
      // Don't replace if already has var()
      if (match.includes('var(--')) return match;
      return `${prefix}var(--font-size-heading, ${oldSize})${suffix}${rest}`;
    }
  );

  // --- SECTION TITLE font size (10pt section headers like "Experience", "Education") ---
  // These typically have textTransform: 'uppercase' or fontWeight: 700 nearby
  content = content.replace(
    /(fontSize:\s*['"])(10pt)(['"][,\s]*\n\s*fontWeight:\s*700[\s\S]{0,200}?textTransform:\s*'uppercase')/g,
    (match, prefix, oldSize, suffix) => {
      if (match.includes('var(--')) return match;
      return `${prefix}var(--font-size-heading, ${oldSize})${suffix}`;
    }
  );
  // Also match the other ordering: fontWeight before fontSize
  content = content.replace(
    /(fontWeight:\s*700[\s\S]{0,30}?fontSize:\s*['"])(10pt)(['"][\s\S]{0,200}?textTransform:\s*'uppercase')/g,
    (match, prefix, oldSize, suffix) => {
      if (match.includes('var(--')) return match;
      return `${prefix}var(--font-size-heading, ${oldSize})${suffix}`;
    }
  );

  // --- BODY font size (9pt for most body text) ---
  // Root-level fontSize on the page div
  content = content.replace(
    /(fontSize:\s*['"])(9pt)(['"][,\s]*\n\s*lineHeight)/g,
    (match, prefix, oldSize, suffix) => {
      if (match.includes('var(--')) return match;
      return `${prefix}var(--font-size-body, ${oldSize})${suffix}`;
    }
  );

  // ────────────────────────────────────────────────────────────────────────────
  // 4. For templates 12-15 that use Tailwind vars for name/body but not heading:
  //    Find h2/h3 or section heading elements that use font-size-body for headings
  //    and replace with font-size-heading
  // ────────────────────────────────────────────────────────────────────────────
  // Template 12, 13, 14, 15 use patterns like:
  //   text-[length:calc(var(--font-size-body)*0.917)] for section headings
  //   We should change these to use --font-size-heading instead

  // For h2 elements that use font-size-body, switch to font-size-heading
  // Pattern: <h2 className="text-[length:calc(var(--font-size-body)*X.XXX)]..."
  content = content.replace(
    /(<h2[^>]*?)text-\[length:calc\(var\(--font-size-body\)\*([0-9.]+)\)\]/g,
    (match, prefix, multiplier) => {
      return `${prefix}text-[length:var(--font-size-heading)]`;
    }
  );

  // For heading divs in templates 12-15 that just say font-[family-name:var(--font-family-body)]
  // on h2 elements, switch to heading
  content = content.replace(
    /(<h2[^>]*?)font-\[family-name:var\(--font-family-body\)\]/g,
    (match, prefix) => {
      return `${prefix}font-[family-name:var(--font-family-heading)]`;
    }
  );

  // Add [text-align:var(--align-heading)] to h2 elements that don't have it
  content = content.replace(
    /(<h2\s+className="[^"]*)(font-\[family-name:var\(--font-family-heading\)\])([^"]*")/g,
    (match, before, fontPart, after) => {
      if (match.includes('align-heading')) return match;
      return `${before}${fontPart} [text-align:var(--align-heading)]${after}`;
    }
  );

  // ────────────────────────────────────────────────────────────────────────────
  // 5. Add lineHeight var to root divs
  // ────────────────────────────────────────────────────────────────────────────
  content = content.replace(
    /lineHeight:\s*'1\.4'/g,
    "lineHeight: 'var(--line-spacing, 1.4)'"
  );
  content = content.replace(
    /lineHeight:\s*'1\.5'/g,
    "lineHeight: 'var(--line-spacing, 1.5)'"
  );

  if (content !== original) {
    fs.writeFileSync(filepath, content, 'utf8');
    console.log(`✅ Updated: ${filename}`);
  } else {
    console.log(`⏭️  No changes: ${filename}`);
  }
}

// Process all templates
const files = fs.readdirSync(TEMPLATES_DIR).filter(f => f.endsWith('.tsx'));
files.forEach(processTemplate);

// ────────────────────────────────────────────────────────────────────────────
// 6. Fix the FinalDraftPage <style> block override
//    Problem: It applies font-size-body to ALL spans/li/p, which is wrong
//    because spans are used for tiny elements like contact separators,
//    dates, skill chips, etc.
//    Solution: Only override elements with specific data attributes or classes
// ────────────────────────────────────────────────────────────────────────────
console.log('\n--- Fixing FinalDraftPage.tsx <style> override ---');
const finalDraftPath = path.join(__dirname, 'src/pages/FinalDraftPage.tsx');
let fdContent = fs.readFileSync(finalDraftPath, 'utf8');

const oldStyleBlock = `                <style>{\`
                  /* Global Font Overrides for the Resume */
                  .resume-page {
                    font-family: var(--font-family-body) !important;
                    line-height: var(--line-spacing) !important;
                  }
                  .resume-page * {
                    line-height: var(--line-spacing) !important;
                  }
                  /* Target Name classes across templates */
                  .resume-page h1, 
                  .resume-page .text-\\\\[32px\\\\], 
                  .resume-page .text-\\\\[28px\\\\], 
                  .resume-page .text-\\\\[24px\\\\],
                  .resume-page .text-\\\\[36px\\\\] {
                    font-family: var(--font-family-name) !important;
                    font-size: var(--font-size-name) !important;
                  }
                  /* Target Heading classes across templates */
                  .resume-page h2, 
                  .resume-page h3,
                  .resume-page .text-\\\\[18px\\\\], 
                  .resume-page .text-\\\\[16px\\\\], 
                  .resume-page .text-\\\\[14px\\\\] {
                    font-family: var(--font-family-heading) !important;
                    font-size: var(--font-size-heading) !important;
                  }
                  /* Target Body classes across templates */
                  .resume-page p, 
                  .resume-page li, 
                  .resume-page span,
                  .resume-page .text-\\\\[13px\\\\], 
                  .resume-page .text-\\\\[12px\\\\], 
                  .resume-page .text-\\\\[11px\\\\], 
                  .resume-page .text-\\\\[10px\\\\],
                  .resume-page .text-\\\\[9pt\\\\],
                  .resume-page .text-\\\\[10pt\\\\] {
                    font-family: var(--font-family-body) !important;
                    font-size: var(--font-size-body) !important;
                  }
                \`}</style>`;

const newStyleBlock = `                <style>{\`
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
                  /* ── Body Text (paragraphs, list items, summary divs) ── */
                  .resume-page p,
                  .resume-page li {
                    font-family: var(--font-family-body) !important;
                    font-size: var(--font-size-body) !important;
                  }
                  /* ── Summary rendered via dangerouslySetInnerHTML ── */
                  .resume-page [dangerouslysetinnerhtml] {
                    font-family: var(--font-family-body) !important;
                    font-size: var(--font-size-body) !important;
                  }
                \`}</style>`;

if (fdContent.includes(oldStyleBlock)) {
  fdContent = fdContent.replace(oldStyleBlock, newStyleBlock);
  fs.writeFileSync(finalDraftPath, fdContent, 'utf8');
  console.log('✅ FinalDraftPage.tsx style block updated');
} else {
  console.log('⚠️  Could not find exact old style block in FinalDraftPage.tsx');
  console.log('   Will try a regex approach...');
  
  // Regex fallback
  const styleRegex = /<style>\{\`[\s\S]*?\/\* Global Font Overrides[\s\S]*?\`\}<\/style>/;
  if (styleRegex.test(fdContent)) {
    fdContent = fdContent.replace(styleRegex, newStyleBlock);
    fs.writeFileSync(finalDraftPath, fdContent, 'utf8');
    console.log('✅ FinalDraftPage.tsx style block updated (regex fallback)');
  } else {
    console.log('❌ Could not find style block at all. Manual fix required.');
  }
}

console.log('\n✅ All templates processed!');
