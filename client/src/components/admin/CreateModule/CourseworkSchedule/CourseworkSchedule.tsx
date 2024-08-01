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
  Button,
  Tooltip,
  Icon,
  Flex,
} from '@chakra-ui/react';
import { QuestionOutlineIcon } from '@chakra-ui/icons';
import { courseworkScheduleStyles } from './CourseworkScheduleStyles';
import { CourseworkScheduleProps } from '../../../../types/admin/CreateModule/CourseworkSchedule';
import { Coursework } from '../../../../types/admin/CreateModule/CourseworkSetup';
import {
  calculateTotalTime,
  expectedTotalTime,
  initializeCourseworkList,
  recalculateCourseworkList,
  getCourseworkListFromSession,
  saveInitialCourseworkListToSession,
  handleRestoreDefaults,
  handleInputChange,
  handleInputBlur,
} from '../../../../utils/admin/CreateModule/CourseworkSchedule';

const CourseworkSchedule: React.FC<CourseworkScheduleProps> = ({
  courseworkList = [],
  moduleCredit = 0,
  handleScheduleChange,
  templateData = [],
  handleCourseworkListChange,
  formFactor = 0,
  isEditing = false,
}) => {
  const [internalCourseworkList, setInternalCourseworkList] =
    useState<Coursework[]>(courseworkList);
  const [manualChanges, setManualChanges] = useState<Record<string, boolean>>(
    {},
  );
  const isInitialized = useRef(false);
  const prevDependencies = useRef({ moduleCredit, formFactor });
  const initialCourseworkListRef = useRef<Coursework[]>([]);

  useEffect(() => {
    const savedCourseworkList = getCourseworkListFromSession();
    if (savedCourseworkList) {
      setInternalCourseworkList(savedCourseworkList);
      handleCourseworkListChange(savedCourseworkList);
      isInitialized.current = true;
    } else if (!isInitialized.current) {
      const initialList = initializeCourseworkList(
        courseworkList,
        templateData,
        moduleCredit,
        formFactor,
        isEditing,
      );
      setInternalCourseworkList(initialList);
      initialCourseworkListRef.current = JSON.parse(
        JSON.stringify(initialList),
      ); // Deep copy
      saveInitialCourseworkListToSession(initialCourseworkListRef.current);
      handleCourseworkListChange(initialList);
      isInitialized.current = true;
    }
  }, [
    courseworkList,
    templateData,
    moduleCredit,
    formFactor,
    isEditing,
    handleCourseworkListChange,
  ]);

  useEffect(() => {
    if (
      isInitialized.current &&
      !isEditing &&
      (moduleCredit !== prevDependencies.current.moduleCredit ||
        formFactor !== prevDependencies.current.formFactor)
    ) {
      const recalculatedList = recalculateCourseworkList(
        initialCourseworkListRef.current, // Use the initial list for recalculation
        templateData,
        moduleCredit,
        formFactor,
      );

      const updatedList = recalculatedList.map(
        (recalculatedCoursework, index) => {
          const currentCoursework = internalCourseworkList[index];
          return {
            ...recalculatedCoursework,
            preparationTime: manualChanges[`${index}-preparationTime`]
              ? currentCoursework.preparationTime
              : recalculatedCoursework.preparationTime,
            privateStudyTime: manualChanges[`${index}-privateStudyTime`]
              ? currentCoursework.privateStudyTime
              : recalculatedCoursework.privateStudyTime,
          };
        },
      );

      setInternalCourseworkList(updatedList);
      handleCourseworkListChange(updatedList);
    }
    prevDependencies.current = { moduleCredit, formFactor };
  }, [
    moduleCredit,
    formFactor,
    templateData,
    isEditing,
    manualChanges,
    internalCourseworkList,
    handleCourseworkListChange,
  ]);

  return (
    <Box>
      <Button
        onClick={() =>
          handleRestoreDefaults(
            setInternalCourseworkList,
            handleCourseworkListChange,
            setManualChanges,
          )
        }
        mb={4}
        colorScheme="blue"
      >
        Restore Defaults
      </Button>
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
            <Td style={courseworkScheduleStyles.td}>Private study</Td>
            {internalCourseworkList.map((coursework, index) => (
              <Td key={index} style={courseworkScheduleStyles.td}>
                <Input
                  type="number"
                  value={
                    typeof coursework.privateStudyTime === 'number'
                      ? coursework.privateStudyTime
                      : ''
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
            <Td style={courseworkScheduleStyles.td}>Preparation time</Td>
            {internalCourseworkList.map((coursework, index) => (
              <Td key={index} style={courseworkScheduleStyles.td}>
                <Input
                  type="number"
                  value={
                    typeof coursework.preparationTime === 'number'
                      ? coursework.preparationTime
                      : ''
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
                      calculateTotalTime(coursework) ===
                      expectedTotalTime(coursework.weight || 0, moduleCredit)
                        ? 'green'
                        : calculateTotalTime(coursework) >
                            expectedTotalTime(
                              coursework.weight || 0,
                              moduleCredit,
                            )
                          ? 'red'
                          : 'inherit',
                  }}
                >
                  {calculateTotalTime(coursework)} /{' '}
                  {expectedTotalTime(coursework.weight || 0, moduleCredit)}
                  {calculateTotalTime(coursework) >
                    expectedTotalTime(coursework.weight || 0, moduleCredit) && (
                    <Text as="span" style={{ color: 'red' }}>
                      {' '}
                      (Warning: Exceeds expected time!)
                    </Text>
                  )}
                  {calculateTotalTime(coursework) <
                    expectedTotalTime(coursework.weight || 0, moduleCredit) && (
                    <Text as="span" style={{ color: 'red' }}>
                      {' '}
                      (Warning: Below expected time!)
                    </Text>
                  )}
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
