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
} from './TeachingScheduleStyles';
import { TeachingScheduleProps } from '../../../../types/admin/CreateModule/TeachingSchedule';
import {
  fetchTemplateData,
  getSemesterHeading,
  transformEditingDataToTemplateData,
  handleInputChange,
} from '../../../../utils/admin/CreateModule/TeachingSchedule';

const TeachingSchedule: React.FC<TeachingScheduleProps> = ({
  moduleCredit,
  semester,
  templateData,
  setTemplateData,
  editingScheduleData,
}) => {
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
    };
    fetchData();
  }, [
    moduleCredit,
    semester,
    setTemplateData,
    editingScheduleData,
    templateData.length,
  ]);

  const renderTableHeader = (isSecondSemester = false) => {
    const numWeeks = isSecondSemester || semester === 'second' ? 18 : 15;
    const lastThreeWeeksStart = numWeeks - 3;

    return (
      <Thead>
        <Tr>
          <Th sx={headerStyle}></Th>
          {Array.from({ length: numWeeks }, (_, i) => (
            <Th
              key={i}
              sx={{
                ...headerStyle,
                color: i >= lastThreeWeeksStart ? 'red' : 'inherit',
              }}
            >
              {(isSecondSemester || semester === 'second') && i >= 8 && i <= 10
                ? `Week ${i + 1} (Easter Break Week ${i - 8 + 1})`
                : `Week ${i + 1}`}
            </Th>
          ))}
        </Tr>
      </Thead>
    );
  };

  const renderTableBody = (tableIndex: number) => (
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
            (value, colIndex) => (
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
                  as="input"
                />
              </Td>
            ),
          )}
        </Tr>
      ))}
    </Tbody>
  );

  const renderTable = (tableIndex: number, isSecondSemester = false) => (
    <Table {...tableStyle}>
      {renderTableHeader(isSecondSemester)}
      {renderTableBody(tableIndex)}
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
          {renderTable(0)}
        </>
      )}
    </Box>
  );
};

export default TeachingSchedule;
