import express from 'express';
import Blog from '../models/Blog.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

const estimateReadTime = (content) => {
  const words = (content || '').trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
};

const normalizeBlog = (blogDoc) => {
  const blog = blogDoc?.toObject ? blogDoc.toObject() : blogDoc;
  const content = blog?.content || '';

  return {
    ...blog,
    excerpt: blog?.excerpt || content.slice(0, 180),
    category: blog?.category || 'General',
    readTime: blog?.readTime || estimateReadTime(content),
    tags: Array.isArray(blog?.tags) ? blog.tags : [],
    published: blog?.published !== false,
  };
};

// Get all blogs
router.get('/', async (req, res) => {
  try {
    const { published } = req.query;
    const filter = {};
    if (published === 'true') {
      filter.published = true;
    }

    const blogs = await Blog.find(filter).sort({ createdAt: -1 });
    res.json(blogs.map(normalizeBlog));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single blog
router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.json(normalizeBlog(blog));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create blog
router.post('/', authMiddleware, async (req, res) => {
  try {
    const blog = new Blog(req.body);
    await blog.save();
    res.status(201).json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update blog
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete blog
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.json({ message: 'Blog deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
