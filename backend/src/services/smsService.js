const twilio = require('twilio');

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendOTP = async (phone, otp) => {
  try {
    const message = await client.messages.create({
      body: `Your Edunia verification code is: ${otp}. Valid for 10 minutes.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: `+91${phone}`
    });
    return message;
  } catch (error) {
    throw new Error('Failed to send OTP');
  }
};

module.exports = {
  generateOTP,
  sendOTP
};