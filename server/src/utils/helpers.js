const Module = require('../models/module');
const Programme = require('../models/programme');
const { handleError } = require('./errorHandler');
const {
  studyWorkloadSimulatorAlgorithm,
} = require('../services/studyWorkloadAlgorithm');

exports.createOrUpdateModule = async (moduleData, existingModule, res) => {
  try {
    console.log('Starting createOrUpdateModule...');
    console.log('Received moduleData:', JSON.stringify(moduleData, null, 2));

    const processedModuleData = moduleData;

    if (existingModule) {
      console.log(
        'Updating existing module with code:',
        existingModule.moduleSetup.moduleCode,
      );

      const updatedModule = await Module.findOneAndUpdate(
        { 'moduleSetup.moduleCode': existingModule.moduleSetup.moduleCode },
        processedModuleData,
        { new: true, runValidators: true },
      );

      console.log('Updated module:', JSON.stringify(updatedModule, null, 2));

      const removePromises = existingModule.moduleSetup.programme
        .filter(
          (programmeId) =>
            !updatedModule.moduleSetup.programme.includes(programmeId),
        )
        .map((programmeId) =>
          Programme.findOneAndUpdate(
            { id: programmeId },
            { $pull: { moduleIds: existingModule.moduleSetup.moduleCode } },
            { new: true },
          ),
        );

      console.log('Remove promises:', removePromises.length);

      const addPromises = updatedModule.moduleSetup.programme
        .filter(
          (programmeId) =>
            !existingModule.moduleSetup.programme.includes(programmeId),
        )
        .map((programmeId) =>
          Programme.findOneAndUpdate(
            { id: programmeId },
            { $addToSet: { moduleIds: updatedModule.moduleSetup.moduleCode } },
            { new: true },
          ),
        );

      console.log('Add promises:', addPromises.length);

      await Promise.all([...removePromises, ...addPromises]);

      console.log('Module updated successfully.');
      res.json(updatedModule);
    } else {
      console.log('Creating new module...');

      const newModule = await Module.create(moduleData);

      console.log('New module created:', JSON.stringify(newModule, null, 2));

      const updatePromises = moduleData.moduleSetup.programme.map(
        (programmeId) =>
          Programme.findOneAndUpdate(
            { id: programmeId },
            { $addToSet: { moduleIds: newModule.moduleSetup.moduleCode } },
            { new: true },
          ),
      );

      console.log('Update promises:', updatePromises.length);

      await Promise.all(updatePromises);

      console.log('New module added to programmes successfully.');
      res.status(201).json(newModule);
    }
  } catch (error) {
    console.error('Error in createOrUpdateModule:', error);
    handleError(res, error);
  }
};
