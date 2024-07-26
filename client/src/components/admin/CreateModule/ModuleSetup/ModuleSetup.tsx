import React from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Grid,
  GridItem,
  Checkbox,
  CheckboxGroup,
  Button,
  IconButton,
} from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import { moduleSetupStyles } from './ModuleSetupStyles';
import { ModuleSetupProps } from '../../../../types/admin/CreateModule/ModuleSetup';
import {
  handleInputChange,
  handleTeachingStaffChange,
  addTeachingStaff,
  removeTeachingStaff,
} from '../../../../utils/admin/CreateModule/ModuleSetup';

const ModuleSetup: React.FC<ModuleSetupProps> = ({ formData, setFormData }) => {
  const programmes = ['CSEE', 'AVS', 'MCR', 'EEE', 'EEEP', 'EEMS', 'EETW'];

  return (
    <Box sx={moduleSetupStyles.container}>
      <Grid templateColumns="repeat(3, 1fr)" gap={6}>
        <GridItem>
          <FormControl
            id="moduleCode"
            sx={moduleSetupStyles.formControl}
            isRequired
          >
            <FormLabel sx={moduleSetupStyles.formLabel}>Module Code</FormLabel>
            <Input
              type="text"
              name="moduleCode"
              value={formData.moduleCode}
              onChange={(e) => handleInputChange(e, formData, setFormData)}
            />
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl
            id="moduleTitle"
            sx={moduleSetupStyles.formControl}
            isRequired
          >
            <FormLabel sx={moduleSetupStyles.formLabel}>Module Title</FormLabel>
            <Input
              type="text"
              name="moduleTitle"
              value={formData.moduleTitle}
              onChange={(e) => handleInputChange(e, formData, setFormData)}
            />
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl
            id="moduleCredit"
            sx={moduleSetupStyles.formControl}
            isRequired
          >
            <FormLabel sx={moduleSetupStyles.formLabel}>
              Module Credit
            </FormLabel>
            <Select
              name="moduleCredit"
              value={formData.moduleCredit}
              onChange={(e) => handleInputChange(e, formData, setFormData)}
            >
              <option value="">Select</option>
              <option value={7.5}>7.5</option>
              <option value={15}>15</option>
              <option value={30}>30</option>
            </Select>
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl
            id="courseworkPercentage"
            sx={moduleSetupStyles.formControl}
            isRequired
          >
            <FormLabel sx={moduleSetupStyles.formLabel}>Coursework %</FormLabel>
            <NumberInput
              name="courseworkPercentage"
              value={formData.courseworkPercentage}
              onChange={(value) =>
                setFormData({
                  ...formData,
                  courseworkPercentage: parseInt(value),
                  examPercentage: 100 - parseInt(value),
                })
              }
              min={0}
              max={100}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl id="examPercentage" sx={moduleSetupStyles.formControl}>
            <FormLabel sx={moduleSetupStyles.formLabel}>Exam %</FormLabel>
            <NumberInput
              name="examPercentage"
              value={100 - formData.courseworkPercentage}
              isReadOnly
            >
              <NumberInputField />
            </NumberInput>
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl
            id="studyYear"
            sx={moduleSetupStyles.formControl}
            isRequired
          >
            <FormLabel sx={moduleSetupStyles.formLabel}>Study Year</FormLabel>
            <Select
              name="studyYear"
              value={formData.studyYear}
              onChange={(e) => handleInputChange(e, formData, setFormData)}
            >
              <option value="">Select</option>
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
            </Select>
          </FormControl>
        </GridItem>

        <GridItem colSpan={3}>
          <FormControl
            id="programme"
            sx={moduleSetupStyles.formControl}
            isRequired
          >
            <FormLabel sx={moduleSetupStyles.formLabel}>Programme</FormLabel>
            <CheckboxGroup
              value={formData.programme}
              onChange={(values) =>
                setFormData({
                  ...formData,
                  programme: values as string[],
                })
              }
            >
              <Grid templateColumns="repeat(4, 1fr)" gap={4}>
                {programmes.map((programme) => (
                  <GridItem key={programme}>
                    <Checkbox value={programme}>{programme}</Checkbox>
                  </GridItem>
                ))}
              </Grid>
            </CheckboxGroup>
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl
            id="semester"
            sx={moduleSetupStyles.formControl}
            isRequired
          >
            <FormLabel sx={moduleSetupStyles.formLabel}>Semester</FormLabel>
            <Select
              name="semester"
              value={formData.semester}
              onChange={(e) => handleInputChange(e, formData, setFormData)}
            >
              <option value="">Select</option>
              <option value="first">First</option>
              <option value="second">Second</option>
              <option value="whole session">Whole Session</option>
            </Select>
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl id="type" sx={moduleSetupStyles.formControl} isRequired>
            <FormLabel sx={moduleSetupStyles.formLabel}>Type</FormLabel>
            <Select
              name="type"
              value={formData.type}
              onChange={(e) => handleInputChange(e, formData, setFormData)}
            >
              <option value="">Select</option>
              <option value="core">Core</option>
              <option value="optional">Optional</option>
            </Select>
          </FormControl>
        </GridItem>

        <GridItem colSpan={3}>
          <FormControl
            id="teachingStaff"
            sx={moduleSetupStyles.formControl}
            isRequired
          >
            <FormLabel sx={moduleSetupStyles.formLabel}>
              Teaching Staff
            </FormLabel>
            {formData.teachingStaff.map((staff, index) => (
              <Box key={index} display="flex" alignItems="center" mb={2}>
                <Input
                  type="text"
                  value={staff}
                  onChange={(e) =>
                    handleTeachingStaffChange(
                      index,
                      e.target.value,
                      formData,
                      setFormData,
                    )
                  }
                  placeholder={`Teaching Staff ${index + 1}`}
                  width="300px"
                />
                <IconButton
                  ml={2}
                  icon={<DeleteIcon />}
                  onClick={() =>
                    removeTeachingStaff(index, formData, setFormData)
                  }
                  aria-label={`Remove Teaching Staff ${index + 1}`}
                  disabled={formData.teachingStaff.length <= 1}
                />
              </Box>
            ))}
            <Button
              onClick={() => addTeachingStaff(formData, setFormData)}
              disabled={formData.teachingStaff.length >= 2}
            >
              Add Teaching Staff
            </Button>
          </FormControl>
        </GridItem>
      </Grid>
    </Box>
  );
};

export default ModuleSetup;
