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
  IconButton,
} from '@chakra-ui/react';
import { QuestionOutlineIcon, DeleteIcon } from '@chakra-ui/icons';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { setHours, setMinutes, format } from 'date-fns';
import {
  CourseworkSetupFunctions,
  addExamCoursework,
} from '../../../../utils/admin/CreateModule/CourseworkSetup';
import {
  Coursework,
  CourseworkSetupProps,
} from '../../../../types/admin/CreateModule/CourseworkSetup';
import { courseworkSetupStyles } from './CourseworkSetupStyles';

const daysOfWeek = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
  'As Timetabled',
];

const CourseworkSetup: React.FC<CourseworkSetupProps> = ({
  courseworkList = [],
  onCourseworkListChange,
  semester,
  examPercentage,
  formFactor,
  onFormFactorChange,
  formData,
}) => {
  const {
    handleAddCoursework,
    handleDeleteCoursework,
    handleInputChange,
    totalWeight,
    isFormValid,
  } = CourseworkSetupFunctions({ courseworkList, onCourseworkListChange });

  useEffect(() => {
    const updatedCourseworkList = addExamCoursework(
      examPercentage,
      courseworkList,
    );
    if (updatedCourseworkList) {
      onCourseworkListChange(updatedCourseworkList);
    }
  }, [examPercentage]);

  const numWeeks =
    formData.semester === 'whole session' ||
    formData.semester === 'Whole Session'
      ? 30
      : 15;

  const handleTimeChange = (index: number, date: Date) => {
    const timeString = format(date, 'HH:mm');
    handleInputChange(index, 'deadlineTime', timeString);
  };

  return (
    <div>
      <Table style={courseworkSetupStyles.table}>
        <Thead>
          <Tr>
            <Th style={courseworkSetupStyles.th}>Short Title</Th>
            <Th style={courseworkSetupStyles.th}>Long Title</Th>
            <Th style={courseworkSetupStyles.th}>Weight</Th>
            <Th style={courseworkSetupStyles.th}>Type</Th>
            <Th style={courseworkSetupStyles.th}>Deadline Week</Th>
            <Th style={courseworkSetupStyles.th}>Released Weeks Prior</Th>
            <Th style={courseworkSetupStyles.th}>Actions</Th>
            <Th style={courseworkSetupStyles.th}>Day of Week</Th>
            <Th style={courseworkSetupStyles.th}>Time</Th>
          </Tr>
        </Thead>
        <Tbody>
          {courseworkList.map((coursework: Coursework, index: number) => (
            <Tr key={index}>
              <Td style={courseworkSetupStyles.td}>
                <Input
                  type="text"
                  value={coursework.shortTitle || ''}
                  onChange={(e) =>
                    handleInputChange(index, 'shortTitle', e.target.value)
                  }
                  style={courseworkSetupStyles.input}
                  disabled={coursework.type === 'exam'}
                />
              </Td>
              <Td style={courseworkSetupStyles.td}>
                <Input
                  type="text"
                  value={coursework.longTitle || ''}
                  onChange={(e) =>
                    handleInputChange(index, 'longTitle', e.target.value)
                  }
                  style={courseworkSetupStyles.input}
                  disabled={coursework.type === 'exam'}
                />
              </Td>
              <Td style={courseworkSetupStyles.td}>
                <Input
                  type="number"
                  step="0.01"
                  value={coursework.weight || ''}
                  onChange={(e) =>
                    handleInputChange(
                      index,
                      'weight',
                      parseFloat(e.target.value),
                    )
                  }
                  style={courseworkSetupStyles.input}
                  disabled={coursework.type === 'exam'}
                />
              </Td>

              <Td style={courseworkSetupStyles.td}>
                <Select
                  value={coursework.type || ''}
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
                  value={coursework.deadlineWeek || ''}
                  onChange={(e) =>
                    handleInputChange(index, 'deadlineWeek', e.target.value)
                  }
                  style={courseworkSetupStyles.select}
                  disabled={
                    coursework.type === 'exam' && semester !== 'whole session'
                  }
                >
                  {Array.from({ length: numWeeks }, (_, i) => {
                    if (semester === 'second' && i + 1 === 8) {
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
                    } else if (semester === 'whole session' && i + 1 === 23) {
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
                          <option key={i + 2} value={i + 2}>
                            {i + 2}
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
                  value={coursework.releasedWeekPrior || ''}
                  onChange={(e) =>
                    handleInputChange(
                      index,
                      'releasedWeekPrior',
                      e.target.value,
                    )
                  }
                  style={courseworkSetupStyles.select}
                  disabled={coursework.type === 'exam'}
                >
                  <option value="N/A">N/A</option>
                  {Array.from({ length: 15 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </Select>
              </Td>
              <Td style={courseworkSetupStyles.td}>
                <IconButton
                  onClick={() => handleDeleteCoursework(index)}
                  style={courseworkSetupStyles.button}
                  aria-label="Delete Coursework"
                  icon={<DeleteIcon />}
                  isDisabled={coursework.type === 'exam'}
                />
              </Td>
              {coursework.type !== 'exam' && (
                <>
                  <Td style={courseworkSetupStyles.td}>
                    <Select
                      value={coursework.deadlineDay || 'Select a day'}
                      onChange={(e) => {
                        handleInputChange(index, 'deadlineDay', e.target.value);
                      }}
                      style={courseworkSetupStyles.select}
                    >
                      <option value="" disabled>
                        Select a day
                      </option>{' '}
                      {/* Default option */}
                      {daysOfWeek.map((day, i) => (
                        <option key={i} value={day}>
                          {day}
                        </option>
                      ))}
                    </Select>
                  </Td>
                  <Td style={courseworkSetupStyles.td}>
                    <DatePicker
                      selected={
                        coursework.deadlineTime
                          ? setHours(
                              setMinutes(
                                new Date(),
                                parseInt(coursework.deadlineTime.split(':')[1]),
                              ),
                              parseInt(coursework.deadlineTime.split(':')[0]),
                            )
                          : new Date()
                      }
                      onChange={(date: Date) => handleTimeChange(index, date)}
                      showTimeSelect
                      showTimeSelectOnly
                      timeIntervals={15} // Set time intervals to 15 minutes
                      timeCaption="Time"
                      dateFormat="HH:mm" // Set dateFormat to 24-hour format
                      timeFormat="HH:mm" // Ensure timeFormat is set to 24-hour format
                      className="chakra-input css-1c6d0i3"
                      popperPlacement="bottom-end"
                      customInput={<Input style={{ width: '80px' }} />}
                    />
                  </Td>
                </>
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
        Total Weight: {totalWeight}%
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
