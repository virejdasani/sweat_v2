import React, { useState, useEffect, useRef, useCallback } from 'react';
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
import { Coursework } from '../../../../types/admin/CreateModule/CourseworkSetup';
import {
  handleInputChange,
  handleInputBlur,
} from '../../../../utils/admin/CreateModule/CourseworkSchedule';
import httpClient from '../../../../shared/api/httpClient';

const CourseworkScheduleOptimized: React.FC<CourseworkScheduleProps> = ({
  courseworkList = [],
  moduleCredit = 0,
  handleScheduleChange,
  templateData = [],
  handleCourseworkListChange,
  formFactor = 0,
  isEditing = false,
  courseworkPercentage,
}) => {
  const [internalCourseworkList, setInternalCourseworkList] = useState<
    Coursework[]
  >([]);
  const [manualChanges, setManualChanges] = useState<Record<string, boolean>>(
    {},
  );
  const isInitialized = useRef(false);
  const prevDependencies = useRef({ moduleCredit, formFactor });
  const initialCourseworkListRef = useRef<Coursework[]>([]);

  // Fetch initial coursework list from the backend using Axios
  const fetchInitialCourseworkList = useCallback(async () => {
    try {
      const response = await httpClient.post<Coursework[]>(
        '/coursework/initialize',
        {
          courseworkList,
          templateData,
          moduleCredit,
          formFactor: courseworkPercentage === 100 ? 100 : formFactor,
          isEditing,
          courseworkPercentage,
        },
      );

      const data = response.data;
      return data;
    } catch (error) {
      console.error('Error fetching initial coursework list:', error);
      return [];
    }
  }, [
    courseworkList,
    templateData,
    moduleCredit,
    formFactor,
    courseworkPercentage,
    isEditing,
  ]);

  // Fetch recalculated coursework list from the backend using Axios
  const fetchRecalculatedCourseworkList = useCallback(
    async (
      initialList: Coursework[],
      manualChanges: Record<string, boolean>,
    ) => {
      try {
        const response = await httpClient.post<Coursework[]>(
          '/coursework/recalculate',
          {
            initialCourseworkList: initialList,
            templateData,
            moduleCredit,
            formFactor,
            manualChanges,
            currentCourseworkList: internalCourseworkList,
          },
        );

        const data = response.data;
        return data;
      } catch (error) {
        console.error('Error fetching recalculated coursework list:', error);
        return internalCourseworkList;
      }
    },
    [templateData, moduleCredit, formFactor, internalCourseworkList],
  );

  useEffect(() => {
    const initialize = async () => {
      if (!isInitialized.current) {
        const initialList = await fetchInitialCourseworkList();
        setInternalCourseworkList(initialList);
        initialCourseworkListRef.current = JSON.parse(
          JSON.stringify(initialList),
        ); // Deep copy
        handleCourseworkListChange(initialList);
        isInitialized.current = true;
      }
    };

    initialize();
  }, [fetchInitialCourseworkList, handleCourseworkListChange]);

  useEffect(() => {
    const recalculate = async () => {
      if (
        isInitialized.current &&
        !isEditing &&
        (moduleCredit !== prevDependencies.current.moduleCredit ||
          formFactor !== prevDependencies.current.formFactor)
      ) {
        const updatedList = await fetchRecalculatedCourseworkList(
          initialCourseworkListRef.current,
          manualChanges,
        );
        setInternalCourseworkList(updatedList);
        handleCourseworkListChange(updatedList);
      }
      prevDependencies.current = { moduleCredit, formFactor };
    };

    recalculate();
  }, [
    moduleCredit,
    formFactor,
    isEditing,
    manualChanges,
    fetchRecalculatedCourseworkList,
    handleCourseworkListChange,
  ]);

  // Helper function to format deadlineWeek
  const formatDeadlineWeek = (
    deadlineWeek: number | string | Date | undefined,
  ): string => {
    if (deadlineWeek instanceof Date) {
      return deadlineWeek.toLocaleDateString(); // or any desired format
    }
    return deadlineWeek !== undefined ? deadlineWeek.toString() : '';
  };

  return (
    <Box>
      <Table style={courseworkScheduleStyles.table}>
        <Thead>
          <Tr>
            <Th style={courseworkScheduleStyles.th}>Activity</Th>
            {internalCourseworkList.map((coursework, index) => (
              <Th key={index} style={courseworkScheduleStyles.th}>
                {coursework.shortTitle} (Week:{' '}
                {formatDeadlineWeek(coursework.deadlineWeek)}, Weight:{' '}
                {coursework.weight}%)
              </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {/* Repeat similar structure for other activities */}
          {/* For brevity, only showing a few rows */}
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
                  value={
                    typeof coursework.contactTimeLectures === 'number'
                      ? coursework.contactTimeLectures
                      : ''
                  }
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
          {/* ... other activity rows ... */}
          <Tr>
            <Td style={courseworkScheduleStyles.td}>Total time</Td>
            {internalCourseworkList.map((coursework, index) => (
              <Td key={index} style={courseworkScheduleStyles.td}>
                <Text
                  style={{
                    color:
                      typeof coursework.totalTime === 'number' &&
                      typeof coursework.expectedTotalTime === 'number'
                        ? coursework.totalTime === coursework.expectedTotalTime
                          ? 'green'
                          : coursework.totalTime > coursework.expectedTotalTime
                            ? 'red'
                            : 'inherit'
                        : 'inherit',
                  }}
                >
                  {typeof coursework.totalTime === 'number'
                    ? coursework.totalTime
                    : 0}{' '}
                  /{' '}
                  {typeof coursework.expectedTotalTime === 'number'
                    ? coursework.expectedTotalTime
                    : 0}
                  {typeof coursework.totalTime === 'number' &&
                    typeof coursework.expectedTotalTime === 'number' &&
                    coursework.totalTime > coursework.expectedTotalTime && (
                      <Text as="span" style={{ color: 'red' }}>
                        {' '}
                        (Warning: Exceeds expected time!)
                      </Text>
                    )}
                  {typeof coursework.totalTime === 'number' &&
                    typeof coursework.expectedTotalTime === 'number' &&
                    coursework.totalTime < coursework.expectedTotalTime && (
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

export default CourseworkScheduleOptimized;
