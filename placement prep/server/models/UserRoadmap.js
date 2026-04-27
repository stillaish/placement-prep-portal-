const mongoose = require('mongoose');

const userRoadmapSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  roadmap: { type: mongoose.Schema.Types.ObjectId, ref: 'Roadmap', required: true },
  completedMilestones: [Number], // indices
  currentMilestone: { type: Number, default: 0 },
  progress: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('UserRoadmap', userRoadmapSchema);
