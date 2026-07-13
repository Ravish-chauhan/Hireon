const fs = require('fs');

// Fix ResumeTemplate7
let t7 = fs.readFileSync('src/components/resume/templates/ResumeTemplate7.tsx', 'utf8');
t7 = t7.replace(/marginBottom: 'var\(--spacing-section-heading, 6px\)',\s*Skills\s*<\/div>/, `marginBottom: 'var(--spacing-section-heading, 6px)'\n          }}>\n            Skills\n          </div>`);
fs.writeFileSync('src/components/resume/templates/ResumeTemplate7.tsx', t7);

// Fix ResumeTemplate9
let t9 = fs.readFileSync('src/components/resume/templates/ResumeTemplate9.tsx', 'utf8');
// Remove the duplicated end block
t9 = t9.replace(/export default ResumeTemplate9;\s*<\/div >\s*\);\s*};\s*export default ResumeTemplate9;/, `export default ResumeTemplate9;`);
fs.writeFileSync('src/components/resume/templates/ResumeTemplate9.tsx', t9);

// Fix FinalDraftPage
let fdp = fs.readFileSync('src/pages/FinalDraftPage.tsx', 'utf8');
fdp = fdp.replace(/<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*\)\}\s*\{activeTab === 'typography' && \(/, `              </div>\n            </div>\n          )}\n\n          {activeTab === 'typography' && (`);
fs.writeFileSync('src/pages/FinalDraftPage.tsx', fdp);

console.log("Fixed syntax errors.");
