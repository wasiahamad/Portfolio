import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    default: 'Your Name'
  },
  title: {
    type: String,
    default: 'Full Stack Developer'
  },
  bio: {
    type: String,
    required: true,
    default: "I'm a passionate developer who loves bridging the gap between design and engineering."
  },
  bio2: {
    type: String,
    default: "My journey began with a curiosity for how things work on the web."
  },
  email: String,
  phone: String,
  location: {
    type: String,
    default: 'San Francisco, CA'
  },
  // Skills arrays matching About section
  skills: {
    frontend: {
      type: String,
      default: 'React, TS, Tailwind'
    },
    design: {
      type: String,
      default: 'Figma, Motion, UI/UX'
    },
    backend: {
      type: String,
      default: 'Node, DBs, API'
    },
    optimization: {
      type: String,
      default: 'SEO, Performance'
    }
  },
  // Social links
  github: {
    type: String,
    default: 'https://github.com'
  },
  linkedin: {
    type: String,
    default: 'https://linkedin.com'
  },
  twitter: {
    type: String,
    default: 'https://twitter.com'
  },
  website: String,
  // CV file
  cvUrl: String,
  // Profile image
  image: String,
}, {
  timestamps: true,
});

export default mongoose.model('Profile', profileSchema);
