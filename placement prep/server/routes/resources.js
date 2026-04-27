const express = require('express');
const Resource = require('../models/Resource');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

// Get all resources
router.get('/', async (req, res) => {
  try {
    const { type, page = 1, limit = 8 } = req.query;
    let query = {};
    if (type && type !== 'All') {
      if (type === 'Resume Templates') query.type = 'Template';
      else if (type === 'Interview Questions') query.type = 'Questions';
      else if (type === 'Videos & PDFs') query.type = { $in: ['Video', 'PDF'] };
    }
    const resources = await Resource.find(query)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));
    res.send(resources);
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
