import React, { useMemo, useRef } from 'react';
import { Box } from '@chakra-ui/react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { DistributionGraphProps } from '../../../../types/admin/CreateModule/ModuleReview';
import {
  calculateWeeks,
  transformTeachingScheduleData,
  transformPreparationTimeData,
  transformPrivateStudyData,
  fillMissingWeeks,
  filterKeys,
  getColor,
} from '../../../../utils/admin/CreateModule/ModuleReview';

const DistributionGraph: React.FC<DistributionGraphProps> = ({
  teachingSchedule,
  privateStudyDistributions,
  preparationTimeDistributions,
  moduleCredit,
  semester,
}) => {
  const colorMapRef = useRef<{ [key: string]: string }>({});
  const existingColors = useRef<string[]>([]);

  const weeks = useMemo(
    () =>
      calculateWeeks(
        teachingSchedule,
        preparationTimeDistributions,
        privateStudyDistributions,
      ),
    [teachingSchedule, preparationTimeDistributions, privateStudyDistributions],
  );

  const totalWeeks = semester.toLowerCase() === 'whole session' ? 30 : 15;
  const averageWeeklyEffort = (moduleCredit * 10) / totalWeeks;

  const teachingScheduleData = useMemo(
    () => transformTeachingScheduleData(teachingSchedule, weeks),
    [teachingSchedule, weeks],
  );
  const preparationTimeData = useMemo(
    () => transformPreparationTimeData(preparationTimeDistributions, weeks),
    [preparationTimeDistributions, weeks],
  );
  const privateStudyData = useMemo(
    () => transformPrivateStudyData(privateStudyDistributions, weeks),
    [privateStudyDistributions, weeks],
  );

  const combinedData = useMemo(() => {
    const data = teachingScheduleData.map((entry, index) => ({
      ...entry,
      ...preparationTimeData[index],
      ...privateStudyData[index],
    }));
    return fillMissingWeeks(data);
  }, [teachingScheduleData, preparationTimeData, privateStudyData]);

  const filteredKeys = useMemo(() => filterKeys(combinedData), [combinedData]);

  const renderAreas = () => {
    const elements: JSX.Element[] = [];

    filteredKeys.forEach((type) => {
      elements.push(
        <Area
          key={type}
          type="monotone"
          dataKey={type}
          stroke={getColor(type, colorMapRef.current, existingColors.current)}
          fill={getColor(type, colorMapRef.current, existingColors.current)}
          strokeWidth={2}
          dot={{ r: 2 }}
          stackId="1"
        />,
      );
    });

    return elements;
  };

  return (
    <Box>
      <ResponsiveContainer width="100%" height={500}>
        <AreaChart
          data={combinedData}
          margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="week"
            label={{
              value: 'Weeks',
              position: 'insideBottom',
              dy: 20,
            }}
          />
          <YAxis
            domain={[0, 30]}
            label={{
              value: 'Effort Hours',
              angle: -90,
              position: 'insideLeft',
            }}
          />
          <Tooltip />
          <Legend verticalAlign="bottom" wrapperStyle={{ paddingTop: 30 }} />
          <ReferenceLine
            y={averageWeeklyEffort}
            stroke="red"
            strokeDasharray="3 3"
            strokeWidth={3}
            label="Avg Effort"
          />
          {renderAreas()}
        </AreaChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default DistributionGraph;
