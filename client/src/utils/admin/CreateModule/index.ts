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
