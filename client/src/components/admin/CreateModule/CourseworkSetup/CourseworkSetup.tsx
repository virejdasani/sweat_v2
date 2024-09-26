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

  // Define readingWeeks based on the selected semester
  const readingWeeks: number[] | { sem1: number[]; sem2: number[] } = (() => {
    if (semester === 'first') {
      return [7]; // Week 7 is a reading week for the first semester
    } else if (semester === 'second') {
      return []; // No reading weeks for the second semester
    } else if (semester === 'whole session') {
      return {
        sem1: [7], // Week 7 is a reading week for the first semester
        sem2: [], // No reading weeks in the second semester
      };
    }
    return [];
  })();

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
      let label = '';

      if (semester === 'whole session') {
        if (week <= 15) {
          label = `S1 W${week}`;
        } else if (week >= 16 && week <= 23) {
          label = `S2 W${week - 15}`; // Weeks 1-8 of second semester
        } else if (week >= 24 && week <= 26) {
          label = `S2 E${week - 23} (Easter Break Week ${week - 23})`; // Easter Break weeks 1-3 with brackets
        } else if (week >= 27 && week <= 33) {
          label = `S2 W${week - 18}`; // Weeks 9-15 of second semester
        }
      }

      if (isReadingWeek(week)) {
        label += ` (Private Study Week)`;
      } else if (!label) {
        label = week.toString();
      }

      return label;
    };

    if (semester === 'second') {
      // Display weeks 1 to 8
      for (let i = 1; i <= 8; i++) {
        options.push(
          <option key={i} value={i.toString()}>
            {`S2 W${i}`}
          </option>,
        );
      }

      // Add Easter Break Weeks with underlying values 9, 10, and 11
      options.push(
        <option key="11" value="11">
          S2 E1 (Easter Break Week 1)
        </option>,
      );
      options.push(
        <option key="12" value="12">
          S2 E2 (Easter Break Week 2)
        </option>,
      );
      options.push(
        <option key="13" value="13">
          S2 E3 (Easter Break Week 3)
        </option>,
      );

      // Display weeks 9 to 15 with adjusted underlying values 12 to 18
      for (let i = 9; i <= 15; i++) {
        const underlyingValue = i + 3; // Adjusting the underlying value
        options.push(
          <option key={underlyingValue} value={underlyingValue.toString()}>
            {`S2 W${i}`}
          </option>,
        );
      }
    } else if (semester === 'whole session' || semester === 'Whole Session') {
      // First semester: weeks 1 to 15 (unchanged)
      for (let i = 1; i <= 15; i++) {
        options.push(
          <option key={i} value={i.toString()}>
            {getLabel(i)}
          </option>,
        );
      }

      // Second semester: map weeks 16-33 to the required format
      for (let i = 16; i <= 33; i++) {
        options.push(
          <option key={i} value={i.toString()}>
            {getLabel(i)}{' '}
            {/* The label is adjusted while the value remains the same */}
          </option>,
        );
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
