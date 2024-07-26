import React, { useMemo } from 'react';
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

    templateData.forEach((semesterData) => {
      semesterData.forEach((weekHoursArray) => {
        weekHoursArray.forEach((hours, weekIndex) => {
          contactTime[weekIndex] += hours;
        });
      });
    });

    return contactTime;
  };

  const contactTime = useMemo(calculateContactTime, [templateData]);

  const renderTable = () => {
    const weeks = templateData.length === 2 ? 30 : 15;

    return (
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
            {privateStudyDistributions.map((dist) =>
              dist.distribution.map((weekData, index) => (
                <Td key={index}>{weekData.hours}</Td>
              )),
            )}
          </Tr>
        </Tbody>
      </Table>
    );
  };

  return <Box>{renderTable()}</Box>;
};

export default DistributionTable;
