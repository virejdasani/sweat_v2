/* eslint-disable @typescript-eslint/no-explicit-any */
import { Coursework } from '../../../../types/admin/CreateModule/CourseworkSetup';

export const mergeTemplateDataWithWorkloadData = (
  workloadData: any[],
  templateData: number[][][],
  courseworkList: Coursework[],
): any[] => {
  const combinedData = [...workloadData];

  // Combine template data with workload data
  templateData.forEach((semesterData, semesterIndex) => {
    semesterData.forEach((contactTypeData, contactTypeIndex) => {
      contactTypeData.forEach((value, weekIndex) => {
        const week = semesterIndex * 15 + weekIndex + 1;
        if (combinedData[week - 1]) {
          switch (contactTypeIndex) {
            case 0:
              combinedData[week - 1].lectures = value;
              break;
            case 1:
              combinedData[week - 1].tutorials = value;
              break;
            case 2:
              combinedData[week - 1].labs = value;
              break;
            case 3:
              combinedData[week - 1].seminars = value;
              break;
            case 4:
              combinedData[week - 1].fieldwork = value;
              break;
            case 5:
              combinedData[week - 1].others = value;
              break;
            default:
              break;
          }
        }
      });
    });
  });

  // Add coursework data with formatted shortTitle
  courseworkList.forEach((coursework) => {
    const {
      shortTitle,
      deadlineWeek,
      weight,
      preparationTime,
      releasedWeekPrior,
    } = coursework;
    if (!shortTitle || preparationTime === undefined) return;

    const formattedTitle = `${shortTitle} (Week: ${deadlineWeek}, Weight: ${weight}%)`;

    for (let weekIndex = 0; weekIndex < combinedData.length; weekIndex++) {
      if (!combinedData[weekIndex][formattedTitle]) {
        combinedData[weekIndex][formattedTitle] = 0;
      }
    }

    const actualStartWeek = deadlineWeek - (releasedWeekPrior ?? 2);
    const weeksToDistribute = deadlineWeek - actualStartWeek + 1;
    const timePerWeek = preparationTime / weeksToDistribute;

    for (let week = actualStartWeek; week <= deadlineWeek; week++) {
      if (week > 0 && week <= 15) {
        combinedData[week - 1][formattedTitle] += timePerWeek;
      }
    }
  });

  return combinedData;
};

export const getRandomColor = (): string => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};
