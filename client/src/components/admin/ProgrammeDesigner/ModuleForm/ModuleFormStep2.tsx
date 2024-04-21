import React from 'react';
import { Box, Table, Thead, Tbody, Tr, Th, Td, Input } from '@chakra-ui/react';
import { ModuleFormStep2Props } from '../../../../types/admin/ProgrammeDesigner';

const ModuleFormStep2: React.FC<ModuleFormStep2Props> = ({
  teachingSchedule,
  handleChange,
}) => {
  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (Number(value) < 0) {
      handleChange({
        target: { name, value: '0' },
      } as React.ChangeEvent<HTMLInputElement>);
    }
  };

  return (
    <Box>
      <h2>Teaching Schedule</h2>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Type</Th>
            <Th>Hours</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td>Lectures</Td>
            <Td>
              <Input
                type="number"
                name="lectures"
                value={teachingSchedule.lectures || ''}
                onChange={handleChange}
                onBlur={handleBlur}
                min={0}
              />
            </Td>
          </Tr>
          <Tr>
            <Td>Seminars</Td>
            <Td>
              <Input
                type="number"
                name="seminars"
                value={teachingSchedule.seminars || ''}
                onChange={handleChange}
                onBlur={handleBlur}
                min={0}
              />
            </Td>
          </Tr>
          <Tr>
            <Td>Tutorials</Td>
            <Td>
              <Input
                type="number"
                name="tutorials"
                value={teachingSchedule.tutorials || ''}
                onChange={handleChange}
                onBlur={handleBlur}
                min={0}
              />
            </Td>
          </Tr>
          <Tr>
            <Td>Labs</Td>
            <Td>
              <Input
                type="number"
                name="labs"
                value={teachingSchedule.labs || ''}
                onChange={handleChange}
                onBlur={handleBlur}
                min={0}
              />
            </Td>
          </Tr>
          <Tr>
            <Td>Fieldwork Placement</Td>
            <Td>
              <Input
                type="number"
                name="fieldworkPlacement"
                value={teachingSchedule.fieldworkPlacement || ''}
                onChange={handleChange}
                onBlur={handleBlur}
                min={0}
              />
            </Td>
          </Tr>
          <Tr>
            <Td>Other</Td>
            <Td>
              <Input
                type="number"
                name="other"
                value={teachingSchedule.other || ''}
                onChange={handleChange}
                onBlur={handleBlur}
                min={0}
              />
            </Td>
          </Tr>
        </Tbody>
      </Table>
    </Box>
  );
};

export default ModuleFormStep2;
