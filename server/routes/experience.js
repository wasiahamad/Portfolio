import express from 'express';
import Experience from '../models/Experience.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

const normalizeExperience = (doc) => {
  const exp = doc?.toObject ? doc.toObject() : doc;
  return {
    ...exp,
    role: exp?.role || exp?.position || '',
    period: exp?.period || exp?.duration || '',
    skills: Array.isArray(exp?.skills) && exp.skills.length > 0
      ? exp.skills
      : Array.isArray(exp?.technologies)
        ? exp.technologies
        : [],
    order: typeof exp?.order === 'number' ? exp.order : 0,
  };
};

// Get all experiences
router.get('/', async (req, res) => {
  try {
    const experiences = await Experience.find().sort({ order: 1, createdAt: -1 });
    res.json(experiences.map(normalizeExperience));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create experience
router.post('/', authMiddleware, async (req, res) => {
  try {
    const experience = new Experience(req.body);
    await experience.save();
    res.status(201).json(normalizeExperience(experience));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update experience
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const experience = await Experience.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!experience) {
      return res.status(404).json({ message: 'Experience not found' });
    }
    res.json(normalizeExperience(experience));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete experience
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const experience = await Experience.findByIdAndDelete(req.params.id);
    if (!experience) {
      return res.status(404).json({ message: 'Experience not found' });
    }
    res.json({ message: 'Experience deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
