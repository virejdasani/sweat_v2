const Module = require('../models/module');
const Programme = require('../models/programme');
const { handleError } = require('../utils/errorHandler');
const { createOrUpdateModule } = require('../utils/helpers');

exports.getAllModules = async (req, res) => {
  try {
    const modules = await Module.find();
    res.json(modules);
  } catch (error) {
    handleError(res, error);
  }
};

exports.getAllModuleIds = async (req, res) => {
  try {
    const moduleIds = await Module.find().distinct('moduleSetup.moduleCode');
    res.json(moduleIds);
  } catch (error) {
    handleError(res, error);
  }
};

exports.getModuleById = async (req, res) => {
  try {
    const moduleId = req.params.id;
    const module = await Module.findOne({ 'moduleSetup.moduleCode': moduleId });

    if (!module) {
      return res.status(404).json({ error: 'Module not found' });
    }

    res.json(module);
  } catch (error) {
    handleError(res, error);
  }
};

exports.createModule = async (req, res) => {
  try {
    const moduleData = req.body;
    const existingModule = await Module.findOne({
      'moduleSetup.moduleCode': moduleData.moduleSetup.moduleCode,
    });

    await createOrUpdateModule(moduleData, existingModule, res);
  } catch (error) {
    handleError(res, error);
  }
};

exports.updateModuleById = async (req, res) => {
  try {
    const moduleId = req.params.id;
    const updatedData = req.body;

    const existingModule = await Module.findOne({
      'moduleSetup.moduleCode': moduleId,
    });
    if (!existingModule) {
      return res.status(404).json({ error: 'Module not found' });
    }

    await createOrUpdateModule(updatedData, existingModule, res);
  } catch (error) {
    handleError(res, error);
  }
};

exports.deleteModuleById = async (req, res) => {
  try {
    const moduleCode = req.params.moduleCode;

    if (!moduleCode) {
      return res.status(400).json({ error: 'Module code is required' });
    }

    const deletedModule = await Module.findOneAndDelete({
      'moduleSetup.moduleCode': moduleCode,
    });

    if (!deletedModule) {
      console.log(`Module with code ${moduleCode} not found`);
      return res.status(404).json({ error: 'Module not found' });
    }

    // Remove the module's id from the moduleIds array of associated programmes
    const updatePromises = deletedModule.moduleSetup.programme.map(
      (programmeId) =>
        Programme.findOneAndUpdate(
          { id: programmeId },
          { $pull: { moduleIds: moduleCode } },
          { new: true },
        ),
    );

    await Promise.all(updatePromises);

    res.json({ message: 'Module deleted successfully' });
  } catch (error) {
    console.error(`Error deleting module with code ${moduleCode}:`, error);
    handleError(res, error);
  }
};

exports.updateProgrammeArrayInModules = async (req, res) => {
  try {
    const programmes = await Programme.find();

    const moduleToProgrammeMap = programmes.reduce((map, programme) => {
      programme.moduleIds.forEach((moduleCode) => {
        if (!map[moduleCode]) {
          map[moduleCode] = [];
        }
        map[moduleCode].push(programme.id);
      });
      return map;
    }, {});

    // Prepare bulk operations for updating moduleIds in programmes
    const updateProgrammeBulkOps = programmes.map((programme) => ({
      updateOne: {
        filter: { _id: programme._id },
        update: { $set: { moduleIds: programme.moduleIds } },
      },
    }));

    const programmeResults = await Programme.bulkWrite(updateProgrammeBulkOps);

    // Update the programme array in modules individually
    const moduleUpdatePromises = Object.entries(moduleToProgrammeMap).map(
      async ([moduleCode, programmeIds]) => {
        const module = await Module.findOne({
          'moduleSetup.moduleCode': moduleCode,
        });
        if (!module) {
          return;
        }

        await Module.updateMany(
          { 'moduleSetup.moduleCode': moduleCode },
          { $set: { 'moduleSetup.programme': programmeIds } },
        );
      },
    );

    await Promise.all(moduleUpdatePromises);

    res.status(200).json({
      message: 'Programme array updated in modules successfully',
      programmeResults,
    });
  } catch (error) {
    console.error('Error updating programme array in modules:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
