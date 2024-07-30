import React from 'react';
import { Box, Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';
import { DistributionTableProps } from '../../../../types/admin/CreateModule/ModuleReview';
import {
  calculateContactTime,
  getTableCell,
} from '../../../../utils/admin/CreateModule/ModuleReview';

const DistributionTable: React.FC<DistributionTableProps> = ({
  templateData,
  privateStudyDistributions,
  preparationDistributions,
}) => {
  const contactTime = React.useMemo(
    () => calculateContactTime(templateData),
    [templateData],
  );

  const renderTable = () => {
    const isWholeSession = templateData.length === 2;
    const totalWeeks = isWholeSession ? 33 : templateData[0][0].length;

    return (
      <Box overflowX="auto">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Week</Th>
              {Array.from({ length: totalWeeks }, (_, i) => (
                <Th key={i}>{i + 1}</Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>Contact Time</Td>
              {contactTime.map((hours, index) => (
                <Td key={index}>{getTableCell(hours)}</Td>
              ))}
            </Tr>
            {privateStudyDistributions[0] && (
              <Tr>
                <Td>Private Study Time</Td>
                {privateStudyDistributions[0].distribution.map(
                  (weekData, index) => (
                    <Td key={index}>{getTableCell(weekData.hours)}</Td>
                  ),
                )}
              </Tr>
            )}
            {preparationDistributions
              .filter((coursework) => coursework.type !== 'exam')
              .map((coursework, i) => (
                <React.Fragment key={i}>
                  {coursework.preparationTimeDistributions?.map((dist, j) => (
                    <Tr key={j}>
                      <Td>
                        {coursework.shortTitle} ({dist.type})
                      </Td>
                      {Array.from({ length: totalWeeks }, (_, index) => (
                        <Td key={index}>
                          {getTableCell(
                            dist.distribution.find(
                              (weekData) => weekData.week === index + 1,
                            )?.hours || 0,
                          )}
                        </Td>
                      ))}
                    </Tr>
                  ))}
                </React.Fragment>
              ))}
            {preparationDistributions
              .filter((coursework) => coursework.type === 'exam')
              .flatMap(
                (coursework) =>
                  coursework.preparationTimeDistributions?.map((dist, j) => (
                    <Tr key={j}>
                      <Td>
                        {coursework.shortTitle} ({dist.type})
                      </Td>
                      {Array.from({ length: totalWeeks }, (_, index) => (
                        <Td key={index}>
                          {getTableCell(
                            dist.distribution.find(
                              (weekData) => weekData.week === index + 1,
                            )?.hours || 0,
                          )}
                        </Td>
                      ))}
                    </Tr>
                  )) || [],
              )}
          </Tbody>
        </Table>
      </Box>
    );
  };

  return <Box>{renderTable()}</Box>;
};

export default DistributionTable;
