import React from 'react';
import { Table, Thead, Tbody, Tr, Th, Td, Input, Text } from '@chakra-ui/react';
import { courseworkScheduleStyles } from './CourseworkScheduleStyles';
import { CourseworkScheduleProps } from '../../../../types/admin/CreateModule/CourseworkSchedule';
import {
  calculateTotalTime,
  expectedTotalTime,
  getPreparationTimeAndPrivateStudyTime,
  updateCourseworkList,
} from '../../../../utils/admin/CreateModule/CourseworkSchedule';

const CourseworkSchedule: React.FC<CourseworkScheduleProps> = ({
  courseworkList,
  moduleCredit,
  handleScheduleChange,
  templateData,
  handleCourseworkListChange,
  formFactor,
}) => {
  const [isPrePopulated, setIsPrePopulated] = React.useState(false);

  React.useEffect(() => {
    if (!isPrePopulated) {
      const updatedCourseworkList = updateCourseworkList(
        courseworkList,
        templateData,
        moduleCredit,
        formFactor,
      );

      const updatedCourseworkListWithPreparationTime =
        updatedCourseworkList.map((coursework) => {
          const { preparationTime, privateStudyTime } =
            getPreparationTimeAndPrivateStudyTime(coursework, moduleCredit);
          return { ...coursework, preparationTime, privateStudyTime };
        });

      handleCourseworkListChange(updatedCourseworkListWithPreparationTime);
      setIsPrePopulated(true);
    }
  }, [
    templateData,
    courseworkList,
    moduleCredit,
    handleCourseworkListChange,
    isPrePopulated,
    formFactor,
  ]);

  return (
    <Table style={courseworkScheduleStyles.table}>
      <Thead>
        <Tr>
          <Th style={courseworkScheduleStyles.th}>Activity</Th>
          {courseworkList.map((coursework, index) => (
            <Th key={index} style={courseworkScheduleStyles.th}>
              {coursework.title}
            </Th>
          ))}
        </Tr>
      </Thead>
      <Tbody>
        <Tr>
          <Td style={courseworkScheduleStyles.td}>Contact time: Lectures</Td>
          {courseworkList.map((coursework, index) => (
            <Td key={index} style={courseworkScheduleStyles.td}>
              <Input
                type="number"
                value={
                  isPrePopulated ? coursework.contactTimeLectures || '' : ''
                }
                onChange={(e) => {
                  if (isPrePopulated) {
                    handleScheduleChange(
                      index,
                      'contactTimeLectures',
                      Number(e.target.value),
                    );
                  }
                }}
                style={courseworkScheduleStyles.input}
              />
            </Td>
          ))}
        </Tr>
        <Tr>
          <Td style={courseworkScheduleStyles.td}>Contact time: Tutorials</Td>
          {courseworkList.map((coursework, index) => (
            <Td key={index} style={courseworkScheduleStyles.td}>
              <Input
                type="number"
                value={
                  isPrePopulated ? coursework.contactTimeTutorials || '' : ''
                }
                onChange={(e) => {
                  if (isPrePopulated) {
                    handleScheduleChange(
                      index,
                      'contactTimeTutorials',
                      Number(e.target.value),
                    );
                  }
                }}
                style={courseworkScheduleStyles.input}
              />
            </Td>
          ))}
        </Tr>
        <Tr>
          <Td style={courseworkScheduleStyles.td}>Contact time: Labs</Td>
          {courseworkList.map((coursework, index) => (
            <Td key={index} style={courseworkScheduleStyles.td}>
              <Input
                type="number"
                value={isPrePopulated ? coursework.contactTimeLabs || '' : ''}
                onChange={(e) => {
                  if (isPrePopulated) {
                    handleScheduleChange(
                      index,
                      'contactTimeLabs',
                      Number(e.target.value),
                    );
                  }
                }}
                style={courseworkScheduleStyles.input}
              />
            </Td>
          ))}
        </Tr>
        <Tr>
          <Td style={courseworkScheduleStyles.td}>Contact time: Seminars</Td>
          {courseworkList.map((coursework, index) => (
            <Td key={index} style={courseworkScheduleStyles.td}>
              <Input
                type="number"
                value={
                  isPrePopulated ? coursework.contactTimeSeminars || '' : ''
                }
                onChange={(e) => {
                  if (isPrePopulated) {
                    handleScheduleChange(
                      index,
                      'contactTimeSeminars',
                      Number(e.target.value),
                    );
                  }
                }}
                style={courseworkScheduleStyles.input}
              />
            </Td>
          ))}
        </Tr>
        <Tr>
          <Td style={courseworkScheduleStyles.td}>
            Contact time: Fieldwork Placement
          </Td>
          {courseworkList.map((coursework, index) => (
            <Td key={index} style={courseworkScheduleStyles.td}>
              <Input
                type="number"
                value={
                  isPrePopulated
                    ? coursework.contactTimeFieldworkPlacement || ''
                    : ''
                }
                onChange={(e) => {
                  if (isPrePopulated) {
                    handleScheduleChange(
                      index,
                      'contactTimeFieldworkPlacement',
                      Number(e.target.value),
                    );
                  }
                }}
                style={courseworkScheduleStyles.input}
              />
            </Td>
          ))}
        </Tr>
        <Tr>
          <Td style={courseworkScheduleStyles.td}>Contact time: Others</Td>
          {courseworkList.map((coursework, index) => (
            <Td key={index} style={courseworkScheduleStyles.td}>
              <Input
                type="number"
                value={isPrePopulated ? coursework.contactTimeOthers || '' : ''}
                onChange={(e) => {
                  if (isPrePopulated) {
                    handleScheduleChange(
                      index,
                      'contactTimeOthers',
                      Number(e.target.value),
                    );
                  }
                }}
                style={courseworkScheduleStyles.input}
              />
            </Td>
          ))}
        </Tr>
        <Tr>
          <Td style={courseworkScheduleStyles.td}>
            Linked formative assessment (if applicable)
          </Td>
          {courseworkList.map((coursework, index) => (
            <Td key={index} style={courseworkScheduleStyles.td}>
              <Input
                type="number"
                value={
                  isPrePopulated ? coursework.formativeAssessmentTime || '' : ''
                }
                onChange={(e) => {
                  if (isPrePopulated) {
                    handleScheduleChange(
                      index,
                      'formativeAssessmentTime',
                      Number(e.target.value),
                    );
                  }
                }}
                style={courseworkScheduleStyles.input}
              />
            </Td>
          ))}
        </Tr>
        <Tr>
          <Td style={courseworkScheduleStyles.td}>Private study</Td>
          {courseworkList.map((coursework, index) => (
            <Td key={index} style={courseworkScheduleStyles.td}>
              <Input
                type="number"
                value={
                  isPrePopulated
                    ? typeof coursework.privateStudyTime === 'number'
                      ? coursework.privateStudyTime
                      : ''
                    : ''
                }
                onChange={(e) => {
                  if (isPrePopulated) {
                    handleScheduleChange(
                      index,
                      'privateStudyTime',
                      Number(e.target.value),
                    );
                  }
                }}
                style={courseworkScheduleStyles.input}
                disabled={coursework.type !== 'exam'}
              />
            </Td>
          ))}
        </Tr>
        <Tr>
          <Td style={courseworkScheduleStyles.td}>Preparation time</Td>
          {courseworkList.map((coursework, index) => (
            <Td key={index} style={courseworkScheduleStyles.td}>
              <Input
                type="number"
                value={
                  isPrePopulated
                    ? typeof coursework.preparationTime === 'number'
                      ? coursework.preparationTime
                      : ''
                    : ''
                }
                onChange={(e) => {
                  if (isPrePopulated) {
                    handleScheduleChange(
                      index,
                      'preparationTime',
                      Number(e.target.value),
                    );
                  }
                }}
                style={courseworkScheduleStyles.input}
                disabled={coursework.type === 'exam'}
              />
            </Td>
          ))}
        </Tr>
        <Tr>
          <Td style={courseworkScheduleStyles.td}>
            Keyboard Time (Actual hours on task)
          </Td>
          {courseworkList.map((coursework, index) => (
            <Td key={index} style={courseworkScheduleStyles.td}>
              <Input
                type="number"
                value={isPrePopulated ? coursework.keyboardTime || '' : ''}
                onChange={(e) => {
                  if (isPrePopulated) {
                    handleScheduleChange(
                      index,
                      'keyboardTime',
                      Number(e.target.value),
                    );
                  }
                }}
                style={courseworkScheduleStyles.input}
              />
            </Td>
          ))}
        </Tr>
        <Tr>
          <Td style={courseworkScheduleStyles.td}>Feedback time</Td>
          {courseworkList.map((coursework, index) => (
            <Td key={index} style={courseworkScheduleStyles.td}>
              <Input
                type="number"
                value={isPrePopulated ? coursework.feedbackTime || '' : ''}
                onChange={(e) => {
                  if (isPrePopulated) {
                    handleScheduleChange(
                      index,
                      'feedbackTime',
                      Number(e.target.value),
                    );
                  }
                }}
                style={courseworkScheduleStyles.input}
                disabled={coursework.type === 'exam'}
              />
            </Td>
          ))}
        </Tr>
        <Tr>
          <Td style={courseworkScheduleStyles.td}>Total time</Td>
          {courseworkList.map((coursework, index) => (
            <Td key={index} style={courseworkScheduleStyles.td}>
              <Text
                style={{
                  color:
                    calculateTotalTime(coursework) ===
                    expectedTotalTime(coursework.weight || 0, moduleCredit)
                      ? 'green'
                      : calculateTotalTime(coursework) >
                          expectedTotalTime(
                            coursework.weight || 0,
                            moduleCredit,
                          )
                        ? 'red'
                        : 'inherit',
                }}
              >
                {calculateTotalTime(coursework)} /{' '}
                {expectedTotalTime(coursework.weight || 0, moduleCredit)}
                {calculateTotalTime(coursework) >
                  expectedTotalTime(coursework.weight || 0, moduleCredit) && (
                  <Text style={{ color: 'red' }}>
                    {' '}
                    (Warning: Exceeds expected time!)
                  </Text>
                )}
                {calculateTotalTime(coursework) <
                  expectedTotalTime(coursework.weight || 0, moduleCredit) && (
                  <Text style={{ color: 'red' }}>
                    {' '}
                    (Warning: Below expected time!)
                  </Text>
                )}
              </Text>
            </Td>
          ))}
        </Tr>
      </Tbody>
    </Table>
  );
};

export default CourseworkSchedule;
