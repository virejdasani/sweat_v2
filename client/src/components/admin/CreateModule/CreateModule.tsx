import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
import { fetchTemplateData } from '../../../utils/admin/CreateModule/TeachingSchedule';
import { fetchCalendarData } from '../../../services/admin/CreateModule/TeachingSchedule';
import ModuleReview from './ModuleReview/ModuleReview';
import { getDefaultFormFactor } from '../../../services/admin/Settings';

const MAX_STEPS = 5;

const CreateModule: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
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
    teachingStaff: [],
    formFactor: 0,
  });

  const [courseworkList, setCourseworkList] = useState<Coursework[]>([]);
  const [templateData, setTemplateData] = useState<number[][][]>(
    initialTemplateData || [],
  );
  const [readingWeeks, setReadingWeeks] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchInitialData = async () => {
      if (!module) {
        try {
          const defaultFormFactor = await getDefaultFormFactor();
          setFormData((prevData) => ({
            ...prevData,
            formFactor: defaultFormFactor ?? 0,
          }));
        } catch (error) {
          console.error('Error fetching default form factor', error);
        }
      } else {
        setFormData(module.moduleSetup);
        setCourseworkList(module.courseworkList || []);
        setTemplateData(module.teachingSchedule || []);
      }
      setLoading(false);
    };

    fetchInitialData();
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

  useEffect(() => {
    if (
      formData.semester &&
      !formData.moduleCode.toLowerCase().startsWith('comp')
    ) {
      const fetchReadingWeeks = async () => {
        const { readingWeeks } = await fetchCalendarData(
          formData.semester as 'first' | 'second' | 'whole session',
        );
        setReadingWeeks(readingWeeks);
      };
      fetchReadingWeeks();
    }
  }, [formData.semester, formData.moduleCode]);

  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  });

  const renderStepComponent = () => {
    if (loading) {
      return <div>Loading...</div>;
    }

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
            readingWeeks={readingWeeks}
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
            formFactor={formData.formFactor}
            onFormFactorChange={(value) =>
              setFormData((prevData) => ({
                ...prevData,
                formFactor: value,
              }))
            }
            readingWeeks={readingWeeks}
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
            formFactor={formData.formFactor}
            isEditing={!!module}
            courseworkPercentage={formData.courseworkPercentage}
          />
        );
      case 4:
        return (
          <ModuleReview
            templateData={templateData}
            formData={formData}
            courseworkList={courseworkList}
            readingWeeks={readingWeeks}
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

  const handleDiscardAndExit = () => {
    navigate('/admin');
  };

  return (
    <>
      <Box className="mt-5 mx-5 pt-4 px-1">
        <button
          className="backButton btn btn-secondary mx-3 my-3 fixed-top col-sm-1"
          onClick={() => {
            window.history.back();
          }}
        >
          Home
        </button>
        <Heading as="h1" mb={8}>
          {formData.moduleCode ? `${formData.moduleCode} - ` : ''}Edit Module
          Details
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
                ? () =>
                    handleSave(
                      formData,
                      templateData,
                      courseworkList,
                      navigate,
                      readingWeeks,
                    )
                : handleNextStep
            }
            disabled={activeStep === MAX_STEPS}
          >
            {activeStep === MAX_STEPS - 1 ? 'Save to database' : 'Next'}
          </Button>
          <Button onClick={handleDiscardAndExit}>Discard and Exit</Button>
        </Box>
      </Box>
    </>
  );
};

export default CreateModule;
