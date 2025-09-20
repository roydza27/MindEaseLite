const express = require('express');
const { protect } = require('../middleware/auth');
const {
  addMoodEntry,
  getMoodEntries,
  getMoodStats,
  updateMoodEntry,
  deleteMoodEntry
} = require('../controllers/moodController');

const router = express.Router();

// All routes are protected
router.use(protect);

router.route('/')
  .post(addMoodEntry)
  .get(getMoodEntries);

router.get('/stats', getMoodStats);

router.route('/:id')
  .put(updateMoodEntry)
  .delete(deleteMoodEntry);

module.exports = router;

