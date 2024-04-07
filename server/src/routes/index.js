const express = require('express');
const router = express.Router();

const calendarRoutes = require('./calendarRoutes');

router.use('/calendar', calendarRoutes);

module.exports = router;
