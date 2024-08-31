import React, { useEffect } from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Input,
  Heading,
} from '@chakra-ui/react';
import {
  tableStyle,
  headerStyle,
  rowStyle,
  inputStyle,
  greyedOutInputStyle,
} from './TeachingScheduleStyles';
import { TeachingScheduleProps } from '../../../../types/admin/CreateModule/TeachingSchedule';
import {
  fetchTemplateData,
  getSemesterHeading,
  transformEditingDataToTemplateData,
  handleInputChange,
  updateTemplateDataForReadingWeek,
} from '../../../../utils/admin/CreateModule/TeachingSchedule';

const TeachingSchedule: React.FC<TeachingScheduleProps> = ({
  moduleCredit,
  semester,
  templateData,
  setTemplateData,
  editingScheduleData,
}) => {
  // Define readingWeeks based on the selected semester
  const readingWeeks = (() => {
    if (semester === 'first') {
      return [7]; // Week 7 is a reading week for the first semester
    } else if (semester === 'second') {
      return []; // No reading weeks for the second semester
    } else if (semester === 'whole session') {
      return {
        sem1: [7], // Week 7 is a reading week for the first semester
        sem2: [], // No reading weeks in the second semester
      };
    }
    return [];
  })();

  useEffect(() => {
    const fetchData = async () => {
      if (editingScheduleData) {
        const transformedData = transformEditingDataToTemplateData(
          editingScheduleData,
          semester as 'first' | 'second' | 'whole session',
        );
        setTemplateData(transformedData);
      } else if (templateData.length === 0) {
        await fetchTemplateData(moduleCredit, semester, setTemplateData);
      }

      if (templateData.length > 0 && readingWeeks) {
        const transformedData = updateTemplateDataForReadingWeek(
          templateData,
          readingWeeks,
        );
        setTemplateData(transformedData);
      }
    };
    fetchData();
  }, [
    moduleCredit,
    semester,
    setTemplateData,
    editingScheduleData,
    templateData.length,
    readingWeeks,
    templateData,
  ]);

  const renderTableHeader = (isSecondSemester = false) => {
    const numWeeks = isSecondSemester || semester === 'second' ? 18 : 15;
    const lastThreeWeeksStart = numWeeks - 3;

    return (
      <Thead>
        <Tr>
          <Th sx={headerStyle}></Th>
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
              <Th
                key={i}
                sx={{
                  ...headerStyle,
                  color: i >= lastThreeWeeksStart ? 'red' : 'inherit',
                }}
              >
                {(isSecondSemester || semester === 'second') &&
                weekNumber >= 9 &&
                weekNumber <= 11
                  ? `Week ${weekNumber} (Easter Break Week ${weekNumber - 8})`
                  : weekLabel}
              </Th>
            );
          })}
        </Tr>
      </Thead>
    );
  };

  const renderTableBody = (tableIndex: number, isSecondSemester = false) => (
    <Tbody>
      {[
        'Lectures',
        'Tutorials',
        'Labs',
        'Seminars',
        'Fieldwork Placement',
        'Others',
      ].map((row, rowIndex) => (
        <Tr key={`${tableIndex}-${rowIndex}`}>
          <Td sx={headerStyle}>{row}</Td>
          {(templateData[tableIndex]?.[rowIndex] || []).map(
            (value, colIndex) => {
              const adjustedWeekIndex = colIndex + 1;
              const isReadingWeek = Array.isArray(readingWeeks)
                ? readingWeeks.includes(adjustedWeekIndex)
                : semester === 'whole session'
                  ? isSecondSemester
                    ? (
                        readingWeeks as { sem1: number[]; sem2: number[] }
                      ).sem2.includes(adjustedWeekIndex)
                    : (
                        readingWeeks as { sem1: number[]; sem2: number[] }
                      ).sem1.includes(adjustedWeekIndex)
                  : false;
              return (
                <Td key={colIndex} sx={rowStyle}>
                  <Input
                    type="number"
                    value={value}
                    onChange={(e) =>
                      handleInputChange(
                        tableIndex,
                        rowIndex,
                        colIndex,
                        e.target.value,
                        templateData,
                        setTemplateData,
                      )
                    }
                    {...inputStyle}
                    sx={isReadingWeek ? greyedOutInputStyle : {}}
                    as="input"
                    disabled={isReadingWeek}
                  />
                </Td>
              );
            },
          )}
        </Tr>
      ))}
    </Tbody>
  );

  const renderTable = (tableIndex: number, isSecondSemester = false) => (
    <Table {...tableStyle}>
      {renderTableHeader(isSecondSemester)}
      {renderTableBody(tableIndex, isSecondSemester)}
    </Table>
  );

  const semesterHeading = getSemesterHeading(semester);

  return (
    <Box>
      {semester === 'whole session' ? (
        <>
          <Heading size="md" mb={4}>
            First Semester
          </Heading>
          {renderTable(0)}
          <Heading size="md" mt={8} mb={4}>
            Second Semester
          </Heading>
          {renderTable(1, true)}
        </>
      ) : (
        <>
          <Heading size="md" mb={4}>
            {semesterHeading}
          </Heading>
          {renderTable(0, semester === 'second')}
        </>
      )}
    </Box>
  );
};

export default TeachingSchedule;
