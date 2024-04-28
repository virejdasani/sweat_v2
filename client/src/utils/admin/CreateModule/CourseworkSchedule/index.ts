import { Coursework } from '../../../../types/admin/CreateModule/CourseworkSetup';

export const calculateTotalTime = (coursework: Coursework) => {
  const totalTime =
    (coursework.contactTimeLectureTutorial || 0) +
    (coursework.contactTimeLab || 0) +
    (coursework.contactTimeBriefing || 0) +
    (coursework.formativeAssessment || 0) +
    (coursework.privateStudyPreparation || 0) +
    (coursework.keyboardTime || 0) +
    (coursework.feedbackTime || 0);
  return totalTime;
};

export const expectedTotalTime = (weight: number, moduleCredit: number) => {
  return moduleCredit * 10 * (weight / 100);
};
