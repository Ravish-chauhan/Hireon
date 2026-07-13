const fs = require('fs');
const ts = require('typescript');

const files = [
  'ResumeTemplate1.tsx',
  'ResumeTemplate7.tsx',
  'ResumeTemplate9.tsx',
  'ResumeTemplate11.tsx',
  'ResumeTemplate13.tsx'
];

files.forEach(f => {
  const content = fs.readFileSync('src/components/resume/templates/' + f, 'utf8');
  if (!content.includes('export default')) {
    console.log(f, 'MISSING EXPORT DEFAULT!');
  }
  
  // also check if there are syntax errors by parsing it with TS
  const sourceFile = ts.createSourceFile(
    f,
    content,
    ts.ScriptTarget.Latest,
    true
  );
  
  const diagnostics = sourceFile.parseDiagnostics;
  if (diagnostics && diagnostics.length > 0) {
    console.log(f, 'has syntax errors!');
    console.log(diagnostics);
  }
});

console.log('Checked files.');
