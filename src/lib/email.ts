import nodemailer from 'nodemailer';
import crypto from 'crypto';

/**
 * Email configuration - Update with your email service
 */
const emailConfig = {
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
};

/**
 * Create email transporter
 */
const getTransporter = () => {
  if (!emailConfig.auth.user || !emailConfig.auth.pass) {
    console.warn('Email credentials not configured. Email features will not work.');
    return null;
  }

  return nodemailer.createTransport({
    host: emailConfig.host,
    port: emailConfig.port,
    secure: emailConfig.secure,
    auth: emailConfig.auth,
  });
};

/**
 * Generate verification token
 */
export function generateVerificationToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Hash verification token (for storage)
 */
export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

/**
 * Send verification email
 */
export async function sendVerificationEmail(
  email: string,
  verificationUrl: string,
  userName?: string
): Promise<boolean> {
  try {
    const transporter = getTransporter();

    if (!transporter) {
      console.error('Email transporter not configured');
      return false;
    }

    const mailOptions = {
      from: `Friends Telecom <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Verify your Friends Telecom account',
      html: getVerificationEmailTemplate(verificationUrl, userName),
    };

    await transporter.sendMail(mailOptions);
    console.log(`Verification email sent to ${email}`);
    return true;
  } catch (error) {
    console.error('Error sending verification email:', error);
    return false;
  }
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(
  email: string,
  resetUrl: string,
  userName?: string
): Promise<boolean> {
  try {
    const transporter = getTransporter();

    if (!transporter) {
      console.error('Email transporter not configured');
      return false;
    }

    const mailOptions = {
      from: `Friends Telecom <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Reset your Friends Telecom password',
      html: getPasswordResetEmailTemplate(resetUrl, userName),
    };

    await transporter.sendMail(mailOptions);
    console.log(`Password reset email sent to ${email}`);
    return true;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return false;
  }
}

/**
 * Get verification email template
 */
function getVerificationEmailTemplate(verificationUrl: string, userName?: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
        .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; font-size: 12px; color: #999; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Welcome to Friends Telecom</h1>
        </div>
        <div class="content">
            <p>Hi ${userName || 'there'},</p>
            <p>Thank you for signing up! To complete your registration and verify your email address, please click the button below:</p>
            <a href="${verificationUrl}" class="button">Verify Email Address</a>
            <p>Or copy and paste this link in your browser:</p>
            <p style="word-break: break-all; color: #667eea;">${verificationUrl}</p>
            <p>This link will expire in 24 hours.</p>
            <p>If you didn't create this account, please ignore this email.</p>
            <p>Best regards,<br>Friends Telecom Team</p>
        </div>
        <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Friends Telecom. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
  `;
}

/**
 * Get password reset email template
 */
function getPasswordResetEmailTemplate(resetUrl: string, userName?: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
        .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; font-size: 12px; color: #999; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Reset Your Password</h1>
        </div>
        <div class="content">
            <p>Hi ${userName || 'there'},</p>
            <p>We received a request to reset your password. Click the button below to create a new password:</p>
            <a href="${resetUrl}" class="button">Reset Password</a>
            <p>Or copy and paste this link in your browser:</p>
            <p style="word-break: break-all; color: #667eea;">${resetUrl}</p>
            <p>This link will expire in 1 hour.</p>
            <p>If you didn't request this password reset, please ignore this email.</p>
            <p>Best regards,<br>Friends Telecom Team</p>
        </div>
        <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Friends Telecom. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
  `;
}
