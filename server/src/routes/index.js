const express = require('express');
const router = express.Router();

const programmeRoutes = require('./programmeRoutes');
const moduleRoutes = require('./moduleRoutes');
const calendarRoutes = require('./calendarRoutes');


router.use('/modules', moduleRoutes);

router.use('/programmes', programmeRoutes);

router.use('/calendar', calendarRoutes);

module.exports = router;
