const fs = require('fs');

const files = [1, 7, 9, 11, 13].map(id => `src/components/resume/templates/ResumeTemplate${id}.tsx`);

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // 1. Spacing between multiple jobs / items -> var(--spacing-item)
  content = content.replace(/className="([^"]*)mb-4([^"]*)"/g, (match, p1, p2) => {
    // If it's a section, it probably should use var(--spacing-section) but most sections already have style={{marginBottom: var(--spacing-section)}}
    // For items like <div key={exp.id} className="mb-4 ..."> we replace with a style
    return match; // We will use targeted replacements instead
  });

  // Let's manually replace the standard Tailwind classes with our CSS variables
  // Replace `mb-4` on item containers with style={{ marginBottom: "var(--spacing-item)" }}
  content = content.replace(/<div key=\{([a-zA-Z0-9_.]+)\} className="([^"]*)mb-4([^"]*)"(>| style=\{)/g, 
    (match, id, p1, p2, closing) => {
      if (closing === '>') {
        return `<div key={${id}} className="${p1.trim()} ${p2.trim()}" style={{ marginBottom: "var(--spacing-item)" }}>`;
      } else {
        // already has style
        return `<div key={${id}} className="${p1.trim()} ${p2.trim()}" style={{ marginBottom: "var(--spacing-item)", `;
      }
    });

  // For role-company gap: replace `mb-1` inside item headers
  content = content.replace(/<h3 className="([^"]*)mb-1([^"]*)"([^>]*)>(.*?)<\/h3>/g, 
    '<h3 className="$1$2" style={{ marginBottom: "var(--spacing-role-company)" }}$3>$4</h3>');

  // For company/date to description gap:
  content = content.replace(/<ul className="([^"]*)mt-2([^"]*)"/g, 
    '<ul className="$1$2" style={{ marginTop: "var(--spacing-role-description)", gap: "var(--spacing-list-items)" }}');
    
  // If it's a p tag with mb-2 for description:
  content = content.replace(/<p className="([^"]*)mb-2([^"]*)"/g, 
    '<p className="$1$2" style={{ marginBottom: "var(--spacing-role-description)" }}"');

  fs.writeFileSync(file, content, 'utf8');
  console.log('Processed', file);
});
