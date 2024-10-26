import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Input,
  Text,
  Tooltip,
  Icon,
  Flex,
} from '@chakra-ui/react';
import { QuestionOutlineIcon } from '@chakra-ui/icons';
import { courseworkScheduleStyles } from './CourseworkScheduleStyles';
import { CourseworkScheduleProps } from '../../../../types/admin/CreateModule/CourseworkSchedule';
import {
  calculateTotalTime,
  handleInputChange,
  handleInputBlur,
  expectedTotalTime,
  getPreparationTimeAndPrivateStudyTime,
} from '../../../../utils/admin/CreateModule/CourseworkSchedule';
import httpClient from '../../../../shared/api/httpClient';
import { Coursework } from '../../../../types/admin/CreateModule/CourseworkSetup';

const CourseworkSchedule: React.FC<CourseworkScheduleProps> = ({
  courseworkList = [],
  moduleCredit = 0,
  handleScheduleChange,
  templateData = [],
  handleCourseworkListChange,
  formFactor = 0,
  isEditing = false,
  courseworkPercentage,
}) => {
  const [internalCourseworkList, setInternalCourseworkList] =
    useState(courseworkList);
  const [manualChanges, setManualChanges] = useState<Record<string, boolean>>(
    {},
  );

  const isInitialized = useRef<boolean>(false);
  const initialCourseworkListRef = useRef<Coursework[]>([]);

  const initializeData = async () => {
    if (isInitialized.current) return;

    if (!isEditing) {
      try {
        const adjustedFormFactor =
          courseworkPercentage === 100 ? 100 : formFactor;

        const requestData = {
          courseworkList: courseworkList.map((cw) => ({
            ...cw,
            weight: Number(cw.weight),
            deadlineWeek: Number(cw.deadlineWeek),
          })),
          templateData,
          moduleCredit: Number(moduleCredit),
          formFactor: Number(adjustedFormFactor),
        };

        const response = await httpClient.post(
          '/coursework-schedule',
          requestData,
        );

        const calculatedCourseworkList = response.data.courseworkList;
        console.log('calculatedCourseworkList:', calculatedCourseworkList);
        setInternalCourseworkList(calculatedCourseworkList);
        initialCourseworkListRef.current = JSON.parse(
          JSON.stringify(calculatedCourseworkList),
        );
        handleCourseworkListChange(calculatedCourseworkList);
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error(
            'Error fetching calculated coursework list:',
            error.message,
          );
        } else {
          console.error(
            'Error fetching calculated coursework list:',
            'An unknown error occurred',
          );
        }
      }
    } else {
      setInternalCourseworkList(courseworkList);
      initialCourseworkListRef.current = JSON.parse(
        JSON.stringify(courseworkList),
      );
      handleCourseworkListChange(courseworkList);
    }
    isInitialized.current = true;
  };

  // Initial setup effect
  useEffect(() => {
    initializeData();
  }, []);

  return (
    <Box>
      <Table style={courseworkScheduleStyles.table}>
        <Thead>
          <Tr>
            <Th style={courseworkScheduleStyles.th}>Activity</Th>
            {internalCourseworkList.map((coursework, index) => (
              <Th key={index} style={courseworkScheduleStyles.th}>
                {coursework.shortTitle} (Week: {coursework.deadlineWeek},
                Weight: {coursework.weight}%)
              </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td style={courseworkScheduleStyles.td}>
              <Flex alignItems="center">
                Contact time: Lectures
                <Tooltip
                  label={`${formFactor}% (form factor) of contact time contributed to the coursework`}
                  aria-label="Form factor tooltip"
                >
                  <Icon as={QuestionOutlineIcon} ml={2} />
                </Tooltip>
              </Flex>
            </Td>
            {internalCourseworkList.map((coursework, index) => (
              <Td key={index} style={courseworkScheduleStyles.td}>
                <Input
                  type="number"
                  value={coursework.contactTimeLectures ?? ''}
                  onChange={(e) =>
                    handleInputChange(
                      index,
                      'contactTimeLectures',
                      e.target.value === ''
                        ? undefined
                        : Number(e.target.value),
                      internalCourseworkList,
                      setInternalCourseworkList,
                      manualChanges,
                      setManualChanges,
                      handleScheduleChange,
                    )
                  }
                  onBlur={() =>
                    handleInputBlur(
                      index,
                      'contactTimeLectures',
                      internalCourseworkList,
                      handleScheduleChange,
                    )
                  }
                  style={courseworkScheduleStyles.input}
                />
              </Td>
            ))}
          </Tr>
          <Tr>
            <Td style={courseworkScheduleStyles.td}>Contact time: Tutorials</Td>
            {internalCourseworkList.map((coursework, index) => (
              <Td key={index} style={courseworkScheduleStyles.td}>
                <Input
                  type="number"
                  value={coursework.contactTimeTutorials ?? ''}
                  onChange={(e) =>
                    handleInputChange(
                      index,
                      'contactTimeTutorials',
                      e.target.value === ''
                        ? undefined
                        : Number(e.target.value),
                      internalCourseworkList,
                      setInternalCourseworkList,
                      manualChanges,
                      setManualChanges,
                      handleScheduleChange,
                    )
                  }
                  onBlur={() =>
                    handleInputBlur(
                      index,
                      'contactTimeTutorials',
                      internalCourseworkList,
                      handleScheduleChange,
                    )
                  }
                  style={courseworkScheduleStyles.input}
                />
              </Td>
            ))}
          </Tr>
          <Tr>
            <Td style={courseworkScheduleStyles.td}>Contact time: Labs</Td>
            {internalCourseworkList.map((coursework, index) => (
              <Td key={index} style={courseworkScheduleStyles.td}>
                <Input
                  type="number"
                  value={coursework.contactTimeLabs ?? ''}
                  onChange={(e) =>
                    handleInputChange(
                      index,
                      'contactTimeLabs',
                      e.target.value === ''
                        ? undefined
                        : Number(e.target.value),
                      internalCourseworkList,
                      setInternalCourseworkList,
                      manualChanges,
                      setManualChanges,
                      handleScheduleChange,
                    )
                  }
                  onBlur={() =>
                    handleInputBlur(
                      index,
                      'contactTimeLabs',
                      internalCourseworkList,
                      handleScheduleChange,
                    )
                  }
                  style={courseworkScheduleStyles.input}
                />
              </Td>
            ))}
          </Tr>
          <Tr>
            <Td style={courseworkScheduleStyles.td}>Contact time: Seminars</Td>
            {internalCourseworkList.map((coursework, index) => (
              <Td key={index} style={courseworkScheduleStyles.td}>
                <Input
                  type="number"
                  value={coursework.contactTimeSeminars ?? ''}
                  onChange={(e) =>
                    handleInputChange(
                      index,
                      'contactTimeSeminars',
                      e.target.value === ''
                        ? undefined
                        : Number(e.target.value),
                      internalCourseworkList,
                      setInternalCourseworkList,
                      manualChanges,
                      setManualChanges,
                      handleScheduleChange,
                    )
                  }
                  onBlur={() =>
                    handleInputBlur(
                      index,
                      'contactTimeSeminars',
                      internalCourseworkList,
                      handleScheduleChange,
                    )
                  }
                  style={courseworkScheduleStyles.input}
                />
              </Td>
            ))}
          </Tr>
          <Tr>
            <Td style={courseworkScheduleStyles.td}>
              Contact time: Fieldwork Placement
            </Td>
            {internalCourseworkList.map((coursework, index) => (
              <Td key={index} style={courseworkScheduleStyles.td}>
                <Input
                  type="number"
                  value={coursework.contactTimeFieldworkPlacement ?? ''}
                  onChange={(e) =>
                    handleInputChange(
                      index,
                      'contactTimeFieldworkPlacement',
                      e.target.value === ''
                        ? undefined
                        : Number(e.target.value),
                      internalCourseworkList,
                      setInternalCourseworkList,
                      manualChanges,
                      setManualChanges,
                      handleScheduleChange,
                    )
                  }
                  onBlur={() =>
                    handleInputBlur(
                      index,
                      'contactTimeFieldworkPlacement',
                      internalCourseworkList,
                      handleScheduleChange,
                    )
                  }
                  style={courseworkScheduleStyles.input}
                />
              </Td>
            ))}
          </Tr>
          <Tr>
            <Td style={courseworkScheduleStyles.td}>Contact time: Others</Td>
            {internalCourseworkList.map((coursework, index) => (
              <Td key={index} style={courseworkScheduleStyles.td}>
                <Input
                  type="number"
                  value={coursework.contactTimeOthers ?? ''}
                  onChange={(e) =>
                    handleInputChange(
                      index,
                      'contactTimeOthers',
                      e.target.value === ''
                        ? undefined
                        : Number(e.target.value),
                      internalCourseworkList,
                      setInternalCourseworkList,
                      manualChanges,
                      setManualChanges,
                      handleScheduleChange,
                    )
                  }
                  onBlur={() =>
                    handleInputBlur(
                      index,
                      'contactTimeOthers',
                      internalCourseworkList,
                      handleScheduleChange,
                    )
                  }
                  style={courseworkScheduleStyles.input}
                />
              </Td>
            ))}
          </Tr>
          <Tr>
            <Td style={courseworkScheduleStyles.td}>
              Linked formative assessment (if applicable)
            </Td>
            {internalCourseworkList.map((coursework, index) => (
              <Td key={index} style={courseworkScheduleStyles.td}>
                <Input
                  type="number"
                  value={coursework.formativeAssessmentTime ?? ''}
                  onChange={(e) =>
                    handleInputChange(
                      index,
                      'formativeAssessmentTime',
                      e.target.value === ''
                        ? undefined
                        : Number(e.target.value),
                      internalCourseworkList,
                      setInternalCourseworkList,
                      manualChanges,
                      setManualChanges,
                      handleScheduleChange,
                    )
                  }
                  onBlur={() =>
                    handleInputBlur(
                      index,
                      'formativeAssessmentTime',
                      internalCourseworkList,
                      handleScheduleChange,
                    )
                  }
                  style={courseworkScheduleStyles.input}
                />
              </Td>
            ))}
          </Tr>
          <Tr>
            <Td style={courseworkScheduleStyles.td}>Preparation time</Td>
            {internalCourseworkList.map((coursework, index) => (
              <Td key={index} style={courseworkScheduleStyles.td}>
                <Input
                  type="number"
                  value={
                    typeof coursework.preparationTime === 'number'
                      ? coursework.preparationTime
                      : getPreparationTimeAndPrivateStudyTime(
                          coursework,
                          moduleCredit,
                        ).preparationTime
                  }
                  onChange={(e) =>
                    handleInputChange(
                      index,
                      'preparationTime',
                      e.target.value === ''
                        ? undefined
                        : Number(e.target.value),
                      internalCourseworkList,
                      setInternalCourseworkList,
                      manualChanges,
                      setManualChanges,
                      handleScheduleChange,
                    )
                  }
                  onBlur={() =>
                    handleInputBlur(
                      index,
                      'preparationTime',
                      internalCourseworkList,
                      handleScheduleChange,
                    )
                  }
                  style={courseworkScheduleStyles.input}
                  disabled={coursework.type === 'exam'}
                />
              </Td>
            ))}
          </Tr>
          <Tr>
            <Td style={courseworkScheduleStyles.td}>Private study time</Td>
            {internalCourseworkList.map((coursework, index) => (
              <Td key={index} style={courseworkScheduleStyles.td}>
                <Input
                  type="number"
                  value={
                    typeof coursework.privateStudyTime === 'number'
                      ? coursework.privateStudyTime
                      : getPreparationTimeAndPrivateStudyTime(
                          coursework,
                          moduleCredit,
                        ).privateStudyTime
                  }
                  onChange={(e) =>
                    handleInputChange(
                      index,
                      'privateStudyTime',
                      e.target.value === ''
                        ? undefined
                        : Number(e.target.value),
                      internalCourseworkList,
                      setInternalCourseworkList,
                      manualChanges,
                      setManualChanges,
                      handleScheduleChange,
                    )
                  }
                  onBlur={() =>
                    handleInputBlur(
                      index,
                      'privateStudyTime',
                      internalCourseworkList,
                      handleScheduleChange,
                    )
                  }
                  style={courseworkScheduleStyles.input}
                  disabled={coursework.type !== 'exam'}
                />
              </Td>
            ))}
          </Tr>
          <Tr>
            <Td style={courseworkScheduleStyles.td}>
              Keyboard Time (Actual hours on task)
            </Td>
            {internalCourseworkList.map((coursework, index) => (
              <Td key={index} style={courseworkScheduleStyles.td}>
                <Input
                  type="number"
                  value={coursework.keyboardTime ?? ''}
                  onChange={(e) =>
                    handleInputChange(
                      index,
                      'keyboardTime',
                      e.target.value === ''
                        ? undefined
                        : Number(e.target.value),
                      internalCourseworkList,
                      setInternalCourseworkList,
                      manualChanges,
                      setManualChanges,
                      handleScheduleChange,
                    )
                  }
                  onBlur={() =>
                    handleInputBlur(
                      index,
                      'keyboardTime',
                      internalCourseworkList,
                      handleScheduleChange,
                    )
                  }
                  style={courseworkScheduleStyles.input}
                />
              </Td>
            ))}
          </Tr>
          <Tr>
            <Td style={courseworkScheduleStyles.td}>Feedback time</Td>
            {internalCourseworkList.map((coursework, index) => (
              <Td key={index} style={courseworkScheduleStyles.td}>
                <Input
                  type="number"
                  value={coursework.feedbackTime ?? ''}
                  onChange={(e) =>
                    handleInputChange(
                      index,
                      'feedbackTime',
                      e.target.value === ''
                        ? undefined
                        : Number(e.target.value),
                      internalCourseworkList,
                      setInternalCourseworkList,
                      manualChanges,
                      setManualChanges,
                      handleScheduleChange,
                    )
                  }
                  onBlur={() =>
                    handleInputBlur(
                      index,
                      'feedbackTime',
                      internalCourseworkList,
                      handleScheduleChange,
                    )
                  }
                  style={courseworkScheduleStyles.input}
                  disabled={coursework.type === 'exam'}
                />
              </Td>
            ))}
          </Tr>
          <Tr>
            <Td style={courseworkScheduleStyles.td}>Total time</Td>
            {internalCourseworkList.map((coursework, index) => (
              <Td key={index} style={courseworkScheduleStyles.td}>
                <Text
                  style={{
                    color:
                      calculateTotalTime(coursework, moduleCredit) ===
                      expectedTotalTime(coursework.weight || 0, moduleCredit)
                        ? 'green'
                        : calculateTotalTime(coursework, moduleCredit) >
                            expectedTotalTime(
                              coursework.weight || 0,
                              moduleCredit,
                            )
                          ? 'red'
                          : 'inherit',
                  }}
                >
                  {calculateTotalTime(coursework, moduleCredit)} /{' '}
                  {expectedTotalTime(coursework.weight || 0, moduleCredit)}{' '}
                  {calculateTotalTime(coursework, moduleCredit) >
                    expectedTotalTime(coursework.weight || 0, moduleCredit) && (
                    <Text as="span" style={{ color: 'red' }}>
                      {' '}
                      (Warning: Exceeds expected time!)
                    </Text>
                  )}
                  {calculateTotalTime(coursework, moduleCredit) <
                    expectedTotalTime(coursework.weight || 0, moduleCredit) && (
                    <Text as="span" style={{ color: 'red' }}>
                      {' '}
                      (Warning: Below expected time!)
                    </Text>
                  )}{' '}
                </Text>
              </Td>
            ))}
          </Tr>
        </Tbody>
      </Table>
    </Box>
  );
};

export default CourseworkSchedule;
