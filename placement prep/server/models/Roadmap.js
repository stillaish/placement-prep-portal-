const mongoose = require('mongoose');

const roadmapSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  tag: String,
  color: String,
  milestones: [{
    label: String,
    topics: [String],
    isLocked: { type: Boolean, default: false }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Roadmap', roadmapSchema);
