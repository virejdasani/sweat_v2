import React from 'react';
import {
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Checkbox,
  ListItemText,
  OutlinedInput,
  SelectChangeEvent,
} from '@mui/material';

export interface FormModuleData {
  moduleCode: string;
  moduleTitle: string;
  moduleCredit: number;
  timetabledHours: number;
  studyYear: number;
  programme: string[];
  semester: string;
  type: 'core' | 'optional';
}

interface ModuleFormStep1Props {
  moduleData: FormModuleData;
  handleChange: (
    event:
      | SelectChangeEvent<string | number | string[]>
      | React.ChangeEvent<{ value: unknown; name?: string }>,
  ) => void;
}

const ModuleFormStep1: React.FC<ModuleFormStep1Props> = ({
  moduleData,
  handleChange,
}) => {
  const programmes = ['CSEE', 'AVS', 'MCR', 'EEE'];
  const semesters = ['First', 'Second', 'Whole Session'];

  return (
    <div>
      <h2>Setup Module</h2>
      <TextField
        label="Module Code"
        name="moduleCode"
        value={moduleData.moduleCode}
        onChange={handleChange}
        margin="normal"
        fullWidth
      />
      <TextField
        label="Module Title"
        name="moduleTitle"
        value={moduleData.moduleTitle}
        onChange={handleChange}
        margin="normal"
        fullWidth
      />
      <FormControl fullWidth margin="normal">
        <InputLabel id="module-credit-label">Module Credit</InputLabel>
        <Select
          labelId="module-credit-label"
          name="moduleCredit"
          value={moduleData.moduleCredit}
          onChange={(event) => handleChange(event)}
        >
          <MenuItem value={7.5}>7.5</MenuItem>
          <MenuItem value={15}>15</MenuItem>
          <MenuItem value={15}>30</MenuItem>
        </Select>
      </FormControl>
      <TextField
        label="Timetabled Hours"
        name="timetabledHours"
        type="number"
        value={moduleData.timetabledHours}
        onChange={handleChange}
        margin="normal"
        fullWidth
      />
      <FormControl fullWidth margin="normal">
        <InputLabel id="study-year-label">Study Year</InputLabel>
        <Select
          labelId="study-year-label"
          name="studyYear"
          value={moduleData.studyYear}
          onChange={(event) => handleChange(event)}
        >
          <MenuItem value={1}>1</MenuItem>
          <MenuItem value={2}>2</MenuItem>
          <MenuItem value={3}>3</MenuItem>
          <MenuItem value={4}>4</MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth margin="normal">
        <InputLabel id="programme-label">Programme</InputLabel>
        <Select
          labelId="programme-label"
          name="programme"
          multiple
          value={moduleData.programme}
          onChange={(event: SelectChangeEvent<string[]>) => handleChange(event)}
          input={<OutlinedInput label="Programme" />}
          renderValue={(selected) => selected.join(', ')}
        >
          {programmes.map((programme) => (
            <MenuItem key={programme} value={programme}>
              <Checkbox checked={moduleData.programme.includes(programme)} />
              <ListItemText primary={programme} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth margin="normal">
        <InputLabel id="semester-label">Semester</InputLabel>
        <Select
          labelId="semester-label"
          name="semester"
          value={moduleData.semester}
          onChange={(event) => handleChange(event)}
        >
          {semesters.map((semester) => (
            <MenuItem key={semester} value={semester}>
              {semester}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth margin="normal">
        <InputLabel id="type-label">Type</InputLabel>
        <Select
          labelId="type-label"
          name="type"
          value={moduleData.type}
          onChange={(event) => handleChange(event)}
        >
          <MenuItem value="core">Core</MenuItem>
          <MenuItem value="optional">Optional</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
};

export default ModuleFormStep1;
