import express from 'express';
import { upload } from '../config/cloudinary.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Upload single image
router.post('/image', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Return the Cloudinary URL
    res.json({
      success: true,
      url: req.file.path,
      publicId: req.file.filename
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Failed to upload image', error: error.message });
  }
});

export default router;
