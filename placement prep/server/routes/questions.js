const express = require('express');
const Question = require('../models/Question');
const auth = require('../middleware/authMiddleware');
const admin = require('../middleware/roleMiddleware');
const router = express.Router();

// Get all questions with filters and search
router.get('/', async (req, res) => {
  try {
    const { company, search, topic, difficulty, page = 1, limit = 10 } = req.query;
    let query = {};

    if (company) query.companies = company;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { companies: { $regex: search, $options: 'i' } },
        { topic: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }

    if (topic) query.topic = topic;
    if (difficulty) query.difficulty = { $in: difficulty.split(',') };

    const questions = await Question.find(query)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));
    
    const total = await Question.countDocuments(query);
    
    res.send({ questions, total });
  } catch (e) {
    res.status(500).send();
  }
});

// Get single question
router.get('/:id', async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).send();
    res.send(question);
  } catch (e) {
    res.status(500).send();
  }
});

// Create question (Admin only)
router.post('/', auth, admin, async (req, res) => {
  try {
    const question = new Question(req.body);
    await question.save();
    res.status(201).send(question);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Update question (Admin only)
router.patch('/:id', auth, admin, async (req, res) => {
  try {
    const question = await Question.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!question) return res.status(404).send();
    res.send(question);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Delete question (Admin only)
router.delete('/:id', auth, admin, async (req, res) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.id);
    if (!question) return res.status(404).send();
    res.send(question);
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
