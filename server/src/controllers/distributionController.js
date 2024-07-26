const {
  calculateCompleteDistributions,
} = require('../utils/distributionCalculations');

const getDistributions = async (req, res) => {
  try {
    const { moduleSetup, teachingSchedule, courseworkList } = req.body;

    // Extract the semester from moduleSetup
    const semester = moduleSetup.semester;

    // Calculate private study distributions and preparation time distributions
    const completeDistributions = courseworkList.map((coursework) =>
      calculateCompleteDistributions(teachingSchedule, coursework, semester),
    );

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
