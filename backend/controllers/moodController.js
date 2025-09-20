const MoodEntry = require('../models/MoodEntry');

// @desc    Add mood entry
// @route   POST /api/moods
// @access  Private
const addMoodEntry = async (req, res) => {
  try {
    const { mood, stress, anxiety, notes } = req.body;

    const moodEntry = await MoodEntry.create({
      userId: req.user._id,
      mood,
      stress,
      anxiety,
      notes
    });

    res.status(201).json({
      success: true,
      data: moodEntry
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get mood entries
// @route   GET /api/moods
// @access  Private
const getMoodEntries = async (req, res) => {
  try {
    const { limit = 30, page = 1 } = req.query;
    const skip = (page - 1) * limit;

    const moodEntries = await MoodEntry.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await MoodEntry.countDocuments({ userId: req.user._id });

    res.json({
      success: true,
      data: moodEntries,
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

// @desc    Get mood statistics
// @route   GET /api/moods/stats
// @access  Private
const getMoodStats = async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const moodEntries = await MoodEntry.find({
      userId: req.user._id,
      createdAt: { $gte: startDate }
    }).sort({ createdAt: -1 });

    if (moodEntries.length === 0) {
      return res.json({
        success: true,
        data: {
          averageMood: 0,
          averageStress: 0,
          averageAnxiety: 0,
          totalEntries: 0,
          trend: 'no_data'
        }
      });
    }

    const totalMood = moodEntries.reduce((sum, entry) => sum + entry.mood, 0);
    const totalStress = moodEntries.reduce((sum, entry) => sum + entry.stress, 0);
    const totalAnxiety = moodEntries.reduce((sum, entry) => sum + entry.anxiety, 0);

    const averageMood = (totalMood / moodEntries.length).toFixed(2);
    const averageStress = (totalStress / moodEntries.length).toFixed(2);
    const averageAnxiety = (totalAnxiety / moodEntries.length).toFixed(2);

    // Calculate trend (comparing first half vs second half)
    const midPoint = Math.floor(moodEntries.length / 2);
    const firstHalf = moodEntries.slice(0, midPoint);
    const secondHalf = moodEntries.slice(midPoint);

    const firstHalfAvg = firstHalf.reduce((sum, entry) => sum + entry.mood, 0) / firstHalf.length;
    const secondHalfAvg = secondHalf.reduce((sum, entry) => sum + entry.mood, 0) / secondHalf.length;

    let trend = 'stable';
    if (secondHalfAvg > firstHalfAvg + 0.5) trend = 'improving';
    else if (secondHalfAvg < firstHalfAvg - 0.5) trend = 'declining';

    res.json({
      success: true,
      data: {
        averageMood: parseFloat(averageMood),
        averageStress: parseFloat(averageStress),
        averageAnxiety: parseFloat(averageAnxiety),
        totalEntries: moodEntries.length,
        trend
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update mood entry
// @route   PUT /api/moods/:id
// @access  Private
const updateMoodEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const { mood, stress, anxiety, notes } = req.body;

    const moodEntry = await MoodEntry.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      { mood, stress, anxiety, notes },
      { new: true, runValidators: true }
    );

    if (!moodEntry) {
      return res.status(404).json({
        success: false,
        message: 'Mood entry not found'
      });
    }

    res.json({
      success: true,
      data: moodEntry
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete mood entry
// @route   DELETE /api/moods/:id
// @access  Private
const deleteMoodEntry = async (req, res) => {
  try {
    const { id } = req.params;

    const moodEntry = await MoodEntry.findOneAndDelete({
      _id: id,
      userId: req.user._id
    });

    if (!moodEntry) {
      return res.status(404).json({
        success: false,
        message: 'Mood entry not found'
      });
    }

    res.json({
      success: true,
      message: 'Mood entry deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  addMoodEntry,
  getMoodEntries,
  getMoodStats,
  updateMoodEntry,
  deleteMoodEntry
};

