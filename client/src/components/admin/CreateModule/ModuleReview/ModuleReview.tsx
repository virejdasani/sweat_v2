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
import { ModuleReviewProps } from '../../../../types/admin/CreateModule/ModuleReview';
import {
  calculateContactTime,
  calculateFormativeAssessmentTime,
  calculatePrivateStudyTime,
  calculatePreparationTime,
  calculateKeyboardTime,
  calculateFeedbackTime,
  calculateTotalTime,
  calculateOverallTime,
} from '../../../../utils/admin/CreateModule/ModuleReview';

const ModuleReview: React.FC<ModuleReviewProps> = ({
  formData,
  courseworkList = [],
  templateData = [],
}) => {
  const overallTime = calculateOverallTime(templateData, courseworkList);
  const totalTime = calculateTotalTime(formData);

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
            <Td>{calculateContactTime(templateData)}</Td>
          </Tr>
          <Tr>
            <Td>Formative Assessment Time</Td>
            <Td>{calculateFormativeAssessmentTime(courseworkList)}</Td>
          </Tr>
          <Tr>
            <Td>Private Study Time</Td>
            <Td>{calculatePrivateStudyTime(courseworkList)}</Td>
          </Tr>
          <Tr>
            <Td>Preparation Time</Td>
            <Td>{calculatePreparationTime(courseworkList)}</Td>
          </Tr>
          <Tr>
            <Td>Keyboard Time</Td>
            <Td>{calculateKeyboardTime(courseworkList)}</Td>
          </Tr>
          <Tr>
            <Td>Feedback Time</Td>
            <Td>{calculateFeedbackTime(courseworkList)}</Td>
          </Tr>
          <Tr>
            <Td>Total Time</Td>
            <Td
              style={{
                color: overallTime === totalTime ? 'green' : 'red',
              }}
            >
              {overallTime} / {totalTime}
            </Td>
          </Tr>
        </Tbody>
      </Table>
    </Box>
  );
};

export default ModuleReview;
