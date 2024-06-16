import { toast } from 'react-toastify';
import { ModuleDocument } from '../../../types/admin/CreateModule';
import { transformTemplateDataToSaveData } from '../../../utils/admin/CreateModule/TeachingSchedule';
import { createModule } from '../../../services/admin/ProgrammeDesigner';
import { Coursework } from '../../../types/admin/CreateModule/CourseworkSetup';
import { ModuleSetupFormData } from '../../../types/admin/CreateModule/ModuleSetup';

export const handleNext = (
  activeStep: number,
  nextStep: (activeStep: number, stepsLength: number) => number,
  setActiveStep: (step: number) => void,
  stepsLength: number,
) => {
  setActiveStep(nextStep(activeStep, stepsLength));
};

export const handlePrev = (
  currentStep: number,
  prevStep: (currentStep: number) => number,
  setCurrentStep: (step: number) => void,
) => {
  const prevStepIndex = prevStep(currentStep);
  if (prevStepIndex >= 0) {
    setCurrentStep(prevStepIndex);
  }
};

export const nextStep = (currentStep: number): number => {
  return currentStep + 1;
};

export const prevStep = (currentStep: number): number => {
  return currentStep - 1;
};

export const handleSave = async (
  formData: ModuleSetupFormData,
  templateData: number[][][],
  courseworkList: Coursework[],
) => {
  const moduleDocument: ModuleDocument = {
    moduleSetup: formData,
    teachingSchedule: transformTemplateDataToSaveData(templateData),
    courseworkList,
  };

  try {
    await createModule(moduleDocument);
    console.log('Module document saved successfully');
    toast.success('Module document saved successfully');
  } catch (error) {
    console.error('Error saving module document:', error);
    toast.error('Error saving module document');
  }
};

export const handleCourseworkListChange = (
  updatedCourseworkList: Coursework[],
  setCourseworkList: (courseworkList: Coursework[]) => void,
) => {
  setCourseworkList(updatedCourseworkList);
};

export const handleScheduleChange = (
  index: number,
  field: keyof Omit<
    Coursework,
    'title' | 'weight' | 'type' | 'deadlineWeek' | 'releasedWeekEarlier'
  >,
  value: number | undefined,
  courseworkList: Coursework[],
  setCourseworkList: (courseworkList: Coursework[]) => void,
) => {
  if (value === undefined) return;

  const updatedCourseworkList = [...courseworkList];
  updatedCourseworkList[index] = {
    ...updatedCourseworkList[index],
    [field]: value,
  };
  handleCourseworkListChange(updatedCourseworkList, setCourseworkList);
};
