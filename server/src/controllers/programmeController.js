const Programme = require('../models/programme');
const { handleError } = require('../utils/errorHandler');
const {
  getCurrentProgrammesForModule,
  addModuleToProgrammes,
  removeModuleFromProgrammes,
} = require('../utils/programmeHelpers');

const getAllProgrammes = async (req, res) => {
  try {
    const programmes = await Programme.find();
    res.json(programmes);
  } catch (error) {
    handleError(res, error);
  }
};

const getAllProgrammeIds = async (req, res) => {
  try {
    const programmeIds = await Programme.find().distinct('id');
    res.json(programmeIds);
  } catch (error) {
    handleError(res, error);
  }
};

const getProgrammeById = async (req, res) => {
  try {
    const programmeId = req.params.id;
    const programme = await Programme.findOne({ id: programmeId });

    if (!programme) {
      return res.status(404).json({ error: 'Programme not found' });
    }

    res.json(programme);
  } catch (error) {
    handleError(res, error);
  }
};

const createProgramme = async (req, res) => {
  try {
    const programmeData = req.body;

    const newProgramme = await Programme.create(programmeData);
    res.status(201).json(newProgramme);
  } catch (error) {
    handleError(res, error);
  }
};

const updateProgrammeById = async (req, res) => {
  try {
    const programmeId = req.params.id;
    const updatedData = req.body;

    const updatedProgramme = await Programme.findOneAndUpdate(
      { id: programmeId },
      updatedData,
      { new: true },
    );

    if (!updatedProgramme) {
      return res.status(404).json({ error: 'Programme not found' });
    }

    res.json(updatedProgramme);
  } catch (error) {
    handleError(res, error);
  }
};

const updateModuleIdsForAllProgrammes = async (req, res) => {
  try {
    const programmeId = req.params.id;
    const { moduleIds } = req.body;

    const updatedDoc = await Programme.findOneAndUpdate(
      { id: programmeId },
      { $set: { moduleIds } },
      { new: true },
    );

    if (!updatedDoc) {
      console.log('Programme not found');
      return res.status(404).json({ error: 'Programme not found' });
    }

    res.json(updatedDoc);
  } catch (error) {
    console.error('Error updating module IDs for programme:', error);
    handleError(res, error);
  }
};

const deleteProgrammeById = async (req, res) => {
  try {
    const programmeId = req.params.id;
    const deletedProgramme = await Programme.findOneAndDelete({
      id: programmeId,
    });

    if (!deletedProgramme) {
      return res.status(404).json({ error: 'Programme not found' });
    }

    res.json({ message: 'Programme deleted successfully' });
  } catch (error) {
    handleError(res, error);
  }
};

const removeModuleFromProgramme = async (req, res) => {
  try {
    const programmeId = req.params.id;
    const { moduleId } = req.body;

    const programme = await Programme.findOne({ id: programmeId });
    if (!programme) {
      return res.status(404).json({ error: 'Programme not found' });
    }

    const moduleIndex = programme.moduleIds.indexOf(moduleId);
    if (moduleIndex === -1) {
      return res
        .status(404)
        .json({ error: 'Module not found in the programme' });
    }

    programme.moduleIds.splice(moduleIndex, 1);

    const updatedProgramme = await programme.save();

    res.json(updatedProgramme);
  } catch (error) {
    handleError(res, error);
  }
};

const updateProgrammesForModule = async (moduleData, res) => {
  try {
    const moduleCode = moduleData.moduleSetup.moduleCode;
    const newProgrammes = moduleData.moduleSetup.programme || [];

    const currentProgrammes = await getCurrentProgrammesForModule(moduleCode);

    const programmesToAdd = newProgrammes.filter(
      (programmeId) => !currentProgrammes.includes(programmeId),
    );
    const programmesToRemove = currentProgrammes.filter(
      (programmeId) => !newProgrammes.includes(programmeId),
    );

    await addModuleToProgrammes(moduleCode, programmesToAdd);
    await removeModuleFromProgrammes(moduleCode, programmesToRemove);
  } catch (error) {
    handleError(res, error);
  }
};

module.exports = {
  getAllProgrammes,
  getAllProgrammeIds,
  getProgrammeById,
  createProgramme,
  updateProgrammeById,
  updateModuleIdsForAllProgrammes,
  deleteProgrammeById,
  removeModuleFromProgramme,
  updateProgrammesForModule,
};
