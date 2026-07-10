const AWS = require('aws-sdk');

// Configure AWS SES
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const ses = new AWS.SES({ apiVersion: '2010-12-01' });

const generateEmailOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendEmailOTP = async (email, otp) => {
  const params = {
    Destination: {
      ToAddresses: [email]
    },
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #0A2647;">EduNiaa Email Verification</h2>
              <p>Your verification code is:</p>
              <div style="background-color: #f8f9fa; padding: 20px; text-align: center; margin: 20px 0;">
                <h1 style="color: #FF9D42; font-size: 32px; margin: 0; letter-spacing: 5px;">${otp}</h1>
              </div>
              <p>This code will expire in 10 minutes.</p>
              <p>If you didn't request this verification, please ignore this email.</p>
              <hr style="margin: 30px 0;">
              <p style="color: #666; font-size: 12px;">EduNiaa - Your Education Journey Starts Here</p>
            </div>
          `
        },
        Text: {
          Charset: 'UTF-8',
          Data: `Your EduNiaa verification code is: ${otp}. This code will expire in 10 minutes.`
        }
      },
      Subject: {
        Charset: 'UTF-8',
        Data: 'EduNiaa - Email Verification Code'
      }
    },
    Source: process.env.FROM_EMAIL
  };

  try {
    const result = await ses.sendEmail(params).promise();
    console.log('Email OTP sent successfully:', result.MessageId);
    return result;
  } catch (error) {
    console.error('SES Email sending failed:', error);
    throw new Error('Failed to send email OTP');
  }
};

const sendWelcomeEmailSES = async (email, fullName) => {
  const params = {
    Destination: {
      ToAddresses: [email]
    },
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #0A2647;">Welcome to EduNiaa, ${fullName}!</h2>
              <p>Your account has been successfully created and verified.</p>
              <p>You can now access all our educational consultation services:</p>
              <ul>
                <li>College recommendations</li>
                <li>Career guidance</li>
                <li>Exam preparation</li>
                <li>Scholarship opportunities</li>
              </ul>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.FRONTEND_URL}/" style="background-color: #FF9D42; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">Explore EduNiaa</a>
              </div>
              <p>Best regards,<br>The EduNiaa Team</p>
            </div>
          `
        },
        Text: {
          Charset: 'UTF-8',
          Data: `Welcome to EduNiaa, ${fullName}! Your account has been successfully created. Visit ${process.env.FRONTEND_URL}/ to get started.`
        }
      },
      Subject: {
        Charset: 'UTF-8',
        Data: 'Welcome to EduNiaa!'
      }
    },
    Source: process.env.FROM_EMAIL
  };

  try {
    const result = await ses.sendEmail(params).promise();
    console.log('Welcome email sent successfully:', result.MessageId);
    return result;
  } catch (error) {
    console.error('Welcome email sending failed:', error);
    throw new Error('Failed to send welcome email');
  }
};

module.exports = {
  generateEmailOTP,
  sendEmailOTP,
  sendWelcomeEmailSES
};