const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');

router.post('/assist', auth, async (req, res) => {
  const { questionId, type } = req.body; // type: 'hint', 'explain', 'approach'
  
  // For now, returning mock responses. In a real app, this would call Gemini API.
  const responses = {
    hint: "Think about how you can use a hash map to store frequencies of elements.",
    explain: "This problem asks you to find the longest substring without repeating characters. You can use a sliding window approach.",
    approach: "1. Initialize a start pointer. 2. Iterate through the string with an end pointer. 3. If a character is repeated, move the start pointer."
  };

  res.send({ response: responses[type] || responses['hint'] });
});

module.exports = router;
