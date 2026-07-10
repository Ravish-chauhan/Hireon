/**
 * Calculates the user's profile completion percentage (0–100)
 * with weighted sections for a realistic progress indicator.
 * 
 * @param {Object} user - The user object from MongoDB.
 * @returns {Number} completionPercent (0–100)
 */

const calculateProfileCompletion = (user) => {
  if (!user) return 0;

  let score = 0;

  // --- 1 Basic Profile Info (20%) ---
  const profile = user.profile || {};
  if (profile.fullName && profile.gender && profile.phone && profile.dob && profile.location?.city) {
    score += 20;
  } else {
    let sub = 0;
    if (profile.fullName) sub += 4;
    if (profile.gender) sub += 4;
    if (profile.phone) sub += 4;
    if (profile.dob) sub += 4;
    if (profile.location?.city) sub += 4;
    score += sub;
  }

  // --- 2 Education (20%) ---
  if (user.education?.length) {
    const valid = user.education.some(e => e.institution && e.yearOfCompletion);
    if (valid) score += 20;
  }

  // --- 3 Professional Experience (10%) ---
  if (user.professionalExperience?.length) {
    const valid = user.professionalExperience.some(exp => exp.company && exp.title);
    if (valid) score += 10;
  }

  // --- 4 Preferences (10%) ---
  if (user.preferences?.programInterests?.length || user.preferences?.budgetMax) {
    score += 10;
  }

  // --- 5 Documents (15%) ---
  if (user.documents?.length) {
    const verifiedDocs = user.documents.filter(doc => doc.verified).length;
    const completion = Math.min((verifiedDocs / user.documents.length) * 15, 15);
    score += completion;
  }

  // --- 6 Financial Info (10%) ---
  if (user.financial?.familyIncome) score += 10;

  // --- 7 Extracurriculars (5%) ---
  if (user.extracurriculars?.length) score += 5;

  // --- 8 Onboarding Progress (5%) ---
  const totalSteps = 7; // adjust this to your actual total onboarding steps
  if (user.onboarding?.isCompleted) {
    score += 5;
  } else if (user.onboarding?.completedSteps?.length) {
    const stepsCompleted = user.onboarding.completedSteps.length;
    const progress = Math.min((stepsCompleted / totalSteps) * 5, 5);
    score += progress;
  }

  // --- 9 Privacy Settings (3%) ---
  // Privacy = preference, not progress.
  // Full 3% credit once user has any privacy settings set.
  if (user.privacySettings && Object.keys(user.privacySettings).length > 0) {
    score += 3;
  }

  // --- 10 Test History (2%) ---
  if (user.testHistory?.length) score += 2;

  // --- Final Rounded Result ---
  const completionPercent = Math.min(Number(score.toFixed(2)), 100);
  return completionPercent;
};

module.exports = { calculateProfileCompletion };
