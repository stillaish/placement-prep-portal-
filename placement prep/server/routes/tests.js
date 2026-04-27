const express = require('express');
const Test = require('../models/Test');
const Result = require('../models/Result');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

// Get all tests
router.get('/', auth, async (req, res) => {
  try {
    const tests = await Test.find({}).populate('questions');
    res.send(tests);
  } catch (e) {
    res.status(500).send();
  }
});

// Get single test
router.get('/:id', auth, async (req, res) => {
  try {
    const test = await Test.findById(req.params.id).populate('questions');
    if (!test) return res.status(404).send();
    res.send(test);
  } catch (e) {
    res.status(500).send();
  }
});

// Submit test result
router.post('/submit', auth, async (req, res) => {
  try {
    const { testId, score, totalQuestions, timeTaken } = req.body;
    const result = new Result({
      user: req.user._id,
      test: testId,
      score,
      totalQuestions,
      timeTaken
    });
    await result.save();
    res.status(201).send(result);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Get user results
router.get('/results', auth, async (req, res) => {
  try {
    const results = await Result.find({ user: req.user._id }).populate('test');
    res.send(results);
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
