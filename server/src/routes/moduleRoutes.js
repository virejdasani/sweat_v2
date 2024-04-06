const express = require('express');
const router = express.Router();
const moduleController = require('../controllers/moduleController');

router.get('/', moduleController.getAllModules);

router.get('/ids', moduleController.getAllModuleIds);

router.get('/:id', moduleController.getModuleById);

router.put('/update-programme-array', moduleController.updateProgrammeArrayInModules);

router.post('/create-module', moduleController.createModule);

router.put('/:id', moduleController.updateModuleById);

router.delete('/:id', moduleController.deleteModuleById);

module.exports = router;
