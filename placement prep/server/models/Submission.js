const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
  status: { type: String, enum: ['Solved', 'Attempted'], default: 'Solved' },
  language: { type: String, default: 'cpp' },
  code: String
}, { timestamps: true });

module.exports = mongoose.model('Submission', submissionSchema);
