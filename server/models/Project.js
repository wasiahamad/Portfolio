import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: String,
  technologies: [String],
  github: String,
  liveUrl: String,
}, {
  timestamps: true,
});

export default mongoose.model('Project', projectSchema);
