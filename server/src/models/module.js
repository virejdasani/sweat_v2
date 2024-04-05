const mongoose = require('mongoose');

const distributionSchema = new mongoose.Schema({
  week: Number,
  hours: Number,
});

const courseworkPrepSchema = new mongoose.Schema({
  deadline: Number,
  weightage: Number,
  studyHours: Number,
  distribution: {
    earlybird: [distributionSchema],
    moderate: [distributionSchema],
    procrastinator: [distributionSchema],
  },
});

const classtestPrepSchema = new mongoose.Schema({
  deadline: Number,
  weightage: Number,
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
  credits: {
    type: Number,
    enum: [7.5, 15, 30],
  },
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
  courseworkPrep: [courseworkPrepSchema],
  classtestPrep: [classtestPrepSchema],
  totalHours: [distributionSchema],
});

const Module = mongoose.model('Module', moduleSchema);

module.exports = Module;
