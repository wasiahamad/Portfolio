import express from 'express';
import Contact from '../models/Contact.js';
import { authMiddleware } from '../middleware/auth.js';
import { sendContactNotification, sendAdminReply, sendAutoReplyToUser } from '../services/emailService.js';

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
    sendContactNotification(req.body).catch(error => {
      console.error('Email notification to admin failed:', error);
    });
    
    // Send auto-reply to user (don't block response)
    sendAutoReplyToUser(req.body).catch(error => {
      console.error('Auto-reply to user failed:', error);
    });
    
    res.status(201).json({ 
      success: true,
      message: 'Message sent successfully! Check your email for confirmation.' 
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
      await sendAdminReply(replyData);
      res.json({ message: 'Reply sent successfully' });
    } catch (emailError) {
      console.error('Email service error:', emailError.message);
      
      // Check if it's a configuration error or connection error
      if (emailError.message.includes('not configured')) {
        res.status(503).json({ 
          message: 'Email service is not configured. Please configure EMAIL_USER and EMAIL_PASSWORD in your environment variables.',
          error: 'EMAIL_NOT_CONFIGURED'
        });
      } else if (emailError.message.includes('timeout') || emailError.code === 'ETIMEDOUT' || emailError.code === 'ECONNECTION') {
        res.status(503).json({ 
          message: 'Email server connection timeout. Please check your email configuration or try again later.',
          error: 'CONNECTION_TIMEOUT'
        });
      } else {
        res.status(503).json({ 
          message: 'Failed to send email. Please try again later or contact the user directly at: ' + contact.email,
          error: 'EMAIL_SEND_FAILED',
          contactEmail: contact.email
        });
      }
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
