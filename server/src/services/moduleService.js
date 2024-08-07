const {
  calculatePreparationTimeDistributions,
  calculateCompleteDistributions,
} = require('../utils/distributionCalculations');
const { handleError } = require('../utils/errorHandler');
const Module = require('../models/module');

const createOrUpdateModule = async (moduleData, existingModule, res) => {
  try {
    if (!existingModule) {
      moduleData.moduleSetup.archived = false;
    }

    // Process coursework list and calculate distributions
    moduleData.courseworkList.forEach((coursework) => {
      if (coursework.type !== 'exam') {
        // Calculate preparation time distributions for coursework not of type exam
        coursework.preparationTimeDistributions =
          calculatePreparationTimeDistributions(
            coursework,
            moduleData.moduleSetup.semester,
          );
      } else {
        // Calculate private study and remaining preparation time distributions for coursework of type exam
        const { privateStudyDistributions, preparationTimeDistributions } =
          calculateCompleteDistributions(
            moduleData.teachingSchedule,
            coursework,
            moduleData.moduleSetup.semester,
            moduleData.readingWeeks,
          );

        // Assign private study distributions to the module
        moduleData.privateStudyDistributions = privateStudyDistributions;

        // Assign preparation time distributions to the coursework
        coursework.preparationTimeDistributions = preparationTimeDistributions;
      }
    });

    if (existingModule) {
      Object.assign(existingModule, moduleData);
      await existingModule.save();
    } else {
      const newModule = new Module(moduleData);
      await newModule.save();
    }
  } catch (error) {
    handleError(res, error);
  }
};

module.exports = { createOrUpdateModule };
