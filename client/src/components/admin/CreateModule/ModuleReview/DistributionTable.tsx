import React from 'react';
import { Box, Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';
import { StudyStyleDistribution } from '../../../../types/admin/CreateModule/CourseworkSetup';

interface DistributionTableProps {
  templateData: number[][][];
  privateStudyDistributions: StudyStyleDistribution[];
}

const DistributionTable: React.FC<DistributionTableProps> = ({
  templateData,
  privateStudyDistributions,
}) => {
  const calculateContactTime = (): number[] => {
    const weeks = templateData.length === 2 ? 30 : 15;
    const contactTime = Array(weeks).fill(0);

    const sumContactHours = (semesterData: number[][], startWeek: number) => {
      semesterData.forEach((contactTypeArray) => {
        contactTypeArray.forEach((hours, weekIndex) => {
          contactTime[startWeek + weekIndex] += hours;
        });
      });
    };

    if (templateData.length > 0) {
      sumContactHours(templateData[0], 0);
    }

    if (templateData.length > 1) {
      sumContactHours(templateData[1], 15);
    }

    return contactTime;
  };

  const contactTime = React.useMemo(calculateContactTime, [templateData]);

  const renderTable = () => {
    const weeks = templateData.length === 2 ? 30 : 15;

    return (
      <Box overflowX="auto">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Week</Th>
              {Array.from({ length: weeks }, (_, i) => (
                <Th key={i}>{i + 1}</Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>Contact Time</Td>
              {contactTime.map((hours, index) => (
                <Td key={index}>{hours}</Td>
              ))}
            </Tr>
            <Tr>
              <Td>Private Study Time</Td>
              {privateStudyDistributions[0].distribution.map(
                (weekData, index) => (
                  <Td key={index}>{weekData.hours}</Td>
                ),
              )}
            </Tr>
          </Tbody>
        </Table>
      </Box>
    );
  };

  return <Box>{renderTable()}</Box>;
};

export default DistributionTable;
