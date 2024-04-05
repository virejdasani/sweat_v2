const express = require('express');
const router = express.Router();

const programmeRoutes = require('./programmeRoutes');
const moduleRoutes = require('./moduleRoutes');

router.use('/programmes', programmeRoutes);
router.use('/modules', moduleRoutes);

module.exports = router;
