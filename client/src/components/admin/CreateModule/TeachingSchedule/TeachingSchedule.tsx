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
  Button,
  Heading,
  Flex,
} from '@chakra-ui/react';
import {
  tableStyle,
  headerStyle,
  rowStyle,
  inputStyle,
  buttonStyle,
} from './TeachingScheduleStyles';
import { TeachingScheduleProps } from '../../../../types/admin/CreateModule/TeachingSchedule';
import {
  fetchTemplateData,
  getSemesterHeading,
  transformTemplateDataToSaveData,
} from '../../../../utils/admin/CreateModule/TeachingSchedule';
import {
  TeachingScheduleSaveData,
  Distribution,
} from '../../../../types/admin/CreateModule/TeachingSchedule';

const TeachingSchedule: React.FC<TeachingScheduleProps> = ({
  moduleCredit,
  semester,
  templateData,
  setTemplateData,
  editingScheduleData,
}) => {
  useEffect(() => {
    if (templateData.length === 0 && !editingScheduleData) {
      const fetchData = async () => {
        await fetchTemplateData(moduleCredit, semester, setTemplateData);
      };
      fetchData();
    }
  }, [
    moduleCredit,
    semester,
    templateData,
    setTemplateData,
    editingScheduleData,
  ]);

  useEffect(() => {
    if (editingScheduleData) {
      setTemplateData(transformEditingDataToTemplateData(editingScheduleData));
    }
  }, [editingScheduleData, setTemplateData]);

  const transformEditingDataToTemplateData = (
    scheduleData: TeachingScheduleSaveData,
  ) => {
    const transformedData = [
      scheduleData.lectures,
      scheduleData.tutorials,
      scheduleData.labs,
      scheduleData.seminars,
      scheduleData.fieldworkPlacement,
      scheduleData.other,
    ].map((activity) => {
      const weeks = Array(15).fill(0);
      if (activity.distribution) {
        activity.distribution.forEach((dist: Distribution) => {
          weeks[dist.week - 1] = dist.hours; // Assuming week is 1-based index
        });
      }
      return weeks;
    });
    return [transformedData];
  };

  const handleInputChange = (
    tableIndex: number,
    rowIndex: number,
    colIndex: number,
    value: string,
  ) => {
    const updatedData = [...templateData];
    updatedData[tableIndex][rowIndex][colIndex] = parseInt(value);
    setTemplateData(updatedData);
  };

  const handleSave = () => {
    const saveData = transformTemplateDataToSaveData(templateData);
    console.log('Saved Data:', JSON.stringify(saveData, null, 2));
    // Implement the actual save logic here (e.g., API call to save the data)
  };

  const renderTableHeader = () => (
    <Thead>
      <Tr>
        <Th sx={headerStyle}></Th>
        {Array.from({ length: 15 }, (_, i) => (
          <Th key={i} sx={headerStyle}>
            Week {i + 1}
          </Th>
        ))}
      </Tr>
    </Thead>
  );

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

  const renderTable = (tableIndex: number) => (
    <Table {...tableStyle}>
      {renderTableHeader()}
      {renderTableBody(tableIndex)}
    </Table>
  );

  const semesterHeading = getSemesterHeading(semester);

  return (
    <Box>
      {semester === 'Whole Session' ? (
        <>
          <Heading size="md" mb={4}>
            First Semester
          </Heading>
          {renderTable(0)}
          <Heading size="md" mt={8} mb={4}>
            Second Semester
          </Heading>
          {renderTable(1)}
        </>
      ) : (
        <>
          <Heading size="md" mb={4}>
            {semesterHeading}
          </Heading>
          <Flex direction="column" gap={8}>
            {templateData.map((table, tableIndex) => (
              <Box key={tableIndex}>{renderTable(tableIndex)}</Box>
            ))}
          </Flex>
        </>
      )}
      <Button onClick={handleSave} {...buttonStyle}>
        Save
      </Button>
    </Box>
  );
};

export default TeachingSchedule;
