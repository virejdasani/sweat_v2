const Settings = require('../models/settings');

// Get the default form factor
exports.getDefaultFormFactor = async (req, res) => {
  try {
    const setting = await Settings.findOne({ key: 'defaultFormFactor' });
    if (setting) {
      res.status(200).json({ formFactor: setting.value });
    } else {
      res.status(404).json({ message: 'Setting not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching setting', error });
  }
};

// Set or update the default form factor
exports.setDefaultFormFactor = async (req, res) => {
  const { formFactor } = req.body;

  try {
    const setting = await Settings.findOneAndUpdate(
      { key: 'defaultFormFactor' },
      { value: formFactor },
      { upsert: true, new: true },
    );
    res
      .status(200)
      .json({ message: 'Form factor saved successfully', setting });
  } catch (error) {
    res.status(500).json({ message: 'Error saving form factor', error });
  }
};
