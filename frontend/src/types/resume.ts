export interface BasicInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedIn: string;
  portfolio: string;
  profilePicture: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
}

export interface PersonalInfo {
  name: string;
  title: string;
  image?: string;
  contact: {
    email?: string;
    phone?: string;
    location?: string;
    linkedin?: string;
    github?: string;
    website?: string;
    portfolio?: string;
    socialLinks?: SocialLink[];
    socialLinksFormat?: 'name' | 'url';
  };
}

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  location?: string;
  graduationDate: string;
  gpa?: string;
  honors?: string;
  coursework?: string[];
  description?: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  gpa: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
}

export interface ExperienceItem {
  id: string;
  title: string;
  company: string;
  location?: string;
  startDate: string;
  endDate: string;
  current?: boolean;
  description: string[];
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
  current: boolean;
}

export interface ProjectItem {
  id: string;
  name: string;
  role?: string;
  description: string | string[];
  technologies?: string[];
  date?: string;
  startDate?: string;
  endDate?: string;
  link?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string;
  startDate: string;
  endDate: string;
  url?: string;
  current: boolean;
}

export interface SkillCategory {
  id: string;
  category: string;
  skills: string[];
}

export interface CertificateItem {
  id: string;
  name: string;
  issuer: string;
  date: string;
  credentialId?: string;
}

export interface CustomSectionItem {
  id: string;
  title: string;
  subtitle?: string;
  date?: string;
  description?: string[];
}

export interface CustomSection {
  id: string;
  title: string;
  items: CustomSectionItem[];
}

export interface TemplateResumeData {
  personalInfo: PersonalInfo;
  summary?: string;
  experience?: ExperienceItem[];
  education?: EducationItem[];
  skills?: SkillCategory[];
  projects?: ProjectItem[];
  certificates?: CertificateItem[];
  awards?: Achievement[];
  languages?: { id: string; language: string; proficiency: string; }[];
  publications?: { id: string; title: string; authors: string; journal: string; date: string; url?: string; }[];
  memberships?: { id: string; organization: string; role?: string; startDate: string; endDate: string; }[];
  volunteer?: { id: string; organization: string; role: string; description: string; startDate: string; endDate: string; }[];
  customSections?: CustomSection[];
  sectionOrder: string[];
  settings?: any;
}

export interface ResumeData {
  basicInfo: BasicInfo;
  education: Education[];
  achievements: Achievement[];
  experience: Experience[];
  projects: Project[];
  skills: string[];
  aiJobTitle: string;
  aiJobDescription: string;
  generatedSummary: string;
  generatedKeywords: string[];
  settings?: any;
}