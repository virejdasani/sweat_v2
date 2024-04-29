import React from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Heading,
} from '@chakra-ui/react';
import { ModuleSetupFormData } from '../../../../types/admin/CreateModule/ModuleSetup';
import { Coursework } from '../../../../types/admin/CreateModule/CourseworkSetup';

interface ModuleReviewProps {
  formData: ModuleSetupFormData;
  courseworkList: Coursework[];
  templateData: number[][][];
}

const ModuleReview: React.FC<ModuleReviewProps> = ({
  formData,
  courseworkList,
  templateData,
}) => {
  const calculateContactTime = () => {
    const contactTimeFromStep2 = templateData.reduce(
      (total, table) =>
        total +
        table.reduce(
          (tableTotal, row) =>
            tableTotal + row.reduce((rowTotal, value) => rowTotal + value, 0),
          0,
        ),
      0,
    );
    const contactTimeFromStep4 = courseworkList.reduce(
      (total, coursework) =>
        total +
        (coursework.contactTimeLectureTutorial || 0) +
        (coursework.contactTimeLab || 0) +
        (coursework.contactTimeBriefing || 0),
      0,
    );
    return contactTimeFromStep2 + contactTimeFromStep4;
  };

  const calculatePrivateStudyTime = () => {
    return courseworkList.reduce(
      (total, coursework) => total + (coursework.privateStudyPreparation || 0),
      0,
    );
  };

  const calculateAssessmentTime = () => {
    return courseworkList.reduce(
      (total, coursework) => total + (coursework.keyboardTime || 0),
      0,
    );
  };

  const calculateTotalTime = () => {
    return formData.moduleCredit * 10;
  };

  return (
    <Box>
      <Heading as="h2" size="lg" mb={4}>
        Module Review
      </Heading>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Category</Th>
            <Th>Time (hours)</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td>Contact Time</Td>
            <Td>{calculateContactTime()}</Td>
          </Tr>
          <Tr>
            <Td>Private Study Time</Td>
            <Td>{calculatePrivateStudyTime()}</Td>
          </Tr>
          <Tr>
            <Td>Assessment Time</Td>
            <Td>{calculateAssessmentTime()}</Td>
          </Tr>
          <Tr>
            <Td>Total Time</Td>
            <Td
              style={{
                color:
                  calculateContactTime() +
                    calculatePrivateStudyTime() +
                    calculateAssessmentTime() ===
                  calculateTotalTime()
                    ? 'green'
                    : 'red',
              }}
            >
              {calculateContactTime() +
                calculatePrivateStudyTime() +
                calculateAssessmentTime()}{' '}
              / {calculateTotalTime()}
            </Td>
          </Tr>
        </Tbody>
      </Table>
    </Box>
  );
};

export default ModuleReview;
