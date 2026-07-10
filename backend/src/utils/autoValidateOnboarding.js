


/* ---------------------------------------
   Utility: Auto-Validate Onboarding Steps
   --------------------------------------- */

function autoValidateOnboarding(user) {
  const completedSteps = [];

  // Step 1 - Basic Profile Info
  const profile = user.profile || {};
  if (profile.fullName && profile.phone && profile.dob && profile.gender && profile.location?.city) {
    completedSteps.push(1);
  }

  // Step 2 - Education Info
  if (user.education?.length > 0) {
    completedSteps.push(2);
  }

  // Step 3 - Preferences
  if (user.preferences?.programInterests?.length || user.preferences?.budgetMax) {
    completedSteps.push(3);
  }

  // Step 4 - Documents Upload
  if (user.documents?.length > 0) {
    completedSteps.push(4);
  }

  // Step 5 - Verification (Email or Phone)
  if (user.isEmailVerified && user.isPhoneVerified) {
    completedSteps.push(5);
  }

  // Step 6 - Financial Info
  if (user.financial?.familyIncome || user.financial?.scholarshipApplied) {
    completedSteps.push(6);
  }

  // Step 7 - Extra Activities or Experience
  if (user.extracurriculars?.length > 0 || user.professionalExperience?.length > 0) {
    completedSteps.push(7);
  }

  // Determine current step
  const currentStep = completedSteps.length ? Math.max(...completedSteps) + 1 : 1;
  const totalSteps = 7;

  return {
    currentStep: Math.min(currentStep, totalSteps),
    completedSteps: [...new Set(completedSteps)],
    isCompleted: completedSteps.length >= totalSteps,
    lastSavedAt: new Date()
  };
}


module.exports = { autoValidateOnboarding };