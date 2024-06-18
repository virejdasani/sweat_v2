import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
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
import { steps } from '../../../types/admin/CreateModule';
import {
  handlePrev,
  handleNext,
  nextStep,
  prevStep,
  handleSave,
  handleCourseworkListChange,
  handleScheduleChange,
} from '../../../utils/admin/CreateModule';
import ModuleSetup from './ModuleSetup/ModuleSetup';
import { createModuleStyles } from './CreateModuleStyles';
import TeachingSchedule from './TeachingSchedule/TeachingSchedule';
import { ModuleSetupFormData } from '../../../types/admin/CreateModule/ModuleSetup';
import CourseworkSetup from './CourseworkSetup/CourseworkSetup';
import CourseworkSchedule from './CourseworkSchedule/CourseworkSchedule';
import { Coursework } from '../../../types/admin/CreateModule/CourseworkSetup';
import ModuleReview from './ModuleReview/ModuleReview';
import { fetchTemplateData } from '../../../utils/admin/CreateModule/TeachingSchedule';

const MAX_STEPS = 5;

const CreateModule: React.FC = () => {
  const location = useLocation();
  const { module, templateData: initialTemplateData } = location.state || {};

  const [formData, setFormData] = useState<ModuleSetupFormData>({
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

  const [courseworkList, setCourseworkList] = useState<Coursework[]>([]);
  const [templateData, setTemplateData] = useState<number[][][]>(
    initialTemplateData || [],
  );
  const [formFactor, setFormFactor] = useState(0);

  useEffect(() => {
    if (module) {
      setFormData(module.moduleSetup);
      setCourseworkList(module.courseworkList || []);
      setTemplateData(module.teachingSchedule || []);
    }
  }, [module]);

  useEffect(() => {
    if (!initialTemplateData && formData.moduleCredit && formData.semester) {
      const fetchData = async () => {
        await fetchTemplateData(
          formData.moduleCredit,
          formData.semester,
          setTemplateData,
        );
      };
      fetchData();
    }
  }, [formData.moduleCredit, formData.semester, initialTemplateData]);

  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  });

  const renderStepComponent = () => {
    switch (activeStep) {
      case 0:
        return <ModuleSetup formData={formData} setFormData={setFormData} />;
      case 1:
        return (
          <TeachingSchedule
            moduleCredit={formData.moduleCredit}
            semester={formData.semester}
            templateData={templateData}
            setTemplateData={setTemplateData}
            editingScheduleData={module?.teachingSchedule}
          />
        );
      case 2:
        return (
          <CourseworkSetup
            courseworkList={courseworkList}
            onCourseworkListChange={(updatedCourseworkList) =>
              handleCourseworkListChange(
                updatedCourseworkList,
                setCourseworkList,
              )
            }
            semester={formData.semester}
            examPercentage={100 - formData.courseworkPercentage}
            formFactor={formFactor}
            onFormFactorChange={setFormFactor}
            formData={formData}
          />
        );
      case 3:
        return (
          <CourseworkSchedule
            courseworkList={courseworkList}
            moduleCredit={formData.moduleCredit}
            handleScheduleChange={(index, field, value) =>
              handleScheduleChange(
                index,
                field,
                value,
                courseworkList,
                setCourseworkList,
              )
            }
            templateData={templateData}
            handleCourseworkListChange={(updatedCourseworkList) =>
              handleCourseworkListChange(
                updatedCourseworkList,
                setCourseworkList,
              )
            }
            formFactor={formFactor}
            isEditing={!!module}
          />
        );
      case 4:
        return (
          <ModuleReview
            formData={formData}
            courseworkList={courseworkList}
            templateData={templateData}
          />
        );
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
              ? () => handleSave(formData, templateData, courseworkList)
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
