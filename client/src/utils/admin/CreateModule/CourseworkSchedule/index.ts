import { Coursework } from '../../../../types/admin/CreateModule/CourseworkSetup';

export const calculateTotalTime = (coursework: Coursework) => {
  const totalTime =
    (coursework.contactTimeLectures || 0) +
    (coursework.contactTimeTutorials || 0) +
    (coursework.contactTimeLabs || 0) +
    (coursework.contactTimeSeminars || 0) +
    (coursework.contactTimeFieldworkPlacement || 0) +
    (coursework.contactTimeOthers || 0) +
    (coursework.formativeAssessment || 0) +
    (coursework.privateStudy || 0) +
    (coursework.preparationTime || 0) +
    (coursework.keyboardTime || 0) +
    (coursework.feedbackTime || 0);
  return totalTime;
};

export const expectedTotalTime = (weight: number, moduleCredit: number) => {
  return parseFloat((moduleCredit * 10 * (weight / 100)).toFixed(2));
};

export const updateCourseworkList = (
  courseworkList: Coursework[],
  templateData: number[][][],
  moduleCredit: number,
): { updatedCourseworkList: Coursework[]; shouldUpdate: boolean } => {
  const sortedCourseworkList = [...courseworkList].sort((a, b) => {
    const getNumericDeadlineWeek = (deadlineWeek: number | string) =>
      typeof deadlineWeek === 'string'
        ? parseInt(deadlineWeek, 10)
        : deadlineWeek;
    return (
      getNumericDeadlineWeek(a.deadlineWeek) -
      getNumericDeadlineWeek(b.deadlineWeek)
    );
  });

  let shouldUpdate = false;

  const updatedCourseworkList = sortedCourseworkList.map(
    (coursework, index) => {
      const numericDeadlineWeek =
        typeof coursework.deadlineWeek === 'string'
          ? parseInt(coursework.deadlineWeek, 10)
          : coursework.deadlineWeek;

      const previousCoursework = sortedCourseworkList[index - 1];
      const previousDeadlineWeek = previousCoursework
        ? previousCoursework.deadlineWeek
        : 0;

      const startWeek =
        typeof previousDeadlineWeek === 'string'
          ? parseInt(previousDeadlineWeek, 10)
          : previousDeadlineWeek;

      const calculateContactTime = (activityData: number[]) =>
        activityData
          .slice(startWeek, numericDeadlineWeek)
          .reduce((acc, val) => acc + val, 0);

      const contactTimeFields = {
        contactTimeLectures: templateData.reduce(
          (total, semesterData) =>
            total + calculateContactTime(semesterData[0]),
          0,
        ),
        contactTimeTutorials: templateData.reduce(
          (total, semesterData) =>
            total + calculateContactTime(semesterData[1]),
          0,
        ),
        contactTimeLabs: templateData.reduce(
          (total, semesterData) =>
            total + calculateContactTime(semesterData[2]),
          0,
        ),
        contactTimeSeminars: templateData.reduce(
          (total, semesterData) =>
            total + calculateContactTime(semesterData[3]),
          0,
        ),
        contactTimeFieldworkPlacement: templateData.reduce(
          (total, semesterData) =>
            total + calculateContactTime(semesterData[4]),
          0,
        ),
        contactTimeOthers: templateData.reduce(
          (total, semesterData) =>
            total + calculateContactTime(semesterData[5]),
          0,
        ),
      };

      const updatedCoursework = {
        ...coursework,
        deadlineWeek: numericDeadlineWeek,
        feedbackTime:
          coursework.type === 'exam' ? 0 : coursework.feedbackTime || 1,
        formativeAssessment:
          coursework.type === 'exam' ? 0 : coursework.formativeAssessment || 1,
        keyboardTime: getKeyboardTime(coursework, moduleCredit),
        preparationTime: getPreparationTime(coursework, moduleCredit),
        privateStudy: getPrivateStudyTime(coursework, moduleCredit),
        ...contactTimeFields,
      };

      shouldUpdate =
        shouldUpdate ||
        JSON.stringify(updatedCoursework) !== JSON.stringify(coursework);

      return updatedCoursework;
    },
  );

  return { updatedCourseworkList, shouldUpdate };
};

export const getKeyboardTime = (
  coursework: Coursework,
  moduleCredit: number,
): number => {
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

export const getPreparationTime = (
  coursework: Coursework,
  moduleCredit: number,
): number => {
  if (coursework.type === 'exam') {
    return 0;
  }

  const totalTime =
    (coursework.contactTimeLectures || 0) +
    (coursework.contactTimeTutorials || 0) +
    (coursework.contactTimeLabs || 0) +
    (coursework.contactTimeSeminars || 0) +
    (coursework.contactTimeFieldworkPlacement || 0) +
    (coursework.contactTimeOthers || 0) +
    (coursework.formativeAssessment || 0) +
    (coursework.keyboardTime || 0) +
    (coursework.feedbackTime || 0);

  return Math.max(
    expectedTotalTime(coursework.weight || 0, moduleCredit) - totalTime,
    0,
  );
};

export const getPrivateStudyTime = (
  coursework: Coursework,
  moduleCredit: number,
): number => {
  if (coursework.type !== 'exam') {
    return 0;
  }

  const totalTime =
    (coursework.contactTimeLectures || 0) +
    (coursework.contactTimeTutorials || 0) +
    (coursework.contactTimeLabs || 0) +
    (coursework.contactTimeSeminars || 0) +
    (coursework.contactTimeFieldworkPlacement || 0) +
    (coursework.contactTimeOthers || 0) +
    (coursework.formativeAssessment || 0) +
    (coursework.keyboardTime || 0) +
    (coursework.feedbackTime || 0);

  return Math.max(
    expectedTotalTime(coursework.weight || 0, moduleCredit) - totalTime,
    0,
  );
};
