// Sort coursework by deadlineWeek
const sortCourseworkByDeadline = (courseworkList) => {
  return courseworkList.sort((a, b) => a.deadlineWeek - b.deadlineWeek);
};

// Calculate total expected time
const calculateTotalExpectedTime = (moduleCredit, weight) => {
  const expectedTime = Math.round(moduleCredit * 10 * (weight / 100));
  return expectedTime;
};

// Calculate contact time for non-exam coursework with formFactor across all semesters
const calculateContactTime = (
  templateData,
  formFactor,
  startWeek,
  endWeek,
  contactTypeIndex,
) => {
  let totalContactTime = 0;
  const adjustedFormFactor = formFactor / 100; // Adjust form factor to percentage

  // Iterate over all semesters in templateData
  for (const semesterData of templateData) {
    if (semesterData[contactTypeIndex]) {
      const weeksData = semesterData[contactTypeIndex].slice(
        startWeek,
        endWeek,
      );

      weeksData.forEach((hours, index) => {
        // Apply form factor correctly for each contact type except for labs (contactTypeIndex 2)
        if (contactTypeIndex === 2) {
          // Labs do not use form factor
          totalContactTime += hours || 0;
        } else {
          totalContactTime += (hours || 0) * adjustedFormFactor;
        }
      });
    }
  }

  return Math.round(totalContactTime); // Round the result to nearest integer
};

// Calculate contact time for exams across all semesters (without formFactor)
const calculateExamContactTime = (templateData, endWeek, contactTypeIndex) => {
  let totalContactTime = 0;

  // Iterate over all semesters in templateData
  for (const semesterData of templateData) {
    if (semesterData[contactTypeIndex]) {
      const weeksData = semesterData[contactTypeIndex].slice(0, endWeek);
      const contactTime = weeksData.reduce(
        (sum, hours) => sum + (hours || 0),
        0,
      );
      totalContactTime += contactTime;
    }
  }

  return totalContactTime;
};

// Calculate fields for coursework, including contact times, expected total time, and keyboard time
const calculateFieldsForCoursework = (
  coursework,
  templateData,
  moduleCredit,
  formFactor,
  startWeek,
  endWeek,
) => {
  const totalExpectedTime = calculateTotalExpectedTime(
    moduleCredit,
    coursework.weight,
  );
  const isExam = coursework.type === 'exam';

  const fields = {
    contactTimeLectures: isExam
      ? calculateExamContactTime(templateData, endWeek, 0)
      : calculateContactTime(templateData, formFactor, startWeek, endWeek, 0),
    contactTimeTutorials: isExam
      ? calculateExamContactTime(templateData, endWeek, 1)
      : calculateContactTime(templateData, formFactor, startWeek, endWeek, 1),
    contactTimeLabs: isExam
      ? calculateExamContactTime(templateData, endWeek, 2)
      : calculateContactTime(templateData, 100, startWeek, endWeek, 2), // Labs bypass form factor (using 100%)
    contactTimeSeminars: isExam
      ? calculateExamContactTime(templateData, endWeek, 3)
      : calculateContactTime(templateData, formFactor, startWeek, endWeek, 3),
    contactTimeFieldworkPlacement: isExam
      ? calculateExamContactTime(templateData, endWeek, 4)
      : calculateContactTime(templateData, formFactor, startWeek, endWeek, 4),
    contactTimeOthers: isExam
      ? calculateExamContactTime(templateData, endWeek, 5)
      : calculateContactTime(templateData, formFactor, startWeek, endWeek, 5),
    expectedTotalTime: totalExpectedTime,
    keyboardTime: getKeyboardTime(coursework, moduleCredit),
    feedbackTime: isExam ? null : 1,
  };

  // Round all contact time fields to integers
  Object.keys(fields).forEach((key) => {
    if (typeof fields[key] === 'number') {
      fields[key] = Math.round(fields[key]);
    }
  });

  return fields;
};

// Calculate keyboard time based on coursework type and module credit
const getKeyboardTime = (coursework, moduleCredit) => {
  let keyboardTime = 0;

  if (moduleCredit === 15) {
    switch (coursework.type) {
      case 'class test':
      case 'other':
        keyboardTime = 1;
        break;
      case 'exam':
      case 'lab report':
        keyboardTime = 3;
        break;
      case 'presentation':
        keyboardTime = 2;
        break;
      case 'assignment':
        keyboardTime = 8;
        break;
      default:
        keyboardTime = 0;
    }
  } else if (moduleCredit === 7.5) {
    switch (coursework.type) {
      case 'class test':
      case 'other':
        keyboardTime = 1;
        break;
      case 'exam':
      case 'lab report':
        keyboardTime = 2;
        break;
      case 'presentation':
        keyboardTime = 1;
        break;
      case 'assignment':
        keyboardTime = 4;
        break;
      default:
        keyboardTime = 0;
    }
  }
  return keyboardTime;
};

module.exports = {
  sortCourseworkByDeadline,
  calculateTotalExpectedTime,
  calculateContactTime,
  calculateExamContactTime,
  getKeyboardTime,
  calculateFieldsForCoursework,
};
