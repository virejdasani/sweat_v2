const express = require('express');
const router = express.Router();
const calendarController = require('../controllers/calendarController');

router.get('/', calendarController.getEvents);
router.post('/save-events', calendarController.saveEvents);

module.exports = router;
