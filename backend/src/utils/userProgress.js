const { calculateProfileCompletion } = require("./profileCompletion");
const { autoValidateOnboarding } = require("./autoValidateOnboarding");

async function updateUserProgress(user) {
  if (!user) return null;
  user.onboarding = autoValidateOnboarding(user);
  user.profileCompletedPercent = calculateProfileCompletion(user);
  await user.save({ validateBeforeSave: false });
  return user;
}

module.exports = { updateUserProgress };