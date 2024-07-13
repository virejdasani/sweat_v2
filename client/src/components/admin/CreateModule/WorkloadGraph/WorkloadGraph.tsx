import React, { useEffect, useState, useCallback } from 'react';
import { Box, Spinner, Text, ButtonGroup, Button } from '@chakra-ui/react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { ModuleSetupFormData } from '../../../../types/admin/CreateModule/ModuleSetup';
import { Coursework } from '../../../../types/admin/CreateModule/CourseworkSetup';
import { fetchWorkloadGraphData } from '../../../../services/admin/CreateModule/WorkloadGraph';
import {
  mergeTemplateDataWithWorkloadData,
  getRandomColor,
} from '../../../../utils/admin/CreateModule/WorkloadGraph';

interface WorkloadGraphProps {
  formData: ModuleSetupFormData;
  courseworkList: Coursework[];
  templateData: number[][][];
}

const WorkloadGraph: React.FC<WorkloadGraphProps> = ({
  formData,
  courseworkList,
  templateData,
}) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [studyStyle, setStudyStyle] = useState<string>('style1');
  const [chartKey, setChartKey] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const workloadGraphData = await fetchWorkloadGraphData({
          formData,
          courseworkList,
          templateData,
          studyStyle,
        });
        console.log('Fetched Workload Graph Data:', workloadGraphData);
        const combinedData = mergeTemplateDataWithWorkloadData(
          workloadGraphData,
          templateData,
          courseworkList,
        );
        console.log('Combined Data:', combinedData);
        console.log('Previous Data:', data);
        setData((prevData) => {
          if (JSON.stringify(prevData) !== JSON.stringify(combinedData)) {
            return [...combinedData];
          }
          return prevData;
        });
      } catch (error) {
        console.error('Error fetching workload graph data:', error);
      } finally {
        setLoading(false);
      }
    };

    console.log('Effect running, studyStyle:', studyStyle);
    fetchData();
  }, [formData, courseworkList, templateData, studyStyle]);

  const handleStudyStyleChange = useCallback((style: string) => {
    setLoading(true);
    setData([]); // Clear data to force re-render
    setStudyStyle(style);
    setChartKey((prevKey) => prevKey + 1); // Change key to force LineChart re-render
  }, []);

  const renderLines = useCallback(() => {
    const lines = [];
    const courseworkTitles = courseworkList.map(
      (coursework) =>
        `${coursework.shortTitle} (Week: ${coursework.deadlineWeek}, Weight: ${coursework.weight}%)`,
    );

    lines.push(
      <Line
        key="lectures"
        type="monotone"
        dataKey="lectures"
        stroke={getRandomColor()}
        activeDot={{ r: 8 }}
      />,
    );
    lines.push(
      <Line
        key="tutorials"
        type="monotone"
        dataKey="tutorials"
        stroke={getRandomColor()}
      />,
    );
    lines.push(
      <Line
        key="labs"
        type="monotone"
        dataKey="labs"
        stroke={getRandomColor()}
      />,
    );
    lines.push(
      <Line
        key="seminars"
        type="monotone"
        dataKey="seminars"
        stroke={getRandomColor()}
      />,
    );
    lines.push(
      <Line
        key="fieldwork"
        type="monotone"
        dataKey="fieldwork"
        stroke={getRandomColor()}
      />,
    );
    lines.push(
      <Line
        key="others"
        type="monotone"
        dataKey="others"
        stroke={getRandomColor()}
      />,
    );

    courseworkTitles.forEach((title) => {
      const hasNonZeroValue = data.some((d) => d[title] && d[title] > 0);
      console.log(
        `Coursework Title: ${title}, Has Non-Zero Value: ${hasNonZeroValue}`,
      );
      if (hasNonZeroValue) {
        lines.push(
          <Line
            key={title}
            type="monotone"
            dataKey={title}
            stroke={getRandomColor()}
          />,
        );
      }
    });

    return lines;
  }, [data, courseworkList]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <Box>
      <Text fontSize="xl" mb={4}>
        Workload Graph
      </Text>
      <ButtonGroup variant="outline" spacing="6" mb={4}>
        <Button
          isActive={studyStyle === 'style1'}
          onClick={() => handleStudyStyleChange('style1')}
        >
          Style 1
        </Button>
        <Button
          isActive={studyStyle === 'style2'}
          onClick={() => handleStudyStyleChange('style2')}
        >
          Style 2
        </Button>
        <Button
          isActive={studyStyle === 'style3'}
          onClick={() => handleStudyStyleChange('style3')}
        >
          Style 3
        </Button>
      </ButtonGroup>
      <div style={{ width: '100%', height: 400 }}>
        <LineChart
          key={chartKey} // Use chartKey to force re-render
          width={800} // Fixed width
          height={400} // Fixed height
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="week" domain={[0, 'dataMax']} />
          <YAxis />
          <Tooltip />
          <Legend />
          {renderLines()}
        </LineChart>
      </div>
      {formData.semester === 'whole session' && (
        <Box mt={10}>
          <Text fontSize="xl" mb={4}>
            Second Semester Workload Graph
          </Text>
          <div style={{ width: '100%', height: 400 }}>
            <LineChart
              key={`${chartKey}-second`} // Use chartKey to force re-render
              width={800} // Fixed width
              height={400} // Fixed height
              data={data} // Reuse the same data for demonstration
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" domain={[0, 'dataMax']} />
              <YAxis />
              <Tooltip />
              <Legend />
              {renderLines()}
            </LineChart>
          </div>
        </Box>
      )}
    </Box>
  );
};

export default React.memo(WorkloadGraph);
