const fs = require('fs');

let content = fs.readFileSync('src/pages/FinalDraftPage.tsx', 'utf8');

// 1. Add new state properties to documentSettings
content = content.replace(
  /spacingListItems: 4\n  \}\)/g, 
  "spacingListItems: 4,\n    spacingSkills: 8,\n    skillsLayout: 'row'\n  })"
);

// 2. Add UI for spacingSkills and skillsLayout in Desktop Design tab
const newUI = `
                    <div>
                      <div className="flex justify-between mb-2">
                        <label className="text-sm text-gray-300 font-medium">Skills Gap</label>
                        <span className="text-xs font-semibold bg-gray-700 text-gray-300 px-2 py-1 rounded">{documentSettings.spacingSkills}px</span>
                      </div>
                      <input type="range" min="0" max="24" step="1" value={documentSettings.spacingSkills} onChange={(e) => setDocumentSettings(s => ({ ...s, spacingSkills: Number(e.target.value) }))} className="w-full accent-[#FF6B5A]" />
                    </div>

                    <div>
                      <div className="flex justify-between mb-2">
                        <label className="text-sm text-gray-300 font-medium">Skills Layout</label>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => setDocumentSettings(s => ({ ...s, skillsLayout: 'row' }))}
                          className={\`flex-1 py-1.5 text-xs font-medium rounded \${documentSettings.skillsLayout === 'row' ? 'bg-[#FF6B5A] text-white' : 'bg-gray-700 text-gray-300'}\`}
                        >
                          Side by Side
                        </button>
                        <button 
                          onClick={() => setDocumentSettings(s => ({ ...s, skillsLayout: 'column' }))}
                          className={\`flex-1 py-1.5 text-xs font-medium rounded \${documentSettings.skillsLayout === 'column' ? 'bg-[#FF6B5A] text-white' : 'bg-gray-700 text-gray-300'}\`}
                        >
                          Single Column
                        </button>
                      </div>
                    </div>
                  </div>`;

content = content.replace(
  /className="w-full accent-\[#FF6B5A\]" \/>\n\s*<\/div>\n\s*<\/div>\n\s*<\/div>\n\s*<\/div>\n\s*<\/div>/g, 
  `className="w-full accent-[#FF6B5A]" />\n                    </div>\n${newUI}\n                </div>\n              </div>\n            </div>`
);

// 3. Inject new variables into the style wrapper
content = content.replace(
  /'--spacing-list-items': `\$\{documentSettings.spacingListItems\}px`,/g,
  `'--spacing-list-items': \`\${documentSettings.spacingListItems}px\`,\n                  '--spacing-skills': \`\${documentSettings.spacingSkills}px\`,\n                  '--skills-layout': documentSettings.skillsLayout === 'column' ? 'column' : 'row',`
);

fs.writeFileSync('src/pages/FinalDraftPage.tsx', content, 'utf8');
console.log('FinalDraftPage updated');
