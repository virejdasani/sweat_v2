const Programme = require('../models/programme');

const getCurrentProgrammesForModule = async (moduleCode) => {
  try {
    const programmes = await Programme.find({ moduleIds: moduleCode });
    return programmes.map((programme) => programme.id);
  } catch (error) {
    throw new Error(
      `Error fetching current programmes for module ${moduleCode}: ${error.message}`,
    );
  }
};

const addModuleToProgrammes = async (moduleCode, programmes) => {
  try {
    const addPromises = programmes.map((programmeId) =>
      Programme.findOneAndUpdate(
        { id: programmeId },
        { $addToSet: { moduleIds: moduleCode } },
        { new: true },
      ),
    );
    return Promise.all(addPromises);
  } catch (error) {
    throw new Error(
      `Error adding module ${moduleCode} to programmes: ${error.message}`,
    );
  }
};

const removeModuleFromProgrammes = async (moduleCode, programmes) => {
  try {
    const removePromises = programmes.map((programmeId) =>
      Programme.findOneAndUpdate(
        { id: programmeId },
        { $pull: { moduleIds: moduleCode } },
        { new: true },
      ),
    );
    return Promise.all(removePromises);
  } catch (error) {
    throw new Error(
      `Error removing module ${moduleCode} from programmes: ${error.message}`,
    );
  }
};

module.exports = {
  getCurrentProgrammesForModule,
  addModuleToProgrammes,
  removeModuleFromProgrammes,
};
