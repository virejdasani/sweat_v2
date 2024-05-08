import { Coursework } from '../../../../types/admin/CreateModule/CourseworkSetup';

export const calculateTotalTime = (coursework: Coursework) => {
  const totalTime =
    (coursework.contactTimeLecture || 0) +
    (coursework.contactTimeTutorial || 0) +
    (coursework.contactTimeLab || 0) +
    (coursework.contactTimeBriefing || 0) +
    (coursework.formativeAssessment || 0) +
    (coursework.privateStudyPreparation || 0) +
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
        contactTimeLecture: templateData.reduce(
          (total, semesterData) =>
            total + calculateContactTime(semesterData[0]),
          0,
        ),
        contactTimeTutorial: templateData.reduce(
          (total, semesterData) =>
            total + calculateContactTime(semesterData[1]),
          0,
        ),
        contactTimeLab: templateData.reduce(
          (total, semesterData) =>
            total + calculateContactTime(semesterData[2]),
          0,
        ),
        contactTimeBriefing: templateData.reduce(
          (total, semesterData) =>
            total +
            semesterData
              .slice(3, 6)
              .reduce(
                (acc, activityData) => acc + calculateContactTime(activityData),
                0,
              ),
          0,
        ),
      };

      const updatedCoursework = {
        ...coursework,
        deadlineWeek: numericDeadlineWeek,
        feedbackTime: coursework.feedbackTime || 1,
        ...contactTimeFields,
      };

      shouldUpdate =
        shouldUpdate ||
        JSON.stringify(updatedCoursework) !== JSON.stringify(coursework);

      return updatedCoursework;
    },
  );

  const examIndex = updatedCourseworkList.findIndex(
    (coursework) => coursework.type === 'exam',
  );
  if (examIndex !== -1 && !updatedCourseworkList[examIndex].feedbackTime) {
    updatedCourseworkList[examIndex].feedbackTime = 1;
    shouldUpdate = true;
  }

  return { updatedCourseworkList, shouldUpdate };
};
