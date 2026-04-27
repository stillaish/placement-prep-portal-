const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

// Signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const user = new User({ name, email, password, role });
    await user.save();
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);
    user.tokens = user.tokens.concat({ token });
    await user.save();
    res.status(201).send({ user, token });
  } catch (e) {
    console.error('Signup error:', e);
    res.status(400).send(e);
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user || !(await user.comparePassword(req.body.password))) {
      return res.status(400).send({ error: 'Unable to login' });
    }
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);
    user.tokens = user.tokens.concat({ token });
    await user.save();
    res.send({ user, token });
  } catch (e) {
    console.error('Login error:', e);
    res.status(500).send();
  }
});

// Get Profile
router.get('/me', auth, async (req, res) => {
  res.send(req.user);
});

const Submission = require('../models/Submission');

// Get Stats
router.get('/stats', auth, async (req, res) => {
  try {
    const totalSolved = await Submission.countDocuments({ user: req.user._id, status: 'Solved' });
    const user = req.user;
    
    // Fetch recent activity
    const recentSubmissions = await Submission.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('question');

    const recentActivity = recentSubmissions.map(s => ({
      name: s.question.title,
      difficulty: s.question.difficulty,
      status: s.status,
      date: new Date(s.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
    }));

    // Heatmap data (last 365 days)
    const oneYearAgo = new Date();
    oneYearAgo.setDate(oneYearAgo.getDate() - 365);
    
    const activityData = await Submission.aggregate([
      { $match: { user: req.user._id, createdAt: { $gte: oneYearAgo } } },
      { $group: { 
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
      }}
    ]);

    // Recommendations
    const recommendations = [
      { tag: 'MASTERY', tagColor: 'bg-blue-50 text-blue-600', title: 'Level up your Graphs knowledge', desc: 'Solve 5 Medium BFS/DFS problems to improve your rating.', link: '/questions?topic=Graphs' },
      { tag: 'CHALLENGE', tagColor: 'bg-purple-50 text-purple-600', title: 'Bit Manipulation Sprint', desc: 'Popular topic for upcoming Amazon OA rounds.', link: '/questions?topic=Bit Manipulation' },
      { tag: 'NEW', tagColor: 'bg-orange-50 text-orange-600', title: 'Sliding Window Patterns', desc: 'Essential for optimizing O(n^2) solutions.', link: '/questions?topic=Sliding Window' }
    ];

    // If user has weak topics, prioritize them
    if (user.weakTopics && user.weakTopics.length > 0) {
        recommendations[0] = {
            tag: 'WEAK TOPIC',
            tagColor: 'bg-red-50 text-red-600',
            title: `Master ${user.weakTopics[0]}`,
            desc: `You've been struggling with ${user.weakTopics[0]}. Try these handpicked problems.`,
            link: `/questions?topic=${user.weakTopics[0]}`
        };
    }

    res.send({
      totalSolved,
      streak: user.streak,
      points: user.points,
      recentActivity,
      heatmap: activityData,
      targetCompany: user.targetCompany,
      progress: Math.min(100, Math.floor((totalSolved / 50) * 100)), // Target 50 questions
      recommendations
    });
  } catch (e) {
    console.error('Stats error:', e);
    res.status(500).send();
  }
});

// Logout from all devices
router.post('/logoutAll', auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send({ message: 'Logged out from all devices' });
  } catch (e) {
    res.status(500).send();
  }
});

// Update Password
router.post('/password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const isMatch = await req.user.comparePassword(currentPassword);
    if (!isMatch) return res.status(400).send({ error: 'Invalid current password' });
    
    req.user.password = newPassword;
    await req.user.save();
    res.send({ message: 'Password updated successfully' });
  } catch (e) {
    res.status(400).send(e);
  }
});

// Update Profile (Settings)
router.patch('/update', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'email', 'targetCompany'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) return res.status(400).send({ error: 'Invalid updates!' });

  try {
    updates.forEach((update) => req.user[update] = req.body[update]);
    await req.user.save();
    res.send(req.user);
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;
