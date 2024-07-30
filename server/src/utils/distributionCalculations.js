const { roundToNearestHalf, safeDivide } = require('./helpers');

// Calculate preparation time distributions for coursework that is not of type exam
const calculatePreparationDistributions = (
  coursework,
  studyStyle,
  semester,
) => {
  if (!coursework) {
    throw new Error('Coursework is undefined');
  }

  const isWholeSession = semester.toLowerCase() === 'whole session';
  const totalWeeks = isWholeSession
    ? 33
    : semester.toLowerCase() === 'second'
      ? 18
      : 15;
  const workloadData = Array(totalWeeks)
    .fill(0)
    .map((_, i) => ({ week: i + 1, coursework: 0 }));

  const { preparationTime, deadlineWeek, releasedWeekPrior } = coursework;
  let actualStartWeek = deadlineWeek - (releasedWeekPrior ?? 0);
  if (actualStartWeek < 1) {
    actualStartWeek = 1;
  }
  let totalPreparationTime = preparationTime || 0;

  const distributeTime = (startWeek, endWeek, timePerWeek) => {
    for (let week = startWeek; week <= endWeek; week++) {
      if (week > 0 && week <= totalWeeks) {
        workloadData[week - 1].coursework += roundToNearestHalf(timePerWeek);
      }
    }
  };

  switch (studyStyle) {
    case 'earlyStarter':
      const weeksForDistribution1 = deadlineWeek - actualStartWeek + 1;
      let timePerWeek1 = safeDivide(
        totalPreparationTime,
        weeksForDistribution1,
      );
      distributeTime(actualStartWeek, deadlineWeek, timePerWeek1);
      break;
    case 'steady':
      if (actualStartWeek > 0 && actualStartWeek <= totalWeeks) {
        const weeksForDistribution2 = deadlineWeek - releasedWeekPrior + 1;
        const incrementValue = safeDivide(
          2 * totalPreparationTime - 2 * releasedWeekPrior - 2,
          releasedWeekPrior * releasedWeekPrior + releasedWeekPrior,
        );
        let cumulativeTime = 1;
        workloadData[actualStartWeek - 1].coursework += 1; // First week always 1 hour
        for (let week = actualStartWeek + 1; week <= deadlineWeek; week++) {
          if (week > 0 && week <= totalWeeks) {
            cumulativeTime += incrementValue;
            workloadData[week - 1].coursework +=
              roundToNearestHalf(cumulativeTime);
          }
        }
      } else {
        throw new Error(`Invalid actual start week: ${actualStartWeek}`);
      }
      break;
    case 'justInTime':
      if (deadlineWeek > 0 && deadlineWeek <= totalWeeks) {
        workloadData[deadlineWeek - 1].coursework +=
          roundToNearestHalf(totalPreparationTime);
      } else {
        throw new Error(`Invalid deadline week: ${deadlineWeek}`);
      }
      break;
    default:
      throw new Error(`Unknown study style: ${studyStyle}`);
  }

  return workloadData.map((data) => ({
    week: data.week,
    hours: data.coursework,
  }));
};

const calculatePreparationTimeDistributions = (coursework, semester) => {
  const studyStyles = ['earlyStarter', 'steady', 'justInTime'];
  return studyStyles.map((style) => ({
    type: style,
    distribution: calculatePreparationDistributions(
      coursework,
      style,
      semester,
    ),
  }));
};

// Calculate private study time distribution for a given ratio using teachingSchedule
const calculatePrivateStudyDistribution = (
  teachingSchedule,
  privateStudyTime,
  ratio,
  totalWeeks,
) => {
  const workloadData = Array(totalWeeks)
    .fill(0)
    .map((_, i) => ({ week: i + 1, hours: 0 }));

  let totalAllocatedTime = 0;

  Object.values(teachingSchedule).forEach((activity) => {
    if (activity.distribution && Array.isArray(activity.distribution)) {
      activity.distribution.forEach((week) => {
        const studyHours = roundToNearestHalf(week.hours * ratio);
        workloadData[week.week - 1].hours += studyHours;
        totalAllocatedTime += studyHours;
      });
    }
  });

  const remainingTime = Math.max(privateStudyTime - totalAllocatedTime, 0);

  return { distribution: workloadData, remainingTime, totalAllocatedTime };
};

const calculatePrivateStudyDistributions = (
  teachingSchedule,
  coursework,
  semester,
) => {
  const isWholeSession = semester.toLowerCase() === 'whole session';
  const totalWeeks = isWholeSession
    ? 33
    : semester.toLowerCase() === 'second'
      ? 18
      : 15;

  if (coursework.type !== 'exam') {
    throw new Error(
      "Private study distributions should only be calculated for coursework of type 'exam'.",
    );
  }

  const { privateStudyTime } = coursework;
  const ratios = [0, 0.5, 1, 2];
  const privateStudyDistributions = ratios.map((ratio) => {
    const { distribution, remainingTime, totalAllocatedTime } =
      calculatePrivateStudyDistribution(
        teachingSchedule,
        privateStudyTime,
        ratio,
        totalWeeks,
      );

    // Adjust for the case where 2x ratio exceeds privateStudyTime
    const adjustedRemainingTime =
      ratio === 2 && totalAllocatedTime > privateStudyTime ? 4 : remainingTime;

    return {
      type: `ratio${ratio.toString().replace('.', '_')}`,
      distribution: distribution.map((data) => ({
        week: data.week,
        hours: data.hours,
      })),
      remainingTime: adjustedRemainingTime,
    };
  });

  return privateStudyDistributions;
};

const calculateRemainingPreparationDistributions = (
  remainingTime,
  studyStyle,
  semester,
  type,
) => {
  const isWholeSession = semester.toLowerCase() === 'whole session';
  const startWeek = isWholeSession
    ? 31
    : semester.toLowerCase() === 'second'
      ? 16
      : 13;
  const endWeek = isWholeSession
    ? 33
    : semester.toLowerCase() === 'second'
      ? 18
      : 15;
  const totalWeeks = endWeek - startWeek + 1;

  const workloadData = Array(totalWeeks)
    .fill(0)
    .map((_, i) => ({ week: startWeek + i, hours: 0 }));

  const distributeTime = (startWeek, endWeek, timePerWeek) => {
    for (let week = startWeek; week <= endWeek; week++) {
      workloadData[week - startWeek].hours += roundToNearestHalf(timePerWeek);
    }
  };

  switch (studyStyle) {
    case 'earlyStarter':
      const weeksForDistribution1 = endWeek - startWeek + 1;
      let timePerWeek1 = safeDivide(
        remainingTime > 0 ? remainingTime : 4,
        weeksForDistribution1,
      );
      distributeTime(startWeek, endWeek, timePerWeek1);
      break;
    case 'steady':
      const weeksForDistribution2 = endWeek - startWeek + 1;
      const incrementValue = safeDivide(
        2 * (remainingTime > 0 ? remainingTime : 4) - 2,
        (weeksForDistribution2 * (weeksForDistribution2 + 1)) / 2,
      );
      let cumulativeTime = 1;
      workloadData[0].hours += 1; // First week always 1 hour
      for (let week = startWeek + 1; week <= endWeek; week++) {
        cumulativeTime += incrementValue;
        workloadData[week - startWeek].hours +=
          roundToNearestHalf(cumulativeTime);
      }
      break;
    case 'justInTime':
      workloadData[endWeek - startWeek].hours += roundToNearestHalf(
        remainingTime > 0 ? remainingTime : 4,
      );
      break;
    default:
      throw new Error(`Unknown study style: ${studyStyle}`);
  }

  return workloadData.map((data) => ({ week: data.week, hours: data.hours }));
};

const calculateCompleteDistributions = (
  teachingSchedule,
  coursework,
  semester,
) => {
  try {
    if (coursework.type !== 'exam') {
      return {
        privateStudyDistributions: [],
        preparationTimeDistributions: calculatePreparationTimeDistributions(
          coursework,
          semester,
        ),
      };
    }

    // Update the deadlineWeek for exam coursework
    coursework.deadlineWeek =
      semester.toLowerCase() === 'whole session'
        ? 33
        : semester.toLowerCase() === 'second'
          ? 18
          : 15;

    const privateStudyDistributions = calculatePrivateStudyDistributions(
      teachingSchedule,
      coursework,
      semester,
    );

    const remainingTime = privateStudyDistributions.map(
      (item) => item.remainingTime,
    );

    const studyStyles = ['earlyStarter', 'steady', 'justInTime'];
    const preparationTimeDistributions = studyStyles
      .map((style) => {
        return remainingTime.map((time, index) => ({
          type: `${style}_${privateStudyDistributions[index].type}`,
          distribution: calculateRemainingPreparationDistributions(
            time,
            style,
            semester,
            privateStudyDistributions[index].type,
          ),
        }));
      })
      .flat();

    return {
      privateStudyDistributions,
      preparationTimeDistributions,
    };
  } catch (error) {
    console.error('Error in calculateCompleteDistributions:', error);
    throw error;
  }
};

module.exports = {
  calculatePreparationTimeDistributions,
  calculatePrivateStudyDistributions,
  calculateCompleteDistributions,
};
