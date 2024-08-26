const Module = require('../models/module');
const Programme = require('../models/programme');
const { handleError } = require('../utils/errorHandler');
const { createOrUpdateModule } = require('../services/moduleService');
const {
  updateProgrammesForModule,
} = require('../controllers/programmeController');
const path = require('path');
const fs = require('fs');

const templatesDir = path.join(__dirname, '../templates'); // Ensure this path is correct

const getAllModules = async (req, res) => {
  try {
    const modules = await Module.find();
    res.json(modules);
  } catch (error) {
    handleError(res, error);
  }
};

const getAllModuleIds = async (req, res) => {
  try {
    const moduleIds = await Module.find().distinct('moduleSetup.moduleCode');
    res.json(moduleIds);
  } catch (error) {
    handleError(res, error);
  }
};

const getModuleById = async (req, res) => {
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

const createOrUpdateModuleController = async (req, res) => {
  try {
    const { moduleData, readingWeeks } = req.body;

    const existingModule = await Module.findOne({
      'moduleSetup.moduleCode': moduleData.moduleSetup.moduleCode,
    });

    await createOrUpdateModule(moduleData, existingModule, readingWeeks, res);

    // Update programmes after module has been created or updated
    await updateProgrammesForModule(moduleData);

    res
      .status(200)
      .json({ message: 'Module created or updated successfully.' });
  } catch (error) {
    handleError(res, error);
  }
};

const deleteModuleById = async (req, res) => {
  try {
    const moduleCode = req.params.moduleCode;

    if (!moduleCode) {
      return res.status(400).json({ error: 'Module code is required' });
    }

    const deletedModule = await Module.findOneAndDelete({
      'moduleSetup.moduleCode': moduleCode,
    });

    if (!deletedModule) {
      return res.status(404).json({ error: 'Module not found' });
    }

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
    handleError(res, error);
  }
};

const updateProgrammeArrayInModules = async (req, res) => {
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

    const updateProgrammeBulkOps = programmes.map((programme) => ({
      updateOne: {
        filter: { _id: programme._id },
        update: { $set: { moduleIds: programme.moduleIds } },
      },
    }));

    const programmeResults = await Programme.bulkWrite(updateProgrammeBulkOps);

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
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getModuleTemplate = (req, res) => {
  const { moduleCredit, semester } = req.query;

  // Map the semester value to the corresponding file name format
  const normalizedSemester =
    semester.toLowerCase() === 'whole session'
      ? 'wholeSession'
      : semester.replace(/\s+/g, '');

  const templateFileName = `module-template-${moduleCredit}-${normalizedSemester}.json`;
  const templateFilePath = path.join(templatesDir, templateFileName);

  console.log(`Looking for template file at: ${templateFilePath}`); // Log the path for debugging

  if (fs.existsSync(templateFilePath)) {
    const templateData = fs.readFileSync(templateFilePath, 'utf-8');
    res.json(JSON.parse(templateData));
  } else {
    console.error(`Template file not found: ${templateFilePath}`); // Log the error for debugging
    res.status(404).json({ message: 'Module template not found' });
  }
};

const getFilteredModules = async (req, res) => {
  try {
    const { studyYear, programme, semester } = req.query;

    // Normalize the semester value
    const normalizedSemester =
      semester === 'wholeSession' ? 'whole session' : semester;

    // Construct the filter object
    const filter = {};
    if (studyYear) {
      filter['moduleSetup.studyYear'] = Number(studyYear);
    }
    if (programme) {
      filter['moduleSetup.programme'] = { $in: [programme] };
    }
    if (normalizedSemester) {
      filter['moduleSetup.semester'] = normalizedSemester;
    }

    // Fetch the modules based on the constructed filter
    const modules = await Module.find(filter);

    // Respond with the filtered modules
    res.json(modules);
  } catch (error) {
    handleError(res, error);
  }
};

module.exports = {
  getAllModules,
  getAllModuleIds,
  getModuleById,
  createOrUpdateModuleController,
  deleteModuleById,
  updateProgrammeArrayInModules,
  getModuleTemplate,
  getFilteredModules, // Export the new controller
};
