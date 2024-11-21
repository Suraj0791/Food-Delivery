import nodemailer from 'nodemailer';
import transporter from '../config/nodemailer-config.ts';
import { generatePasswordResetEmailHtml, generateResetSuccessEmailHtml, generateWelcomeEmailHtml, htmlContent } from './htmlEmail.ts';

export const sendVerificationEmail = async (email: string, verificationCode: string) => {
  const mailOptions = {
    from: '"SURAJ" surajsharma790340@gmail.com',
    to: email,
    subject: 'Verify your email',
    html: htmlContent.replace("{verificationCode}", verificationCode),
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Verification email sent: %s', info.messageId);
  } catch (error) {
    console.log(error);
    throw new Error("Failed to send email verification");
  }
};

export const sendWelcomeEmail = async (email: string, name: string) => {
  const htmlContent = generateWelcomeEmailHtml(name);
  const mailOptions = {
    from: ' "SURAJeats" " surajsharma790340@gmail.com',
    to: email,
    subject: 'Welcome to SurajEats',
    html: htmlContent,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Welcome email sent: %s', info.messageId);
  } catch (error) {
    console.log(error);
    throw new Error("Failed to send welcome email");
  }
};

export const sendPasswordResetEmail = async (email: string, resetURL: string) => {
  const htmlContent = generatePasswordResetEmailHtml(resetURL);
  const mailOptions = {
    from: '"SURAJeats" " surajsharma790340@gmail.com',
    to: email,
    subject: 'Reset your password',
    html: htmlContent,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Password reset email sent: %s', info.messageId);
  } catch (error) {
    console.log(error);
    throw new Error("Failed to send password reset email");
  }
};

export const sendResetSuccessEmail = async (email: string) => {
  const htmlContent = generateResetSuccessEmailHtml();
  const mailOptions = {
    from: '"SURAJeats" " surajsharma790340@gmail.com',
    to: email,
    subject: 'Password Reset Successfully',
    html: htmlContent,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Password reset success email sent: %s', info.messageId);
  } catch (error) {
    console.log(error);
    throw new Error("Failed to send password reset success email");
  }
};