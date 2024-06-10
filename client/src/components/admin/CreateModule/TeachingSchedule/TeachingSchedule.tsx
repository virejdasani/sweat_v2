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
import {
  TeachingScheduleProps,
  TeachingScheduleSaveData,
} from '../../../../types/admin/CreateModule/TeachingSchedule';
import {
  fetchTemplateData,
  getSemesterHeading,
} from '../../../../utils/admin/CreateModule/TeachingSchedule';

const TeachingSchedule: React.FC<TeachingScheduleProps> = ({
  moduleCredit,
  semester,
  templateData,
  setTemplateData,
}) => {
  useEffect(() => {
    if (templateData.length === 0) {
      const fetchData = async () => {
        await fetchTemplateData(moduleCredit, semester, setTemplateData);
      };
      fetchData();
    }
  }, [moduleCredit, semester, templateData, setTemplateData]);

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

  const transformTemplateDataToSaveData = (
    templateData: number[][][],
  ): TeachingScheduleSaveData => {
    const teachingScheduleSaveData: TeachingScheduleSaveData = {
      lectures: { hours: 0, distribution: [] },
      tutorials: { hours: 0, distribution: [] },
      labs: { hours: 0, distribution: [] },
      seminars: { hours: 0, distribution: [] },
      fieldworkPlacement: { hours: 0, distribution: [] },
      other: { hours: 0, distribution: [] },
    };

    templateData.forEach((table) => {
      table.forEach((row, rowIndex) => {
        let activityKey: keyof TeachingScheduleSaveData;

        switch (rowIndex) {
          case 0:
            activityKey = 'lectures';
            break;
          case 1:
            activityKey = 'tutorials';
            break;
          case 2:
            activityKey = 'labs';
            break;
          case 3:
            activityKey = 'seminars';
            break;
          case 4:
            activityKey = 'fieldworkPlacement';
            break;
          case 5:
            activityKey = 'other';
            break;
          default:
            return;
        }

        const distribution = row
          .map((hours, week) => ({ week: week + 1, hours }))
          .filter((item) => item.hours > 0);

        teachingScheduleSaveData[activityKey] = {
          hours: distribution.reduce((total, dist) => total + dist.hours, 0),
          distribution,
        };
      });
    });

    return teachingScheduleSaveData;
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
