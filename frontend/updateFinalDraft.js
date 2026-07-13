const fs = require('fs');
const path = require('path');

const fp = path.join(__dirname, 'src/pages/FinalDraftPage.tsx');
let c = fs.readFileSync(fp, 'utf8');

// 1. Update initial state for documentSettings
c = c.replace(
  /const \[documentSettings, setDocumentSettings\] = useState\(\{[\s\S]*?sectionOrder: [^\n]*\n\s*\}\)/,
  `const [documentSettings, setDocumentSettings] = useState({
    marginX: 0.4,
    marginY: 0.4,
    fontFamilyName: 'Inter',
    fontFamilyHeading: 'Inter',
    fontFamilyBody: 'Inter',
    fontSizeName: 28,
    fontSizeHeading: 16,
    fontSizeSubHeading: 12,
    fontSizeBody: 11,
    lineSpacingHeader: 1.2,
    lineSpacingContent: 1.4,
    nameAlignment: 'left' as 'left' | 'center' | 'right',
    headingAlignment: 'left' as 'left' | 'center' | 'right',
    sectionOrder: templateData.sectionOrder || ['summary', 'experience', 'skills', 'education', 'projects', 'certificates', 'awards', 'languages']
  })`
);

// 2. Update CSS variables injection
c = c.replace(
  /'--font-size-body': `\$\{documentSettings\.fontSizeBody\}px`,\s*'--line-spacing': documentSettings\.lineSpacing,/,
  `'--font-size-subheading': \`\${documentSettings.fontSizeSubHeading}px\`,
                  '--font-size-body': \`\${documentSettings.fontSizeBody}px\`,
                  '--line-spacing-header': documentSettings.lineSpacingHeader,
                  '--line-spacing-content': documentSettings.lineSpacingContent,`
);

// 3. Update style block
const oldStyleRegex = /<style>\{`[\s\S]*?`\}<\/style>/;
const newStyleBlock = `<style>{\`
                  /* ── Global Font Override ── */
                  .resume-page {
                    font-family: var(--font-family-body) !important;
                    line-height: var(--line-spacing-content) !important;
                  }
                  /* ── Name (h1) ── */
                  .resume-page h1 {
                    font-family: var(--font-family-name) !important;
                    font-size: var(--font-size-name) !important;
                    text-align: var(--align-name) !important;
                    line-height: 1.1 !important;
                  }
                  /* ── Section Headings (h2, h3) ── */
                  .resume-page h2,
                  .resume-page h3 {
                    font-family: var(--font-family-heading) !important;
                    font-size: var(--font-size-heading) !important;
                    text-align: var(--align-heading) !important;
                    line-height: 1.2 !important;
                  }
                  /* ── Body Text (paragraphs, list items) ── */
                  .resume-page p,
                  .resume-page li {
                    font-family: var(--font-family-body) !important;
                    font-size: var(--font-size-body) !important;
                  }
                \`}</style>`;
c = c.replace(oldStyleRegex, newStyleBlock);

// 4. Update the Typography Panel to add the new sliders
// Let's find the Spacing block first
const spacingBlockRegex = /(<div className="bg-gray-800\/50 p-4 rounded-xl border border-gray-700 space-y-4">\s*<h4 className="text-gray-400 text-xs font-bold uppercase tracking-wider">Spacing<\/h4>\s*<div>[\s\S]*?<\/div>\s*<\/div>)/;

// We will replace the single line-spacing slider with two sliders: Header Spacing and Content Spacing
const newSpacingBlock = `<div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700 space-y-4">
                <h4 className="text-gray-400 text-xs font-bold uppercase tracking-wider">Spacing</h4>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm text-gray-300 font-medium flex items-center gap-2">
                      Header Spacing
                    </label>
                    <span className="text-xs font-semibold bg-gray-700 text-gray-300 px-2 py-1 rounded">{documentSettings.lineSpacingHeader}</span>
                  </div>
                  <input 
                    type="range" min="1" max="2" step="0.1"
                    value={documentSettings.lineSpacingHeader}
                    onChange={(e) => setDocumentSettings(s => ({ ...s, lineSpacingHeader: Number(e.target.value) }))}
                    className="w-full accent-[#FF6B5A]"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm text-gray-300 font-medium flex items-center gap-2">
                      Content Spacing
                    </label>
                    <span className="text-xs font-semibold bg-gray-700 text-gray-300 px-2 py-1 rounded">{documentSettings.lineSpacingContent}</span>
                  </div>
                  <input 
                    type="range" min="1" max="2" step="0.1"
                    value={documentSettings.lineSpacingContent}
                    onChange={(e) => setDocumentSettings(s => ({ ...s, lineSpacingContent: Number(e.target.value) }))}
                    className="w-full accent-[#FF6B5A]"
                  />
                </div>
              </div>`;

c = c.replace(spacingBlockRegex, newSpacingBlock);

// Add the Subheading font size slider. We'll add it right after the Heading font size slider.
// Find the "Headings" block
const headingSizeSliderRegex = /(<div className="flex justify-between mb-2">\s*<label className="text-sm text-gray-300 font-medium">Size<\/label>\s*<span className="text-xs font-semibold bg-gray-700 text-gray-300 px-2 py-1 rounded">\{documentSettings\.fontSizeHeading\}px<\/span>\s*<\/div>\s*<input[^>]*value=\{documentSettings\.fontSizeHeading\}[^>]*>\s*<\/div>)/;

const newSubheadingSlider = `$1
                <div className="mt-4">
                  <div className="flex justify-between mb-2">
                    <label className="text-sm text-gray-300 font-medium">Subheading Size</label>
                    <span className="text-xs font-semibold bg-gray-700 text-gray-300 px-2 py-1 rounded">{documentSettings.fontSizeSubHeading}px</span>
                  </div>
                  <input 
                    type="range" min="10" max="18" step="1"
                    value={documentSettings.fontSizeSubHeading}
                    onChange={(e) => setDocumentSettings(s => ({ ...s, fontSizeSubHeading: Number(e.target.value) }))}
                    className="w-full accent-[#FF6B5A]"
                  />
                </div>`;

c = c.replace(headingSizeSliderRegex, newSubheadingSlider);

fs.writeFileSync(fp, c, 'utf8');
console.log('✅ FinalDraftPage.tsx updated successfully');
