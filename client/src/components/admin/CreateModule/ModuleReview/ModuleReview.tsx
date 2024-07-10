import React, { useEffect, useState } from 'react';
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
  const [overallTime, setOverallTime] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [contactTime, setContactTime] = useState(0);
  const [formativeAssessmentTime, setFormativeAssessmentTime] = useState(0);
  const [privateStudyTime, setPrivateStudyTime] = useState(0);
  const [preparationTime, setPreparationTime] = useState(0);
  const [keyboardTime, setKeyboardTime] = useState(0);
  const [feedbackTime, setFeedbackTime] = useState(0);

  useEffect(() => {
    setOverallTime(calculateOverallTime(templateData, courseworkList));
    setTotalTime(calculateTotalTime(formData));
    setContactTime(calculateContactTime(templateData));
    setFormativeAssessmentTime(
      calculateFormativeAssessmentTime(courseworkList),
    );
    setPrivateStudyTime(calculatePrivateStudyTime(courseworkList));
    setPreparationTime(calculatePreparationTime(courseworkList));
    setKeyboardTime(calculateKeyboardTime(courseworkList));
    setFeedbackTime(calculateFeedbackTime(courseworkList));
  }, [formData, courseworkList, templateData]);

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
            <Td>{contactTime}</Td>
          </Tr>
          <Tr>
            <Td>Formative Assessment Time</Td>
            <Td>{formativeAssessmentTime}</Td>
          </Tr>
          <Tr>
            <Td>Private Study Time</Td>
            <Td>{privateStudyTime}</Td>
          </Tr>
          <Tr>
            <Td>Preparation Time</Td>
            <Td>{preparationTime}</Td>
          </Tr>
          <Tr>
            <Td>Keyboard Time</Td>
            <Td>{keyboardTime}</Td>
          </Tr>
          <Tr>
            <Td>Feedback Time</Td>
            <Td>{feedbackTime}</Td>
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
