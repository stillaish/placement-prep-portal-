const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'admin'], default: 'student' },
  streak: { type: Number, default: 0 },
  lastActive: { type: Date, default: Date.now },
  targetCompany: { type: String, default: 'Amazon' },
  solvedQuestions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
  weakTopics: [String],
  points: { type: Number, default: 0 },
  tokens: [{
    token: { type: String, required: true }
  }]
}, { timestamps: true });

userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
