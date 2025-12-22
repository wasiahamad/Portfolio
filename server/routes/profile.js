import express from 'express';
import Profile from '../models/Profile.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Get Profile
router.get('/', async (req, res) => {
  try {
    let profile = await Profile.findOne();
    
    // If no profile exists, create one with defaults
    if (!profile) {
      profile = new Profile({
        name: 'Your Name',
        title: 'Full Stack Developer',
        bio: "I'm a passionate developer who loves bridging the gap between design and engineering. With a keen eye for detail and a drive for perfection, I create software that not only works flawlessly but feels amazing to use.",
        bio2: "My journey began with a curiosity for how things work on the web, which quickly turned into a career building complex applications for clients around the globe. I believe in writing clean, accessible code and designing intuitive user interfaces.",
        skills: {
          frontend: 'React, TS, Tailwind',
          design: 'Figma, Motion, UI/UX',
          backend: 'Node, DBs, API',
          optimization: 'SEO, Performance'
        }
      });
      await profile.save();
    }
    
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create/Update Profile
router.post('/', authMiddleware, async (req, res) => {
  try {
    const profile = await Profile.findOne();
    
    if (profile) {
      Object.assign(profile, req.body);
      await profile.save();
    } else {
      const newProfile = new Profile(req.body);
      await newProfile.save();
    }

    const updatedProfile = await Profile.findOne();
    res.json(updatedProfile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT endpoint for compatibility with client
router.put('/', authMiddleware, async (req, res) => {
  try {
    const profile = await Profile.findOne();
    
    if (profile) {
      Object.assign(profile, req.body);
      await profile.save();
    } else {
      const newProfile = new Profile(req.body);
      await newProfile.save();
    }

    const updatedProfile = await Profile.findOne();
    res.json(updatedProfile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
