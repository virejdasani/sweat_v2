const Module = require('../models/module');
const Programme = require('../models/programme');
const { handleError } = require('./errorHandler');
const {
  studyWorkloadSimulatorAlgorithm,
} = require('../services/studyWorkloadAlgorithm');

exports.createOrUpdateModule = async (moduleData, existingModule, res) => {
  try {
    const processedModuleData = moduleData;

    if (existingModule) {
      const updatedModule = await Module.findOneAndUpdate(
        { 'moduleSetup.moduleCode': existingModule.moduleSetup.moduleCode },
        processedModuleData,
        { new: true, runValidators: true },
      );

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

      await Promise.all([...removePromises, ...addPromises]);

      res.json(updatedModule);
    } else {
      const newModule = await Module.create(moduleData);

      const updatePromises = moduleData.moduleSetup.programme.map(
        (programmeId) =>
          Programme.findOneAndUpdate(
            { id: programmeId },
            { $addToSet: { moduleIds: newModule.moduleSetup.moduleCode } },
            { new: true },
          ),
      );

      await Promise.all(updatePromises);

      res.status(201).json(newModule);
    }
  } catch (error) {
    handleError(res, error);
  }
};
