const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const distributionSchema = new mongoose.Schema({
  week: { type: Number, required: true },
  hours: { type: Number, required: true },
});

const courseworkSchema = new mongoose.Schema({
  title: { type: String, required: true },
  weight: { type: Number, required: true },
  type: {
    type: String,
    enum: [
      'exam',
      'assignment',
      'class test',
      'lab report',
      'presentation',
      'other',
    ],
    lowercase: true, // This makes the enum case insensitive
    required: true,
  },
  deadlineWeek: { type: Number, required: true },
  deadlineDate: { type: Date },
  releasedWeekEarlier: {
    type: Number,
    required: function () {
      return this.type !== 'Exam';
    },
  },
  deadlineDay: {
    type: String,
    enum: [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ],
    required: function () {
      return this.type !== 'Exam';
    },
  },
  deadlineTime: {
    type: String,
    match: /^([01]\d|2[0-3]):([0-5]\d)$/,
    required: function () {
      return this.type !== 'Exam';
    },
  },
  contactTimeLectures: { type: Number, default: 0 },
  contactTimeTutorials: { type: Number, default: 0 },
  contactTimeLabs: { type: Number, default: 0 },
  contactTimeSeminars: { type: Number, default: 0 },
  contactTimeFieldworkPlacement: { type: Number, default: 0 },
  contactTimeOthers: { type: Number, default: 0 },
  formativeAssessmentTime: { type: Number, default: 0 },
  privateStudyTime: { type: Number, default: 0 },
  preparationTime: { type: Number, default: 0 },
  keyboardTime: { type: Number, default: 0 },
  feedbackTime: { type: Number, default: 0 },
});

const scheduleSchema = new mongoose.Schema({
  hours: { type: Number, required: true },
  distribution: [distributionSchema],
});

const moduleSetupSchema = new mongoose.Schema({
  moduleCode: { type: String, required: true, unique: true },
  moduleTitle: { type: String, required: true },
  moduleCredit: { type: Number, required: true },
  courseworkPercentage: { type: Number, required: true },
  examPercentage: { type: Number, required: true },
  studyYear: { type: Number, enum: [1, 2, 3, 4], required: true },
  programme: { type: [String], required: true },
  semester: {
    type: String,
    enum: ['first', 'second', 'whole session'],
    lowercase: true, // This makes the enum case insensitive
    required: true,
  },
  type: {
    type: String,
    enum: ['core', 'optional'],
    lowercase: true, // This makes the enum case insensitive
    required: true,
  },
});

const moduleSchema = new mongoose.Schema({
  id: { type: String, default: uuidv4, unique: true }, // Adding custom id field
  moduleSetup: { type: moduleSetupSchema, required: true },
  teachingSchedule: {
    lectures: { type: scheduleSchema, required: true },
    seminars: { type: scheduleSchema, required: true },
    tutorials: { type: scheduleSchema, required: true },
    labs: { type: scheduleSchema, required: true },
    fieldworkPlacement: { type: scheduleSchema, required: true },
    other: { type: scheduleSchema, required: true },
  },
  courseworkList: { type: [courseworkSchema], required: true },
});

const Module = mongoose.model('Module', moduleSchema);

module.exports = Module;
