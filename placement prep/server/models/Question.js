const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
  companies: [String],
  topic: { type: String, required: true },
  tags: [String],
  approach: String,
  example: String, // String representation from design
  examples: [{ 
    input: String,
    output: String,
    explanation: String
  }],
  constraints: [String],
  solution: {
    code: String,
    language: { type: String, default: 'cpp' }
  },
  acceptanceRate: { type: Number, default: 0 },
  frequency: { type: Number, default: 0 },
  company: String // Match seed.js
}, { timestamps: true });

module.exports = mongoose.model('Question', questionSchema);
