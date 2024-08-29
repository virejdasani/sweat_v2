import httpClient from '../../../../shared/api/httpClient';
import {
  AggregatedData,
  OptionType,
} from '../../../../types/student/StudentView';
import { getRandomColor } from '../../../admin/CreateModule/ModuleReview';

export const studyStyleOptions = [
  { label: 'Early Starter', value: 'earlyStarter' },
  { label: 'Steady', value: 'steady' },
  { label: 'Just In Time', value: 'justInTime' },
];

export const ratioOptions = [
  { label: '0', value: '0' },
  { label: '0.5', value: '0_5' },
  { label: '1', value: '1' },
  { label: '2', value: '2' },
];

export const fetchAggregatedData = async (
  selectedModules: OptionType[],
  studyStyle: string,
  ratio: string,
  setData: (data: AggregatedData[]) => void,
  lineColors: { [key: string]: string },
  setLineColors: (colors: { [key: string]: string }) => void,
) => {
  if (selectedModules.length === 0) {
    setData([]);
    return;
  }

  try {
    const moduleCodes = selectedModules.map((module) => module.value);

    const response = await httpClient.post('/aggregate-data', {
      moduleCodes,
      studyStyle,
      ratio,
    });

    const fetchedData: AggregatedData[] = response.data;

    const totalEffortData = fetchedData.map((weekData) => {
      const totalHours = Object.keys(weekData)
        .filter((key) => key !== 'week')
        .reduce((acc, key) => acc + (weekData[key] as number), 0);
      return { ...weekData, totalEffort: totalHours };
    });

    setData(totalEffortData);

    // Assign colors only to newly added modules
    const newColors: { [key: string]: string } = { ...lineColors };

    selectedModules.forEach((module) => {
      if (!newColors[module.value]) {
        newColors[module.value] = getRandomColor(Object.values(newColors));
      }
    });

    setLineColors(newColors);
  } catch (error) {
    console.error('Error fetching aggregated data:', error);
  }
};
