const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const distributionSchema = new mongoose.Schema({
  week: { type: Number },
  hours: { type: Number },
});

const courseworkSchema = new mongoose.Schema({
  shortTitle: { type: String },
  longTitle: { type: String },
  weight: { type: Number },
  type: { type: String },
  deadlineWeek: { type: Number },
  deadlineDate: { type: Date },
  releaseWeek: { type: Number, default: null },
  deadlineDay: { type: String, default: null },
  deadlineTime: { type: String, default: null },
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
});

const Module = mongoose.model('Module', moduleSchema);

module.exports = Module;
