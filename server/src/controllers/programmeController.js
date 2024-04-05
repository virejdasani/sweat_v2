const Programme = require('../models/programme');
const { handleError } = require('../utils/errorHandler');

exports.getAllProgrammes = async (req, res) => {
  try {
    const programmes = await Programme.find();
    res.json(programmes);
  } catch (error) {
    handleError(res, error);
  }
};

exports.getAllProgrammeIds = async (req, res) => {
  try {
    const programmeIds = await Programme.find().distinct('id');
    res.json(programmeIds);
  } catch (error) {
    handleError(res, error);
  }
};

exports.getProgrammeById = async (req, res) => {
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

exports.createProgramme = async (req, res) => {
  try {
    const programmeData = req.body;

    // TODO: Apply any necessary validation or processing to the programme data

    const newProgramme = await Programme.create(programmeData);
    res.status(201).json(newProgramme);
  } catch (error) {
    handleError(res, error);
  }
};

exports.updateProgrammeById = async (req, res) => {
  try {
    const programmeId = req.params.id;
    const updatedData = req.body;

    // TODO: Apply any necessary validation or processing to the updated data

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

exports.deleteProgrammeById = async (req, res) => {
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
