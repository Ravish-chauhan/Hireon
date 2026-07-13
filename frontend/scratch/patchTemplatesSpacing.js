const fs = require('fs');

const files = [1, 7, 9, 11, 13].map(id => `src/components/resume/templates/ResumeTemplate${id}.tsx`);

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');

  // 1. Ensure Skills section uses the new variables correctly
  // Let's replace the whole Skills mapping block if we can find it.
  
  // A generic replace for Skills: find the .map block
  content = content.replace(
    /\{data\.skills\.map\(\(cat\) => \([\s\S]*?\}\)\)}/g,
    (match) => {
      // Find what the category heading looks like and the inner items
      // Example match:
      // {data.skills.map((cat) => (
      //   <div key={cat.id} className="..." style={{...}}>
      //     <h3 ...>{cat.category}</h3>
      //     <p ...>{cat.skills.join(' • ')}</p>
      //   </div>
      // ))}
      // OR
      //     <div className="flex flex-wrap gap-2">
      //       {cat.skills.map((skill, i) => <span key={i}>{skill}</span>)}
      //     </div>

      // Let's standardize the skill layout block:
      // If it uses .join(' • '), change it to support row/column.
      // Actually, since tailwind varies, we should just inject the inline styles to whatever exists, OR standardize it.
      return `{data.skills.map((cat) => (
            <div key={cat.id} style={{ marginBottom: "var(--spacing-section-heading)" }}>
              <h3 className="text-[length:var(--font-size-heading)] font-[family-name:var(--font-family-heading)] font-bold text-gray-900 mb-1" style={{ marginBottom: "var(--spacing-role-company)" }}>{cat.category}</h3>
              <div 
                style={{ 
                  display: "flex", 
                  flexDirection: "var(--skills-layout, row)" as any,
                  flexWrap: "wrap",
                  gap: "var(--spacing-skills)"
                }}
              >
                {cat.skills.map((skill, i) => (
                  <span key={i} className="text-[length:calc(var(--font-size-body)*1.0)] font-[family-name:var(--font-family-body)] text-gray-700 bg-gray-100 px-2 py-1 rounded">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}`;
    }
  );

  // 2. Standardize Experience, Education, Projects
  // We want to ensure:
  // - Section Wrapper: <section style={{ marginBottom: "var(--spacing-section)" }}>
  // - Section Heading: style={{ marginBottom: "var(--spacing-section-heading)" }}
  // - Item Wrapper: style={{ marginBottom: "var(--spacing-item)" }}
  // - Job/Degree Header: <div style={{ marginBottom: "var(--spacing-role-company)" }}>
  // - Description List: <ul style={{ marginTop: "var(--spacing-role-description)", gap: "var(--spacing-list-items)", display: "flex", flexDirection: "column" }}>

  // Fix item wrappers (Experience, Education, Projects, etc)
  // Look for data.experience.map
  content = content.replace(
    /\{data\.experience\.map\(\(exp\) => \([\s\S]*?\}\)\)}/g,
    (match) => {
      // Just inject style={{ marginBottom: "var(--spacing-item)" }} into the first div
      return match.replace(/<div key=\{exp\.id\}[^>]*>/, (divMatch) => {
        if (divMatch.includes('style={{')) {
          return divMatch.replace(/style=\{\{/, 'style={{ marginBottom: "var(--spacing-item)", ');
        } else {
          return divMatch.replace(/>$/, ' style={{ marginBottom: "var(--spacing-item)" }}>');
        }
      });
    }
  );

  content = content.replace(
    /\{data\.education\.map\(\(edu\) => \([\s\S]*?\}\)\)}/g,
    (match) => {
      return match.replace(/<div key=\{edu\.id\}[^>]*>/, (divMatch) => {
        if (divMatch.includes('style={{')) {
          return divMatch.replace(/style=\{\{/, 'style={{ marginBottom: "var(--spacing-item)", ');
        } else {
          return divMatch.replace(/>$/, ' style={{ marginBottom: "var(--spacing-item)" }}>');
        }
      });
    }
  );

  // Description pointers spacing
  // We already replaced some with `gap: "var(--spacing-list-items)"` but let's make sure it's robust.
  content = content.replace(/<ul[^>]*>/g, (ulMatch) => {
    if (!ulMatch.includes('gap:')) {
      if (ulMatch.includes('style={{')) {
        ulMatch = ulMatch.replace(/style=\{\{/, 'style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-list-items)", marginTop: "var(--spacing-role-description)", ');
      } else {
        ulMatch = ulMatch.replace(/>$/, ' style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-list-items)", marginTop: "var(--spacing-role-description)" }}>');
      }
    }
    return ulMatch;
  });

  // Section Heading gap
  // All <h2 ...> inside <section>
  content = content.replace(/<h2[^>]*>/g, (h2Match) => {
    if (!h2Match.includes('var(--spacing-section-heading)')) {
      if (h2Match.includes('style={{')) {
        h2Match = h2Match.replace(/style=\{\{/, 'style={{ marginBottom: "var(--spacing-section-heading)", ');
      } else {
        h2Match = h2Match.replace(/>$/, ' style={{ marginBottom: "var(--spacing-section-heading)" }}>');
      }
    }
    return h2Match;
  });

  fs.writeFileSync(file, content, 'utf8');
  console.log('Patched', file);
});
