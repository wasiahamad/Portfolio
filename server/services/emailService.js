/**
 * Email Service Module
 * 
 * Handles all email-related functionality for the portfolio application.
 * Uses Nodemailer with Gmail SMTP for sending emails.
 * 
 * Features:
 * - Send contact form notifications to admin
 * - Send automatic confirmation to visitors
 * - Send manual replies from admin to users
 * 
 * Configuration:
 * - EMAIL_USER: Gmail email address
 * - EMAIL_PASSWORD: Gmail App Password (NOT regular password)
 * - ADMIN_EMAIL: Email to receive contact notifications
 * - ADMIN_NAME: Name to display in auto-reply emails
 * 
 * @see EMAIL_SETUP.md for configuration instructions
 */

import nodemailer from 'nodemailer';

/**
 * Create and configure email transporter
 * Uses Gmail SMTP with credentials from environment variables
 * 
 * @returns {nodemailer.Transporter} Configured email transporter
 */
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'your-email@gmail.com',
      pass: process.env.EMAIL_PASSWORD || 'your-app-password'
    }
  });
};

// Send contact form notification to admin
export const sendContactNotification = async (contactData) => {
  const transporter = createTransporter();
  
  // Get current date and time
  const submittedAt = new Date().toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short'
  });
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
    subject: `🔔 New Contact Form Submission from ${contactData.name}`,
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 20px;">
        <div style="background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
            <h2 style="color: white; margin: 0; font-size: 24px; font-weight: 600;">
              📬 New Contact Form Submission
            </h2>
          </div>
          
          <div style="padding: 30px;">
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="margin: 0 0 15px 0; color: #333; font-size: 18px;">Contact Details</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px 0; color: #666; font-weight: 600; width: 120px;">👤 Name:</td>
                  <td style="padding: 10px 0; color: #333;">${contactData.name}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #666; font-weight: 600;">📧 Email:</td>
                  <td style="padding: 10px 0;">
                    <a href="mailto:${contactData.email}" style="color: #667eea; text-decoration: none;">${contactData.email}</a>
                  </td>
                </tr>
                ${contactData.phone ? `
                <tr>
                  <td style="padding: 10px 0; color: #666; font-weight: 600;">📱 Phone:</td>
                  <td style="padding: 10px 0; color: #333;">${contactData.phone}</td>
                </tr>
                ` : ''}
                <tr>
                  <td style="padding: 10px 0; color: #666; font-weight: 600;">📅 Submitted:</td>
                  <td style="padding: 10px 0; color: #333;">${submittedAt}</td>
                </tr>
              </table>
            </div>
            
            <div style="background: #fff; border-left: 4px solid #667eea; padding: 20px; border-radius: 8px;">
              <h3 style="margin: 0 0 15px 0; color: #333; font-size: 18px;">💬 Message</h3>
              <p style="color: #555; line-height: 1.8; margin: 0; white-space: pre-wrap;">${contactData.message}</p>
            </div>
            
            <div style="margin-top: 20px; padding: 15px; background: #e7f3ff; border-radius: 8px; text-align: center;">
              <p style="margin: 0; color: #0066cc; font-size: 14px;">
                💡 <strong>Quick Tip:</strong> Reply directly to this email or use the admin panel to respond.
              </p>
            </div>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e0e0e0;">
            <p style="color: #999; font-size: 12px; margin: 0;">
              This email was automatically sent from your portfolio contact form
            </p>
          </div>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ Contact notification email sent to admin');
    return { success: true };
  } catch (error) {
    console.error('❌ Error sending contact notification:', error);
    throw error;
  }
};

// Send reply email from admin to user
export const sendAdminReply = async (replyData) => {
  const transporter = createTransporter();
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: replyData.userEmail,
    subject: replyData.subject || 'Reply from Portfolio Admin',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333; border-bottom: 2px solid #4CAF50; padding-bottom: 10px;">
          ${replyData.subject || 'Reply from Portfolio Admin'}
        </h2>
        <div style="margin: 20px 0;">
          <p>Hi ${replyData.userName},</p>
          <div style="margin: 20px 0; line-height: 1.6;">
            ${replyData.message}
          </div>
        </div>
        <hr style="border: 1px solid #eee; margin: 20px 0;" />
        <p style="color: #666; font-size: 12px;">
          Best regards,<br/>
          Portfolio Admin
        </p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Reply email sent to ${replyData.userEmail}`);
    return { success: true };
  } catch (error) {
    console.error('❌ Error sending reply email:', error);
    throw error;
  }
};

// Send automatic confirmation email to user
export const sendAutoReplyToUser = async (contactData) => {
  const transporter = createTransporter();
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: contactData.email,
    subject: '✅ Thank you for contacting us!',
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 20px;">
        <div style="background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
            <h2 style="color: white; margin: 0; font-size: 24px; font-weight: 600;">
              ✨ Message Received!
            </h2>
          </div>
          
          <div style="padding: 30px;">
            <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
              Hi <strong>${contactData.name}</strong>,
            </p>
            
            <p style="color: #555; font-size: 15px; line-height: 1.8; margin: 0 0 20px 0;">
              Thank you for reaching out! I've received your message and I'm excited to connect with you.
            </p>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea; margin: 20px 0;">
              <p style="color: #333; font-size: 14px; margin: 0 0 10px 0; font-weight: 600;">
                📝 Your message:
              </p>
              <p style="color: #666; font-size: 14px; line-height: 1.6; margin: 0; font-style: italic; white-space: pre-wrap;">
                "${contactData.message}"
              </p>
            </div>
            
            <div style="background: #e7f3ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="color: #0066cc; font-size: 15px; line-height: 1.6; margin: 0;">
                <strong>⏱️ What's next?</strong><br/>
                I'll review your message and get back to you as soon as possible, usually within 24-48 hours.
              </p>
            </div>
            
            <p style="color: #555; font-size: 15px; line-height: 1.8; margin: 20px 0 0 0;">
              In the meantime, feel free to check out my latest projects and blog posts on my portfolio.
            </p>
            
            <div style="text-align: center; margin-top: 30px;">
              <p style="color: #333; font-size: 15px; margin: 0 0 10px 0;">
                Looking forward to connecting with you!
              </p>
              <p style="color: #667eea; font-size: 16px; font-weight: 600; margin: 0;">
                Best regards,<br/>
                ${process.env.ADMIN_NAME || 'Portfolio Admin'}
              </p>
            </div>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e0e0e0;">
            <p style="color: #999; font-size: 12px; margin: 0;">
              This is an automated confirmation email. Please do not reply to this email.
            </p>
          </div>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Auto-reply confirmation sent to ${contactData.email}`);
    return { success: true };
  } catch (error) {
    console.error('❌ Error sending auto-reply:', error);
    throw error;
  }
};
