import { fetchModuleTemplate } from '../../../../services/admin/CreateModule/TeachingSchedule';
import { TeachingScheduleSaveData } from '../../../../types/admin/CreateModule/TeachingSchedule';

export const fetchTemplateData = async (
  moduleCredit: number,
  semester: string,
  setTemplateData: (data: number[][][]) => void,
) => {
  const template = await fetchModuleTemplate(moduleCredit, semester);
  setTemplateData(template);
};

export const getSemesterHeading = (semester: string): string => {
  if (semester === 'First') {
    return 'First Semester';
  } else if (semester === 'Second') {
    return 'Second Semester';
  } else {
    return `${semester.charAt(0).toUpperCase() + semester.slice(1)} Semester`;
  }
};

export const transformTemplateDataToSaveData = (
  templateData: number[][][],
): TeachingScheduleSaveData => {
  const teachingScheduleSaveData: TeachingScheduleSaveData = {
    lectures: { hours: 0, distribution: [] },
    tutorials: { hours: 0, distribution: [] },
    labs: { hours: 0, distribution: [] },
    seminars: { hours: 0, distribution: [] },
    fieldworkPlacement: { hours: 0, distribution: [] },
    other: { hours: 0, distribution: [] },
  };

  templateData.forEach((table) => {
    table.forEach((row, rowIndex) => {
      let activityKey: keyof TeachingScheduleSaveData;

      switch (rowIndex) {
        case 0:
          activityKey = 'lectures';
          break;
        case 1:
          activityKey = 'tutorials';
          break;
        case 2:
          activityKey = 'labs';
          break;
        case 3:
          activityKey = 'seminars';
          break;
        case 4:
          activityKey = 'fieldworkPlacement';
          break;
        case 5:
          activityKey = 'other';
          break;
        default:
          return;
      }

      const distribution = row
        .map((hours, week) => ({ week: week + 1, hours }))
        .filter((item) => item.hours > 0);

      teachingScheduleSaveData[activityKey] = {
        hours: distribution.reduce((total, dist) => total + dist.hours, 0),
        distribution,
      };
    });
  });

  return teachingScheduleSaveData;
};
