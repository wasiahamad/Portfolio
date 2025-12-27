import express from 'express';
import { upload } from '../config/cloudinary.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Upload single image
router.post('/image', authMiddleware, (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      console.error('Multer/Cloudinary error:', err);
      return res.status(500).json({ 
        message: 'Failed to upload image', 
        error: err.message 
      });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Return the Cloudinary URL
    res.json({
      success: true,
      url: req.file.path,
      publicId: req.file.filename
    });
  });
});

export default router;
