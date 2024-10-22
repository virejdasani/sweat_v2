// utils/admin/CreateModule/CourseworkSchedule.ts

import { Coursework } from '../../../../types/admin/CreateModule/CourseworkSetup';

/**
 * Handles changes to input fields in the coursework schedule.
 * Updates the internal coursework list and manual changes state.
 */
export const handleInputChange = (
  index: number,
  field: keyof CourseworkInputFields,
  value: number | undefined,
  internalCourseworkList: Coursework[],
  setInternalCourseworkList: React.Dispatch<React.SetStateAction<Coursework[]>>,
  manualChanges: Record<string, boolean>,
  setManualChanges: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >,
  handleScheduleChange: (updatedList: Coursework[]) => void,
) => {
  const updatedCourseworkList = [...internalCourseworkList];
  updatedCourseworkList[index] = {
    ...updatedCourseworkList[index],
    [field]: value,
  };
  setInternalCourseworkList(updatedCourseworkList);

  setManualChanges({
    ...manualChanges,
    [`${index}-${field}`]: true,
  });

  handleScheduleChange(updatedCourseworkList);
};

/**
 * Handles blur events on input fields.
 * Can be used to trigger additional actions when an input loses focus.
 */
export const handleInputBlur = (
  index: number,
  field: keyof CourseworkInputFields,
  internalCourseworkList: Coursework[],
  handleScheduleChange: (updatedList: Coursework[]) => void,
) => {
  // Currently, we simply call handleScheduleChange with the updated list.
  handleScheduleChange([...internalCourseworkList]);
};

// Type definition for the input fields we allow changes on
type CourseworkInputFields = Omit<
  Coursework,
  | 'title'
  | 'weight'
  | 'type'
  | 'deadlineWeek'
  | 'releasedWeekPrior'
  | 'shortTitle'
>;
