const Module = require('../models/module');
const Programme = require('../models/programme');
const { handleError } = require('../utils/errorHandler');

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
    const moduleIds = await Module.find().distinct('id');
    res.json(moduleIds);
  } catch (error) {
    handleError(res, error);
  }
};

exports.getModuleById = async (req, res) => {
  try {
    const moduleId = req.params.id;
    const module = await Module.findOne({ id: moduleId });

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

    // TODO: Apply the algorithm to the module data
    // const processedModuleData = applyAlgorithm(moduleData);

    const newModule = await Module.create(moduleData);
    res.status(201).json(newModule);
  } catch (error) {
    handleError(res, error);
  }
};

exports.updateModuleById = async (req, res) => {
  try {
    const moduleId = req.params.id;
    const updatedData = req.body;

    // TODO: Apply the algorithm to the updated data
    // const processedUpdatedData = applyAlgorithm(updatedData);

    const updatedModule = await Module.findOneAndUpdate(
      { id: moduleId },
      updatedData,
      { new: true },
    );

    if (!updatedModule) {
      return res.status(404).json({ error: 'Module not found' });
    }

    res.json(updatedModule);
  } catch (error) {
    handleError(res, error);
  }
};

exports.deleteModuleById = async (req, res) => {
  try {
    const moduleId = req.params.id;
    const deletedModule = await Module.findOneAndDelete({ id: moduleId });

    if (!deletedModule) {
      return res.status(404).json({ error: 'Module not found' });
    }

    res.json({ message: 'Module deleted successfully' });
  } catch (error) {
    handleError(res, error);
  }
};

exports.updateProgrammeArrayInModules = async (req, res) => {
  try {
    const programmes = await Programme.find();
    const moduleToProgrammeMap = programmes.reduce((map, programme) => {
      programme.moduleIds.forEach((moduleId) => {
        if (!map[moduleId]) {
          map[moduleId] = [];
        }
        map[moduleId].push(programme.id);
      });
      return map;
    }, {});

    // Prepare bulk operations
    const bulkOps = Object.entries(moduleToProgrammeMap).map(
      ([moduleId, programmeIds]) => ({
        updateOne: {
          filter: { id: moduleId }, // Ensure this matches your Module document's identifier field
          update: { $set: { programme: programmeIds } },
        },
      }),
    );

    // Execute bulk write operation
    await Module.bulkWrite(bulkOps);

    res
      .status(200)
      .json({ message: 'Programme array updated in modules successfully' });
  } catch (error) {
    console.error('Error updating programme array in modules:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
