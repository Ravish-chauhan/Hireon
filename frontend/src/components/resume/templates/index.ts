import ResumeTemplate1 from './ResumeTemplate1';
import ResumeTemplate2 from './ResumeTemplate2';
import ResumeTemplate3 from './ResumeTemplate3';
import ResumeTemplate4 from './ResumeTemplate4';
import ResumeTemplate6 from './ResumeTemplate6';
import ResumeTemplate7 from './ResumeTemplate7';
import ResumeTemplate8 from './ResumeTemplate8';
import ResumeTemplate9 from './ResumeTemplate9';
import ResumeTemplate10 from './ResumeTemplate10';
import ResumeTemplate11 from './ResumeTemplate11';
import ResumeTemplate12 from './ResumeTemplate12';
import ResumeTemplate13 from './ResumeTemplate13';
import ResumeTemplate14 from './ResumeTemplate14';
import ResumeTemplate15 from './ResumeTemplate15';

export interface ResumeTemplate {
  id: string;
  name: string;
  description: string;
  component: React.ComponentType<any>;
  thumbnail?: string;
  category: 'professional' | 'creative' | 'modern' | 'technical' | 'simple';
}

export const resumeTemplates: ResumeTemplate[] = [
  // Professional Templates
  {
    id: 'template-1',
    name: 'Professional Classic',
    description: 'Clean traditional layout with blue accents, ideal for most industries',
    component: ResumeTemplate1,
    category: 'professional'
  },
  {
    id: 'template-7',
    name: 'Professional Compact',
    description: 'Compact layout with navy accents and efficient space usage',
    component: ResumeTemplate7,
    category: 'professional'
  },
  {
    id: 'template-8',
    name: 'Green Professional',
    description: 'Professional layout with green header banner',
    component: ResumeTemplate8,
    category: 'professional'
  },
  {
    id: 'template-10',
    name: 'Executive Blue',
    description: 'Premium executive design with navy header, perfect for senior roles',
    component: ResumeTemplate10,
    category: 'professional'
  },
  {
    id: 'template-15',
    name: 'Corporate Elite',
    description: 'Traditional corporate design for finance, legal & executive positions',
    component: ResumeTemplate15,
    category: 'professional'
  },

  // Modern Templates
  {
    id: 'template-2',
    name: 'Two-Column Rose',
    description: 'Modern two-column design with rose accent sidebar',
    component: ResumeTemplate2,
    category: 'modern'
  },
  {
    id: 'template-3',
    name: 'Dark Sidebar',
    description: 'Sleek layout with dark sidebar for skills',
    component: ResumeTemplate3,
    category: 'modern'
  },
  {
    id: 'template-6',
    name: 'Minimalist Pro',
    description: 'Clean minimalist design with elegant typography',
    component: ResumeTemplate6,
    category: 'modern'
  },
  {
    id: 'template-9',
    name: 'Dark Sidebar Pro',
    description: 'Two-column layout with dark sidebar and teal accents',
    component: ResumeTemplate9,
    category: 'modern'
  },
  {
    id: 'template-11',
    name: 'Modern Gradient',
    description: 'Creative design with purple gradient accents and timeline experience',
    component: ResumeTemplate11,
    category: 'modern'
  },

  // Creative Templates
  {
    id: 'template-4',
    name: 'Orange Timeline',
    description: 'Timeline-based layout with orange accents',
    component: ResumeTemplate4,
    category: 'creative'
  },
  {
    id: 'template-14',
    name: 'Coral Creative',
    description: 'Bold gradient sidebar for creative professionals and marketing',
    component: ResumeTemplate14,
    category: 'creative'
  },

  // Technical Templates
  {
    id: 'template-13',
    name: 'Tech Developer',
    description: 'Developer-focused design with dark sidebar and tech stack showcase',
    component: ResumeTemplate13,
    category: 'technical'
  },

  // Simple Templates
  {
    id: 'template-12',
    name: 'Clean Minimal',
    description: 'Elegant serif typography with centered layout, perfect for traditional industries',
    component: ResumeTemplate12,
    category: 'simple'
  },
];

export {
  ResumeTemplate1,
  ResumeTemplate2,
  ResumeTemplate3,
  ResumeTemplate4,
  ResumeTemplate6,
  ResumeTemplate7,
  ResumeTemplate8,
  ResumeTemplate9,
  ResumeTemplate10,
  ResumeTemplate11,
  ResumeTemplate12,
  ResumeTemplate13,
  ResumeTemplate14,
  ResumeTemplate15
};

export const getTemplateById = (id: string) => {
  return resumeTemplates.find(t => t.id === id);
};

export const getTemplatesByCategory = (category: ResumeTemplate['category']) => {
  return resumeTemplates.filter(t => t.category === category);
};
