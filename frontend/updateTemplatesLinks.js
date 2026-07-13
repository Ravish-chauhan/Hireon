const fs = require('fs'); 
const path = require('path');
const dir = 'src/components/resume/templates';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx')); 

files.forEach(f => { 
  let content = fs.readFileSync(path.join(dir, f), 'utf8'); 
  
  // Wrap email in <a> tag
  content = content.replace(/<span[^>]*?>\s*\{data\.personalInfo\.contact\.email\}\s*<\/span>/g, '<a href={`mailto:${data.personalInfo.contact.email}`} className="hover:underline" style={{ textDecoration: "none", color: "inherit" }}>{data.personalInfo.contact.email}</a>'); 
  
  // Wrap phone in <a> tag (no regex formatting inside href to avoid TS errors, just use it raw or basic replace)
  content = content.replace(/<span[^>]*?>\s*\{data\.personalInfo\.contact\.phone\}\s*<\/span>/g, '<a href={`tel:${data.personalInfo.contact.phone.replace(/[^0-9+]/g, "")}`} className="hover:underline" style={{ textDecoration: "none", color: "inherit" }}>{data.personalInfo.contact.phone}</a>'); 
  
  fs.writeFileSync(path.join(dir, f), content); 
  console.log('Processed', f);
});
