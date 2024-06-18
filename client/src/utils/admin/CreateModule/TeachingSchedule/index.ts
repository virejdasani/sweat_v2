import { fetchModuleTemplate } from '../../../../services/admin/CreateModule/TeachingSchedule';
import {
  TeachingScheduleSaveData,
  Distribution,
} from '../../../../types/admin/CreateModule/TeachingSchedule';

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

  templateData.forEach((semesterData) => {
    semesterData.forEach((row, rowIndex) => {
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

      teachingScheduleSaveData[activityKey].hours += distribution.reduce(
        (total, dist) => total + dist.hours,
        0,
      );

      teachingScheduleSaveData[activityKey].distribution!.push(...distribution);
    });
  });

  return teachingScheduleSaveData;
};

export const transformEditingDataToTemplateData = (
  scheduleData: TeachingScheduleSaveData,
): number[][][] => {
  const transformedData = [
    createWeekArray(scheduleData.lectures?.distribution),
    createWeekArray(scheduleData.tutorials?.distribution),
    createWeekArray(scheduleData.labs?.distribution),
    createWeekArray(scheduleData.seminars?.distribution),
    createWeekArray(scheduleData.fieldworkPlacement?.distribution),
    createWeekArray(scheduleData.other?.distribution),
  ];

  return [transformedData, transformedData];
};

const createWeekArray = (distribution: Distribution[] = []): number[] => {
  const weeks = Array(15).fill(0);
  distribution.forEach((dist) => {
    weeks[dist.week - 1] = dist.hours; // Assuming week is 1-based index
  });
  return weeks;
};

export const handleInputChange = (
  tableIndex: number,
  rowIndex: number,
  colIndex: number,
  value: string,
  templateData: number[][][],
  setTemplateData: (data: number[][][]) => void,
) => {
  const updatedData = [...templateData];
  updatedData[tableIndex][rowIndex][colIndex] = parseInt(value);
  setTemplateData(updatedData);
};
