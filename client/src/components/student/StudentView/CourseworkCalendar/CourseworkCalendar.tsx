import React, { useState, useEffect } from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Heading,
  IconButton,
  Text,
  VStack,
} from '@chakra-ui/react';
import { SmallCloseIcon } from '@chakra-ui/icons';
import { ModuleDocument } from '../../../../types/admin/CreateModule';
import { Dropdown } from 'primereact/dropdown';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import {
  cellStyle,
  headerStyle,
  tableStyle,
} from './CourseworkCalendar.styles';
import { CourseworkCalendarProps } from '../../../../types/student/StudentView';
import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL + 'settings/editing-status/';

const CourseworkCalendar: React.FC<CourseworkCalendarProps> = ({
  semester,
  programme,
  modules,
  readingWeeks,
  semester1Start,
  semester2Start,
}) => {
  const [displayedModules, setDisplayedModules] =
    useState<ModuleDocument[]>(modules);
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [filterText, setFilterText] = useState<string>('');
  const [editingStatus, setEditingStatus] = useState<boolean>(false);

  useEffect(() => {
    setDisplayedModules(modules);
    fetchEditingStatus();
  }, [modules]);

  const fetchEditingStatus = async () => {
    try {
      const response = await axios.get(baseURL);
      setEditingStatus(response.data.editingStatus);
      console.log('Editing status:', response.data.editingStatus);
    } catch (error) {
      console.error('Error fetching editing status:', error);
    }
  };

  const removeModule = (moduleCode: string) => {
    setDisplayedModules(
      displayedModules.filter(
        (module) => module.moduleSetup.moduleCode !== moduleCode,
      ),
    );
  };

  const addModule = (moduleCode: string) => {
    const moduleToAdd = modules.find(
      (module) => module.moduleSetup.moduleCode === moduleCode,
    );
    if (moduleToAdd) {
      setDisplayedModules([...displayedModules, moduleToAdd]);
      setSelectedModule(null); // Clear selection after adding
      setFilterText(''); // Clear the filter text
    }
  };

  const DAYS_OF_WEEK = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  const getDateForWeekAndDay = (
    semesterStart: Date,
    week: number,
    day: string,
  ) => {
    const startDate = new Date(semesterStart);
    const dayOffset = DAYS_OF_WEEK.indexOf(day);
    const date = new Date(
      startDate.setDate(startDate.getDate() + (week - 1) * 7 + dayOffset),
    );
    return date;
  };

  const renderTableHeader = (
    startWeek: number,
    endWeek: number,
    semester: 'first' | 'second',
  ) => {
    const numWeeks = endWeek - startWeek + 1;

    return (
      <Thead bg="gray.50">
        <Tr>
          <Th {...cellStyle} {...headerStyle}>
            Module Code
          </Th>
          {Array.from({ length: numWeeks }, (_, i) => {
            const weekNumber = startWeek + i;

            let isReadingWeek = false;
            if (Array.isArray(readingWeeks)) {
              isReadingWeek = readingWeeks.includes(weekNumber);
            } else if (
              typeof readingWeeks === 'object' &&
              readingWeeks.sem1 &&
              readingWeeks.sem2
            ) {
              if (startWeek <= 15) {
                isReadingWeek = readingWeeks.sem1.includes(weekNumber);
              } else {
                isReadingWeek = readingWeeks.sem2.includes(weekNumber);
              }
            }

            const isEasterBreak =
              (semester === 'second' &&
                startWeek <= 9 &&
                weekNumber >= 9 &&
                weekNumber <= 11) ||
              (semester === 'second' &&
                startWeek > 15 &&
                weekNumber >= 24 &&
                weekNumber <= 26);

            const weekLabel = isEasterBreak
              ? `Week ${weekNumber} (Easter Break)`
              : isReadingWeek
                ? `Week ${weekNumber} (Private Study Week) (${getDateForWeekAndDay(
                    semester === 'first' ? semester1Start : semester2Start,
                    weekNumber,
                    'Sunday',
                  )
                    .toLocaleDateString()
                    .slice(0, -5)})`
                : `Week ${weekNumber} (${getDateForWeekAndDay(
                    semester === 'first' ? semester1Start : semester2Start,
                    weekNumber,
                    'Sunday',
                  )
                    .toLocaleDateString()
                    .slice(0, -5)})`;
            return (
              <Th
                key={i}
                {...cellStyle}
                {...headerStyle}
                style={
                  {
                    // whiteSpace: 'nowrap',
                    // minWidth: '10px',
                  }
                }
              >
                {weekLabel}
              </Th>
            );
          })}
        </Tr>
      </Thead>
    );
  };

  const renderTableBody = (startWeek: number, endWeek: number) => {
    const numWeeks = endWeek - startWeek + 1;

    return (
      <Tbody>
        {displayedModules.map((module) => (
          <Tr key={module.moduleSetup.moduleCode}>
            <Td textAlign="left" fontWeight="bold" {...cellStyle}>
              {module.moduleSetup.moduleCode}
              <IconButton
                aria-label="Remove module"
                icon={<SmallCloseIcon />}
                size="xs"
                ml={2}
                onClick={() => removeModule(module.moduleSetup.moduleCode)}
                colorScheme="red"
                variant="ghost"
              />
            </Td>
            {Array.from({ length: numWeeks }, (_, i) => {
              const weekNumber = startWeek + i;

              let courseworkForWeek = [];
              if (
                semester === 'second' &&
                module.moduleSetup.semester === 'whole session'
              ) {
                courseworkForWeek = module.courseworkList.filter(
                  (coursework) => {
                    const adjustedWeek = coursework.deadlineWeek - 15;
                    return (
                      adjustedWeek === weekNumber &&
                      !coursework.longTitle.toLowerCase().includes('exam')
                    );
                  },
                );
              } else {
                courseworkForWeek = module.courseworkList.filter(
                  (coursework) =>
                    coursework.deadlineWeek === weekNumber &&
                    !coursework.longTitle.toLowerCase().includes('exam'),
                );
              }

              return (
                <Td
                  key={i}
                  textAlign="center"
                  py={1}
                  // whiteSpace="nowrap"
                  {...cellStyle}
                >
                  {courseworkForWeek.length > 0 && (
                    <VStack spacing={1}>
                      {courseworkForWeek.map((coursework) => (
                        <Text
                          key={coursework.shortTitle}
                          fontSize="sm"
                          bg="teal.100"
                          p={1}
                          borderRadius="md"
                          width="100%"
                          textOverflow="ellipsis"
                          overflow="hidden"
                        >
                          {coursework.longTitle} ({coursework.weight}%){' '}
                          {coursework.deadlineDay}
                        </Text>
                      ))}
                    </VStack>
                  )}
                </Td>
              );
            })}
          </Tr>
        ))}
      </Tbody>
    );
  };

  const renderTables = () => {
    if (semester === 'first') {
      return (
        <>
          <Heading size="md" mb={4}>
            First Semester - {programme}
          </Heading>
          <Box width="100%" margin="0 auto">
            <Table {...tableStyle}>
              {renderTableHeader(1, 15, 'first')}
              {renderTableBody(1, 15)}
            </Table>
          </Box>
        </>
      );
    } else {
      return (
        <>
          <Heading size="md" mb={4}>
            Second Semester - {programme}
          </Heading>
          <Box width="100%" margin="0 auto">
            <Table {...tableStyle}>
              {renderTableHeader(1, 18, 'second')}
              {renderTableBody(1, 18)}
            </Table>
          </Box>
        </>
      );
    }
  };

  return (
    <Box width="90%" overflowX="auto">
      {/* Display the draft message if editingStatus is true */}
      {editingStatus && (
        <Text
          color="red"
          fontSize="lg"
          mb={4}
          mt={14}
          fontWeight="bold"
          textAlign="center"
        >
          This is a draft and is subject to changes.
        </Text>
      )}

      {/* {!editingStatus && (
        <Text color="green.500" fontSize="lg" mb={4} fontWeight="bold">
          This is the final version.
        </Text>
      )} */}

      <Box mb={4} maxWidth="200px">
        <Dropdown
          value={selectedModule}
          options={modules
            .filter((module) => !displayedModules.includes(module))
            .filter((module) =>
              module.moduleSetup.moduleCode
                .toLowerCase()
                .includes(filterText.toLowerCase()),
            )
            .map((module) => ({
              label: module.moduleSetup.moduleCode,
              value: module.moduleSetup.moduleCode,
            }))}
          onChange={(e) => addModule(e.value)}
          onInput={(e) => setFilterText((e.target as HTMLInputElement).value)}
          placeholder="Add Module"
          showClear
          filter
        />
      </Box>

      {renderTables()}
    </Box>
  );
};

export default CourseworkCalendar;
