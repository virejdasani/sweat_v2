const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const distributionSchema = new mongoose.Schema({
  week: { type: Number },
  hours: { type: Number },
});

const studyStyleDistributionSchema = new mongoose.Schema({
  type: { type: String },
  distribution: { type: [distributionSchema] },
});

const courseworkSchema = new mongoose.Schema({
  shortTitle: { type: String },
  longTitle: { type: String },
  weight: { type: Number },
  type: { type: String },
  deadlineWeek: { type: Number },
  deadlineDate: { type: Date },
  releasedWeekPrior: { type: Number || String, default: 2 },
  deadlineDay: { type: String, default: 'Friday' },
  deadlineTime: { type: String, default: '23:59' },
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
  preparationTimeDistributions: {
    type: [studyStyleDistributionSchema],
    default: [],
  },
});

const scheduleSchema = new mongoose.Schema({
  hours: { type: Number },
  distribution: [distributionSchema],
});

const moduleSetupSchema = new mongoose.Schema({
  moduleCode: { type: String },
  moduleTitle: { type: String },
  moduleCredit: { type: Number },
  courseworkPercentage: { type: Number },
  examPercentage: { type: Number },
  studyYear: { type: Number },
  programme: { type: [String] },
  semester: { type: String },
  type: { type: String },
  teachingStaff: { type: [String] },
  formFactor: { type: Number },
  archived: { type: Boolean, default: false },
});

const moduleSchema = new mongoose.Schema({
  id: { type: String, default: uuidv4, unique: true },
  moduleSetup: { type: moduleSetupSchema },
  teachingSchedule: {
    lectures: { type: scheduleSchema },
    seminars: { type: scheduleSchema },
    tutorials: { type: scheduleSchema },
    labs: { type: scheduleSchema },
    fieldworkPlacement: { type: scheduleSchema },
    other: { type: scheduleSchema },
  },
  courseworkList: { type: [courseworkSchema] },
  privateStudyDistributions: {
    type: [studyStyleDistributionSchema],
    default: [],
  },
});

const Module = mongoose.model('Module', moduleSchema);

module.exports = Module;
