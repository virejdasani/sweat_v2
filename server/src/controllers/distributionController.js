const {
  calculateCompleteDistributions,
} = require('../utils/distributionCalculations');

const getDistributions = async (req, res) => {
  try {
    const { moduleSetup, teachingSchedule, courseworkList, readingWeeks } =
      req.body;
    // Extract the semester from moduleSetup
    const semester = moduleSetup.semester;

    // Check if courseworkList is empty
    if (!courseworkList || courseworkList.length === 0) {
      return res.status(200).json({
        courseworkList: [],
        privateStudyDistributions: [],
      });
    }

    // Calculate private study distributions and preparation time distributions
    const completeDistributions = courseworkList.map((coursework, index) => {
      if (!coursework) {
        console.error(`Coursework at index ${index} is undefined`);
        return {
          privateStudyDistributions: [],
          preparationTimeDistributions: [],
        };
      }
      const distribution = calculateCompleteDistributions(
        teachingSchedule,
        coursework,
        semester,
        readingWeeks,
      );
      return distribution;
    });

    // Check if completeDistributions is properly populated
    if (!completeDistributions || completeDistributions.length === 0) {
      throw new Error('completeDistributions is empty or undefined');
    }

    // Check each element in completeDistributions
    completeDistributions.forEach((dist, index) => {
      if (
        !dist ||
        !dist.preparationTimeDistributions ||
        (courseworkList[index].type === 'exam' &&
          !dist.privateStudyDistributions)
      ) {
        throw new Error(
          `completeDistributions[${index}] is missing required properties`,
        );
      }
    });

    // Collect all private study distributions
    const privateStudyDistributions = completeDistributions.flatMap(
      (dist) => dist.privateStudyDistributions || [],
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
