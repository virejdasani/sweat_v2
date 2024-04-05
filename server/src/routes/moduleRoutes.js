const express = require('express');
const router = express.Router();
const moduleController = require('../controllers/moduleController');

router.get('/', moduleController.getAllModules);
router.get('/ids', moduleController.getAllModuleIds);
router.get('/:id', moduleController.getModuleById);
router.post('/', moduleController.createModule);
router.put('/:id', moduleController.updateModuleById);
router.delete('/:id', moduleController.deleteModuleById);

module.exports = router;
