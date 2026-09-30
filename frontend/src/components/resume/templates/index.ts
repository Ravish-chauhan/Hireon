import ResumeTemplate1 from './ResumeTemplate1';
import ResumeTemplate7 from './ResumeTemplate7';
import ResumeTemplate9 from './ResumeTemplate9';
import ResumeTemplate11 from './ResumeTemplate11';
import ResumeTemplate13 from './ResumeTemplate13';
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
    description: 'Space-efficient professional layout with sidebar and blue header',
    component: ResumeTemplate7,
    category: 'professional'
  },
  {
    id: 'template-9',
    name: 'Creative Timeline',
    description: 'Modern two-column layout with dark sidebar and bright accents',
    component: ResumeTemplate9,
    category: 'creative'
  },
  {
    id: 'template-11',
    name: 'Modern Purple',
    description: 'Clean modern layout with purple accents and badge styling',
    component: ResumeTemplate11,
    category: 'modern'
  },
  {
    id: 'template-13',
    name: 'Tech Terminal',
    description: 'Dark theme developer resume with monospaced fonts and green accents',
    component: ResumeTemplate13,
    category: 'technical'
  },
  {
    id: 'template-15',
    name: 'Executive Minimalist',
    description: 'Clean centered sections separated by horizontal lines with classic typography',
    component: ResumeTemplate15,
    category: 'professional'
  }
];

export const getTemplateById = (id: string): ResumeTemplate | undefined => {
  return resumeTemplates.find(template => template.id === id);
};

export const hasSummaryText = (summary?: any): boolean => {
  if (!summary) return false;
  const content = typeof summary === 'string' ? summary : summary.content;
  if (!content || typeof content !== 'string') return false;
  const clean = content
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/gi, '')
    .replace(/\s+/g, '')
    .trim();
  return clean.length > 0;
};

export const getSummaryContent = (summary?: any): string => {
  if (!summary) return '';
  return typeof summary === 'string' ? summary : (summary.content || '');
};
