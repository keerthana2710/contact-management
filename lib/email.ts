// lib/email.ts (or wherever you store your email functions)

import nodemailer from 'nodemailer';

// Configure the transporter
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,  // Your email address
    pass: process.env.EMAIL_PASS,  // Your app-specific password
  },
});

// Function to send the password reset email
export async function sendPasswordResetEmail(email: string, token: string) {
  const url = `${process.env.FRONTEND_URL}/reset-password?token=${token}`; // Link to reset password page

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Reset Your Password',
      html: `<p>Click the link below to reset your password:</p>
             <a href="${url}">Reset Password</a>`,  // Email content
    });

    console.log('Password reset email sent successfully!');
  } catch (error) {
    console.error('Error sending email:', error);
  }
}
