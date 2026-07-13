const fs = require('fs');

const content = fs.readFileSync('src/pages/FinalDraftPage.tsx', 'utf8');

// We will extract all uppercase tags
const tags = new Set([...content.matchAll(/<([A-Z][a-zA-Z0-9_]*)/g)].map(m => m[1]));

console.log('Custom Tags used in FinalDraftPage.tsx:');
console.log(Array.from(tags).join(', '));
