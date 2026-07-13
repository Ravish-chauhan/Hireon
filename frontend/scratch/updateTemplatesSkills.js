const fs = require('fs');
const path = require('path');

const templatesPath = path.join(__dirname, 'src/components/resume/templates');
const templateFiles = ['ResumeTemplate7.tsx', 'ResumeTemplate9.tsx', 'ResumeTemplate11.tsx', 'ResumeTemplate13.tsx'];

const replacementBlock = `<div style={{ 
            display: data.settings?.skillsLayout === 'two-column' ? 'grid' : 'flex',
            gridTemplateColumns: data.settings?.skillsLayout === 'two-column' ? '1fr 1fr' : undefined,
            flexDirection: data.settings?.skillsLayout === 'block' ? 'column' : (data.settings?.skillsLayout === 'two-column' ? undefined : 'row'),
            flexWrap: 'wrap', 
            gap: data.settings?.skillsLayout === 'two-column' ? 'var(--spacing-skills, 16px)' : 'var(--spacing-skills, 6px)' 
          }}>
            {data.skills.map((cat) => (
              <div key={cat.id} style={{ display: data.settings?.skillsLayout === 'block' ? 'block' : 'flex', flexDirection: data.settings?.skillsLayout === 'block' ? 'column' : 'row', gap: data.settings?.skillsLayout === 'block' ? '4px' : '8px', alignItems: data.settings?.skillsLayout === 'block' ? 'flex-start' : 'baseline' }}>
                <span className="text-[length:calc(var(--font-size-body)*1.083)] font-[family-name:var(--font-family-body)] font-bold text-gray-900">{cat.category}: </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: \`\${data.settings?.spacingSkillsItem ?? 8}px\`, rowGap: '4px' }} className="text-[length:calc(var(--font-size-body)*1.000)] font-[family-name:var(--font-family-body)] text-gray-700">
                  {cat.skills.map((skill, index) => (
                    <span key={index}>
                      {skill}{index < cat.skills.length - 1 ? (data.settings?.skillsSeparator || ' • ') : ''}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>`;

templateFiles.forEach(file => {
  const filePath = path.join(templatesPath, file);
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Find the exact skills div container
  // It usually starts with <div style={{ display: 'flex', flexDirection: 'var(--skills-layout, row)' as any, flexWrap: 'wrap', gap: 'var(--spacing-skills, 6px)' }}>
  // and ends with </div> just before </section>
  
  // We'll use a regex to match the old div exactly. It's usually similar across templates.
  const regex = /<div style=\{\{\s*display:\s*'flex',\s*flexDirection:\s*'var\(--skills-layout,\s*row\)'\s*as\s*any,\s*flexWrap:\s*'wrap',\s*gap:\s*'var\(--spacing-skills,\s*6px\)'\s*\}\}>[\s\S]*?\{data\.skills\.map\(\(cat\)\s*=>\s*\([\s\S]*?<div key=\{cat\.id\}>[\s\S]*?<span className="[^"]*font-bold[^"]*">\{cat\.category\}:\s*<\/span>[\s\S]*?<span className="[^"]*">\{cat\.skills\.join\(' • '\)\}<\/span>[\s\S]*?<\/div>[\s\S]*?\)\)\}[\s\S]*?<\/div>/;

  const newContent = content.replace(regex, replacementBlock);
  if (newContent !== content) {
    fs.writeFileSync(filePath, newContent);
    console.log(`Updated ${file}`);
  } else {
    // If exact regex fails, try a slightly more flexible one
    const flexRegex = /<div style=\{\{\s*display:\s*'flex',\s*flexDirection:\s*'var\(--skills-layout,\s*row\)'\s*as\s*any,\s*flexWrap:\s*'wrap',\s*gap:\s*'var\(--spacing-skills,\s*6px\)'\s*\}\}>[\s\S]*?\{data\.skills\.map\([\s\S]*?<\/div>\s*\)\)\}\s*<\/div>/;
    const newerContent = content.replace(flexRegex, replacementBlock);
    if (newerContent !== content) {
      fs.writeFileSync(filePath, newerContent);
      console.log(`Updated ${file} (fallback)`);
    } else {
      console.log(`Failed to update ${file}`);
    }
  }
});
