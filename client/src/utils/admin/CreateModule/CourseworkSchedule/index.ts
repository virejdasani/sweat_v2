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
  handleScheduleChange: (
    index: number,
    field: keyof Omit<
      Coursework,
      'title' | 'weight' | 'type' | 'deadlineWeek' | 'releasedWeekEarlier'
    >,
    value: number,
  ) => void,
) => {
  const updatedCourseworkList = courseworkList.map((coursework, index) => {
    const { deadlineWeek } = coursework;
    const previousCoursework = courseworkList[index - 1];
    const previousDeadlineWeek = previousCoursework
      ? previousCoursework.deadlineWeek
      : 0;

    const contactTimeFields = {
      contactTimeLecture: templateData.reduce((total, semesterData) => {
        const lecturesData = semesterData[0].slice(
          previousDeadlineWeek,
          deadlineWeek,
        );
        return total + lecturesData.reduce((acc, val) => acc + val, 0);
      }, 0),

      contactTimeTutorial: templateData.reduce((total, semesterData) => {
        const tutorialsData = semesterData[1].slice(
          previousDeadlineWeek,
          deadlineWeek,
        );
        return total + tutorialsData.reduce((acc, val) => acc + val, 0);
      }, 0),

      contactTimeLab: templateData.reduce((total, semesterData) => {
        const labsData = semesterData[2].slice(
          previousDeadlineWeek,
          deadlineWeek,
        );
        return total + labsData.reduce((acc, val) => acc + val, 0);
      }, 0),

      contactTimeBriefing: templateData.reduce((total, semesterData) => {
        const briefingData = semesterData
          .slice(3, 6)
          .map((activityData) =>
            activityData
              .slice(previousDeadlineWeek, deadlineWeek)
              .reduce((acc, val) => acc + val, 0),
          );
        return total + briefingData.reduce((acc, val) => acc + val, 0);
      }, 0),
    };

    const updatedCoursework = {
      ...coursework,
      feedbackTime: coursework.feedbackTime || 1,
      ...contactTimeFields,
    };

    Object.entries(updatedCoursework).forEach(([field, value]) => {
      if (
        field !== 'title' &&
        field !== 'weight' &&
        field !== 'type' &&
        field !== 'deadlineWeek' &&
        field !== 'releasedWeekEarlier'
      ) {
        handleScheduleChange(
          index,
          field as keyof Omit<
            Coursework,
            'title' | 'weight' | 'type' | 'deadlineWeek' | 'releasedWeekEarlier'
          >,
          value as number,
        );
      }
    });

    return updatedCoursework;
  });

  return updatedCourseworkList;
};
