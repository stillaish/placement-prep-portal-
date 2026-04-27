const express = require('express');
const Note = require('../models/Note');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

// Add or update note
router.post('/', auth, async (req, res) => {
  try {
    const { questionId, content } = req.body;
    let note = await Note.findOne({ user: req.user._id, question: questionId });
    
    if (note) {
      note.content = content;
      await note.save();
    } else {
      note = new Note({ user: req.user._id, question: questionId, content });
      await note.save();
    }
    res.send(note);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Get notes for a question
router.get('/:questionId', auth, async (req, res) => {
  try {
    const note = await Note.findOne({ user: req.user._id, question: req.params.questionId });
    res.send(note || { content: '' });
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
