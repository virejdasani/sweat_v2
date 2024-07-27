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
    lectures: { hours: 0 },
    tutorials: { hours: 0 },
    labs: { hours: 0 },
    seminars: { hours: 0 },
    fieldworkPlacement: { hours: 0 },
    other: { hours: 0 },
  };

  const activityKeys: (keyof TeachingScheduleSaveData)[] = [
    'lectures',
    'tutorials',
    'labs',
    'seminars',
    'fieldworkPlacement',
    'other',
  ];

  const totalWeeks = templateData.length * 15;

  templateData.forEach((semesterData, semesterIndex) => {
    semesterData.forEach((row, rowIndex) => {
      const activityKey = activityKeys[rowIndex];

      if (activityKey) {
        const distribution = row
          .map((hours, week) => ({
            week: week + 1 + semesterIndex * 15,
            hours,
          }))
          .filter((item) => item.hours > 0);

        const activity = teachingScheduleSaveData[activityKey];
        activity.hours += distribution.reduce(
          (total, dist) => total + dist.hours,
          0,
        );

        if (distribution.length > 0) {
          if (!activity.distribution) {
            activity.distribution = [];
          }
          activity.distribution.push(...distribution);
        }
      }
    });
  });

  // Ensure all weeks up to totalWeeks are represented
  activityKeys.forEach((key) => {
    const activity = teachingScheduleSaveData[key];
    if (activity.distribution) {
      for (let week = 1; week <= totalWeeks; week++) {
        if (!activity.distribution.some((d) => d.week === week)) {
          activity.distribution.push({ week, hours: 0 });
        }
      }
      activity.distribution.sort((a, b) => a.week - b.week);
    }
  });
  return teachingScheduleSaveData;
};
export const transformEditingDataToTemplateData = (
  scheduleData: TeachingScheduleSaveData,
  isWholeSession: boolean,
): number[][][] => {
  const splitDistribution = (
    distribution: Distribution[] = [],
  ): [Distribution[], Distribution[]] => {
    const firstSemester = distribution.slice(0, 12);
    const secondSemester = distribution.slice(12);
    return [firstSemester, secondSemester];
  };

  if (isWholeSession) {
    const [lecturesFirst, lecturesSecond] = splitDistribution(
      scheduleData.lectures?.distribution,
    );
    const [tutorialsFirst, tutorialsSecond] = splitDistribution(
      scheduleData.tutorials?.distribution,
    );
    const [labsFirst, labsSecond] = splitDistribution(
      scheduleData.labs?.distribution,
    );
    const [seminarsFirst, seminarsSecond] = splitDistribution(
      scheduleData.seminars?.distribution,
    );
    const [fieldworkFirst, fieldworkSecond] = splitDistribution(
      scheduleData.fieldworkPlacement?.distribution,
    );
    const [otherFirst, otherSecond] = splitDistribution(
      scheduleData.other?.distribution,
    );

    const firstSemesterData = [
      createWeekArray(lecturesFirst),
      createWeekArray(tutorialsFirst),
      createWeekArray(labsFirst),
      createWeekArray(seminarsFirst),
      createWeekArray(fieldworkFirst),
      createWeekArray(otherFirst),
    ];

    const secondSemesterData = [
      createWeekArray(lecturesSecond),
      createWeekArray(tutorialsSecond),
      createWeekArray(labsSecond),
      createWeekArray(seminarsSecond),
      createWeekArray(fieldworkSecond),
      createWeekArray(otherSecond),
    ];

    return [firstSemesterData, secondSemesterData];
  } else {
    const transformedData = [
      createWeekArray(scheduleData.lectures?.distribution),
      createWeekArray(scheduleData.tutorials?.distribution),
      createWeekArray(scheduleData.labs?.distribution),
      createWeekArray(scheduleData.seminars?.distribution),
      createWeekArray(scheduleData.fieldworkPlacement?.distribution),
      createWeekArray(scheduleData.other?.distribution),
    ];

    return [transformedData];
  }
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
