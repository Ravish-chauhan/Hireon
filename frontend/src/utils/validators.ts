export const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string) => {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone);
};

export const validatePassword = (password: string) => {
  return password.length >= 8;
};

export const validateFile = (file: File) => {
  const maxSize = parseInt(process.env.REACT_APP_MAX_FILE_SIZE || '10485760');
  const allowedTypes = process.env.REACT_APP_ALLOWED_FILE_TYPES?.split(',') || [
    '.pdf', '.jpg', '.jpeg', '.png', '.doc', '.docx'
  ];
  
  const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
  
  if (file.size > maxSize) {
    return { valid: false, error: 'File size exceeds 10MB limit' };
  }
  
  if (!allowedTypes.includes(fileExtension)) {
    return { valid: false, error: 'Invalid file type' };
  }
  
  return { valid: true };
};

export const validateOTP = (otp: string) => {
  return /^\d{6}$/.test(otp);
};
