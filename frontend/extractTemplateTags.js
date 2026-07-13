const fs = require('fs');

const files = [
  'ResumeTemplate1.tsx',
  'ResumeTemplate7.tsx',
  'ResumeTemplate9.tsx',
  'ResumeTemplate11.tsx',
  'ResumeTemplate13.tsx'
];

files.forEach(f => {
  const content = fs.readFileSync('src/components/resume/templates/' + f, 'utf8');
  const tags = new Set([...content.matchAll(/<([A-Z][a-zA-Z0-9_]*)/g)].map(m => m[1]));
  console.log(f, 'Custom Tags:', Array.from(tags).join(', '));
});
