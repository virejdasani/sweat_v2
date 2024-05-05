import React from 'react';
import { Table, Thead, Tbody, Tr, Th, Td, Input, Text } from '@chakra-ui/react';
import { courseworkScheduleStyles } from './CourseworkScheduleStyles';
import { CourseworkScheduleProps } from '../../../../types/admin/CreateModule/CourseworkSchedule';
import {
  calculateTotalTime,
  expectedTotalTime,
  updateCourseworkList,
} from '../../../../utils/admin/CreateModule/CourseworkSchedule';

const CourseworkSchedule: React.FC<CourseworkScheduleProps> = ({
  courseworkList,
  moduleCredit,
  handleScheduleChange,
  templateData,
}) => {
  // Set default feedback time to 1 for each coursework and pre-populate contact time fields
  React.useEffect(() => {
    updateCourseworkList(courseworkList, templateData, handleScheduleChange);
  }, [templateData, courseworkList, handleScheduleChange]);

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
                value={coursework.contactTimeLecture || ''}
                onChange={(e) =>
                  handleScheduleChange(
                    index,
                    'contactTimeLecture',
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
                value={coursework.contactTimeTutorial || ''}
                onChange={(e) =>
                  handleScheduleChange(
                    index,
                    'contactTimeTutorial',
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
                value={coursework.contactTimeLab || ''}
                onChange={(e) =>
                  handleScheduleChange(
                    index,
                    'contactTimeLab',
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
                value={coursework.contactTimeBriefing || ''}
                onChange={(e) =>
                  handleScheduleChange(
                    index,
                    'contactTimeBriefing',
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
                value={coursework.contactTimeBriefing || ''}
                onChange={(e) =>
                  handleScheduleChange(
                    index,
                    'contactTimeBriefing',
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
                value={coursework.contactTimeBriefing || ''}
                onChange={(e) =>
                  handleScheduleChange(
                    index,
                    'contactTimeBriefing',
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
                value={coursework.formativeAssessment || ''}
                onChange={(e) =>
                  handleScheduleChange(
                    index,
                    'formativeAssessment',
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
            Private study and preparation time
          </Td>
          {courseworkList.map((coursework, index) => (
            <Td key={index} style={courseworkScheduleStyles.td}>
              <Input
                type="number"
                value={coursework.privateStudyPreparation || ''}
                onChange={(e) =>
                  handleScheduleChange(
                    index,
                    'privateStudyPreparation',
                    Number(e.target.value),
                  )
                }
                style={courseworkScheduleStyles.input}
              />
            </Td>
          ))}
        </Tr>
        <Tr>
          <Td style={courseworkScheduleStyles.td}>Actual hours on task</Td>
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
