const express = require('express');
const Bookmark = require('../models/Bookmark');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

// Toggle bookmark
router.post('/toggle', auth, async (req, res) => {
  try {
    const { questionId } = req.body;
    const existing = await Bookmark.findOne({ user: req.user._id, question: questionId });
    
    if (existing) {
      await Bookmark.findByIdAndDelete(existing._id);
      return res.send({ bookmarked: false });
    }
    
    const bookmark = new Bookmark({ user: req.user._id, question: questionId });
    await bookmark.save();
    res.status(201).send({ bookmarked: true });
  } catch (e) {
    res.status(400).send(e);
  }
});

// Get user bookmarks
router.get('/', auth, async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({ user: req.user._id }).populate('question');
    res.send(bookmarks);
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
