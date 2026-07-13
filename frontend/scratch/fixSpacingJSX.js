const fs = require('fs');

const files = [1, 7, 9, 11, 13].map(id => `src/components/resume/templates/ResumeTemplate${id}.tsx`);

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // Fix double style props
  content = content.replace(/style=\{\{ marginTop: "var\(--spacing-role-description\)", gap: "var\(--spacing-list-items\)" \}\} style=\{\{ gap: "var\(--spacing-list-items\)" \}\}/g, 
    'style={{ marginTop: "var(--spacing-role-description)", gap: "var(--spacing-list-items)" }}');

  // Fix unmatched quotes from the <p className="mb-2" replacement:
  // It added style={...}"  <- extra quote at the end.
  content = content.replace(/style=\{\{ marginBottom: "var\(--spacing-role-description\)" \}\}"/g, 
    'style={{ marginBottom: "var(--spacing-role-description)" }}');

  fs.writeFileSync(file, content, 'utf8');
  console.log('Fixed', file);
});
