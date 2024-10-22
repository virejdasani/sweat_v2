// controllers/courseworkController.js

const { handleError } = require('../utils/errorHandler');
const {
  initializeCourseworkList,
  recalculateCourseworkList,
} = require('../utils/courseworkCalculations');

/**
 * Initializes the coursework list with backend calculations.
 */
exports.initializeCourseworkList = async (req, res) => {
  try {
    const {
      courseworkList,
      templateData,
      moduleCredit,
      formFactor,
      isEditing,
      courseworkPercentage,
    } = req.body;

    // Input validation
    if (!Array.isArray(courseworkList)) {
      return res.status(400).json({ message: 'Invalid courseworkList' });
    }

    if (!Array.isArray(templateData)) {
      return res.status(400).json({ message: 'Invalid templateData' });
    }

    if (typeof moduleCredit !== 'number' || moduleCredit <= 0) {
      return res.status(400).json({ message: 'Invalid moduleCredit' });
    }

    if (typeof formFactor !== 'number' || formFactor < 0 || formFactor > 100) {
      return res.status(400).json({ message: 'Invalid formFactor' });
    }

    if (typeof isEditing !== 'boolean') {
      return res.status(400).json({ message: 'Invalid isEditing flag' });
    }

    // Adjust formFactor if courseworkPercentage is 100%
    const adjustedFormFactor = courseworkPercentage === 100 ? 100 : formFactor;

    // Perform calculations using utility function
    const updatedCourseworkList = initializeCourseworkList(
      courseworkList,
      templateData,
      moduleCredit,
      adjustedFormFactor,
      isEditing,
    );

    // Send the updated coursework list as response
    res.json(updatedCourseworkList);
  } catch (error) {
    handleError(res, error);
  }
};

/**
 * Recalculates the coursework list when dependencies change.
 */
exports.recalculateCourseworkList = async (req, res) => {
  try {
    const {
      initialCourseworkList,
      templateData,
      moduleCredit,
      formFactor,
      manualChanges,
      currentCourseworkList,
    } = req.body;

    // Input validation
    if (!Array.isArray(initialCourseworkList)) {
      return res.status(400).json({ message: 'Invalid initialCourseworkList' });
    }

    if (!Array.isArray(currentCourseworkList)) {
      return res.status(400).json({ message: 'Invalid currentCourseworkList' });
    }

    if (!Array.isArray(templateData)) {
      return res.status(400).json({ message: 'Invalid templateData' });
    }

    if (typeof moduleCredit !== 'number' || moduleCredit <= 0) {
      return res.status(400).json({ message: 'Invalid moduleCredit' });
    }

    if (typeof formFactor !== 'number' || formFactor < 0 || formFactor > 100) {
      return res.status(400).json({ message: 'Invalid formFactor' });
    }

    if (typeof manualChanges !== 'object') {
      return res.status(400).json({ message: 'Invalid manualChanges' });
    }

    // Perform recalculations using utility function
    const recalculatedList = recalculateCourseworkList(
      initialCourseworkList,
      templateData,
      moduleCredit,
      formFactor,
      manualChanges,
      currentCourseworkList,
    );

    // Send the recalculated coursework list as response
    res.json(recalculatedList);
  } catch (error) {
    handleError(res, error);
  }
};
