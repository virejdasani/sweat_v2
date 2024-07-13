const Module = require('../models/module');
const Programme = require('../models/programme');
const { handleError } = require('../utils/errorHandler');
const { createOrUpdateModule } = require('../utils/helpers');
const path = require('path');
const fs = require('fs');
const {
  calculateWorkloadGraphData,
} = require('../utils/distributionsGenerator');

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
    const moduleData = req.body;
    const existingModule = await Module.findOne({
      'moduleSetup.moduleCode': moduleData.moduleSetup.moduleCode,
    });

    await createOrUpdateModule(moduleData, existingModule, res);
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

  const templateFileName = `module-template-${moduleCredit}-${semester}.json`;
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

const getWorkloadGraphData = async (req, res) => {
  try {
    const { formData, courseworkList, templateData, studyStyle } = req.body;
    console.log('Request body:', req.body);
    const workloadData = calculateWorkloadGraphData(
      formData,
      courseworkList,
      templateData,
      studyStyle,
    );
    res.json(workloadData);
  } catch (error) {
    console.error('Error generating workload graph data:', error);
    res.status(500).json({ message: 'Internal server error' });
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
  getWorkloadGraphData,
};
