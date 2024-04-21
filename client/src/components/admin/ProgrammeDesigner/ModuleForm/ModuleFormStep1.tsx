import React from 'react';
import { ModuleFormStep1Props } from '../../../../types/admin/ProgrammeDesigner';
import {
  FormContainer,
  FormTitle,
  StyledFormControl,
  StyledFormLabel,
  StyledInput,
  StyledSelect,
  StyledNumberInput,
  StyledCheckboxGroup,
  StyledCheckbox,
  StyledNumberInputField,
} from './ModuleFormStep1.styles';

const ModuleFormStep1: React.FC<ModuleFormStep1Props> = ({
  moduleData,
  handleChange,
}) => {
  const programmes = ['CSEE', 'AVS', 'MCR', 'EEE'];
  const semesters = ['first', 'second', 'whole session'];

  return (
    <FormContainer>
      <FormTitle>Setup Module</FormTitle>
      <StyledFormControl id="module-code" isRequired>
        <StyledFormLabel>Module Code</StyledFormLabel>
        <StyledInput
          type="text"
          name="id"
          value={moduleData.id || ''}
          onChange={handleChange}
        />
      </StyledFormControl>
      <StyledFormControl id="module-title" isRequired>
        <StyledFormLabel>Module Title</StyledFormLabel>
        <StyledInput
          type="text"
          name="name"
          value={moduleData.name || ''}
          onChange={handleChange}
        />
      </StyledFormControl>
      <StyledFormControl id="module-credit" isRequired>
        <StyledFormLabel>Module Credit</StyledFormLabel>
        <StyledSelect
          name="credits"
          value={moduleData.credits || ''}
          onChange={handleChange}
          placeholder="Select credit"
        >
          <option value={7.5}>7.5</option>
          <option value={15}>15</option>
          <option value={30}>30</option>
        </StyledSelect>
      </StyledFormControl>
      <StyledFormControl id="timetabled-hours" isRequired>
        <StyledFormLabel>Timetabled Hours</StyledFormLabel>
        <StyledNumberInput
          name="timetabledHours"
          value={moduleData.timetabledHours || ''}
          onChange={(valueString) =>
            handleChange({
              target: {
                name: 'timetabledHours',
                value: valueString,
              },
            } as React.ChangeEvent<HTMLInputElement>)
          }
        >
          <StyledNumberInputField />
        </StyledNumberInput>
      </StyledFormControl>
      <StyledFormControl id="study-year" isRequired>
        <StyledFormLabel>Study Year</StyledFormLabel>
        <StyledSelect
          name="year"
          value={moduleData.year || ''}
          onChange={handleChange}
          placeholder="Select year"
        >
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={4}>4</option>
        </StyledSelect>
      </StyledFormControl>
      <StyledFormControl id="programme" isRequired>
        <StyledFormLabel>Programme</StyledFormLabel>
        <StyledCheckboxGroup
          value={moduleData.programme || []}
          onChange={(values) =>
            handleChange({
              target: { name: 'programme', value: values },
            } as unknown as React.ChangeEvent<HTMLInputElement>)
          }
        >
          {programmes.map((programme) => (
            <StyledCheckbox key={programme} value={programme}>
              {programme}
            </StyledCheckbox>
          ))}
        </StyledCheckboxGroup>
      </StyledFormControl>
      <StyledFormControl id="semester" isRequired>
        <StyledFormLabel>Semester</StyledFormLabel>
        <StyledSelect
          name="semester"
          value={moduleData.semester || ''}
          onChange={handleChange}
          placeholder="Select semester"
        >
          {semesters.map((semester) => (
            <option key={semester} value={semester}>
              {semester.charAt(0).toUpperCase() + semester.slice(1)}
            </option>
          ))}
        </StyledSelect>
      </StyledFormControl>
      <StyledFormControl id="type" isRequired>
        <StyledFormLabel>Type</StyledFormLabel>
        <StyledSelect
          name="type"
          value={moduleData.type || ''}
          onChange={handleChange}
          placeholder="Select type"
        >
          <option value="core">Core</option>
          <option value="optional">Optional</option>
        </StyledSelect>
      </StyledFormControl>
    </FormContainer>
  );
};

export default ModuleFormStep1;
