import React from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Input,
  Select,
  IconButton,
  Box,
  Button,
} from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import { ModuleFormStep3Props } from '../../../../types/admin/ProgrammeDesigner';
import { handleNumberChange } from '../../../../utils/admin/ProgrammeDesigner';

const ModuleFormStep3: React.FC<ModuleFormStep3Props> = ({
  courseworks,
  handleChange,
  addCoursework,
  removeCoursework,
}) => {
  return (
    <Box>
      <h2>Coursework Setup</h2>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>CW Title</Th>
            <Th>Weight</Th>
            <Th>Type</Th>
            <Th>Deadline Week</Th>
            <Th>Released Week Earlier</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {courseworks.map((coursework, index) => (
            <Tr key={index}>
              <Td>
                <Input
                  value={coursework.cwTitle}
                  onChange={(e) =>
                    handleChange(index, 'cwTitle', e.target.value)
                  }
                />
              </Td>
              <Td>
                <Input
                  type="number"
                  value={coursework.weight}
                  onChange={(e) =>
                    handleNumberChange(
                      index,
                      'weight',
                      e.target.value,
                      handleChange,
                    )
                  }
                  inputMode="numeric"
                  pattern="[0-9]*"
                  min={0}
                  max={100}
                  step={1}
                />
              </Td>
              <Td>
                <Select
                  value={coursework.type}
                  onChange={(e) => handleChange(index, 'type', e.target.value)}
                >
                  <option value="exam">Exam</option>
                  <option value="assignment">Assignment</option>
                  <option value="class test">Class Test</option>
                  <option value="lab report">Lab Report</option>
                  <option value="presentation">Presentation</option>
                  <option value="other">Other</option>
                </Select>
              </Td>
              <Td>
                <Input
                  type="number"
                  value={coursework.deadlineWeek}
                  onChange={(e) =>
                    handleNumberChange(
                      index,
                      'deadlineWeek',
                      e.target.value,
                      handleChange,
                    )
                  }
                  inputMode="numeric"
                  pattern="[0-9]*"
                  min={1}
                  max={52}
                  step={1}
                />
              </Td>
              <Td>
                <Input
                  type="number"
                  value={coursework.releasedWeekEarlier}
                  onChange={(e) =>
                    handleNumberChange(
                      index,
                      'releasedWeekEarlier',
                      e.target.value,
                      handleChange,
                    )
                  }
                  inputMode="numeric"
                  pattern="[0-9]*"
                  min={0}
                  max={51}
                  step={1}
                />
              </Td>
              <Td>
                <IconButton
                  aria-label="Delete coursework"
                  icon={<DeleteIcon />}
                  onClick={() => removeCoursework(index)}
                />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      <Button mt={4} onClick={addCoursework}>
        Add Coursework
      </Button>
    </Box>
  );
};

export default ModuleFormStep3;
