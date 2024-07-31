const Calendar = require('../models/calendar');
const { extractReadingWeek } = require('../services/calendarService');

const saveEvents = async (req, res) => {
  try {
    const eventsData = req.body;
    const newEvents = await Calendar.create(eventsData);
    res.status(201).json(newEvents);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getEvents = async (req, res) => {
  try {
    const events = await Calendar.find();
    res.json(events);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const addEvent = async (req, res) => {
  try {
    const calendar = await Calendar.create(req.body);
    res.json(calendar);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const calendar = await Calendar.findByIdAndDelete({ _id: eventId });
    res.json(calendar);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateEvent = async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const calendar = await Calendar.findByIdAndUpdate(
      { _id: eventId },
      req.body,
      { new: true },
    );
    res.json(calendar);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteAllEvents = async (req, res) => {
  try {
    const calendar = await Calendar.deleteMany();
    res.json(calendar);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Controller function to get calendar events and extract reading week
const getReadingWeek = async (req, res) => {
  const { semester } = req.params;
  try {
    const events = await Calendar.find({});
    console.log('Retrieved calendar events:', events);
    const readingWeeks = extractReadingWeek(events, semester);
    res.json({ events, readingWeeks });
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  saveEvents,
  getEvents,
  addEvent,
  deleteEvent,
  updateEvent,
  deleteAllEvents,
  getReadingWeek,
};
