import React, { useMemo, useRef } from 'react';
import { Box } from '@chakra-ui/react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import {
  StudyStyleDistribution,
  Distribution,
  Coursework,
} from '../../../../types/admin/CreateModule/CourseworkSetup';
import { TeachingScheduleSaveData } from '../../../../types/admin/CreateModule/TeachingSchedule';
import { getRandomColor } from '../../../../utils/admin/CreateModule/ModuleReview';

interface DistributionGraphProps {
  teachingSchedule: TeachingScheduleSaveData;
  privateStudyDistributions: StudyStyleDistribution[];
  preparationTimeDistributions: Coursework[];
  moduleCredit: number;
}

interface CombinedData {
  week: number;
  [key: string]: number;
}

const DistributionGraph: React.FC<DistributionGraphProps> = ({
  teachingSchedule,
  privateStudyDistributions,
  preparationTimeDistributions,
  moduleCredit,
}) => {
  const colorMapRef = useRef<{ [key: string]: string }>({});

  const getColor = (key: string) => {
    if (!colorMapRef.current[key]) {
      colorMapRef.current[key] = getRandomColor();
    }
    return colorMapRef.current[key];
  };

  const weeks = useMemo(
    () =>
      Math.max(
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
      ),
    [teachingSchedule, preparationTimeDistributions, privateStudyDistributions],
  );

  const averageWeeklyEffort = (moduleCredit * 10) / weeks;

  // Transform teaching schedule data
  const teachingScheduleData = useMemo(() => {
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
  }, [teachingSchedule, weeks]);

  // Transform preparation time data
  const preparationTimeData = useMemo(() => {
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
  }, [preparationTimeDistributions, weeks]);

  // Transform private study data
  const privateStudyData = useMemo(() => {
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
  }, [privateStudyDistributions, weeks]);

  // Combine all data
  const combinedData = useMemo(() => {
    return teachingScheduleData.map((entry, index) => ({
      ...entry,
      ...preparationTimeData[index],
      ...privateStudyData[index],
    }));
  }, [teachingScheduleData, preparationTimeData, privateStudyData]);

  const renderLines = () => {
    const elements = [];

    Object.keys(teachingSchedule).forEach((type) => {
      elements.push(
        <Line
          key={type}
          type="monotone"
          dataKey={type}
          stroke={getColor(type)}
          strokeWidth={2}
          dot={{ r: 4 }}
        />,
      );
    });

    preparationTimeDistributions.flatMap((coursework) =>
      (coursework.preparationTimeDistributions ?? []).forEach((dist) => {
        const label =
          coursework.type === 'exam'
            ? `${coursework.shortTitle} (${dist.type})`
            : `${coursework.shortTitle} (deadline: ${coursework.deadlineWeek}, weight: ${coursework.weight}%)`;
        elements.push(
          <Line
            key={label}
            type="monotone"
            dataKey={label}
            stroke={getColor(label)}
            strokeWidth={2}
            dot={{ r: 4 }}
          />,
        );
      }),
    );

    elements.push(
      <Line
        key="privateStudy"
        type="monotone"
        dataKey="privateStudy"
        stroke={getColor('privateStudy')}
        strokeWidth={2}
        dot={{ r: 4 }}
      />,
    );

    return elements;
  };

  return (
    <Box>
      <ResponsiveContainer width="100%" height={500}>
        <LineChart
          data={combinedData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="week"
            label={{
              value: 'Weeks',
              position: 'insideBottomRight',
              offset: -5,
            }}
          />
          <YAxis
            domain={[0, 40]}
            label={{
              value: 'Effort Hours',
              angle: -90,
              position: 'insideLeft',
            }}
          />
          <Tooltip />
          <Legend />
          <ReferenceLine
            y={averageWeeklyEffort}
            stroke="red"
            strokeDasharray="3 3"
            strokeWidth={3}
            label="Avg Effort"
          />
          {renderLines()}
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default DistributionGraph;
