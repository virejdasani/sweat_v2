import { ModuleSetupFormData } from '../../../types/admin/CreateModule';

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
  setCurrentStep(prevStep(currentStep));
};

export const nextStep = (currentStep: number): number => {
  return currentStep + 1;
};

export const prevStep = (currentStep: number): number => {
  return currentStep - 1;
};

export const handleInputChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  formData: ModuleSetupFormData,
  setFormData: React.Dispatch<React.SetStateAction<ModuleSetupFormData>>,
) => {
  const { name, value } = e.target;
  setFormData({ ...formData, [name]: value });
};

export const handleSubmit = (formData: ModuleSetupFormData) => {
  // Handle form submission logic here
  console.log('Form submitted:', formData);
};
