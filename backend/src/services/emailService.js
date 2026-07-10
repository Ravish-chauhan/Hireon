const nodemailer = require('nodemailer');

// SMTP transporter using Ravish's configuration
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
};

console.log('SMTP service configured for:', process.env.SMTP_USER);

const sendVerificationEmail = async (email, token) => {
  console.log('Attempting to send verification email to:', email);
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
  console.log('Verification URL:', verificationUrl);
  
  const mailOptions = {
    from: process.env.FROM_EMAIL,
    to: email,
    subject: 'Verify Your Email - Edunia',
    html: `
      <h2>Welcome to Edunia!</h2>
      <p>Please click the link below to verify your email address:</p>
      <a href="${verificationUrl}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Email</a>
      <p>This link will expire in 24 hours.</p>
    `
  };

  console.log('Mail options:', { from: mailOptions.from, to: mailOptions.to, subject: mailOptions.subject });
  
  try {
    const transporter = createTransporter();
    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);
    return result;
  } catch (error) {
    console.error('Email sending failed:', error);
    throw error;
  }
};

const sendWelcomeEmail = async (email, name) => {
  const mailOptions = {
    from: process.env.FROM_EMAIL,
    to: email,
    subject: 'Welcome to Edunia!',
    html: `
      <h2>Welcome ${name}!</h2>
      <p>Your account has been successfully verified. You can now access all features of Edunia.</p>
    `
  };

  const transporter = createTransporter();
  return transporter.sendMail(mailOptions);
};

const sendPasswordResetEmail = async (email, token) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
  
  const mailOptions = {
    from: process.env.FROM_EMAIL,
    to: email,
    subject: 'Password Reset - Edunia',
    html: `
      <h2>Password Reset Request</h2>
      <p>You requested a password reset for your Edunia account.</p>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
      <p>This link will expire in 15 minutes.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `
  };

  const transporter = createTransporter();
  return transporter.sendMail(mailOptions);
};

const sendEmailOTPViaGmail = async (email, otp) => {
  console.log('Sending email OTP to:', email);
  
  const mailOptions = {
    from: process.env.FROM_EMAIL,
    to: email,
    subject: 'EduNiaa - Email Verification Code',
    html: `
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
    `,
    text: `Your EduNiaa verification code is: ${otp}. This code will expire in 10 minutes.`
  };

  try {
    const transporter = createTransporter();
    const result = await transporter.sendMail(mailOptions);
    console.log('Email OTP sent successfully:', result.messageId);
    return result;
  } catch (error) {
    console.error('Email OTP sending failed:', error);
    throw new Error('Failed to send email OTP');
  }
};

const sendConsultationConfirmationToUser = async (userEmail, userName, consultationDetails) => {
  const { consultant_name, session_type, preferred_date, preferred_time } = consultationDetails;
  
  const mailOptions = {
    from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
    to: userEmail,
    subject: 'Consultation Booked Successfully - EduNiaa',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #0B2447;">Consultation Confirmed!</h2>
        <p>Dear ${userName},</p>
        <p>Your consultation has been successfully booked. We will contact you within 24 hours to confirm the details.</p>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #FF8855; margin-top: 0;">Consultation Details:</h3>
          <p><strong>Consultant:</strong> ${consultant_name}</p>
          <p><strong>Session Type:</strong> ${session_type}</p>
          <p><strong>Date:</strong> ${preferred_date}</p>
          <p><strong>Time:</strong> ${preferred_time}</p>
        </div>
        
        <p>Our team will reach out to you shortly to finalize the meeting details and provide the meeting link.</p>
        <p>Thank you for choosing EduNiaa!</p>
        
        <hr style="margin: 30px 0;">
        <p style="color: #666; font-size: 12px;">EduNiaa - Your Education Journey Starts Here</p>
      </div>
    `
  };

  const transporter = createTransporter();
  return transporter.sendMail(mailOptions);
};

const sendConsultationNotificationToCompany = async (consultationDetails, userDetails) => {
  const { consultant_name, session_type, preferred_date, preferred_time, notes } = consultationDetails;
  const { fullName, email, phone } = userDetails;
  
  const mailOptions = {
    from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
    to: 'contact@eduniaa.com',
    subject: `New Consultation Booking - ${fullName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #0B2447;">New Consultation Booking</h2>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #FF8855; margin-top: 0;">Student Details:</h3>
          <p><strong>Name:</strong> ${fullName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
        </div>
        
        <div style="background-color: #e8f4fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #0B2447; margin-top: 0;">Consultation Details:</h3>
          <p><strong>Consultant Requested:</strong> ${consultant_name}</p>
          <p><strong>Session Type:</strong> ${session_type}</p>
          <p><strong>Preferred Date:</strong> ${preferred_date}</p>
          <p><strong>Preferred Time:</strong> ${preferred_time}</p>
          ${notes ? `<p><strong>Additional Notes:</strong> ${notes}</p>` : ''}
        </div>
        
        <p><strong>Action Required:</strong> Please contact the student within 24 hours to confirm the consultation details.</p>
        
        <hr style="margin: 30px 0;">
        <p style="color: #666; font-size: 12px;">EduNiaa Consultation Management System</p>
      </div>
    `
  };

  const transporter = createTransporter();
  return transporter.sendMail(mailOptions);
};

module.exports = {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendEmailOTPViaGmail,
  sendConsultationConfirmationToUser,
  sendConsultationNotificationToCompany
};