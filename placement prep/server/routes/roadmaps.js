const express = require('express');
const Roadmap = require('../models/Roadmap');
const UserRoadmap = require('../models/UserRoadmap');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

// Get all roadmaps with user progress
router.get('/', auth, async (req, res) => {
  try {
    const roadmaps = await Roadmap.find({});
    const userProgress = await UserRoadmap.find({ user: req.user._id });
    
    const combined = roadmaps.map(r => {
      const progress = userProgress.find(up => up.roadmap.toString() === r._id.toString());
      return {
        ...r.toObject(),
        progress: progress ? progress.progress : 0,
        completedMilestones: progress ? progress.completedMilestones : [],
        currentMilestone: progress ? progress.currentMilestone : 0
      };
    });
    
    res.send(combined);
  } catch (e) {
    res.status(500).send();
  }
});

// Start a roadmap
router.post('/start', auth, async (req, res) => {
  try {
    const { roadmapId } = req.body;
    let userRoadmap = await UserRoadmap.findOne({ user: req.user._id, roadmap: roadmapId });
    if (!userRoadmap) {
      userRoadmap = new UserRoadmap({ user: req.user._id, roadmap: roadmapId });
      await userRoadmap.save();
    }
    res.status(201).send(userRoadmap);
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;
