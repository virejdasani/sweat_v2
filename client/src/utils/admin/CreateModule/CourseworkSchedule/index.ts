import { Coursework } from '../../../../types/admin/CreateModule/CourseworkSetup';
export const calculateTotalTime = (
  coursework: Coursework,
  moduleCredit: number,
) => {
  console.log('Coursework data:', coursework);

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

  // Fetch preparation and private study time dynamically
  const { preparationTime, privateStudyTime } =
    getPreparationTimeAndPrivateStudyTime(coursework, moduleCredit);

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

const calculateContactTime = (
  templateData: number[][][],
  activityIndex: number,
  startWeek: number,
  endWeek: number,
): number => {
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

export const updateCourseworkList = (
  courseworkList: Coursework[],
  templateData: number[][][],
  moduleCredit: number,
  formFactor: number,
): Coursework[] => {
  // Helper function to ensure numeric deadlineWeek
  const getNumericDeadlineWeek = (deadlineWeek: number | string): number =>
    typeof deadlineWeek === 'string'
      ? parseInt(deadlineWeek, 10)
      : deadlineWeek;

  const sortedCourseworkList = courseworkList.sort((a, b) => {
    return (
      getNumericDeadlineWeek(a.deadlineWeek) -
      getNumericDeadlineWeek(b.deadlineWeek)
    );
  });

  let previousDeadlineWeek: number | undefined;
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
            (calculateContactTime(
              templateData,
              0,
              startWeek,
              numericDeadlineWeek,
            ) *
              formFactor) /
              100,
          ),
          contactTimeTutorials: Math.round(
            (calculateContactTime(
              templateData,
              1,
              startWeek,
              numericDeadlineWeek,
            ) *
              formFactor) /
              100,
          ),
          contactTimeLabs: Math.round(
            calculateContactTime(
              templateData,
              2,
              startWeek,
              numericDeadlineWeek,
            ), // formFactor not applied here
          ),
          contactTimeSeminars: Math.round(
            (calculateContactTime(
              templateData,
              3,
              startWeek,
              numericDeadlineWeek,
            ) *
              formFactor) /
              100,
          ),
          contactTimeFieldworkPlacement: Math.round(
            (calculateContactTime(
              templateData,
              4,
              startWeek,
              numericDeadlineWeek,
            ) *
              formFactor) /
              100,
          ),
          contactTimeOthers: Math.round(
            (calculateContactTime(
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
      } = getTimeFields(coursework, moduleCredit);

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
    'title' | 'weight' | 'type' | 'deadlineWeek' | 'releasedWeekPrior'
  >,
  value: number | undefined,
  handleScheduleChange: (
    index: number,
    field: keyof Omit<
      Coursework,
      'title' | 'weight' | 'type' | 'deadlineWeek' | 'releasedWeekPrior'
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
    'title' | 'weight' | 'type' | 'deadlineWeek' | 'releasedWeekPrior'
  >,
  handleScheduleChange: (
    index: number,
    field: keyof Omit<
      Coursework,
      'title' | 'weight' | 'type' | 'deadlineWeek' | 'releasedWeekPrior'
    >,
    value: number | undefined,
  ) => void,
) => {
  const value = Number(internalCourseworkList[index][field]);
  handleScheduleChange(index, field, value);
};

export const initializeCourseworkList = (
  courseworkList: Coursework[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  templateData: number[][][],
  moduleCredit: number,
  formFactor: number,
  isEditing: boolean,
): Coursework[] => {
  if (isEditing) {
    return courseworkList;
  }

  let updatedCourseworkList = updateCourseworkList(
    courseworkList,
    templateData,
    moduleCredit,
    formFactor,
  );

  updatedCourseworkList = updateExamContactTime(
    updatedCourseworkList,
    templateData,
    moduleCredit,
    formFactor,
  );

  return updatedCourseworkList.map((coursework) => {
    const { preparationTime, privateStudyTime } =
      getPreparationTimeAndPrivateStudyTime(coursework, moduleCredit);
    return { ...coursework, preparationTime, privateStudyTime };
  });
};

export const recalculateCourseworkList = (
  courseworkList: Coursework[],
  templateData: number[][][],
  moduleCredit: number,
  formFactor: number,
): Coursework[] => {
  let updatedCourseworkList = updateCourseworkList(
    courseworkList,
    templateData,
    moduleCredit,
    formFactor,
  );

  updatedCourseworkList = updateExamContactTime(
    updatedCourseworkList,
    templateData,
    moduleCredit,
    formFactor,
  );

  return updatedCourseworkList.map((coursework) => {
    const { preparationTime, privateStudyTime } =
      getPreparationTimeAndPrivateStudyTime(coursework, moduleCredit);
    return { ...coursework, preparationTime, privateStudyTime };
  });
};

export const saveCourseworkListToSession = (courseworkList: Coursework[]) => {
  sessionStorage.setItem(
    'internalCourseworkList',
    JSON.stringify(courseworkList),
  );
};

export const getCourseworkListFromSession = (): Coursework[] | null => {
  const savedCourseworkList = sessionStorage.getItem('internalCourseworkList');
  return savedCourseworkList ? JSON.parse(savedCourseworkList) : null;
};

export const saveInitialCourseworkListToSession = (
  initialCourseworkList: Coursework[],
) => {
  sessionStorage.setItem(
    'initialCourseworkList',
    JSON.stringify(initialCourseworkList),
  );
};

export const getInitialCourseworkListFromSession = (): Coursework[] | null => {
  const savedInitialList = sessionStorage.getItem('initialCourseworkList');
  return savedInitialList ? JSON.parse(savedInitialList) : null;
};

export const handleRestoreDefaults = (
  setInternalCourseworkList: React.Dispatch<React.SetStateAction<Coursework[]>>,
  handleCourseworkListChange: (courseworkList: Coursework[]) => void,
  setManualChanges: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >,
) => {
  const restoredList = getInitialCourseworkListFromSession() || []; // Deep copy
  setInternalCourseworkList(restoredList);
  handleCourseworkListChange(restoredList);
  setManualChanges({});
  sessionStorage.removeItem('internalCourseworkList');
};

export const handleInputChange = (
  index: number,
  field: keyof Omit<
    Coursework,
    'title' | 'weight' | 'type' | 'deadlineWeek' | 'releasedWeekPrior'
  >,
  value: number | undefined,
  internalCourseworkList: Coursework[],
  setInternalCourseworkList: React.Dispatch<React.SetStateAction<Coursework[]>>,
  manualChanges: Record<string, boolean>,
  setManualChanges: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >,
  handleScheduleChange: (
    index: number,
    field: string,
    value: number | undefined,
  ) => void,
) => {
  const updatedCourseworkList = [...internalCourseworkList];
  updatedCourseworkList[index][field] = value;
  setInternalCourseworkList(updatedCourseworkList);

  const manualChangesCopy = { ...manualChanges };
  manualChangesCopy[`${index}-${field}`] = true;
  setManualChanges(manualChangesCopy);

  handleScheduleChange(index, field as string, value);

  saveCourseworkListToSession(updatedCourseworkList);
};

export const handleInputBlur = (
  index: number,
  field: keyof Omit<
    Coursework,
    'title' | 'weight' | 'type' | 'deadlineWeek' | 'releasedWeekPrior'
  >,
  internalCourseworkList: Coursework[],
  handleScheduleChange: (
    index: number,
    field: string,
    value: number | undefined,
  ) => void,
) => {
  const value = Number(internalCourseworkList[index][field]);
  handleScheduleChange(index, field as string, value);
};
