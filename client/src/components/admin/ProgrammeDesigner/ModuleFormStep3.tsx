import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Select,
  MenuItem,
  IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

export interface Coursework {
  cwTitle: string;
  weight: string | number;
  type: 'assignment' | 'class test' | 'lab report' | 'presentation' | 'other';
  deadlineWeek: string | number;
  releasedWeekEarlier: string | number;
  [key: string]: string | number; // Add this index signature
}

interface ModuleFormStep3Props {
  courseworks: Coursework[];
  handleChange: (
    index: number,
    field: keyof Coursework,
    value: string | number,
  ) => void;
  addCoursework: () => void;
  removeCoursework: (index: number) => void;
}

const ModuleFormStep3: React.FC<ModuleFormStep3Props> = ({
  courseworks,
  handleChange,
  addCoursework,
  removeCoursework,
}) => {
  return (
    <div>
      <h2>Coursework Setup</h2>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>CW Title</TableCell>
              <TableCell>Weight</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Deadline Week</TableCell>
              <TableCell>Released Week Earlier</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {courseworks.map((coursework, index) => (
              <TableRow key={index}>
                <TableCell>
                  <TextField
                    value={coursework.cwTitle}
                    onChange={(e) =>
                      handleChange(index, 'cwTitle', e.target.value)
                    }
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    type="number"
                    value={coursework.weight}
                    onChange={(e) =>
                      handleChange(index, 'weight', Number(e.target.value))
                    }
                    InputProps={{
                      endAdornment: <span>%</span>,
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Select
                    value={coursework.type}
                    onChange={(e) =>
                      handleChange(index, 'type', e.target.value)
                    }
                  >
                    <MenuItem value="assignment">Assignment</MenuItem>
                    <MenuItem value="class test">Class Test</MenuItem>
                    <MenuItem value="lab report">Lab Report</MenuItem>
                    <MenuItem value="presentation">Presentation</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                </TableCell>
                <TableCell>
                  <TextField
                    type="number"
                    value={coursework.deadlineWeek}
                    onChange={(e) =>
                      handleChange(
                        index,
                        'deadlineWeek',
                        Number(e.target.value),
                      )
                    }
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    type="number"
                    value={coursework.releasedWeekEarlier}
                    onChange={(e) =>
                      handleChange(
                        index,
                        'releasedWeekEarlier',
                        Number(e.target.value),
                      )
                    }
                  />
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => removeCoursework(index)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <button onClick={addCoursework}>Add Coursework</button>
    </div>
  );
};

export default ModuleFormStep3;
