// moduleUtils.js
const Module = require('../models/module');
const Programme = require('../models/programme');
const { handleError } = require('./errorHandler');
const {
  studyWorkloadSimulatorAlgorithm,
} = require('../services/studyWorkloadAlgorithm');

exports.createOrUpdateModule = async (moduleData, existingModule, res) => {
  try {
    const processedModuleData = studyWorkloadSimulatorAlgorithm(moduleData);

    if (existingModule) {
      // If the module exists, update it
      const updatedModule = await Module.findOneAndUpdate(
        { id: existingModule.id },
        processedModuleData,
        { new: true },
      );

      // Remove the module from the moduleIds array of programmes that are no longer associated
      const removePromises = existingModule.programme
        .filter((programmeId) => !updatedModule.programme.includes(programmeId))
        .map((programmeId) =>
          Programme.findOneAndUpdate(
            { id: programmeId },
            { $pull: { moduleIds: existingModule.id } },
            { new: true },
          ),
        );

      // Add the module to the moduleIds array of new associated programmes
      const addPromises = updatedModule.programme
        .filter(
          (programmeId) => !existingModule.programme.includes(programmeId),
        )
        .map((programmeId) =>
          Programme.findOneAndUpdate(
            { id: programmeId },
            { $addToSet: { moduleIds: updatedModule.id } },
            { new: true },
          ),
        );

      const updatePromises = [...removePromises, ...addPromises];
      await Promise.all(updatePromises);

      res.json(updatedModule);
    } else {
      // If the module doesn't exist, create a new one
      const newModule = await Module.create(processedModuleData);

      const updatePromises = processedModuleData.programme.map((programmeId) =>
        Programme.findOneAndUpdate(
          { id: programmeId },
          { $addToSet: { moduleIds: newModule.id } },
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
