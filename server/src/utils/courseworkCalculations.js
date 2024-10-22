// utils/courseworkUtils.js

/**
 * Initializes the coursework list with calculations.
 */
exports.initializeCourseworkList = (
  courseworkList,
  templateData,
  moduleCredit,
  formFactor,
  isEditing,
) => {
  if (isEditing) {
    return courseworkList;
  }

  let updatedCourseworkList = exports.updateCourseworkList(
    courseworkList,
    templateData,
    moduleCredit,
    formFactor,
  );

  updatedCourseworkList = exports.updateExamContactTime(
    updatedCourseworkList,
    templateData,
    moduleCredit,
    formFactor,
  );

  return updatedCourseworkList.map((coursework) => {
    const { preparationTime, privateStudyTime } =
      exports.getPreparationTimeAndPrivateStudyTime(coursework, moduleCredit);
    const totalTime = exports.calculateTotalTime(coursework);
    const expectedTime = exports.expectedTotalTime(
      coursework.weight || 0,
      moduleCredit,
    );

    return {
      ...coursework,
      preparationTime,
      privateStudyTime,
      totalTime,
      expectedTotalTime: expectedTime,
    };
  });
};

/**
 * Recalculates the coursework list when dependencies change.
 */
exports.recalculateCourseworkList = (
  initialCourseworkList,
  templateData,
  moduleCredit,
  formFactor,
  manualChanges,
  currentCourseworkList,
) => {
  let updatedCourseworkList = exports.updateCourseworkList(
    initialCourseworkList,
    templateData,
    moduleCredit,
    formFactor,
  );

  // Apply manual changes to preparationTime and privateStudyTime
  updatedCourseworkList = updatedCourseworkList.map((coursework, index) => {
    const currentCoursework = currentCourseworkList[index];
    return {
      ...coursework,
      preparationTime: manualChanges[`${index}-preparationTime`]
        ? currentCoursework.preparationTime
        : coursework.preparationTime,
      privateStudyTime: manualChanges[`${index}-privateStudyTime`]
        ? currentCoursework.privateStudyTime
        : coursework.privateStudyTime,
    };
  });

  updatedCourseworkList = exports.updateExamContactTime(
    updatedCourseworkList,
    templateData,
    moduleCredit,
    formFactor,
  );

  return updatedCourseworkList.map((coursework) => {
    const { preparationTime, privateStudyTime } =
      exports.getPreparationTimeAndPrivateStudyTime(coursework, moduleCredit);
    const totalTime = exports.calculateTotalTime(coursework);
    const expectedTime = exports.expectedTotalTime(
      coursework.weight || 0,
      moduleCredit,
    );

    return {
      ...coursework,
      preparationTime,
      privateStudyTime,
      totalTime,
      expectedTotalTime: expectedTime,
    };
  });
};

/**
 * Updates the coursework list with calculated contact times.
 */
exports.updateCourseworkList = (
  courseworkList,
  templateData,
  moduleCredit,
  formFactor,
) => {
  // Helper function to ensure numeric deadlineWeek
  const getNumericDeadlineWeek = (deadlineWeek) =>
    typeof deadlineWeek === 'string'
      ? parseInt(deadlineWeek, 10)
      : deadlineWeek;

  const sortedCourseworkList = [...courseworkList].sort((a, b) => {
    return (
      getNumericDeadlineWeek(a.deadlineWeek) -
      getNumericDeadlineWeek(b.deadlineWeek)
    );
  });

  let previousDeadlineWeek;
  let sharedContactTime = {
    contactTimeLectures: 0,
    contactTimeTutorials: 0,
    contactTimeLabs: 0,
    contactTimeSeminars: 0,
    contactTimeFieldworkPlacement: 0,
    contactTimeOthers: 0,
  };

  const updatedCourseworkList = sortedCourseworkList.map(
    (coursework, index) => {
      const numericDeadlineWeek = getNumericDeadlineWeek(
        coursework.deadlineWeek,
      );

      // Only recalculate if the deadline week is different from the previous one
      if (
        previousDeadlineWeek === undefined ||
        numericDeadlineWeek !== previousDeadlineWeek
      ) {
        const startWeek =
          index > 0
            ? getNumericDeadlineWeek(
                sortedCourseworkList[index - 1].deadlineWeek,
              )
            : 0;

        sharedContactTime = {
          contactTimeLectures: Math.round(
            (exports.calculateContactTime(
              templateData,
              0,
              startWeek,
              numericDeadlineWeek,
            ) *
              formFactor) /
              100,
          ),
          contactTimeTutorials: Math.round(
            (exports.calculateContactTime(
              templateData,
              1,
              startWeek,
              numericDeadlineWeek,
            ) *
              formFactor) /
              100,
          ),
          contactTimeLabs: Math.round(
            exports.calculateContactTime(
              templateData,
              2,
              startWeek,
              numericDeadlineWeek,
            ),
          ), // formFactor not applied here
          contactTimeSeminars: Math.round(
            (exports.calculateContactTime(
              templateData,
              3,
              startWeek,
              numericDeadlineWeek,
            ) *
              formFactor) /
              100,
          ),
          contactTimeFieldworkPlacement: Math.round(
            (exports.calculateContactTime(
              templateData,
              4,
              startWeek,
              numericDeadlineWeek,
            ) *
              formFactor) /
              100,
          ),
          contactTimeOthers: Math.round(
            (exports.calculateContactTime(
              templateData,
              5,
              startWeek,
              numericDeadlineWeek,
            ) *
              formFactor) /
              100,
          ),
        };

        previousDeadlineWeek = numericDeadlineWeek;
      }

      const {
        feedbackTime,
        formativeAssessmentTime,
        keyboardTime,
        preparationTime,
        privateStudyTime,
      } = exports.getTimeFields(coursework, moduleCredit);

      return {
        ...coursework,
        deadlineWeek: numericDeadlineWeek,
        feedbackTime,
        formativeAssessmentTime,
        keyboardTime,
        preparationTime,
        privateStudyTime,
        ...sharedContactTime,
      };
    },
  );

  return updatedCourseworkList;
};

/**
 * Updates the exam contact time based on the remaining contact time after other courseworks.
 */
exports.updateExamContactTime = (
  courseworkList,
  templateData,
  moduleCredit,
  formFactor,
) => {
  // Calculate total contact time from the templateData
  const totalContactTime = [0, 1, 2, 3, 4, 5].map((activityIndex) =>
    templateData.reduce((semesterTotal, semesterData) => {
      return (
        semesterTotal +
        semesterData[activityIndex].reduce((weekTotal, weekHours) => {
          return weekTotal + weekHours;
        }, 0)
      );
    }, 0),
  );

  // Adjust totalContactTime with formFactor where applicable
  totalContactTime[0] = Math.round((totalContactTime[0] * formFactor) / 100);
  totalContactTime[1] = Math.round((totalContactTime[1] * formFactor) / 100);
  totalContactTime[3] = Math.round((totalContactTime[3] * formFactor) / 100);
  totalContactTime[4] = Math.round((totalContactTime[4] * formFactor) / 100);
  totalContactTime[5] = Math.round((totalContactTime[5] * formFactor) / 100);
  // Note: totalContactTime[2] (Labs) does not apply formFactor

  // Calculate non-exam coursework contact time totals
  const nonExamCourseworkList = courseworkList.filter(
    (coursework) => coursework.type !== 'exam',
  );

  const nonExamContactTimeTotals = nonExamCourseworkList.reduce(
    (totals, coursework) => {
      return [
        totals[0] + (coursework.contactTimeLectures || 0),
        totals[1] + (coursework.contactTimeTutorials || 0),
        totals[2] + (coursework.contactTimeLabs || 0),
        totals[3] + (coursework.contactTimeSeminars || 0),
        totals[4] + (coursework.contactTimeFieldworkPlacement || 0),
        totals[5] + (coursework.contactTimeOthers || 0),
      ];
    },
    [0, 0, 0, 0, 0, 0],
  );

  // Calculate exam contact times
  const examContactTime = totalContactTime.map(
    (total, index) => total - nonExamContactTimeTotals[index],
  );

  // Update the coursework list
  return courseworkList.map((coursework) => {
    if (coursework.type === 'exam') {
      return {
        ...coursework,
        contactTimeLectures: examContactTime[0],
        contactTimeTutorials: examContactTime[1],
        contactTimeLabs: examContactTime[2],
        contactTimeSeminars: examContactTime[3],
        contactTimeFieldworkPlacement: examContactTime[4],
        contactTimeOthers: examContactTime[5],
      };
    } else {
      return coursework;
    }
  });
};

/**
 * Calculates the total time for a coursework item.
 */
exports.calculateTotalTime = (coursework) => {
  const {
    contactTimeLectures = 0,
    contactTimeTutorials = 0,
    contactTimeLabs = 0,
    contactTimeSeminars = 0,
    contactTimeFieldworkPlacement = 0,
    contactTimeOthers = 0,
    formativeAssessmentTime = 0,
    privateStudyTime = 0,
    preparationTime = 0,
    keyboardTime = 0,
    feedbackTime = 0,
  } = coursework;

  return (
    contactTimeLectures +
    contactTimeTutorials +
    contactTimeLabs +
    contactTimeSeminars +
    contactTimeFieldworkPlacement +
    contactTimeOthers +
    formativeAssessmentTime +
    privateStudyTime +
    preparationTime +
    keyboardTime +
    feedbackTime
  );
};

/**
 * Calculates the expected total time based on weight and module credit.
 */
exports.expectedTotalTime = (weight, moduleCredit) => {
  return parseFloat((moduleCredit * 10 * (weight / 100)).toFixed(2));
};

/**
 * Calculates contact time for a specific activity between two weeks.
 */
exports.calculateContactTime = (
  templateData,
  activityIndex,
  startWeek,
  endWeek,
) => {
  if (!Array.isArray(templateData) || templateData.length < 1) {
    throw new Error('Invalid templateData structure');
  }

  if (activityIndex < 0 || activityIndex >= templateData[0].length) {
    throw new Error('Invalid activityIndex');
  }

  if (startWeek < 0 || endWeek <= startWeek) {
    throw new Error('Invalid week range');
  }

  const firstSemesterWeeks = templateData[0][0].length;
  const secondSemesterWeeks =
    templateData.length > 1 ? templateData[1][0].length : 0;

  let total = 0;

  for (let week = startWeek; week < endWeek; week++) {
    if (week < firstSemesterWeeks) {
      total += templateData[0][activityIndex][week];
    } else if (
      week >= firstSemesterWeeks &&
      week < firstSemesterWeeks + secondSemesterWeeks
    ) {
      const adjustedWeek = week - firstSemesterWeeks;
      total += templateData[1][activityIndex][adjustedWeek];
    }
  }

  return total;
};

/**
 * Gets time fields for a coursework item.
 */
exports.getTimeFields = (coursework, moduleCredit) => {
  const { preparationTime, privateStudyTime } =
    exports.getPreparationTimeAndPrivateStudyTime(coursework, moduleCredit);

  const feedbackTime =
    coursework.type === 'exam' ? 0 : coursework.feedbackTime || 1;
  const formativeAssessmentTime =
    coursework.type === 'exam' ? 0 : coursework.formativeAssessmentTime || 1;
  const keyboardTime = exports.getKeyboardTime(coursework, moduleCredit);

  return {
    feedbackTime,
    formativeAssessmentTime,
    keyboardTime,
    preparationTime,
    privateStudyTime,
  };
};

/**
 * Calculates the keyboard time based on coursework type and module credit.
 */
exports.getKeyboardTime = (coursework, moduleCredit) => {
  const moduleCreditNumber = Number(moduleCredit);

  if (moduleCreditNumber === 15) {
    switch (coursework.type) {
      case 'class test':
        return 1;
      case 'other':
        return 1;
      case 'exam':
        return 3;
      case 'lab report':
        return 3;
      case 'presentation':
        return 2;
      case 'assignment':
        return 8;
      default:
        return 0;
    }
  } else if (moduleCreditNumber === 7.5) {
    switch (coursework.type) {
      case 'class test':
        return 1;
      case 'other':
        return 1;
      case 'exam':
        return 2;
      case 'lab report':
        return 2;
      case 'presentation':
        return 1;
      case 'assignment':
        return 4;
      default:
        return 0;
    }
  }
  return 0;
};

/**
 * Calculates preparationTime and privateStudyTime for a coursework item.
 */
exports.getPreparationTimeAndPrivateStudyTime = (coursework, moduleCredit) => {
  // Exclude preparationTime and privateStudyTime initially
  const {
    contactTimeLectures = 0,
    contactTimeTutorials = 0,
    contactTimeLabs = 0,
    contactTimeSeminars = 0,
    contactTimeFieldworkPlacement = 0,
    contactTimeOthers = 0,
    formativeAssessmentTime = 0,
    keyboardTime = 0,
    feedbackTime = 0,
  } = coursework;

  const initialTotalTime =
    contactTimeLectures +
    contactTimeTutorials +
    contactTimeLabs +
    contactTimeSeminars +
    contactTimeFieldworkPlacement +
    contactTimeOthers +
    formativeAssessmentTime +
    keyboardTime +
    feedbackTime;

  const expectedTime = exports.expectedTotalTime(
    coursework.weight || 0,
    moduleCredit,
  );

  let preparationTime = 0;
  let privateStudyTime = 0;

  if (coursework.type === 'exam') {
    privateStudyTime = Math.max(expectedTime - initialTotalTime, 0);
  } else {
    preparationTime = Math.max(expectedTime - initialTotalTime, 0);
  }

  return { preparationTime, privateStudyTime };
};
