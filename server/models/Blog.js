import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  excerpt: {
    type: String,
    default: '',
  },
  category: {
    type: String,
    default: 'General',
  },
  readTime: {
    type: String,
    default: '',
  },
  content: {
    type: String,
    required: true,
  },
  image: String,
  tags: {
    type: [String],
    default: [],
  },
  published: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

export default mongoose.model('Blog', blogSchema);
