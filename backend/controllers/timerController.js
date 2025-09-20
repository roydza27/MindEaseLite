const TimerSession = require('../models/TimerSession');

// @desc    Add timer session
// @route   POST /api/timers
// @access  Private
const addTimerSession = async (req, res) => {
  try {
    const { duration, notes } = req.body;

    const timerSession = await TimerSession.create({
      userId: req.user._id,
      duration,
      notes
    });

    res.status(201).json({
      success: true,
      data: timerSession
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get timer sessions
// @route   GET /api/timers
// @access  Private
const getTimerSessions = async (req, res) => {
  try {
    const { limit = 50, page = 1, completed } = req.query;
    const skip = (page - 1) * limit;

    let query = { userId: req.user._id };
    if (completed !== undefined) {
      query.completed = completed === 'true';
    }

    const timerSessions = await TimerSession.find(query)
      .sort({ startTime: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await TimerSession.countDocuments(query);

    res.json({
      success: true,
      data: timerSessions,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update timer session
// @route   PUT /api/timers/:id
// @access  Private
const updateTimerSession = async (req, res) => {
  try {
    const { id } = req.params;
    const { completed, notes } = req.body;

    let updateData = { notes };
    
    if (completed === true) {
      updateData.completed = true;
      updateData.endTime = new Date();
    }

    const timerSession = await TimerSession.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      updateData,
      { new: true, runValidators: true }
    );

    if (!timerSession) {
      return res.status(404).json({
        success: false,
        message: 'Timer session not found'
      });
    }

    res.json({
      success: true,
      data: timerSession
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Complete timer session
// @route   PUT /api/timers/:id/complete
// @access  Private
const completeTimerSession = async (req, res) => {
  try {
    const { id } = req.params;

    const timerSession = await TimerSession.findOne({
      _id: id,
      userId: req.user._id
    });

    if (!timerSession) {
      return res.status(404).json({
        success: false,
        message: 'Timer session not found'
      });
    }

    if (timerSession.completed) {
      return res.status(400).json({
        success: false,
        message: 'Timer session already completed'
      });
    }

    await timerSession.completeSession();

    res.json({
      success: true,
      data: timerSession
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get timer statistics
// @route   GET /api/timers/stats
// @access  Private
const getTimerStats = async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const timerSessions = await TimerSession.find({
      userId: req.user._id,
      startTime: { $gte: startDate }
    });

    const completedSessions = timerSessions.filter(session => session.completed);
    const totalDuration = completedSessions.reduce((sum, session) => sum + session.duration, 0);
    const averageDuration = completedSessions.length > 0 ? totalDuration / completedSessions.length : 0;

    // Calculate completion rate
    const completionRate = timerSessions.length > 0 
      ? (completedSessions.length / timerSessions.length) * 100 
      : 0;

    // Get sessions by day of week
    const sessionsByDay = {};
    completedSessions.forEach(session => {
      const day = session.startTime.toLocaleDateString('en-US', { weekday: 'long' });
      sessionsByDay[day] = (sessionsByDay[day] || 0) + 1;
    });

    res.json({
      success: true,
      data: {
        totalSessions: timerSessions.length,
        completedSessions: completedSessions.length,
        totalDuration,
        averageDuration: Math.round(averageDuration * 100) / 100,
        completionRate: Math.round(completionRate * 100) / 100,
        sessionsByDay
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete timer session
// @route   DELETE /api/timers/:id
// @access  Private
const deleteTimerSession = async (req, res) => {
  try {
    const { id } = req.params;

    const timerSession = await TimerSession.findOneAndDelete({
      _id: id,
      userId: req.user._id
    });

    if (!timerSession) {
      return res.status(404).json({
        success: false,
        message: 'Timer session not found'
      });
    }

    res.json({
      success: true,
      message: 'Timer session deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  addTimerSession,
  getTimerSessions,
  updateTimerSession,
  completeTimerSession,
  getTimerStats,
  deleteTimerSession
};

