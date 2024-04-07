const mongoose = require('mongoose');

const distributionSchema = new mongoose.Schema({
  week: Number,
  hours: Number,
});

const courseworkSchema = new mongoose.Schema({
  cwTitle: String,
  weight: Number,
  type: {
    type: String,
    enum: ['assignment', 'class test', 'lab report', 'presentation', 'other'],
  },
  deadlineWeek: Number,
  releasedWeekEarlier: Number,
  studyHours: Number,
  distribution: {
    earlybird: [distributionSchema],
    moderate: [distributionSchema],
    procrastinator: [distributionSchema],
  },
});

const moduleSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  name: String,
  year: {
    type: Number,
    enum: [1, 2, 3, 4],
  },
  type: {
    type: String,
    enum: ['core', 'optional'],
  },
  programme: [String],
  semester: {
    type: String,
    enum: ['first', 'second', 'whole session'],
  },
  credits: Number,
  totalStudyHours: Number,
  timetabledHours: Number,
  privateStudyHours: Number,
  lectures: {
    hours: Number,
    distribution: [distributionSchema],
  },
  seminars: {
    hours: Number,
    distribution: [distributionSchema],
  },
  tutorials: {
    hours: Number,
    distribution: [distributionSchema],
  },
  labs: {
    hours: Number,
    distribution: [distributionSchema],
  },
  fieldworkPlacement: {
    hours: Number,
    distribution: [distributionSchema],
  },
  other: {
    hours: Number,
    distribution: [distributionSchema],
  },
  examPrep: {
    deadline: Number,
    weightage: Number,
    studyHours: Number,
    distribution: [distributionSchema],
  },
  courseworks: [courseworkSchema], // Updated to match new structure
  totalHours: [distributionSchema],
});

const Module = mongoose.model('Module', moduleSchema);

module.exports = Module;
