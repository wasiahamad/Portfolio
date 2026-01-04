/**
 * Email Service using Brevo API (More reliable than SMTP)
 * Works on all hosting platforms including Railway, Render, Vercel
 */

const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

/**
 * Check if Brevo API is configured
 */
const isEmailConfigured = () => {
  const apiKey = process.env.BREVO_API_KEY;
  const hasConfig = !!apiKey && apiKey !== 'xkeysib-your-api-key' && apiKey.startsWith('xkeysib-');
  if (!hasConfig) {
    console.warn('⚠️ Brevo API not configured. Set BREVO_API_KEY in .env file.');
    console.warn('Current API key:', apiKey ? 'Set but invalid' : 'Not set');
  }
  return hasConfig;
};

/**
 * Send email using Brevo API
 */
const sendEmailViaAPI = async (emailData) => {
  const apiKey = process.env.BREVO_API_KEY;
  
  try {
    const response = await fetch(BREVO_API_URL, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': apiKey,
        'content-type': 'application/json'
      },
      body: JSON.stringify(emailData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Brevo API Error: ${error.message || response.statusText}`);
    }

    const result = await response.json();
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('❌ Brevo API Error:', error.message);
    throw error;
  }
};

/**
 * Send contact notification to admin
 */
export const sendContactNotification = async (contactData) => {
  if (!isEmailConfigured()) {
    console.log('📧 Brevo API not configured - skipping notification');
    return { success: false, message: 'Email service not configured' };
  }

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

  const emailData = {
    sender: {
      name: process.env.ADMIN_NAME || 'Portfolio',
      email: process.env.EMAIL_FROM || '9ee4b1001@smtp-brevo.com'
    },
    to: [{
      email: process.env.ADMIN_EMAIL || 'mdwasia98@gmail.com',
      name: process.env.ADMIN_NAME || 'Admin'
    }],
    subject: `🔔 New Contact Form Submission from ${contactData.name}`,
    htmlContent: `
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
          </div>
        </div>
      </div>
    `
  };

  try {
    const result = await sendEmailViaAPI(emailData);
    console.log('✅ Contact notification sent via Brevo API');
    return result;
  } catch (error) {
    console.error('❌ Failed to send contact notification:', error);
    throw error;
  }
};

/**
 * Send reply from admin to user
 */
export const sendAdminReply = async (replyData) => {
  if (!isEmailConfigured()) {
    throw new Error('Brevo API is not configured. Please set BREVO_API_KEY environment variable.');
  }

  const emailData = {
    sender: {
      name: process.env.ADMIN_NAME || 'Portfolio Admin',
      email: process.env.EMAIL_FROM || '9ee4b1001@smtp-brevo.com'
    },
    to: [{
      email: replyData.userEmail,
      name: replyData.userName
    }],
    subject: replyData.subject || 'Reply from Portfolio Admin',
    htmlContent: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333; border-bottom: 2px solid #4CAF50; padding-bottom: 10px;">
          ${replyData.subject || 'Reply from Portfolio Admin'}
        </h2>
        <div style="margin: 20px 0;">
          <p>Hi ${replyData.userName},</p>
          <div style="margin: 20px 0; line-height: 1.6;">
            ${replyData.message.replace(/\n/g, '<br>')}
          </div>
        </div>
        <hr style="border: 1px solid #eee; margin: 20px 0;" />
        <p style="color: #666; font-size: 12px;">
          Best regards,<br/>
          ${process.env.ADMIN_NAME || 'Portfolio Admin'}
        </p>
      </div>
    `
  };

  try {
    const result = await sendEmailViaAPI(emailData);
    console.log(`✅ Reply sent to ${replyData.userEmail} via Brevo API`);
    return result;
  } catch (error) {
    console.error('❌ Failed to send reply:', error);
    throw error;
  }
};

/**
 * Send auto-reply to user
 */
export const sendAutoReplyToUser = async (contactData) => {
  if (!isEmailConfigured()) {
    console.log('📧 Brevo API not configured - skipping auto-reply');
    return { success: false, message: 'Email service not configured' };
  }

  const emailData = {
    sender: {
      name: process.env.ADMIN_NAME || 'Portfolio',
      email: process.env.EMAIL_FROM || '9ee4b1001@smtp-brevo.com'
    },
    to: [{
      email: contactData.email,
      name: contactData.name
    }],
    subject: '✅ Thank you for contacting us!',
    htmlContent: `
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
              <p style="color: #666; font-size: 14px; line-height: 1.6; margin: 0; font-style: italic;">
                "${contactData.message}"
              </p>
            </div>
            
            <div style="background: #e7f3ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="color: #0066cc; font-size: 15px; line-height: 1.6; margin: 0;">
                <strong>⏱️ What's next?</strong><br/>
                I'll review your message and get back to you as soon as possible, usually within 24-48 hours.
              </p>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <p style="color: #667eea; font-size: 16px; font-weight: 600; margin: 0;">
                Best regards,<br/>
                ${process.env.ADMIN_NAME || 'Portfolio Admin'}
              </p>
            </div>
          </div>
        </div>
      </div>
    `
  };

  try {
    const result = await sendEmailViaAPI(emailData);
    console.log(`✅ Auto-reply sent to ${contactData.email} via Brevo API`);
    return result;
  } catch (error) {
    console.error('❌ Failed to send auto-reply:', error);
    throw error;
  }
};
