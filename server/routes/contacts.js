import express from 'express';
import Contact from '../models/Contact.js';
import { authMiddleware } from '../middleware/auth.js';
import { sendContactNotification, sendAdminReply, sendAutoReplyToUser } from '../services/emailServiceBrevo.js';

const router = express.Router();

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
    
    // Send email notification to admin (don't block response)
    const adminNotifyPromise = sendContactNotification(req.body).catch(error => {
      console.error('Email notification to admin failed:', error);
      return { success: false, error: error.message };
    });
    
    // Send auto-reply to user (don't block response)
    const autoReplyPromise = sendAutoReplyToUser(req.body).catch(error => {
      console.error('Auto-reply to user failed:', error);
      return { success: false, error: error.message };
    });

    // Fire-and-forget, but attach handlers so Node doesn't treat as unhandled.
    void adminNotifyPromise;
    void autoReplyPromise;
    
    res.status(201).json({ 
      success: true,
      message: 'Message sent successfully!',
      email: {
        adminNotification: 'queued',
        autoReply: 'queued'
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
      res.json({ message: 'Reply sent successfully', ...result });
    } catch (emailError) {
      console.error('Email service error:', emailError.message);
      
      // Detailed error categorization
      const errorMessage = emailError.message || '';
      const errorCode = emailError.code || '';
      
      if (errorMessage.includes('not configured')) {
        return res.status(503).json({ 
          message: 'Email service is not configured. Please set BREVO_API_KEY and EMAIL_FROM (or EMAIL_USER).',
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
