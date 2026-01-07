import React, { useState, useEffect } from 'react';
import axios from '../lib/axios';
import AdminLayout from '../components/AdminLayout';

const ContactsContent = () => {
  const [contacts, setContacts] = useState([]);
  const [replyModal, setReplyModal] = useState({ show: false, contact: null });
  const [replyData, setReplyData] = useState({ subject: '', message: '' });

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await axios.get('/contacts');
      setContacts(response.data);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  };

  const handleReply = (contact) => {
    setReplyModal({ show: true, contact });
    setReplyData({
      subject: `Re: Your message from ${contact.name}`,
      message: ''
    });
  };

  const sendReply = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `/contacts/reply/${replyModal.contact._id}`,
        replyData,
        { timeout: 30000 } // 30 second timeout
      );
      alert('Reply sent successfully!');
      setReplyModal({ show: false, contact: null });
      setReplyData({ subject: '', message: '' });
      fetchContacts();
    } catch (error) {
      console.error('Error sending reply:', error);
      if (error.response) {
        const errorData = error.response.data;
        
        // Show user-friendly error messages with copy-to-clipboard option
        if (errorData.error === 'EMAIL_NOT_CONFIGURED') {
          const message = `⚠️ Email Service Not Configured\n\n${errorData.message}\n\n📧 User's Email:\n${replyModal.contact.email}\n\nClick OK to copy the email address.`;
          if (confirm(message)) {
            navigator.clipboard.writeText(replyModal.contact.email);
            alert('Email address copied to clipboard!');
          }
        } else if (errorData.error === 'CONNECTION_TIMEOUT') {
          const message = `⏱️ ${errorData.message}\n\n📧 User's Email: ${replyModal.contact.email}\n\n💡 Suggestion: ${errorData.suggestion || 'Use your regular email client to send the reply'}\n\nClick OK to copy the email address.`;
          if (confirm(message)) {
            navigator.clipboard.writeText(replyModal.contact.email);
            alert('Email address copied to clipboard!');
          }
        } else if (errorData.error === 'AUTH_FAILED') {
          alert(`🔐 ${errorData.message}\n\n📧 User's Email: ${errorData.contactEmail}\n\nPlease update your Gmail App Password in the server environment variables.`);
        } else if (errorData.contactEmail) {
          const message = `❌ ${errorData.message}\n\n${errorData.suggestion || 'Contact: ' + errorData.contactEmail}\n\nClick OK to copy the email address.`;
          if (confirm(message)) {
            navigator.clipboard.writeText(errorData.contactEmail);
            alert('Email address copied to clipboard!');
          }
        } else {
          alert(`Failed to send reply: ${errorData.message || 'Server error'}`);
        }
      } else if (error.request) {
        const message = `Failed to send reply: No response from server.\n\n📧 User's Email: ${replyModal.contact.email}\n\nClick OK to copy the email address.`;
        if (confirm(message)) {
          navigator.clipboard.writeText(replyModal.contact.email);
          alert('Email address copied to clipboard!');
        }
      } else {
        alert('Failed to send reply: ' + error.message);
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await axios.delete(`/contacts/${id}`);
        fetchContacts();
      } catch (error) {
        console.error('Error deleting contact:', error);
      }
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Contact Messages</h1>
      
      <div className="space-y-4">
        {contacts.map((contact) => (
          <div key={contact._id} className="bg-white p-6 rounded-lg shadow">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <span>{contact.name}</span>
                  {contact.replied && (
                    <span className="inline-flex items-center text-xs font-semibold px-2 py-1 rounded bg-green-100 text-green-700">
                      ✓ Replied
                    </span>
                  )}
                </h3>
                <p className="text-gray-600 break-all">{contact.email}</p>
                {contact.phone && <p className="text-gray-600">{contact.phone}</p>}
                <p className="text-gray-700 mt-3 whitespace-pre-wrap break-words">{contact.message}</p>
                <p className="text-sm text-gray-400 mt-2">
                  {new Date(contact.createdAt).toLocaleString()}
                </p>
                {contact.repliedAt && (
                  <p className="text-sm text-green-700 mt-1">
                    Replied at: {new Date(contact.repliedAt).toLocaleString()}
                  </p>
                )}
              </div>
              <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row gap-2 w-full sm:w-auto">
                <button
                  onClick={() => handleReply(contact)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full sm:w-auto"
                >
                  {contact.replied ? 'Reply Again' : 'Reply'}
                </button>
                <button
                  onClick={() => handleDelete(contact._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 w-full sm:w-auto"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
        {contacts.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            No contact messages yet
          </div>
        )}
      </div>

      {/* Reply Modal */}
      {replyModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 md:p-8 rounded-lg shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Reply to {replyModal.contact.name}</h2>
            <form onSubmit={sendReply}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">To:</label>
                <input
                  type="text"
                  value={replyModal.contact.email}
                  disabled
                  className="w-full p-3 border rounded bg-gray-100"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Subject</label>
                <input
                  type="text"
                  className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={replyData.subject}
                  onChange={(e) => setReplyData({ ...replyData, subject: e.target.value })}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Message</label>
                <textarea
                  className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="6"
                  value={replyData.message}
                  onChange={(e) => setReplyData({ ...replyData, message: e.target.value })}
                  required
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition w-full sm:w-auto"
                >
                  Send Reply
                </button>
                <button
                  type="button"
                  onClick={() => setReplyModal({ show: false, contact: null })}
                  className="bg-gray-600 text-white px-6 py-3 rounded hover:bg-gray-700 transition w-full sm:w-auto"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactsContent;
