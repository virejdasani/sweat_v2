import React, { useState } from 'react';
import { Box, Button, IconButton } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { Module } from '../../../../shared/types';
import ModuleFormStep1 from './ModuleFormStep1';
import ModuleFormStep2 from './ModuleFormStep2';
import ModuleFormStep3 from './ModuleFormStep3';
import { ModuleModalProps } from '../../../../types/admin/ProgrammeDesigner';
import {
  handleChangeStep1,
  handleChangeStep2,
  handleChangeStep3,
  handleNext,
  handleBack,
  addCoursework,
  removeCoursework,
  useModuleActions,
} from '../../../../utils/admin/ProgrammeDesigner';
import {
  StyledModal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  StepperContainer,
  StyledModalContent,
  ModalBackdrop,
} from './ModuleForm.styles.ts';

const ModuleForm: React.FC<ModuleModalProps> = ({
  mode,
  module,
  onClose,
  moduleInstances,
  setModuleInstances,
  programmeState,
  setProgrammeState,
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [moduleData, setModuleData] = useState<Partial<Module>>({
    id: module?.id || '',
    name: module?.name || '',
    year: module?.year || 1,
    type: module?.type || 'core',
    programme: module?.programme || [],
    semester: module?.semester || 'first',
    credits: module?.credits || 7.5,
    timetabledHours: module?.timetabledHours || 0,
    lectures: { hours: module?.lectures?.hours || 0 },
    seminars: { hours: module?.seminars?.hours || 0 },
    tutorials: { hours: module?.tutorials?.hours || 0 },
    labs: { hours: module?.labs?.hours || 0 },
    fieldworkPlacement: {
      hours: module?.fieldworkPlacement?.hours || 0,
    },
    other: { hours: module?.other?.hours || 0 },
    courseworks: module?.courseworks || [],
  });

  const { handleSubmit } = useModuleActions(
    moduleInstances,
    setModuleInstances,
    programmeState,
    setProgrammeState,
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChangeStep1Wrapper = (event: any) => {
    handleChangeStep1(event, setModuleData);
  };

  const handleChangeStep2Wrapper = (
    event: React.ChangeEvent<{ value: unknown; name?: string }>,
  ) => {
    handleChangeStep2(event, setModuleData);
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <ModuleFormStep1
            moduleData={moduleData}
            handleChange={handleChangeStep1Wrapper}
          />
        );
      case 1:
        return (
          <ModuleFormStep2
            teachingSchedule={{
              lectures: moduleData.lectures?.hours || 0,
              seminars: moduleData.seminars?.hours || 0,
              tutorials: moduleData.tutorials?.hours || 0,
              labs: moduleData.labs?.hours || 0,
              fieldworkPlacement: moduleData.fieldworkPlacement?.hours || 0,
              other: moduleData.other?.hours || 0,
            }}
            handleChange={handleChangeStep2Wrapper}
          />
        );
      case 2:
        return (
          <ModuleFormStep3
            courseworks={moduleData.courseworks ?? []}
            handleChange={(index, field, value) =>
              handleChangeStep3(index, field, value, setModuleData)
            }
            addCoursework={() => addCoursework(setModuleData)}
            removeCoursework={(index) => removeCoursework(index, setModuleData)}
          />
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <>
      <StyledModal isOpen onClose={onClose}>
        <StyledModalContent>
          <ModalHeader>
            {mode === 'add' ? 'Add Module' : 'Edit Module'}
          </ModalHeader>
          <ModalBody>
            <StepperContainer>
              <IconButton
                aria-label="Previous"
                icon={<ChevronLeftIcon />}
                disabled={activeStep === 0}
                onClick={handleBack(setActiveStep)}
                variant="ghost"
              />
              <Box flex={1}>{getStepContent(activeStep)}</Box>
              <IconButton
                aria-label="Next"
                icon={<ChevronRightIcon />}
                disabled={activeStep === 2}
                onClick={handleNext(setActiveStep)}
                variant="ghost"
              />
            </StepperContainer>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose} mr={3}>
              Cancel
            </Button>
            <Button
              onClick={() =>
                activeStep === 2
                  ? handleSubmit(moduleData, onClose)
                  : handleNext(setActiveStep)()
              }
              colorScheme="blue"
            >
              {activeStep === 2 ? 'Submit' : 'Next'}
            </Button>
          </ModalFooter>
        </StyledModalContent>
      </StyledModal>
      <ModalBackdrop isOpen />
    </>
  );
};

export default ModuleForm;
