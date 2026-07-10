export const EDUCATION_LEVELS = [
  { value: 'undergraduate', label: 'Undergraduate' },
  { value: 'graduate', label: 'Graduate (Masters)' },
  { value: 'working_professional', label: 'Working Professional' },
  { value: 'other', label: 'Other' },
];

export const COURSE_PREFERENCES = [
  { value: 'mba', label: 'MBA' },
  { value: 'engineering', label: 'Engineering' },
  { value: 'medical', label: 'Medical' },
  { value: 'law', label: 'Law' },
  { value: 'arts', label: 'Arts & Humanities' },
  { value: 'science', label: 'Science' },
  { value: 'commerce', label: 'Commerce' },
];

export const EXAM_LIST = [
  'CAT', 'GMAT', 'GRE', 'SAT', 'NEET', 'JEE', 'XAT', 'MAT', 'CMAT', 'SNAP', 'IELTS', 'TOEFL', 'GATE', 'CLAT',
];

export const BUDGET_RANGES = [
  { value: '0-5', label: 'Below ₹5 Lakhs' },
  { value: '5-10', label: '₹5-10 Lakhs' },
  { value: '10-15', label: '₹10-15 Lakhs' },
  { value: '15-20', label: '₹15-20 Lakhs' },
  { value: '20+', label: 'Above ₹20 Lakhs' },
];

export const LOCATION_PREFERENCES = [
  'North India', 'South India', 'East India', 'West India', 'Central India', 'Metro Cities', 'Tier 2 Cities', 'Any Location',
];

export const DOCUMENT_TYPES = [
  { value: 'aadhar', label: 'Aadhar Card' },
  { value: 'pan', label: 'PAN Card' },
  { value: 'passport', label: 'Passport' },
  { value: '10th_marksheet', label: '10th Marksheet' },
  { value: '12th_marksheet', label: '12th Marksheet' },
  { value: 'graduation_marksheet', label: 'Graduation Marksheet' },
  { value: 'degree_certificate', label: 'Degree Certificate' },
  { value: 'experience_letter', label: 'Experience Letter' },
  { value: 'salary_slip', label: 'Salary Slip' },
  { value: 'income_certificate', label: 'Income Certificate' },
  { value: 'caste_certificate', label: 'Caste Certificate' },
  { value: 'other', label: 'Other' },
];

export const MAX_FILE_SIZE = parseInt(process.env.REACT_APP_MAX_FILE_SIZE || '10485760');
export const ALLOWED_FILE_TYPES = ['.pdf', '.jpg', '.jpeg', '.png', '.doc', '.docx'];
