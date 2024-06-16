import React, { useEffect } from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Input,
  Select,
  Button,
  Text,
  Tooltip,
  Icon,
  Flex,
  Box,
} from '@chakra-ui/react';
import { QuestionOutlineIcon } from '@chakra-ui/icons';
import {
  CourseworkSetupFunctions,
  addExamCoursework,
} from '../../../../utils/admin/CreateModule/CourseworkSetup';
import {
  Coursework,
  CourseworkSetupProps,
} from '../../../../types/admin/CreateModule/CourseworkSetup';
import { courseworkSetupStyles } from './CourseworkSetupStyles';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './CourseworkSetup.css';

const CourseworkSetup: React.FC<CourseworkSetupProps> = ({
  courseworkList = [],
  onCourseworkListChange,
  semester,
  examPercentage,
  formFactor,
  onFormFactorChange,
}) => {
  const {
    handleAddCoursework,
    handleDeleteCoursework,
    handleInputChange,
    totalWeight,
    isFormValid,
  } = CourseworkSetupFunctions({ courseworkList, onCourseworkListChange });

  useEffect(() => {
    addExamCoursework(examPercentage, courseworkList, onCourseworkListChange);
  }, [examPercentage, courseworkList, onCourseworkListChange]);

  return (
    <div>
      <Table style={courseworkSetupStyles.table}>
        <Thead>
          <Tr>
            <Th style={courseworkSetupStyles.th}>Coursework Title</Th>
            <Th style={courseworkSetupStyles.th}>Weight</Th>
            <Th style={courseworkSetupStyles.th}>Type</Th>
            <Th style={courseworkSetupStyles.th}>Deadline Week</Th>
            <Th style={courseworkSetupStyles.th}>Released Week Earlier</Th>
            <Th style={courseworkSetupStyles.th}>Actions</Th>
            <Th style={courseworkSetupStyles.th}>Date</Th>
          </Tr>
        </Thead>
        <Tbody>
          {courseworkList.map((coursework: Coursework, index: number) => (
            <Tr key={index}>
              <Td style={courseworkSetupStyles.td}>
                <Input
                  type="text"
                  value={coursework.title}
                  onChange={(e) =>
                    handleInputChange(index, 'title', e.target.value)
                  }
                  style={courseworkSetupStyles.input}
                  disabled={coursework.type === 'exam'}
                />
              </Td>
              <Td style={courseworkSetupStyles.td}>
                <Input
                  type="number"
                  value={coursework.weight}
                  onChange={(e) =>
                    handleInputChange(index, 'weight', e.target.value)
                  }
                  style={courseworkSetupStyles.input}
                  disabled={coursework.type === 'exam'}
                />
              </Td>
              <Td style={courseworkSetupStyles.td}>
                <Select
                  value={coursework.type}
                  onChange={(e) =>
                    handleInputChange(index, 'type', e.target.value)
                  }
                  style={courseworkSetupStyles.select}
                  disabled={coursework.type === 'exam'}
                >
                  <option value="exam">Exam</option>
                  <option value="assignment">Assignment</option>
                  <option value="class test">Class Test</option>
                  <option value="lab report">Lab Report</option>
                  <option value="presentation">Presentation</option>
                  <option value="other">Other</option>
                </Select>
              </Td>
              <Td style={courseworkSetupStyles.td}>
                <Select
                  value={coursework.deadlineWeek}
                  onChange={(e) =>
                    handleInputChange(index, 'deadlineWeek', e.target.value)
                  }
                  style={courseworkSetupStyles.select}
                  disabled={coursework.type === 'exam'}
                >
                  {Array.from({ length: 15 }, (_, i) => {
                    if (
                      (semester === 'second' || semester === 'Second') &&
                      i + 1 === 8
                    ) {
                      return (
                        <React.Fragment key={i}>
                          <option key={i + 1} value={i + 1}>
                            {i + 1}
                          </option>
                          <option key="easterBreak1" value="easterBreak1">
                            Easter Break Week 1
                          </option>
                          <option key="easterBreak2" value="easterBreak2">
                            Easter Break Week 2
                          </option>
                          <option key="easterBreak3" value="easterBreak3">
                            Easter Break Week 3
                          </option>
                        </React.Fragment>
                      );
                    } else {
                      return (
                        <option key={i + 1} value={i + 1}>
                          {i + 1}
                        </option>
                      );
                    }
                  })}
                </Select>
              </Td>
              <Td style={courseworkSetupStyles.td}>
                <Select
                  value={coursework.releasedWeekEarlier}
                  onChange={(e) =>
                    handleInputChange(
                      index,
                      'releasedWeekEarlier',
                      e.target.value,
                    )
                  }
                  style={courseworkSetupStyles.select}
                  disabled={coursework.type === 'exam'}
                >
                  {Array.from({ length: 15 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </Select>
              </Td>
              <Td style={courseworkSetupStyles.td}>
                <Button
                  onClick={() => handleDeleteCoursework(index)}
                  style={courseworkSetupStyles.button}
                  disabled={coursework.type === 'exam'}
                >
                  Delete
                </Button>
              </Td>
              {coursework.type !== 'exam' && (
                <Td style={courseworkSetupStyles.td}>
                  <DatePicker
                    selected={
                      coursework.deadlineDate
                        ? new Date(coursework.deadlineDate)
                        : null
                    }
                    onChange={(date: Date | null) =>
                      handleInputChange(index, 'deadlineDate', date)
                    }
                    dateFormat="dd/MM/yyyy"
                    className="datePicker"
                  />
                </Td>
              )}
            </Tr>
          ))}
        </Tbody>
      </Table>
      <Text
        style={{
          ...courseworkSetupStyles.totalWeight,
          color:
            totalWeight === 100
              ? 'green'
              : totalWeight > 100
                ? 'red'
                : 'inherit',
        }}
      >
        Total Weight: {totalWeight}
        {totalWeight > 100 && (
          <Text as="span" style={{ color: 'red' }}>
            {' '}
            (Warning: Total weight exceeds 100%)
          </Text>
        )}
        {totalWeight < 100 && (
          <Text as="span" style={{ color: 'red' }}>
            {' '}
            (Warning: Total weight is less than 100%)
          </Text>
        )}
      </Text>
      <Flex direction="column" align="center" mt={4}>
        <Button
          onClick={handleAddCoursework}
          disabled={!isFormValid}
          style={courseworkSetupStyles.button}
          mb={4}
        >
          Add Coursework
        </Button>
        <Box>
          <Tooltip
            label="Form Factor is the percentage of contact time that will be dedicated to all courseworks."
            aria-label="Form Factor Tooltip"
            hasArrow
          >
            <Flex align="center">
              <Text mr={2}>Form Factor (%):</Text>
              <Icon as={QuestionOutlineIcon} mr={2} />
              <Input
                type="number"
                value={formFactor}
                onChange={(e) => onFormFactorChange(parseInt(e.target.value))}
                style={{ ...courseworkSetupStyles.input, width: '80px' }}
              />
            </Flex>
          </Tooltip>
        </Box>
      </Flex>
    </div>
  );
};

export default CourseworkSetup;
