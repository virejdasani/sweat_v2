import React, { useState, useEffect } from 'react';
import { Box, Select, Flex, Text, Tooltip, Icon } from '@chakra-ui/react';
import { InfoOutlineIcon } from '@chakra-ui/icons';
import DistributionTable from './DistributionTable';
import DistributionGraph from './DistributionGraph';
import {
  Coursework,
  StudyStyleDistribution,
} from '../../../../types/admin/CreateModule/CourseworkSetup';
import httpClient from '../../../../shared/api/httpClient';
import { transformTemplateDataToSaveData } from '../../../../utils/admin/CreateModule/TeachingSchedule';
import { ModuleReviewProps } from '../../../../types/admin/CreateModule/ModuleReview';

const ModuleReview: React.FC<ModuleReviewProps> = ({
  templateData,
  formData,
  courseworkList,
  readingWeeks,
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
          readingWeeks,
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
  }, [templateData, formData, courseworkList, readingWeeks]);

  if (loading) {
    return <Box>Loading...</Box>;
  }

  const filteredPrivateStudyData = privateStudyData.filter(
    (dist) => dist.type === `ratio${ratio}`,
  );

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
      <Flex justifyContent="center" mb={8} mt={4}>
        <Box mr={8}>
          <Text mb={1}>
            Select student study style
            <Tooltip
              label="3 different study styles for students with different studying habits"
              fontSize="md"
            >
              <Icon as={InfoOutlineIcon} ml={2} />
            </Tooltip>
          </Text>
          <Select
            width="200px"
            onChange={(e) => setStudyStyle(e.target.value)}
            value={studyStyle}
          >
            <option value="earlyStarter">Early Starter</option>
            <option value="steady">Steady</option>
            <option value="justInTime">Just In Time</option>
          </Select>
        </Box>
        <Box>
          <Text mb={1}>
            Select student study hour ratio
            <Tooltip
              label={`For every 1 hour spent in class, the student will study ${ratio} hour(s) at home`}
              fontSize="md"
            >
              <Icon as={InfoOutlineIcon} ml={2} />
            </Tooltip>
          </Text>
          <Select
            width="200px"
            onChange={(e) => setRatio(e.target.value)}
            value={ratio}
          >
            <option value="0">0</option>
            <option value="0_5">0.5</option>
            <option value="1">1</option>
            <option value="2">2</option>
          </Select>
        </Box>
      </Flex>
      <Box width="80%" mb={12} mx="auto" overflowX="auto">
        <DistributionTable
          templateData={templateData}
          privateStudyDistributions={filteredPrivateStudyData}
          preparationDistributions={filteredPreparationData}
        />
      </Box>
      <Box width="80%" mx="auto" mb={12} overflowX="auto">
        <DistributionGraph
          teachingSchedule={transformTemplateDataToSaveData(templateData)}
          privateStudyDistributions={filteredPrivateStudyData}
          preparationTimeDistributions={filteredPreparationData}
          moduleCredit={formData.moduleCredit}
        />
      </Box>
    </Box>
  );
};

export default ModuleReview;
