import { Coursework } from '../../../../types/admin/CreateModule/CourseworkSetup';
export const calculateTotalTime = (
  coursework: Coursework,
  moduleCredit: number,
) => {
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
  const updatedCourseworkList = internalCourseworkList.map((cw, i) =>
    i === index ? { ...cw, [field]: value } : cw,
  );

  setInternalCourseworkList(updatedCourseworkList);

  const manualChangesCopy = { ...manualChanges };
  manualChangesCopy[`${index}-${field}`] = true;
  setManualChanges(manualChangesCopy);

  handleScheduleChange(index, field as string, value);
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
