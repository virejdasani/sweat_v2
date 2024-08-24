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
  TableProps,
  ResponsiveValue,
} from '@chakra-ui/react';
import { SmallCloseIcon } from '@chakra-ui/icons';
import { ModuleDocument } from '../../../../types/admin/CreateModule';
import { Dropdown } from 'primereact/dropdown';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

// Styles
export const tableStyle: TableProps = {
  size: 'sm',
  variant: 'simple',
  colorScheme: 'gray',
};

export const headerStyle = {
  fontSize: 'xs',
  textAlign: 'center' as ResponsiveValue<'left' | 'center' | 'right'>,
  fontWeight: 'semibold',
};

const cellStyle = {
  border: '1px solid',
  borderColor: 'gray.300',
  px: 2,
};

interface CourseworkCalendarProps {
  semester: 'first' | 'second' | 'whole session';
  programme: string;
  modules: ModuleDocument[];
  readingWeeks?: number[] | { sem1: number[]; sem2: number[] };
}

const CourseworkCalendar: React.FC<CourseworkCalendarProps> = ({
  semester,
  programme,
  modules,
  readingWeeks,
}) => {
  const [displayedModules, setDisplayedModules] =
    useState<ModuleDocument[]>(modules);
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [filterText, setFilterText] = useState<string>('');

  useEffect(() => {
    setDisplayedModules(modules);
  }, [modules]);

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

  const renderTableHeader = (isSecondSemester = false) => {
    const numWeeks = isSecondSemester || semester === 'second' ? 18 : 15;

    return (
      <Thead bg="gray.50">
        <Tr>
          <Th {...cellStyle} {...headerStyle}>
            Module Code
          </Th>
          {Array.from({ length: numWeeks }, (_, i) => {
            const weekNumber = i + 1;
            const isReadingWeek = Array.isArray(readingWeeks)
              ? readingWeeks.includes(weekNumber)
              : semester === 'whole session'
                ? isSecondSemester
                  ? (
                      readingWeeks as { sem1: number[]; sem2: number[] }
                    ).sem2.includes(weekNumber)
                  : (
                      readingWeeks as { sem1: number[]; sem2: number[] }
                    ).sem1.includes(weekNumber)
                : false;
            const weekLabel = isReadingWeek
              ? `Week ${weekNumber} (Private Study Week)`
              : `Week ${weekNumber}`;
            return (
              <Th key={i} {...cellStyle} {...headerStyle}>
                {weekLabel}
              </Th>
            );
          })}
        </Tr>
      </Thead>
    );
  };

  const renderTableBody = () => {
    const numWeeks =
      semester === 'second' || semester === 'whole session' ? 18 : 15;

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
              const weekNumber = i + 1;
              const courseworkForWeek = module.courseworkList.filter(
                (coursework) => coursework.deadlineWeek === weekNumber,
              );
              return (
                <Td
                  key={i}
                  textAlign="center"
                  py={1}
                  whiteSpace="nowrap"
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
                          {coursework.shortTitle} - {coursework.longTitle} (
                          {coursework.type})
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

  return (
    <Box width="90%" overflowX="auto">
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

      {semester === 'whole session' ? (
        <>
          <Heading size="md" mb={4}>
            First Semester - {programme}
          </Heading>
          <Box width="80%" margin="0 auto">
            <Table {...tableStyle} mb={8}>
              {renderTableHeader(false)}
              {renderTableBody()}
            </Table>
          </Box>

          <Heading size="md" mb={4}>
            Second Semester - {programme}
          </Heading>
          <Box width="100%" margin="0 auto">
            <Table {...tableStyle}>
              {renderTableHeader(true)}
              {renderTableBody()}
            </Table>
          </Box>
        </>
      ) : (
        <>
          <Heading size="md" mb={4}>
            {semester.charAt(0).toUpperCase() + semester.slice(1)} Semester -{' '}
            {programme}
          </Heading>
          <Box width="100%" margin="0 auto">
            <Table {...tableStyle}>
              {renderTableHeader(semester === 'second')}
              {renderTableBody()}
            </Table>
          </Box>
        </>
      )}
    </Box>
  );
};

export default CourseworkCalendar;
