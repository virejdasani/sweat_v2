import React from 'react';
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
} from '@mui/material';

export interface TeachingSchedule {
  lectures: number;
  seminars: number;
  tutorials: number;
  labs: number;
  fieldworkPlacement: number;
  other: number;
}

interface ModuleFormStep2Props {
  teachingSchedule: TeachingSchedule;
  handleChange: (
    event: React.ChangeEvent<{ value: unknown; name?: string }>,
  ) => void;
}

const ModuleFormStep2: React.FC<ModuleFormStep2Props> = ({
  teachingSchedule,
  handleChange,
}) => {
  return (
    <div>
      <h2>Teaching Schedule</h2>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Type</TableCell>
              <TableCell>Hours</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>Lectures</TableCell>
              <TableCell>
                <TextField
                  type="number"
                  name="lectures"
                  value={teachingSchedule.lectures || ''}
                  onChange={handleChange}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Seminars</TableCell>
              <TableCell>
                <TextField
                  type="number"
                  name="seminars"
                  value={teachingSchedule.seminars || ''}
                  onChange={handleChange}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Tutorials</TableCell>
              <TableCell>
                <TextField
                  type="number"
                  name="tutorials"
                  value={teachingSchedule.tutorials || ''}
                  onChange={handleChange}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Labs</TableCell>
              <TableCell>
                <TextField
                  type="number"
                  name="labs"
                  value={teachingSchedule.labs || ''}
                  onChange={handleChange}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Fieldwork Placement</TableCell>
              <TableCell>
                <TextField
                  type="number"
                  name="fieldworkPlacement"
                  value={teachingSchedule.fieldworkPlacement || ''}
                  onChange={handleChange}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Other</TableCell>
              <TableCell>
                <TextField
                  type="number"
                  name="other"
                  value={teachingSchedule.other || ''}
                  onChange={handleChange}
                />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ModuleFormStep2;
