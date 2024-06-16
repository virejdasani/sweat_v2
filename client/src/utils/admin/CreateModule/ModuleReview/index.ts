import { Coursework } from '../../../../types/admin/CreateModule/CourseworkSetup';
import { ModuleSetupFormData } from '../../../../types/admin/CreateModule/ModuleSetup';

export const calculateContactTime = (
  templateData: number[][][] = [],
): number => {
  return templateData.reduce(
    (total, table) =>
      total +
      table.reduce(
        (tableTotal, row) =>
          tableTotal +
          row.reduce((rowTotal, value) => rowTotal + (value || 0), 0),
        0,
      ),
    0,
  );
};

export const calculateFormativeAssessmentTime = (
  courseworkList: Coursework[] = [],
): number => {
  return courseworkList.reduce(
    (total, coursework) => total + (coursework.formativeAssessmentTime || 0),
    0,
  );
};

export const calculatePrivateStudyTime = (
  courseworkList: Coursework[] = [],
): number => {
  return courseworkList.reduce(
    (total, coursework) => total + (coursework.privateStudyTime || 0),
    0,
  );
};

export const calculatePreparationTime = (
  courseworkList: Coursework[] = [],
): number => {
  return courseworkList.reduce(
    (total, coursework) => total + (coursework.preparationTime || 0),
    0,
  );
};

export const calculateKeyboardTime = (
  courseworkList: Coursework[] = [],
): number => {
  return courseworkList.reduce(
    (total, coursework) => total + (coursework.keyboardTime || 0),
    0,
  );
};

export const calculateFeedbackTime = (
  courseworkList: Coursework[] = [],
): number => {
  return courseworkList.reduce(
    (total, coursework) => total + (coursework.feedbackTime || 0),
    0,
  );
};

export const calculateTotalTime = (formData: ModuleSetupFormData): number => {
  return (formData.moduleCredit || 0) * 10;
};

export const calculateOverallTime = (
  templateData: number[][][] = [],
  courseworkList: Coursework[] = [],
): number => {
  return (
    calculateContactTime(templateData) +
    calculateFormativeAssessmentTime(courseworkList) +
    calculatePrivateStudyTime(courseworkList) +
    calculatePreparationTime(courseworkList) +
    calculateKeyboardTime(courseworkList) +
    calculateFeedbackTime(courseworkList)
  );
};
