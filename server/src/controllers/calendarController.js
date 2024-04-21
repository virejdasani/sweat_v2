const Calendar = require('../models/calendar');

// save events to MongoDB
const saveEvents = async (req, res) => {
  try {
    const eventsData = req.body;
    const newEvents = await Calendar.create(eventsData);
    res.status(201).json(newEvents);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// get events from MongoDB
const getEvents = async (req, res) => {
  try {
    const events = await Calendar.find();
    res.json(events);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { saveEvents, getEvents };
