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
import { setHours, setMinutes } from 'date-fns';
import {
  CourseworkSetupFunctions,
  addExamCoursework,
  handleDeadlineWeekChange,
  handleTimeChange,
} from '../../../../utils/admin/CreateModule/CourseworkSetup';
import {
  Coursework,
  CourseworkSetupProps,
  daysOfWeek,
} from '../../../../types/admin/CreateModule/CourseworkSetup';
import { courseworkSetupStyles } from './CourseworkSetupStyles';

const CourseworkSetup: React.FC<CourseworkSetupProps> = ({
  courseworkList = [],
  onCourseworkListChange,
  semester,
  examPercentage,
  formFactor,
  onFormFactorChange,
  readingWeeks,
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
      semester,
    );
    if (updatedCourseworkList) {
      onCourseworkListChange(updatedCourseworkList);
    }
  }, [examPercentage, semester, courseworkList, onCourseworkListChange]);

  const renderWeekOptions = () => {
    const options = [];

    const isReadingWeek = (week: number) => {
      if (Array.isArray(readingWeeks)) {
        return readingWeeks.includes(week);
      } else if (readingWeeks && semester === 'whole session') {
        return (
          (week <= 15 && readingWeeks.sem1.includes(week)) ||
          (week > 15 && readingWeeks.sem2.includes(week - 15))
        ); // Adjust for whole session
      }
      return false;
    };

    const getLabel = (week: number) => {
      if (isReadingWeek(week)) {
        return `${week} (Private Study Week)`;
      }
      if (week >= 24 && week <= 26) {
        return `${week} (Easter Break Week ${week - 23})`;
      }
      return week.toString();
    };

    if (semester === 'second') {
      for (let i = 1; i <= 18; i++) {
        if (i === 9) {
          options.push(
            <React.Fragment key="easterBreak1">
              <option key={9} value="9">
                9 (Easter Break Week 1)
              </option>
              <option key={10} value="10">
                10 (Easter Break Week 2)
              </option>
              <option key={11} value="11">
                11 (Easter Break Week 3)
              </option>
            </React.Fragment>,
          );
          i += 2;
        } else {
          options.push(
            <option key={i} value={i.toString()}>
              {getLabel(i)}
            </option>,
          );
        }
      }
    } else if (semester === 'whole session' || semester === 'Whole Session') {
      for (let i = 1; i <= 33; i++) {
        if (i === 24) {
          options.push(
            <React.Fragment key="easterBreak1">
              <option key={24} value="24">
                24 (Easter Break Week 1)
              </option>
              <option key={25} value="25">
                25 (Easter Break Week 2)
              </option>
              <option key={26} value="26">
                26 (Easter Break Week 3)
              </option>
            </React.Fragment>,
          );
          i += 2;
        } else {
          options.push(
            <option key={i} value={i.toString()}>
              {getLabel(i)}
            </option>,
          );
        }
      }
    } else {
      for (let i = 1; i <= 15; i++) {
        options.push(
          <option key={i} value={i.toString()}>
            {getLabel(i)}
          </option>,
        );
      }
    }
    return options;
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
                  value={coursework.deadlineWeek.toString() || ''}
                  onChange={(e) =>
                    handleDeadlineWeekChange(
                      index,
                      e.target.value,
                      semester,
                      handleInputChange,
                    )
                  }
                  style={courseworkSetupStyles.select}
                  disabled={
                    coursework.type === 'exam' && semester !== 'whole session'
                  }
                >
                  {renderWeekOptions()}
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
                  {Array.from(
                    {
                      length: semester === 'whole session' ? 30 : 15,
                    },
                    (_, i) => (
                      <option key={i + 1} value={(i + 1).toString()}>
                        {i + 1}
                      </option>
                    ),
                  )}
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
                      onChange={(date: Date) =>
                        handleTimeChange(index, date, handleInputChange)
                      }
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
