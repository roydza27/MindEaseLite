const mongoose = require('mongoose');

const timerSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  duration: {
    type: Number,
    required: [true, 'Duration is required'],
    min: [1, 'Duration must be at least 1 minute']
  },
  completed: {
    type: Boolean,
    default: false
  },
  startTime: {
    type: Date,
    required: [true, 'Start time is required'],
    default: Date.now
  },
  endTime: {
    type: Date,
    validate: {
      validator: function(value) {
        return !value || value >= this.startTime;
      },
      message: 'End time must be after start time'
    }
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
timerSessionSchema.index({ userId: 1, startTime: -1 });

// Virtual for actual duration
timerSessionSchema.virtual('actualDuration').get(function() {
  if (this.endTime && this.startTime) {
    return Math.round((this.endTime - this.startTime) / (1000 * 60)); // in minutes
  }
  return null;
});

// Method to complete session
timerSessionSchema.methods.completeSession = function() {
  this.completed = true;
  this.endTime = new Date();
  return this.save();
};

module.exports = mongoose.model('TimerSession', timerSessionSchema);

