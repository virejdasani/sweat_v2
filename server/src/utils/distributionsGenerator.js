exports.generateDistribution = (deadline, studyHours, maxStudyHours) => {
  const numWeeks = 15;
  let earlyBirdDistribution = [];
  let distributionWeeks = Math.ceil(studyHours / maxStudyHours);
  let tempStudyHours = studyHours;

  for (let week = numWeeks; week >= 1; week--) {
    const hoursForWeek =
      week <= deadline
        ? distributionWeeks > 0
          ? tempStudyHours % maxStudyHours === 0
            ? maxStudyHours
            : tempStudyHours % maxStudyHours
          : 0
        : 0;

    earlyBirdDistribution.push({
      week,
      hours:
        hoursForWeek % 2 === 0 ? hoursForWeek : Number(hoursForWeek.toFixed(2)),
    });

    week <= deadline && distributionWeeks--;
    week <= deadline && (tempStudyHours = tempStudyHours - hoursForWeek);
  }

  earlyBirdDistribution = earlyBirdDistribution.reverse();

  let moderateDistribution = [];
  distributionWeeks = Math.ceil(studyHours / maxStudyHours);
  const hoursPerWeek = studyHours / distributionWeeks;

  for (let week = numWeeks; week >= 1; week--) {
    const hoursForWeek =
      week <= deadline ? (distributionWeeks > 0 ? hoursPerWeek : 0) : 0;

    moderateDistribution.push({
      week,
      hours:
        hoursForWeek % 2 === 0 ? hoursForWeek : Number(hoursForWeek.toFixed(2)),
    });

    week <= deadline && distributionWeeks--;
  }

  moderateDistribution = moderateDistribution.reverse();

  let procrastinatorDistribution = [];
  distributionWeeks = Math.ceil(studyHours / maxStudyHours);
  tempStudyHours = studyHours;

  for (let week = numWeeks; week >= 1; week--) {
    const hoursForWeek =
      week <= deadline
        ? distributionWeeks > 0
          ? tempStudyHours > maxStudyHours
            ? maxStudyHours
            : tempStudyHours
          : 0
        : 0;

    procrastinatorDistribution.push({
      week,
      hours:
        hoursForWeek % 2 === 0 ? hoursForWeek : Number(hoursForWeek.toFixed(2)),
    });

    week <= deadline && distributionWeeks--;
    week <= deadline && (tempStudyHours = tempStudyHours - hoursForWeek);
  }

  procrastinatorDistribution = procrastinatorDistribution.reverse();

  return {
    earlyBirdDistribution,
    moderateDistribution,
    procrastinatorDistribution,
  };
};

const calculateDistribution = (hours, numWeeks) => {
  const distribution = [];
  let hoursPerWeek = hours / 12;
  for (let week = 1; week <= numWeeks; week++) {
    const hoursForWeek = week <= 12 ? hoursPerWeek : 0;
    distribution.push({
      week,
      hours:
        hoursForWeek % 2 === 0 ? hoursForWeek : Number(hoursForWeek.toFixed(2)),
    });
  }
  return distribution;
};

exports.createLecturesObject = (lectures, numWeeks) => ({
  hours: lectures.hours,
  distribution: calculateDistribution(lectures.hours, numWeeks),
});

exports.createSeminarsObject = (seminars, numWeeks) => ({
  hours: seminars.hours,
  distribution: calculateDistribution(seminars.hours, numWeeks),
});

exports.createTutorialsObject = (tutorials, numWeeks) => ({
  hours: tutorials.hours,
  distribution: calculateDistribution(tutorials.hours, numWeeks),
});

exports.createLabsObject = (labs, numWeeks) => ({
  hours: labs.hours,
  distribution: calculateDistribution(labs.hours, numWeeks),
});

exports.createFieldworkPlacementObject = (fieldworkPlacement, numWeeks) => ({
  hours: fieldworkPlacement.hours,
  distribution: calculateDistribution(fieldworkPlacement.hours, numWeeks),
});

exports.createOtherObject = (other, numWeeks) => ({
  hours: other.hours,
  distribution: calculateDistribution(other.hours, numWeeks),
});

exports.aggregateDistributions = (distributions) => {
  const aggregated = {};

  distributions.forEach((distribution) => {
    // Check if distribution is an array before proceeding
    if (Array.isArray(distribution)) {
      distribution.forEach(({ week, hours }) => {
        if (!aggregated[week]) {
          aggregated[week] = 0;
        }
        aggregated[week] += hours;
      });
    } else {
      console.log('Skipping non-array distribution:', distribution);
    }
  });

  // Convert the aggregated map back into an array of { week, hours }
  return Object.keys(aggregated)
    .map((week) => ({
      week: parseInt(week),
      hours: parseFloat(aggregated[week].toFixed(2)),
    }))
    .sort((a, b) => a.week - b.week); // Ensure the distribution is sorted by week
};

