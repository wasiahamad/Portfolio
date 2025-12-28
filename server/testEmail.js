import dotenv from 'dotenv';
import { sendAdminReply } from './services/emailService.js';

dotenv.config();

console.log('📧 Testing Brevo Email Service...');
console.log('Configuration:', {
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  user: process.env.EMAIL_USER,
  from: process.env.EMAIL_FROM,
  to: process.env.ADMIN_EMAIL
});

const testData = {
  userName: 'Test User',
  userEmail: process.env.ADMIN_EMAIL,
  subject: 'Test Email from Brevo',
  message: 'This is a test email to verify Brevo SMTP is working correctly! 🎉\n\nIf you receive this, your email service is configured properly.'
};

console.log('\n📤 Sending test email...');
sendAdminReply(testData)
  .then(() => {
    console.log('✅ Test email sent successfully!');
    console.log(`Check your inbox at: ${process.env.ADMIN_EMAIL}`);
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Failed to send test email:', error.message);
    console.error('Error details:', error);
    process.exit(1);
  });
