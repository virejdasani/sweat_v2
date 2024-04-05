const express = require('express');
const router = express.Router();
const programmeController = require('../controllers/programmeController');

router.get('/', programmeController.getAllProgrammes);
router.get('/ids', programmeController.getAllProgrammeIds);
router.get('/:id', programmeController.getProgrammeById);
router.post('/', programmeController.createProgramme);
router.put('/:id', programmeController.updateProgrammeById);
router.delete('/:id', programmeController.deleteProgrammeById);

module.exports = router;
