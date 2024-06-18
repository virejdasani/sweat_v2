import { Coursework } from '../../../../types/admin/CreateModule/CourseworkSetup';

export const calculateTotalTime = (coursework: Coursework) => {
  const {
    contactTimeLectures,
    contactTimeTutorials,
    contactTimeLabs,
    contactTimeSeminars,
    contactTimeFieldworkPlacement,
    contactTimeOthers,
    formativeAssessmentTime,
    privateStudyTime,
    preparationTime,
    keyboardTime,
    feedbackTime,
  } = coursework;

  return (
    (contactTimeLectures || 0) +
    (contactTimeTutorials || 0) +
    (contactTimeLabs || 0) +
    (contactTimeSeminars || 0) +
    (contactTimeFieldworkPlacement || 0) +
    (contactTimeOthers || 0) +
    (formativeAssessmentTime || 0) +
    (privateStudyTime || 0) +
    (preparationTime || 0) +
    (keyboardTime || 0) +
    (feedbackTime || 0)
  );
};

export const expectedTotalTime = (weight: number, moduleCredit: number) => {
  return parseFloat((moduleCredit * 10 * (weight / 100)).toFixed(2));
};

export const updateCourseworkList = (
  courseworkList: Coursework[],
  templateData: number[][][],
  moduleCredit: number,
  formFactor: number,
): Coursework[] => {
  const sortedCourseworkList = courseworkList.sort((a, b) => {
    const getNumericDeadlineWeek = (deadlineWeek: number | string) =>
      typeof deadlineWeek === 'string'
        ? parseInt(deadlineWeek, 10)
        : deadlineWeek;
    return (
      getNumericDeadlineWeek(a.deadlineWeek) -
      getNumericDeadlineWeek(b.deadlineWeek)
    );
  });

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

      const contactTimeFields =
        coursework.type === 'exam'
          ? {}
          : {
              contactTimeLectures: Math.round(
                (templateData.reduce(
                  (total, semesterData) =>
                    total + calculateContactTime(semesterData[0]),
                  0,
                ) *
                  formFactor) /
                  100,
              ),
              contactTimeTutorials: Math.round(
                (templateData.reduce(
                  (total, semesterData) =>
                    total + calculateContactTime(semesterData[1]),
                  0,
                ) *
                  formFactor) /
                  100,
              ),
              contactTimeLabs: Math.round(
                (templateData.reduce(
                  (total, semesterData) =>
                    total + calculateContactTime(semesterData[2]),
                  0,
                ) *
                  formFactor) /
                  100,
              ),
              contactTimeSeminars: Math.round(
                (templateData.reduce(
                  (total, semesterData) =>
                    total + calculateContactTime(semesterData[3]),
                  0,
                ) *
                  formFactor) /
                  100,
              ),
              contactTimeFieldworkPlacement: Math.round(
                (templateData.reduce(
                  (total, semesterData) =>
                    total + calculateContactTime(semesterData[4]),
                  0,
                ) *
                  formFactor) /
                  100,
              ),
              contactTimeOthers: Math.round(
                (templateData.reduce(
                  (total, semesterData) =>
                    total + calculateContactTime(semesterData[5]),
                  0,
                ) *
                  formFactor) /
                  100,
              ),
            };

      const {
        feedbackTime,
        formativeAssessmentTime,
        keyboardTime,
        preparationTime,
        privateStudyTime,
      } = getTimeFields(coursework, moduleCredit);

      return {
        ...coursework,
        deadlineWeek: numericDeadlineWeek,
        feedbackTime,
        formativeAssessmentTime,
        keyboardTime,
        preparationTime,
        privateStudyTime,
        ...contactTimeFields,
      };
    },
  );

  return updatedCourseworkList;
};
export const updateExamContactTime = (
  courseworkList: Coursework[],
  templateData: number[][][],
  moduleCredit: number,
  formFactor: number,
): Coursework[] => {
  const totalContactTime = templateData.reduce(
    (totals, semesterData) => {
      return totals.map(
        (total, index) =>
          total + semesterData[index].reduce((sum, value) => sum + value, 0),
      );
    },
    [0, 0, 0, 0, 0, 0], // Initial totals for each contact time field
  );

  const nonExamCourseworkList = updateCourseworkList(
    courseworkList.filter((coursework) => coursework.type !== 'exam'),
    templateData,
    moduleCredit,
    formFactor,
  );

  const nonExamCourseworkContactTime = nonExamCourseworkList.reduce(
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
    [0, 0, 0, 0, 0, 0], // Initial totals for each contact time field
  );

  const examContactTime = totalContactTime.map(
    (total, index) => total - nonExamCourseworkContactTime[index],
  );

  return courseworkList.map((coursework) =>
    coursework.type === 'exam'
      ? {
          ...coursework,
          contactTimeLectures: examContactTime[0],
          contactTimeTutorials: examContactTime[1],
          contactTimeLabs: examContactTime[2],
          contactTimeSeminars: examContactTime[3],
          contactTimeFieldworkPlacement: examContactTime[4],
          contactTimeOthers: examContactTime[5],
        }
      : coursework,
  );
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

const getTimeFields = (
  coursework: Coursework,
  moduleCredit: number,
): {
  feedbackTime: number;
  formativeAssessmentTime: number;
  keyboardTime: number;
  preparationTime: number;
  privateStudyTime: number;
} => {
  const { preparationTime, privateStudyTime } =
    getPreparationTimeAndPrivateStudyTime(coursework, moduleCredit);

  const feedbackTime =
    coursework.type === 'exam' ? 0 : coursework.feedbackTime || 1;
  const formativeAssessmentTime =
    coursework.type === 'exam' ? 0 : coursework.formativeAssessmentTime || 1;
  const keyboardTime = getKeyboardTime(coursework, moduleCredit);

  return {
    feedbackTime,
    formativeAssessmentTime,
    keyboardTime,
    preparationTime,
    privateStudyTime,
  };
};

export const getPreparationTimeAndPrivateStudyTime = (
  coursework: Coursework,
  moduleCredit: number,
): { preparationTime: number; privateStudyTime: number } => {
  // Exclude preparationTime and privateStudyTime initially
  const {
    contactTimeLectures,
    contactTimeTutorials,
    contactTimeLabs,
    contactTimeSeminars,
    contactTimeFieldworkPlacement,
    contactTimeOthers,
    formativeAssessmentTime,
    keyboardTime,
    feedbackTime,
  } = coursework;

  const initialTotalTime =
    (contactTimeLectures || 0) +
    (contactTimeTutorials || 0) +
    (contactTimeLabs || 0) +
    (contactTimeSeminars || 0) +
    (contactTimeFieldworkPlacement || 0) +
    (contactTimeOthers || 0) +
    (formativeAssessmentTime || 0) +
    (keyboardTime || 0) +
    (feedbackTime || 0);

  const expectedTotalTimeForCoursework = expectedTotalTime(
    coursework.weight || 0,
    moduleCredit,
  );

  const preparationTime =
    coursework.type === 'exam'
      ? 0
      : Math.max(expectedTotalTimeForCoursework - initialTotalTime, 0);

  const privateStudyTime =
    coursework.type !== 'exam'
      ? 0
      : Math.max(
          expectedTotalTimeForCoursework -
            (contactTimeLectures || 0) -
            (contactTimeTutorials || 0) -
            (contactTimeLabs || 0) -
            (contactTimeSeminars || 0) -
            (contactTimeFieldworkPlacement || 0) -
            (contactTimeOthers || 0) -
            (formativeAssessmentTime || 0) -
            (keyboardTime || 0) -
            (feedbackTime || 0),
          0,
        );

  return { preparationTime, privateStudyTime };
};

export const handleInputChangeUtil = (
  internalCourseworkList: Coursework[],
  index: number,
  field: keyof Omit<
    Coursework,
    'title' | 'weight' | 'type' | 'deadlineWeek' | 'releasedWeekEarlier'
  >,
  value: number | undefined,
  handleScheduleChange: (
    index: number,
    field: keyof Omit<
      Coursework,
      'title' | 'weight' | 'type' | 'deadlineWeek' | 'releasedWeekEarlier'
    >,
    value: number | undefined,
  ) => void,
  setInternalCourseworkList: (courseworkList: Coursework[]) => void,
) => {
  const updatedCourseworkList = [...internalCourseworkList];
  updatedCourseworkList[index][field] = value;
  setInternalCourseworkList(updatedCourseworkList);
  handleScheduleChange(index, field, value);
};

export const handleInputBlurUtil = (
  internalCourseworkList: Coursework[],
  index: number,
  field: keyof Omit<
    Coursework,
    'title' | 'weight' | 'type' | 'deadlineWeek' | 'releasedWeekEarlier'
  >,
  handleScheduleChange: (
    index: number,
    field: keyof Omit<
      Coursework,
      'title' | 'weight' | 'type' | 'deadlineWeek' | 'releasedWeekEarlier'
    >,
    value: number | undefined,
  ) => void,
) => {
  const value = Number(internalCourseworkList[index][field]);
  handleScheduleChange(index, field, value);
};
