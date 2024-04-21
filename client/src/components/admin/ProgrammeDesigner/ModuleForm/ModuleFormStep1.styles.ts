import {
  FormControl,
  FormLabel,
  Input,
  Select,
  Checkbox,
  Stack,
  CheckboxGroup,
  NumberInput,
  NumberInputField,
} from '@chakra-ui/react';
import styled from '@emotion/styled';

export const FormContainer = styled(Stack)`
  max-width: 500px;
  margin: 0 auto;
  padding: 2rem;
  border-radius: 8px;
  background-color: #ffffff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

export const FormTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
`;

export const StyledFormControl = styled(FormControl)`
  margin-bottom: 1.5rem;
`;

export const StyledFormLabel = styled(FormLabel)`
  font-weight: bold;
`;

export const StyledInput = styled(Input)`
  border-color: #e2e8f0;
  border-radius: 4px;

  &:focus {
    border-color: #3182ce;
    box-shadow: 0 0 0 1px #3182ce;
  }
`;

export const StyledSelect = styled(Select)`
  border-color: #e2e8f0;
  border-radius: 4px;

  &:focus {
    border-color: #3182ce;
    box-shadow: 0 0 0 1px #3182ce;
  }
`;

export const StyledNumberInput = styled(NumberInput)`
  border-color: #e2e8f0;
  border-radius: 4px;

  &:focus {
    border-color: #3182ce;
    box-shadow: 0 0 0 1px #3182ce;
  }
`;

export const StyledNumberInputField = styled(NumberInputField)`
  border-color: #e2e8f0;
  border-radius: 4px;

  &:focus {
    border-color: #3182ce;
    box-shadow: 0 0 0 1px #3182ce;
  }
`;

export const StyledCheckboxGroup = styled(CheckboxGroup)`
  margin-top: 0.5rem;
`;

export const StyledCheckbox = styled(Checkbox)`
  margin-bottom: 0.5rem;
`;
