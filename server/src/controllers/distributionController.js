const {
  calculateCompleteDistributions,
} = require('../utils/distributionCalculations');

const getDistributions = async (req, res) => {
  try {
    const { moduleSetup, teachingSchedule, courseworkList } = req.body;

    // Extract the semester from moduleSetup
    const semester = moduleSetup.semester;

    // Calculate private study distributions and preparation time distributions
    const completeDistributions = courseworkList.map((coursework, index) => {
      return calculateCompleteDistributions(
        teachingSchedule,
        coursework,
        semester,
      );
    });

    // Check if completeDistributions is properly populated
    if (!completeDistributions || completeDistributions.length === 0) {
      throw new Error('completeDistributions is empty or undefined');
    }

    // Check each element in completeDistributions
    completeDistributions.forEach((dist, index) => {
      if (
        !dist ||
        !dist.privateStudyDistributions ||
        !dist.preparationTimeDistributions
      ) {
        throw new Error(
          `completeDistributions[${index}] is missing required properties`,
        );
      }
    });

    // Collect all private study distributions
    const privateStudyDistributions = completeDistributions.flatMap(
      (dist) => dist.privateStudyDistributions,
    );

    // Collect all preparation time distributions for each coursework
    const updatedCourseworkList = courseworkList.map((coursework, index) => ({
      ...coursework,
      preparationTimeDistributions:
        completeDistributions[index].preparationTimeDistributions,
    }));

    // Send the response
    res.status(200).json({
      courseworkList: updatedCourseworkList,
      privateStudyDistributions,
    });
  } catch (error) {
    console.error('Error fetching distributions:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  getDistributions,
};
