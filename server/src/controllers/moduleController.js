const Module = require('../models/module');
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
