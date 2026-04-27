const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
  folder: { type: String, default: 'General' },
  tags: [String]
}, { timestamps: true });

module.exports = mongoose.model('Bookmark', bookmarkSchema);
