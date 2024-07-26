import React, { useState, useEffect } from 'react';
import { Box, Select } from '@chakra-ui/react';
import DistributionTable from './DistributionTable';
import DistributionGraph from './DistributionGraph';
import { ModuleSetupFormData } from '../../../../types/admin/CreateModule/ModuleSetup';
import {
  Coursework,
  StudyStyleDistribution,
} from '../../../../types/admin/CreateModule/CourseworkSetup';
import httpClient from '../../../../shared/api/httpClient';
import { transformTemplateDataToSaveData } from '../../../../utils/admin/CreateModule/TeachingSchedule';

interface ModuleReviewProps {
  templateData: number[][][];
  formData: ModuleSetupFormData;
  courseworkList: Coursework[];
}

const ModuleReview: React.FC<ModuleReviewProps> = ({
  templateData,
  formData,
  courseworkList,
}) => {
  const [studyStyle, setStudyStyle] = useState<string>('earlyStarter');
  const [ratio, setRatio] = useState<string>('0');
  const [courseworkData, setCourseworkData] = useState<Coursework[]>([]);
  const [privateStudyData, setPrivateStudyData] = useState<
    StudyStyleDistribution[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const moduleDocument = {
          moduleSetup: formData,
          teachingSchedule: transformTemplateDataToSaveData(templateData),
          courseworkList,
        };
        const response = await httpClient.post(
          '/private-study-distributions',
          moduleDocument,
        );
        setCourseworkData(response.data.courseworkList);
        setPrivateStudyData(response.data.privateStudyDistributions);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching distributions:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [templateData, formData, courseworkList]);

  if (loading) {
    return <Box>Loading...</Box>;
  }

  // Filter private study distributions based on the selected ratio
  const filteredPrivateStudyData = privateStudyData.filter(
    (dist) => dist.type === `ratio${ratio}`,
  );

  // Filter preparation time distributions based on the selected study style for each coursework
  const filteredPreparationData = courseworkData.map((coursework) => ({
    ...coursework,
    preparationTimeDistributions: (
      coursework.preparationTimeDistributions || []
    ).filter((dist) => {
      if (coursework.type !== 'exam') {
        return dist.type === studyStyle;
      } else {
        return dist.type === `${studyStyle}_ratio${ratio}`;
      }
    }),
  }));

  return (
    <Box>
      <Box mb={4}>
        <Select
          placeholder="Select Study Style"
          onChange={(e) => setStudyStyle(e.target.value)}
          value={studyStyle}
        >
          <option value="earlyStarter">Early Starter</option>
          <option value="steady">Steady</option>
          <option value="justInTime">Just In Time</option>
        </Select>
        <Select
          placeholder="Select Ratio"
          onChange={(e) => setRatio(e.target.value)}
          value={ratio}
        >
          <option value="0">0</option>
          <option value="0_5">0.5</option>
          <option value="1">1</option>
          <option value="2">2</option>
        </Select>
      </Box>
      <DistributionTable
        templateData={templateData}
        privateStudyDistributions={filteredPrivateStudyData}
      />
      <DistributionGraph
        teachingSchedule={transformTemplateDataToSaveData(templateData)}
        privateStudyDistributions={filteredPrivateStudyData}
        preparationTimeDistributions={filteredPreparationData}
        moduleCredit={formData.moduleCredit}
      />
    </Box>
  );
};

export default ModuleReview;
