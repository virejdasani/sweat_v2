const Calendar = require('../models/calendar');

// Function to save events to MongoDB
// async function saveEvents(events) {
//   try {
//     // Create a new calendar instance
//     const newCalendar = new Calendar({ events });
//     // Save the calendar to the database
//     await newCalendar.save();
//     console.log('Events saved successfully.');
//   } catch (error) {
//     console.error('Error saving events:', error);
//   }
// }

// // Function to get events from MongoDB
// async function getEvents() {
//   try {
//     // Find the calendar document in the database
//     const calendar = await Calendar.findOne();
//     // If calendar exists, return its events, otherwise return an empty array
//     return calendar ? calendar.events : [];
//   } catch (error) {
//     console.error('Error getting events:', error);
//     return [];
//   }
// }

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

module.exports = { saveEvents, getEvents };
