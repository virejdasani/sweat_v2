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

export const expectedTotalTime = (
  weight: number,
  moduleCredit: number,
  templateData: number[][][],
) => {
  const totalContactTimeFromStep2 = templateData.reduce(
    (total, table) =>
      total +
      table.reduce(
        (tableTotal, row) =>
          tableTotal + row.reduce((rowTotal, value) => rowTotal + value, 0),
        0,
      ),
    0,
  );
  return parseFloat(
    ((moduleCredit * 10 - totalContactTimeFromStep2) * (weight / 100)).toFixed(
      2,
    ),
  );
};
