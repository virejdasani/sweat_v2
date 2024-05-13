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
    return contactTimeFromStep2;
  };

  const calculateFormativeAssessmentTime = () => {
    return courseworkList.reduce(
      (total, coursework) => total + (coursework.formativeAssessment || 0),
      0,
    );
  };

  const calculatePrivateStudyTime = () => {
    return courseworkList.reduce(
      (total, coursework) => total + (coursework.privateStudy || 0),
      0,
    );
  };

  const calculatePreparationTime = () => {
    return courseworkList.reduce(
      (total, coursework) => total + (coursework.preparationTime || 0),
      0,
    );
  };

  const calculateKeyboardTime = () => {
    return courseworkList.reduce(
      (total, coursework) => total + (coursework.keyboardTime || 0),
      0,
    );
  };

  const calculateFeedbackTime = () => {
    return courseworkList.reduce(
      (total, coursework) => total + (coursework.feedbackTime || 0),
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
            <Td>Formative Assessment Time</Td>
            <Td>{calculateFormativeAssessmentTime()}</Td>
          </Tr>
          <Tr>
            <Td>Private Study Time</Td>
            <Td>{calculatePrivateStudyTime()}</Td>
          </Tr>
          <Tr>
            <Td>Preparation Time</Td>
            <Td>{calculatePreparationTime()}</Td>
          </Tr>
          <Tr>
            <Td>Keyboard Time</Td>
            <Td>{calculateKeyboardTime()}</Td>
          </Tr>
          <Tr>
            <Td>Feedback Time</Td>
            <Td>{calculateFeedbackTime()}</Td>
          </Tr>
          <Tr>
            <Td>Total Time</Td>
            <Td
              style={{
                color:
                  calculateContactTime() +
                    calculateFormativeAssessmentTime() +
                    calculatePrivateStudyTime() +
                    calculatePreparationTime() +
                    calculateKeyboardTime() +
                    calculateFeedbackTime() ===
                  calculateTotalTime()
                    ? 'green'
                    : 'red',
              }}
            >
              {calculateContactTime() +
                calculateFormativeAssessmentTime() +
                calculatePrivateStudyTime() +
                calculatePreparationTime() +
                calculateKeyboardTime() +
                calculateFeedbackTime()}{' '}
              / {calculateTotalTime()}
            </Td>
          </Tr>
        </Tbody>
      </Table>
    </Box>
  );
};

export default ModuleReview;
