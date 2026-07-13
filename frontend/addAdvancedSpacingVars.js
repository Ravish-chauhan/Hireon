const fs = require('fs');
const path = require('path');

const fp = path.join(__dirname, 'src/pages/FinalDraftPage.tsx');
let c = fs.readFileSync(fp, 'utf8');

// 1. Update initial state for documentSettings
c = c.replace(
  /const \[documentSettings, setDocumentSettings\] = useState\(\{[\s\S]*?lineSpacingContent: 1\.4\n\s*\}\)/,
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
    spacingSection: 24,
    spacingSectionHeading: 12,
    spacingItem: 20,
    spacingRoleCompany: 4,
    spacingRoleDescription: 8,
    spacingListItems: 4
  })`
);

// 2. Update CSS variables injection
c = c.replace(
  /'--line-spacing-header': documentSettings\.lineSpacingHeader,\s*'--line-spacing-content': documentSettings\.lineSpacingContent,/,
  `'--line-spacing-header': documentSettings.lineSpacingHeader,
                  '--line-spacing-content': documentSettings.lineSpacingContent,
                  '--spacing-section': \`\${documentSettings.spacingSection}px\`,
                  '--spacing-section-heading': \`\${documentSettings.spacingSectionHeading}px\`,
                  '--spacing-item': \`\${documentSettings.spacingItem}px\`,
                  '--spacing-role-company': \`\${documentSettings.spacingRoleCompany}px\`,
                  '--spacing-role-description': \`\${documentSettings.spacingRoleDescription}px\`,
                  '--spacing-list-items': \`\${documentSettings.spacingListItems}px\`,`
);

// 3. Add UI sliders in the Typography panel
// We'll insert it right after the Spacing block
const spacingBlockRegex = /(<div className="bg-gray-800\/50 p-4 rounded-xl border border-gray-700 space-y-4">\s*<h4 className="text-gray-400 text-xs font-bold uppercase tracking-wider">Spacing<\/h4>[\s\S]*?<\/div>\s*<\/div>)/;

const advancedSpacingUI = `$1

              {/* Advanced Spacing Settings */}
              <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700 space-y-4">
                <h4 className="text-gray-400 text-xs font-bold uppercase tracking-wider">Advanced Margins</h4>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm text-gray-300 font-medium">Section Gap</label>
                    <span className="text-xs font-semibold bg-gray-700 text-gray-300 px-2 py-1 rounded">{documentSettings.spacingSection}px</span>
                  </div>
                  <input type="range" min="8" max="48" step="1" value={documentSettings.spacingSection} onChange={(e) => setDocumentSettings(s => ({ ...s, spacingSection: Number(e.target.value) }))} className="w-full accent-[#FF6B5A]" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm text-gray-300 font-medium">Heading Gap</label>
                    <span className="text-xs font-semibold bg-gray-700 text-gray-300 px-2 py-1 rounded">{documentSettings.spacingSectionHeading}px</span>
                  </div>
                  <input type="range" min="0" max="24" step="1" value={documentSettings.spacingSectionHeading} onChange={(e) => setDocumentSettings(s => ({ ...s, spacingSectionHeading: Number(e.target.value) }))} className="w-full accent-[#FF6B5A]" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm text-gray-300 font-medium">Item Gap</label>
                    <span className="text-xs font-semibold bg-gray-700 text-gray-300 px-2 py-1 rounded">{documentSettings.spacingItem}px</span>
                  </div>
                  <input type="range" min="0" max="32" step="1" value={documentSettings.spacingItem} onChange={(e) => setDocumentSettings(s => ({ ...s, spacingItem: Number(e.target.value) }))} className="w-full accent-[#FF6B5A]" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm text-gray-300 font-medium">Role/Company Gap</label>
                    <span className="text-xs font-semibold bg-gray-700 text-gray-300 px-2 py-1 rounded">{documentSettings.spacingRoleCompany}px</span>
                  </div>
                  <input type="range" min="0" max="16" step="1" value={documentSettings.spacingRoleCompany} onChange={(e) => setDocumentSettings(s => ({ ...s, spacingRoleCompany: Number(e.target.value) }))} className="w-full accent-[#FF6B5A]" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm text-gray-300 font-medium">Role/Description Gap</label>
                    <span className="text-xs font-semibold bg-gray-700 text-gray-300 px-2 py-1 rounded">{documentSettings.spacingRoleDescription}px</span>
                  </div>
                  <input type="range" min="0" max="24" step="1" value={documentSettings.spacingRoleDescription} onChange={(e) => setDocumentSettings(s => ({ ...s, spacingRoleDescription: Number(e.target.value) }))} className="w-full accent-[#FF6B5A]" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm text-gray-300 font-medium">Bullet Point Gap</label>
                    <span className="text-xs font-semibold bg-gray-700 text-gray-300 px-2 py-1 rounded">{documentSettings.spacingListItems}px</span>
                  </div>
                  <input type="range" min="0" max="16" step="1" value={documentSettings.spacingListItems} onChange={(e) => setDocumentSettings(s => ({ ...s, spacingListItems: Number(e.target.value) }))} className="w-full accent-[#FF6B5A]" />
                </div>
              </div>`;

c = c.replace(spacingBlockRegex, advancedSpacingUI);

fs.writeFileSync(fp, c, 'utf8');
console.log('✅ FinalDraftPage.tsx updated successfully with advanced spacing UI');
