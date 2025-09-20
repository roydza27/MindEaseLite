const express = require('express');
const { protect } = require('../middleware/auth');
const {
  addTimerSession,
  getTimerSessions,
  updateTimerSession,
  completeTimerSession,
  getTimerStats,
  deleteTimerSession
} = require('../controllers/timerController');

const router = express.Router();

// All routes are protected
router.use(protect);

router.route('/')
  .post(addTimerSession)
  .get(getTimerSessions);

router.get('/stats', getTimerStats);

router.route('/:id')
  .put(updateTimerSession)
  .delete(deleteTimerSession);

router.put('/:id/complete', completeTimerSession);

module.exports = router;

