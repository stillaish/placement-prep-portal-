const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ['PDF', 'Video', 'Link', 'Template', 'Questions'], required: true },
  url: { type: String, required: true },
  topic: String,
  description: String,
  image: String
}, { timestamps: true });

module.exports = mongoose.model('Resource', resourceSchema);
