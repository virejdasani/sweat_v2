const {
  calculateFieldsForCoursework,
  sortCourseworkByDeadline,
} = require('../utils/courseworkCalculations');
const { handleError } = require('../utils/errorHandler');

const processCourseworkSchedule = (req, res) => {
  try {
    const { templateData, formFactor, moduleCredit, courseworkList } = req.body;

    // Validate input types and structure
    if (
      !Array.isArray(courseworkList) ||
      !Array.isArray(templateData) ||
      typeof moduleCredit !== 'number' ||
      typeof formFactor !== 'number'
    ) {
      return res.status(400).json({
        error: 'Invalid input types',
        received: {
          courseworkListType: typeof courseworkList,
          templateDataType: typeof templateData,
          moduleCreditType: typeof moduleCredit,
          formFactorType: typeof formFactor,
        },
      });
    }

    // Sort coursework by deadline week for sequential processing
    const sortedCourseworks = sortCourseworkByDeadline(courseworkList);

    let lastDeadlineWeek = 0;
    const processedCourseworks = sortedCourseworks.map((coursework) => {
      const startWeek = lastDeadlineWeek;
      const endWeek = coursework.deadlineWeek;
      lastDeadlineWeek = endWeek;

      console.log(`Processing coursework: ${coursework.shortTitle}`);
      console.log('Week range:', { startWeek, endWeek });

      const fields = calculateFieldsForCoursework(
        coursework,
        templateData,
        moduleCredit,
        formFactor,
        startWeek,
        endWeek,
      );

      return { ...coursework, ...fields };
    });

    res.json({ courseworkList: processedCourseworks });
  } catch (error) {
    console.error('Processing error:', error);
    handleError(res, error);
  }
};

module.exports = {
  processCourseworkSchedule,
};
