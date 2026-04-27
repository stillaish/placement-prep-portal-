const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
  title: { type: String, required: true },
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
  duration: { type: Number, required: true }, // in minutes
  totalMarks: { type: Number, required: true },
  description: String
}, { timestamps: true });

module.exports = mongoose.model('Test', testSchema);
