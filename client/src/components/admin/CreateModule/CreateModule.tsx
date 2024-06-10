import React, { useEffect } from 'react';
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
import { useLocation } from 'react-router-dom';
import { steps } from '../../../types/admin/CreateModule';
import {
  handlePrev,
  handleNext,
  prevStep,
  nextStep,
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

  const [courseworkList, setCourseworkList] = React.useState<Coursework[]>([]);
  const [templateData, setTemplateData] = React.useState<number[][][]>(
    initialTemplateData || [],
  );
  const [formFactor, setFormFactor] = React.useState(0);

  useEffect(() => {
    if (module) {
      setFormData({
        moduleCode: module.id,
        moduleTitle: module.name,
        moduleCredit: module.credits,
        courseworkPercentage: module.courseworkPercentage,
        examPercentage: module.examPercentage,
        studyYear: module.year,
        programme: module.programme,
        semester: module.semester,
        type: module.type,
      });
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

  const handleCourseworkListChange = (updatedCourseworkList: Coursework[]) => {
    setCourseworkList(updatedCourseworkList);
  };

  const handleScheduleChange = (
    index: number,
    field: keyof Omit<
      Coursework,
      'title' | 'weight' | 'type' | 'deadlineWeek' | 'releasedWeekEarlier'
    >,
    value: number | undefined,
  ) => {
    if (value === undefined) return;

    const updatedCourseworkList = [...courseworkList];
    updatedCourseworkList[index] = {
      ...updatedCourseworkList[index],
      [field]: value,
    };
    handleCourseworkListChange(updatedCourseworkList);
  };

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
          />
        );
      case 2:
        return (
          <CourseworkSetup
            courseworkList={courseworkList}
            onCourseworkListChange={handleCourseworkListChange}
            semester={formData.semester}
            examPercentage={100 - formData.courseworkPercentage}
            formFactor={formFactor}
            onFormFactorChange={setFormFactor}
          />
        );
      case 3:
        return (
          <CourseworkSchedule
            courseworkList={courseworkList}
            moduleCredit={formData.moduleCredit}
            handleScheduleChange={handleScheduleChange}
            templateData={templateData}
            handleCourseworkListChange={handleCourseworkListChange}
            formFactor={formFactor}
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

  const handleSave = async () => {
    return;
    // const moduleDocument: ModuleDocument = {
    //   moduleSetup: formData,
    //   teachingSchedule: transformTemplateDataToSaveData(templateData),
    //   courseworkList,
    // };

    // try {
    //   await saveModuleDocument(moduleDocument);
    //   console.log('Module document saved successfully');
    // } catch (error) {
    //   console.error('Error saving module document:', error);
    // }
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
          onClick={activeStep === MAX_STEPS - 1 ? handleSave : handleNextStep}
          disabled={activeStep === MAX_STEPS}
        >
          {activeStep === MAX_STEPS - 1 ? 'Submit' : 'Next'}
        </Button>
      </Box>
    </Box>
  );
};

export default CreateModule;
