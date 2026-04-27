const express = require('express');
const Planner = require('../models/Planner');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

// Get planner items
router.get('/', auth, async (req, res) => {
  try {
    const items = await Planner.find({ user: req.user._id }).sort({ date: 1 });
    res.send(items);
  } catch (e) {
    res.status(500).send();
  }
});

// Add planner item
router.post('/', auth, async (req, res) => {
  try {
    const item = new Planner({ ...req.body, user: req.user._id });
    await item.save();
    res.status(201).send(item);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Update item (e.g. toggle completion)
router.patch('/:id', auth, async (req, res) => {
  try {
    const item = await Planner.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );
    if (!item) return res.status(404).send();
    res.send(item);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Delete item
router.delete('/:id', auth, async (req, res) => {
  try {
    const item = await Planner.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!item) return res.status(404).send();
    res.send(item);
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
