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
import { ModuleFormStep1Props } from '../../../types/admin/ProgrammeDesigner';

const ModuleFormStep1: React.FC<ModuleFormStep1Props> = ({
  moduleData,
  handleChange,
}) => {
  const programmes = ['CSEE', 'AVS', 'MCR', 'EEE'];
  const semesters = ['first', 'second', 'whole session'];

  return (
    <div>
      <h2>Setup Module</h2>
      <TextField
        label="Module Code"
        name="id"
        value={moduleData.id || ''}
        onChange={handleChange}
        margin="normal"
        fullWidth
        required
      />
      <TextField
        label="Module Title"
        name="name"
        value={moduleData.name || ''}
        onChange={handleChange}
        margin="normal"
        fullWidth
        required
      />
      <FormControl fullWidth margin="normal">
        <InputLabel id="module-credit-label">Module Credit</InputLabel>
        <Select
          labelId="module-credit-label"
          name="credits"
          value={moduleData.credits || ''}
          onChange={(event) => handleChange(event)}
          required
        >
          <MenuItem value={7.5}>7.5</MenuItem>
          <MenuItem value={15}>15</MenuItem>
          <MenuItem value={30}>30</MenuItem>
        </Select>
      </FormControl>
      <TextField
        label="Timetabled Hours"
        name="timetabledHours"
        type="number"
        value={moduleData.timetabledHours || ''}
        onChange={handleChange}
        margin="normal"
        fullWidth
        required
      />
      <FormControl fullWidth margin="normal">
        <InputLabel id="study-year-label">Study Year</InputLabel>
        <Select
          labelId="study-year-label"
          name="year"
          value={moduleData.year || ''}
          onChange={(event) => handleChange(event)}
          required
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
          value={moduleData.programme || []}
          onChange={(event: SelectChangeEvent<string[]>) => handleChange(event)}
          input={<OutlinedInput label="Programme" />}
          renderValue={(selected) => selected.join(', ')}
          required
        >
          {programmes.map((programme) => (
            <MenuItem key={programme} value={programme}>
              <Checkbox
                checked={(moduleData.programme || []).includes(programme)}
              />
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
          value={moduleData.semester || ''}
          onChange={(event) => handleChange(event)}
          required
        >
          {semesters.map((semester) => (
            <MenuItem key={semester} value={semester}>
              {semester.charAt(0).toUpperCase() + semester.slice(1)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth margin="normal">
        <InputLabel id="type-label">Type</InputLabel>
        <Select
          labelId="type-label"
          name="type"
          value={moduleData.type || ''}
          onChange={(event) => handleChange(event)}
          required
        >
          <MenuItem value="core">Core</MenuItem>
          <MenuItem value="optional">Optional</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
};

export default ModuleFormStep1;
