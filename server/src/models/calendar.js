const mongoose = require('mongoose');

const calendarSchema = new mongoose.Schema({
  title: String,
  allDay: Boolean,
  start: Date,
  end: Date,
});

const calendarModel = mongoose.model('calendar', calendarSchema);

module.exports = calendarModel;
