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
  isEditing,
}) => {
  React.useEffect(() => {
    if (!isEditing) {
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
    }
  }, [
    templateData,
    courseworkList,
    moduleCredit,
    handleCourseworkListChange,
    formFactor,
    isEditing,
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
                value={coursework.contactTimeLectures || ''}
                onChange={(e) =>
                  handleScheduleChange(
                    index,
                    'contactTimeLectures',
                    Number(e.target.value),
                  )
                }
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
                value={coursework.contactTimeTutorials || ''}
                onChange={(e) =>
                  handleScheduleChange(
                    index,
                    'contactTimeTutorials',
                    Number(e.target.value),
                  )
                }
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
                value={coursework.contactTimeLabs || ''}
                onChange={(e) =>
                  handleScheduleChange(
                    index,
                    'contactTimeLabs',
                    Number(e.target.value),
                  )
                }
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
                value={coursework.contactTimeSeminars || ''}
                onChange={(e) =>
                  handleScheduleChange(
                    index,
                    'contactTimeSeminars',
                    Number(e.target.value),
                  )
                }
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
                value={coursework.contactTimeFieldworkPlacement || ''}
                onChange={(e) =>
                  handleScheduleChange(
                    index,
                    'contactTimeFieldworkPlacement',
                    Number(e.target.value),
                  )
                }
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
                value={coursework.contactTimeOthers || ''}
                onChange={(e) =>
                  handleScheduleChange(
                    index,
                    'contactTimeOthers',
                    Number(e.target.value),
                  )
                }
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
                value={coursework.formativeAssessmentTime || ''}
                onChange={(e) =>
                  handleScheduleChange(
                    index,
                    'formativeAssessmentTime',
                    Number(e.target.value),
                  )
                }
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
                  typeof coursework.privateStudyTime === 'number'
                    ? coursework.privateStudyTime
                    : ''
                }
                onChange={(e) =>
                  handleScheduleChange(
                    index,
                    'privateStudyTime',
                    Number(e.target.value),
                  )
                }
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
                  typeof coursework.preparationTime === 'number'
                    ? coursework.preparationTime
                    : ''
                }
                onChange={(e) =>
                  handleScheduleChange(
                    index,
                    'preparationTime',
                    Number(e.target.value),
                  )
                }
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
                value={coursework.keyboardTime || ''}
                onChange={(e) =>
                  handleScheduleChange(
                    index,
                    'keyboardTime',
                    Number(e.target.value),
                  )
                }
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
                value={coursework.feedbackTime || ''}
                onChange={(e) =>
                  handleScheduleChange(
                    index,
                    'feedbackTime',
                    Number(e.target.value),
                  )
                }
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
