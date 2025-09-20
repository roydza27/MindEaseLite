const mongoose = require('mongoose');

const moodEntrySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  mood: {
    type: Number,
    required: [true, 'Mood rating is required'],
    min: [1, 'Mood rating must be at least 1'],
    max: [5, 'Mood rating cannot exceed 5']
  },
  stress: {
    type: Number,
    required: [true, 'Stress rating is required'],
    min: [1, 'Stress rating must be at least 1'],
    max: [5, 'Stress rating cannot exceed 5']
  },
  anxiety: {
    type: Number,
    required: [true, 'Anxiety rating is required'],
    min: [1, 'Anxiety rating must be at least 1'],
    max: [5, 'Anxiety rating cannot exceed 5']
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot exceed 500 characters'],
    trim: true
  }
}, {
  timestamps: true
});

// Index for efficient queries
moodEntrySchema.index({ userId: 1, createdAt: -1 });

// Virtual for average mood score
moodEntrySchema.virtual('averageScore').get(function() {
  return (this.mood + this.stress + this.anxiety) / 3;
});

module.exports = mongoose.model('MoodEntry', moodEntrySchema);

