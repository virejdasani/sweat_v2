const {
  generateDistribution,
  aggregateDistributions,
} = require('../utils/distributionsGenerator');
const {
  createLecturesObject,
  createSeminarsObject,
  createTutorialsObject,
  createLabsObject,
  createFieldworkPlacementObject,
  createOtherObject,
} = require('../utils/distributionsGenerator');

exports.studyWorkloadSimulatorAlgorithm = (data) => {
  try {
    const {
      id,
      name,
      year,
      type,
      programme,
      semester,
      credits,
      timetabledHours,
      lectures,
      seminars,
      tutorials,
      labs,
      fieldworkPlacement,
      other,
      courseworks,
    } = data;

    const totalStudyHours = credits * 10;
    const privateStudyHours = totalStudyHours - timetabledHours;
    const numWeeks = 15;

    const lecturesObject = createLecturesObject(lectures, numWeeks);
    const seminarsObject = createSeminarsObject(seminars, numWeeks);
    const tutorialsObject = createTutorialsObject(tutorials, numWeeks);
    const labsObject = createLabsObject(labs, numWeeks);
    const fieldworkPlacementObject = createFieldworkPlacementObject(
      fieldworkPlacement,
      numWeeks,
    );
    const otherObject = createOtherObject(other, numWeeks);

    const courseworkPrepObject = courseworks.map((coursework) => {
      const maxStudyHours = 20;
      const {
        cwTitle,
        weight,
        type,
        deadlineWeek,
        releaseWeek,
        studyHours,
      } = coursework;
      const {
        earlyBirdDistribution,
        moderateDistribution,
        procrastinatorDistribution,
      } = generateDistribution(deadlineWeek, studyHours, maxStudyHours);

      return {
        cwTitle,
        weight,
        type,
        deadlineWeek,
        releaseWeek,
        studyHours,
        distribution: {
          earlybird: earlyBirdDistribution,
          moderate: moderateDistribution,
          procrastinator: procrastinatorDistribution,
        },
      };
    });

    const distributions = [
      lecturesObject.distribution,
      seminarsObject.distribution,
      tutorialsObject.distribution,
      labsObject.distribution,
      fieldworkPlacementObject.distribution,
      otherObject.distribution,
      ...courseworkPrepObject.map(
        (coursework) => coursework.distribution.moderate,
      ),
    ];

    const totalHoursDistribution = aggregateDistributions(distributions);

    return {
      id,
      name,
      year,
      type,
      programme,
      semester,
      credits,
      totalStudyHours,
      timetabledHours,
      privateStudyHours,
      lectures: lecturesObject,
      seminars: seminarsObject,
      tutorials: tutorialsObject,
      labs: labsObject,
      fieldworkPlacement: fieldworkPlacementObject,
      other: otherObject,
      courseworks: courseworkPrepObject,
      totalHours: totalHoursDistribution,
    };
  } catch (error) {
    console.error('Error in study workload simulator algorithm:', error);
    throw error;
  }
};
