import express from 'express';
import Project from '../models/Project.js';
import { authMiddleware } from '../middleware/auth.js';
import { upload } from '../config/cloudinary.js';

const router = express.Router();

// Get all projects
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single project
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create project
router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const projectData = {
      ...req.body,
      technologies: req.body.technologies ? JSON.parse(req.body.technologies) : []
    };
    
    // Add image URL if file was uploaded
    if (req.file) {
      projectData.image = req.file.path; // Cloudinary URL
    }
    
    const project = new Project(projectData);
    await project.save();
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update project
router.put('/:id', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const updateData = {
      ...req.body,
      technologies: req.body.technologies ? 
        (typeof req.body.technologies === 'string' ? JSON.parse(req.body.technologies) : req.body.technologies) 
        : []
    };
    
    // Add new image URL if file was uploaded
    if (req.file) {
      updateData.image = req.file.path; // Cloudinary URL
    }
    
    const project = await Project.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete project
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json({ message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
