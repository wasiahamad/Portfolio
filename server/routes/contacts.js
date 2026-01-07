import express from 'express';
import Contact from '../models/Contact.js';
import { authMiddleware } from '../middleware/auth.js';
import { sendContactNotification, sendAdminReply, sendAutoReplyToUser, sendTestEmail } from '../services/emailServiceBrevo.js';

const router = express.Router();

const withTimeout = (promise, ms, label) => {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms)
  );
  return Promise.race([promise, timeout]);
};

// Get all contacts
router.get('/', authMiddleware, async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create contact - with email notification and auto-reply
router.post('/', async (req, res) => {
  try {
    const contact = new Contact(req.body);
    await contact.save();

    // Try to send emails quickly; don't hang request forever.
    const emailTimeoutMs = parseInt(process.env.EMAIL_SEND_TIMEOUT_MS || '15000', 10);

    const adminNotify = withTimeout(
      sendContactNotification(req.body),
      emailTimeoutMs,
      'Admin notification'
    );
    const autoReply = withTimeout(
      sendAutoReplyToUser(req.body),
      emailTimeoutMs,
      'Auto-reply'
    );

    const [adminResult, autoReplyResult] = await Promise.allSettled([adminNotify, autoReply]);

    const adminEmail = adminResult.status === 'fulfilled'
      ? { status: 'sent', ...adminResult.value }
      : { status: 'failed', error: adminResult.reason?.message || String(adminResult.reason) };

    const userEmail = autoReplyResult.status === 'fulfilled'
      ? { status: 'sent', ...autoReplyResult.value }
      : { status: 'failed', error: autoReplyResult.reason?.message || String(autoReplyResult.reason) };

    res.status(201).json({
      success: true,
      message: 'Message saved successfully',
      email: {
        adminNotification: adminEmail,
        autoReply: userEmail
      }
    });
  } catch (error) {
    console.error('Error saving contact:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to send message. Please try again.' 
    });
  }
});

// Send reply email to user
router.post('/reply/:id', authMiddleware, async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    const replyData = {
      userName: contact.name,
      userEmail: contact.email,
      subject: req.body.subject,
      message: req.body.message
    };

    try {
      const result = await sendAdminReply(replyData);
      contact.replied = true;
      contact.repliedAt = new Date();
      await contact.save();
      res.json({ message: 'Reply sent successfully', ...result });
    } catch (emailError) {
      console.error('Email service error:', emailError.message);
      
      // Detailed error categorization
      const errorMessage = emailError.message || '';
      const errorCode = emailError.code || '';
      
      if (errorMessage.includes('not configured')) {
        return res.status(503).json({ 
          message: 'Email service is not configured. Please set BREVO_API_KEY and BREVO_SENDER_EMAIL (verified sender in Brevo).',
          error: 'EMAIL_NOT_CONFIGURED',
          contactEmail: contact.email
        });
      } 
      
      if (errorMessage.includes('timeout') || 
          errorCode === 'ETIMEDOUT' || 
          errorCode === 'ECONNECTION' ||
          errorCode === 'ESOCKET') {
        return res.status(503).json({ 
          message: 'Gmail SMTP connection timeout. The email server is not responding. Please check your network or try again later.',
          error: 'CONNECTION_TIMEOUT',
          contactEmail: contact.email,
          suggestion: 'You can contact the user directly via email client using: ' + contact.email
        });
      }
      
      if (errorCode === 'EAUTH' || errorMessage.includes('authentication') || errorMessage.includes('Invalid login')) {
        return res.status(503).json({ 
          message: 'Gmail authentication failed. Please check your EMAIL_USER and EMAIL_PASSWORD (must be App Password).',
          error: 'AUTH_FAILED',
          contactEmail: contact.email
        });
      }
      
      // Generic email error
      return res.status(503).json({ 
        message: 'Failed to send email: ' + errorMessage,
        error: 'EMAIL_SEND_FAILED',
        contactEmail: contact.email,
        suggestion: 'Contact the user directly at: ' + contact.email
      });
    }
  } catch (error) {
    console.error('Reply error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Admin-only: send a test email to verify production configuration
router.post('/test-email', authMiddleware, async (req, res) => {
  try {
    const toEmail = req.body?.toEmail || process.env.ADMIN_EMAIL || process.env.EMAIL_USER;
    const toName = req.body?.toName || process.env.ADMIN_NAME || 'Admin';
    const result = await sendTestEmail({ toEmail, toName });
    res.json({ message: 'Test email sent', ...result, toEmail });
  } catch (error) {
    res.status(503).json({ message: error.message || 'Failed to send test email', error: 'TEST_EMAIL_FAILED' });
  }
});

// Delete contact
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.json({ message: 'Contact deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
