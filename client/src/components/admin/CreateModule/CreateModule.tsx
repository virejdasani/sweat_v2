import React from 'react';
import {
  Box,
  Button,
  Heading,
  Stepper,
  Step,
  StepIndicator,
  StepStatus,
  StepIcon,
  StepNumber,
  StepTitle,
  StepDescription,
  StepSeparator,
  useSteps,
} from '@chakra-ui/react';
import { ModuleSetupFormData, steps } from '../../../types/admin/CreateModule';
import {
  handlePrev,
  handleNext,
  prevStep,
  nextStep,
  handleSubmit,
} from '../../../utils/admin/CreateModule';
import ModuleSetup from './ModuleSetup/ModuleSetup';
import { createModuleStyles } from './CreateModuleStyles';

const MAX_STEPS = 5;

const CreateModule: React.FC = () => {
  const [formData, setFormData] = React.useState<ModuleSetupFormData>({
    moduleCode: '',
    moduleTitle: '',
    moduleCredit: 0,
    courseworkPercentage: 0,
    examPercentage: 0,
    studyYear: 0,
    programme: [],
    semester: '',
    type: '',
  });

  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  });

  const renderStepComponent = () => {
    switch (activeStep) {
      case 0:
        return <ModuleSetup formData={formData} setFormData={setFormData} />;
      // case 1:
      //   return <ModuleTemplate />;
      // case 2:
      //   return <ModuleRows />;
      // case 3:
      //   return <ModuleDependentTable />;
      // case 4:
      //   return <ModuleReview />;
      default:
        return null;
    }
  };

  const handleNextStep = () => {
    if (activeStep < MAX_STEPS - 1) {
      handleNext(activeStep, nextStep, setActiveStep, steps.length);
    }
  };

  return (
    <Box>
      <Heading as="h1" mb={8}>
        Create Module
      </Heading>
      <Stepper index={activeStep} sx={createModuleStyles.stepper}>
        {steps.map((step, index) => (
          <Step key={index}>
            <StepIndicator>
              <StepStatus
                complete={<StepIcon />}
                incomplete={<StepNumber />}
                active={<StepNumber />}
              />
            </StepIndicator>
            <Box flexShrink="0" ml={2}>
              <StepTitle>{step.title}</StepTitle>
              <StepDescription>{step.description}</StepDescription>
            </Box>
            {index < steps.length - 1 && <StepSeparator />}
          </Step>
        ))}
      </Stepper>
      <Box mb={8}>{renderStepComponent()}</Box>
      <Box sx={createModuleStyles.buttons}>
        <Button
          onClick={() => handlePrev(activeStep, prevStep, setActiveStep)}
          disabled={activeStep === 0}
        >
          Previous
        </Button>
        <Button
          onClick={
            activeStep === MAX_STEPS - 1
              ? () => handleSubmit(formData)
              : handleNextStep
          }
          disabled={activeStep === MAX_STEPS}
        >
          {activeStep === MAX_STEPS - 1 ? 'Submit' : 'Next'}
        </Button>
      </Box>
    </Box>
  );
};

export default CreateModule;
