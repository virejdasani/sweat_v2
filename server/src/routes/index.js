const express = require('express');
const router = express.Router();

const programmeRoutes = require('./programmeRoutes');
const moduleRoutes = require('./moduleRoutes');


router.use('/modules', moduleRoutes);

router.use('/programmes', programmeRoutes);

module.exports = router;
