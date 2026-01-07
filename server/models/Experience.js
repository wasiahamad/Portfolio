import mongoose from 'mongoose';

const experienceSchema = new mongoose.Schema({
  // New (client-facing) fields
  role: {
    type: String,
  },
  company: {
    type: String,
    required: true,
  },
  period: {
    type: String,
    default: '',
  },
  skills: {
    type: [String],
    default: [],
  },
  order: {
    type: Number,
    default: 0,
  },

  // Legacy/admin fields (kept for compatibility)
  position: {
    type: String,
  },
  duration: {
    type: String,
    default: '',
  },
  location: {
    type: String,
    default: '',
  },
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
  current: {
    type: Boolean,
    default: false,
  },
  technologies: {
    type: [String],
    default: [],
  },
  description: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

// Basic normalization on save: ensure role/period/skills populated from legacy fields
experienceSchema.pre('save', function (next) {
  if (!this.role && this.position) this.role = this.position;
  if (!this.position && this.role) this.position = this.role;
  if (!this.period && this.duration) this.period = this.duration;
  if (!this.duration && this.period) this.duration = this.period;
  if ((!this.skills || this.skills.length === 0) && Array.isArray(this.technologies) && this.technologies.length > 0) {
    this.skills = this.technologies;
  }
  if ((!this.technologies || this.technologies.length === 0) && Array.isArray(this.skills) && this.skills.length > 0) {
    this.technologies = this.skills;
  }
  next();
});

export default mongoose.model('Experience', experienceSchema);
