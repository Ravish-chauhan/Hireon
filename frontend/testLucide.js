const lucide = require('lucide-react');
const icons = [
  'Mail', 'Phone', 'Linkedin', 'Github', 'Globe', 'Award', 'Briefcase', 'GraduationCap', 'Code', 'Twitter', 'Link', 'MapPin'
];

icons.forEach(icon => {
  if (lucide[icon] === undefined) {
    console.log(`Icon ${icon} is UNDEFINED in lucide-react!`);
  }
});

const pagesIcons = [
  'FileTextIcon', 'Edit2Icon', 'ChevronDownIcon', 'PlusIcon', 'ArrowLeft', 'SettingsIcon', 'LayoutIcon', 'DownloadIcon', 'CheckIcon', 'XIcon', 'FileIcon', 'BookOpenIcon', 'Loader2Icon', 'Palette', 'Type', 'LayoutTemplate'
];

pagesIcons.forEach(icon => {
  if (lucide[icon] === undefined) {
    console.log(`FinalDraftPage Icon ${icon} is UNDEFINED in lucide-react!`);
  }
});
