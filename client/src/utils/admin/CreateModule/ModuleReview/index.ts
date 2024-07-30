import {
  Distribution,
  StudyStyleDistribution,
} from '../../../../types/admin/CreateModule/CourseworkSetup';
import {
  DistributionGraphProps,
  CombinedData,
} from '../../../../types/admin/CreateModule/ModuleReview';
import React from 'react';

export const getRandomColor = (
  existingColors: string[],
  minDistance = 100,
): string => {
  const letters = '0123456789ABCDEF';
  let color;

  const hexToRgb = (hex: string) => {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return [r, g, b];
  };

  const colorDistance = (color1: string, color2: string) => {
    const [r1, g1, b1] = hexToRgb(color1);
    const [r2, g2, b2] = hexToRgb(color2);
    return Math.sqrt((r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2);
  };

  const isDistinct = (newColor: string) =>
    existingColors.every(
      (existingColor) => colorDistance(newColor, existingColor) >= minDistance,
    );

  do {
    color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
  } while (!isDistinct(color));

  return color;
};

export const getColor = (
  key: string,
  colorMapRef: { [key: string]: string },
  existingColors: string[],
) => {
  if (!colorMapRef[key]) {
    const newColor = getRandomColor(existingColors, 100);
    colorMapRef[key] = newColor;
    existingColors.push(newColor);
  }
  return colorMapRef[key];
};

export const calculateWeeks = (
  teachingSchedule: DistributionGraphProps['teachingSchedule'],
  preparationTimeDistributions: DistributionGraphProps['preparationTimeDistributions'],
  privateStudyDistributions: DistributionGraphProps['privateStudyDistributions'],
) => {
  return Math.max(
    ...Object.values(teachingSchedule).flatMap((activity) =>
      (activity.distribution ?? []).map((dist: Distribution) => dist.week),
    ),
    ...preparationTimeDistributions.flatMap((coursework) =>
      (coursework.preparationTimeDistributions ?? []).flatMap(
        (dist: StudyStyleDistribution) =>
          dist.distribution.map((weekData: Distribution) => weekData.week),
      ),
    ),
    ...privateStudyDistributions.flatMap((dist: StudyStyleDistribution) =>
      dist.distribution.map((weekData: Distribution) => weekData.week),
    ),
  );
};

export const transformTeachingScheduleData = (
  teachingSchedule: DistributionGraphProps['teachingSchedule'],
  weeks: number,
) => {
  const data: CombinedData[] = Array(weeks)
    .fill(0)
    .map((_, i) => ({ week: i + 1 }));
  Object.keys(teachingSchedule).forEach((type) => {
    teachingSchedule[
      type as keyof typeof teachingSchedule
    ].distribution?.forEach((weekData) => {
      data[weekData.week - 1][type] = weekData.hours;
    });
  });
  return data;
};

export const transformPreparationTimeData = (
  preparationTimeDistributions: DistributionGraphProps['preparationTimeDistributions'],
  weeks: number,
) => {
  const data: CombinedData[] = Array(weeks)
    .fill(0)
    .map((_, i) => ({ week: i + 1 }));
  preparationTimeDistributions.forEach((coursework) => {
    (coursework.preparationTimeDistributions ?? []).forEach((dist) => {
      dist.distribution.forEach((weekData) => {
        if (weekData.hours > 0) {
          const label =
            coursework.type === 'exam'
              ? `${coursework.shortTitle} (${dist.type})`
              : `${coursework.shortTitle} (deadline: ${coursework.deadlineWeek}, weight: ${coursework.weight}%)`;
          data[weekData.week - 1][label] = weekData.hours;
        }
      });
    });
  });
  return data;
};

export const transformPrivateStudyData = (
  privateStudyDistributions: DistributionGraphProps['privateStudyDistributions'],
  weeks: number,
) => {
  const data: CombinedData[] = Array(weeks)
    .fill(0)
    .map((_, i) => ({ week: i + 1 }));
  privateStudyDistributions.forEach((dist) => {
    dist.distribution.forEach((weekData) => {
      if (weekData.hours > 0) {
        data[weekData.week - 1]['privateStudy'] = weekData.hours;
      }
    });
  });
  return data;
};

export const fillMissingWeeks = (data: CombinedData[]) => {
  const allKeys = new Set<string>();
  data.forEach((weekData) => {
    Object.keys(weekData).forEach((key) => {
      if (key !== 'week') {
        allKeys.add(key);
      }
    });
  });
  return data.map((weekData) => {
    allKeys.forEach((key) => {
      if (!(key in weekData)) {
        weekData[key] = 0;
      }
    });
    return weekData;
  });
};

export const filterKeys = (combinedData: CombinedData[]) => {
  const keys = new Set<string>();
  combinedData.forEach((weekData) => {
    Object.keys(weekData).forEach((key) => {
      if (weekData[key] !== 0) {
        keys.add(key);
      }
    });
  });
  return Array.from(keys).filter((key) => key !== 'week');
};

export const calculateContactTime = (templateData: number[][][]): number[] => {
  const isWholeSession = templateData.length === 2;
  const totalWeeks = isWholeSession ? 33 : templateData[0][0].length;
  const contactTime = Array(totalWeeks).fill(0);

  const sumContactHours = (semesterData: number[][], startWeek: number) => {
    semesterData.forEach((contactTypeArray) => {
      contactTypeArray.forEach((hours, weekIndex) => {
        if (!isNaN(hours)) {
          contactTime[startWeek + weekIndex] += hours;
        }
      });
    });
  };

  if (templateData.length > 0) {
    sumContactHours(templateData[0], 0);
  }

  if (templateData.length > 1) {
    const secondSemesterStartWeek = templateData[0][0].length;
    sumContactHours(templateData[1], secondSemesterStartWeek);
  }

  return contactTime;
};

export const getTableCell = (hours: number) => {
  return hours > 0 ? React.createElement('strong', null, hours) : hours;
};
