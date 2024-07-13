// exports.generateDistribution = (deadline, studyHours, maxStudyHours) => {
//   const numWeeks = 15;
//   let earlyBirdDistribution = [];
//   let distributionWeeks = Math.ceil(studyHours / maxStudyHours);
//   let tempStudyHours = studyHours;

//   for (let week = numWeeks; week >= 1; week--) {
//     const hoursForWeek =
//       week <= deadline
//         ? distributionWeeks > 0
//           ? tempStudyHours % maxStudyHours === 0
//             ? maxStudyHours
//             : tempStudyHours % maxStudyHours
//           : 0
//         : 0;

//     earlyBirdDistribution.push({
//       week,
//       hours:
//         hoursForWeek % 2 === 0 ? hoursForWeek : Number(hoursForWeek.toFixed(2)),
//     });

//     week <= deadline && distributionWeeks--;
//     week <= deadline && (tempStudyHours = tempStudyHours - hoursForWeek);
//   }

//   earlyBirdDistribution = earlyBirdDistribution.reverse();

//   let moderateDistribution = [];
//   distributionWeeks = Math.ceil(studyHours / maxStudyHours);
//   const hoursPerWeek = studyHours / distributionWeeks;

//   for (let week = numWeeks; week >= 1; week--) {
//     const hoursForWeek =
//       week <= deadline ? (distributionWeeks > 0 ? hoursPerWeek : 0) : 0;

//     moderateDistribution.push({
//       week,
//       hours:
//         hoursForWeek % 2 === 0 ? hoursForWeek : Number(hoursForWeek.toFixed(2)),
//     });

//     week <= deadline && distributionWeeks--;
//   }

//   moderateDistribution = moderateDistribution.reverse();

//   let procrastinatorDistribution = [];
//   distributionWeeks = Math.ceil(studyHours / maxStudyHours);
//   tempStudyHours = studyHours;

//   for (let week = numWeeks; week >= 1; week--) {
//     const hoursForWeek =
//       week <= deadline
//         ? distributionWeeks > 0
//           ? tempStudyHours > maxStudyHours
//             ? maxStudyHours
//             : tempStudyHours
//           : 0
//         : 0;

//     procrastinatorDistribution.push({
//       week,
//       hours:
//         hoursForWeek % 2 === 0 ? hoursForWeek : Number(hoursForWeek.toFixed(2)),
//     });

//     week <= deadline && distributionWeeks--;
//     week <= deadline && (tempStudyHours = tempStudyHours - hoursForWeek);
//   }

//   procrastinatorDistribution = procrastinatorDistribution.reverse();

//   return {
//     earlyBirdDistribution,
//     moderateDistribution,
//     procrastinatorDistribution,
//   };
// };

// const calculateDistribution = (hours, numWeeks) => {
//   const distribution = [];
//   let hoursPerWeek = hours / 12;
//   for (let week = 1; week <= numWeeks; week++) {
//     const hoursForWeek = week <= 12 ? hoursPerWeek : 0;
//     distribution.push({
//       week,
//       hours:
//         hoursForWeek % 2 === 0 ? hoursForWeek : Number(hoursForWeek.toFixed(2)),
//     });
//   }
//   return distribution;
// };

// exports.createLecturesObject = (lectures, numWeeks) => ({
//   hours: lectures.hours,
//   distribution: calculateDistribution(lectures.hours, numWeeks),
// });

// exports.createSeminarsObject = (seminars, numWeeks) => ({
//   hours: seminars.hours,
//   distribution: calculateDistribution(seminars.hours, numWeeks),
// });

// exports.createTutorialsObject = (tutorials, numWeeks) => ({
//   hours: tutorials.hours,
//   distribution: calculateDistribution(tutorials.hours, numWeeks),
// });

// exports.createLabsObject = (labs, numWeeks) => ({
//   hours: labs.hours,
//   distribution: calculateDistribution(labs.hours, numWeeks),
// });

// exports.createFieldworkPlacementObject = (fieldworkPlacement, numWeeks) => ({
//   hours: fieldworkPlacement.hours,
//   distribution: calculateDistribution(fieldworkPlacement.hours, numWeeks),
// });

// exports.createOtherObject = (other, numWeeks) => ({
//   hours: other.hours,
//   distribution: calculateDistribution(other.hours, numWeeks),
// });

// exports.aggregateDistributions = (distributions) => {
//   const aggregated = {};

//   distributions.forEach((distribution) => {
//     // Check if distribution is an array before proceeding
//     if (Array.isArray(distribution)) {
//       distribution.forEach(({ week, hours }) => {
//         if (!aggregated[week]) {
//           aggregated[week] = 0;
//         }
//         aggregated[week] += hours;
//       });
//     } else {
//       console.log('Skipping non-array distribution:', distribution);
//     }
//   });

//   // Convert the aggregated map back into an array of { week, hours }
//   return Object.keys(aggregated)
//     .map((week) => ({
//       week: parseInt(week),
//       hours: parseFloat(aggregated[week].toFixed(2)),
//     }))
//     .sort((a, b) => a.week - b.week); // Ensure the distribution is sorted by week
// };

exports.calculateWorkloadGraphData = (
  formData,
  courseworkList,
  templateData,
  studyStyle,
) => {
  const workloadData = Array(15)
    .fill(0)
    .map((_, i) => ({
      week: i + 1,
      lectures: 0,
      coursework: 0,
    }));

  console.log(
    `Calculating workload graph data using studyStyle: ${studyStyle}`,
  );

  courseworkList.forEach((coursework) => {
    const { preparationTime, deadlineWeek, releaseWeek } = coursework;
    const actualStartWeek = deadlineWeek - releaseWeek;

    console.log(
      `Coursework: ${coursework.shortTitle}, Preparation Time: ${preparationTime}, Deadline Week: ${deadlineWeek}, Release Week: ${releaseWeek}, Actual Start Week: ${actualStartWeek}`,
    );

    switch (studyStyle) {
      case 'style1':
        const weeksToDistribute = deadlineWeek - actualStartWeek + 1; // Including the deadlineWeek
        const timePerWeek = preparationTime / weeksToDistribute;
        console.log(
          `Style 1: Distributing ${preparationTime} hours over ${weeksToDistribute} weeks. Time per week: ${timePerWeek}`,
        );
        for (let week = actualStartWeek; week <= deadlineWeek; week++) {
          if (week > 0 && week <= 15) {
            workloadData[week - 1].coursework += timePerWeek;
          }
        }
        break;

      case 'style2':
        const weeksToDistribute2 = deadlineWeek - actualStartWeek + 1;
        const t =
          (2 * preparationTime - 2 * releaseWeek - 2) /
          (releaseWeek * releaseWeek + releaseWeek);
        console.log(
          `Style 2: Calculated t = ${t}. Distributing ${preparationTime} hours over ${weeksToDistribute2} weeks with incremental time allocation.`,
        );
        let cumulativeTime2 = 1;
        for (let week = actualStartWeek; week <= deadlineWeek; week++) {
          if (week > 0 && week <= 15) {
            workloadData[week - 1].coursework += cumulativeTime2;
            cumulativeTime2 += t;
          }
        }
        break;

      case 'style3':
        console.log(
          `Style 3: Assigning all ${preparationTime} hours to week ${deadlineWeek}`,
        );
        if (deadlineWeek > 0 && deadlineWeek <= 15) {
          workloadData[deadlineWeek - 1].coursework += preparationTime;
        }
        break;

      // Add more cases for other styles here...

      default:
        console.log(`Unknown study style: ${studyStyle}`);
        break;
    }
  });

  console.log('Workload Data:', workloadData);

  return workloadData;
};
