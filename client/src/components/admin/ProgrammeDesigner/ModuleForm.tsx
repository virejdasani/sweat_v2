import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button as MuiButton,
  IconButton,
  SelectChangeEvent,
  styled,
  Box,
} from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Module } from '../../../shared/types';
import ModuleFormStep1, { FormModuleData } from './ModuleFormStep1';
import ModuleFormStep2, { TeachingSchedule } from './ModuleFormStep2';
import ModuleFormStep3, { Coursework } from './ModuleFormStep3';

interface ModuleModalProps {
  mode: 'add' | 'edit';
  module?: Module;
  onClose: () => void;
  onSubmit: (module: Module) => void;
}

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-container': {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  '& .MuiDialog-paper': {
    width: '70%',
    maxWidth: '800px',
    maxHeight: '80vh',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(4),
    borderRadius: theme.shape.borderRadius,
  },
}));

const ModuleForm: React.FC<ModuleModalProps> = ({
  mode,
  module,
  onClose,
  onSubmit,
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [moduleData, setModuleData] = useState<
    FormModuleData & {
      teachingSchedule: TeachingSchedule;
      courseworks: Coursework[];
    }
  >({
    moduleCode: module?.id || '',
    moduleTitle: module?.name || '',
    moduleCredit: module?.credits || 0,
    timetabledHours: 0,
    studyYear: module?.year || 1,
    programme: [],
    semester: '',
    type: module?.type || 'core',
    teachingSchedule: {
      lectures: 0,
      seminars: 0,
      tutorials: 0,
      labs: 0,
      fieldworkPlacement: 0,
      other: 0,
    },
    courseworks: [],
  });

  const handleChange = (
    event:
      | SelectChangeEvent<string | number | string[]>
      | React.ChangeEvent<{ value: unknown; name?: string }>,
  ) => {
    const { name, value } = event.target;

    if (typeof name === 'string') {
      setModuleData((prevData) => ({
        ...prevData,
        [name]: value,
        teachingSchedule: {
          ...prevData.teachingSchedule,
          [name]: value,
        },
      }));
    }
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = () => {
    const mappedYear = [1, 2, 3, 4].includes(moduleData.studyYear)
      ? moduleData.studyYear
      : 1;

    const mappedModule: Module = {
      id: moduleData.moduleCode,
      name: moduleData.moduleTitle,
      credits: moduleData.moduleCredit,
      year: mappedYear as 1 | 2 | 3 | 4,
      type: moduleData.type,
    };

    onSubmit(mappedModule);
    onClose();
  };

  const addCoursework = () => {
    setModuleData((prevData) => ({
      ...prevData,
      courseworks: [
        ...prevData.courseworks,
        {
          cwTitle: '',
          weight: '',
          type: 'assignment',
          deadlineWeek: '',
          releasedWeekEarlier: '',
        },
      ],
    }));
  };

  const removeCoursework = (index: number) => {
    setModuleData((prevData) => ({
      ...prevData,
      courseworks: prevData.courseworks.filter((_, i) => i !== index),
    }));
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <ModuleFormStep1
            moduleData={moduleData}
            handleChange={handleChange}
          />
        );
      case 1:
        return (
          <ModuleFormStep2
            teachingSchedule={moduleData.teachingSchedule}
            handleChange={handleChange}
          />
        );
      case 2:
        return (
          <ModuleFormStep3
            courseworks={moduleData.courseworks}
            handleChange={(index, field, value) => {
              setModuleData((prevData) => ({
                ...prevData,
                courseworks: prevData.courseworks.map((coursework, i) =>
                  i === index ? { ...coursework, [field]: value } : coursework,
                ),
              }));
            }}
            addCoursework={addCoursework}
            removeCoursework={removeCoursework}
          />
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <StyledDialog open onClose={onClose}>
      <DialogTitle>{mode === 'add' ? 'Add Module' : 'Edit Module'}</DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '16px',
          }}
        >
          <IconButton disabled={activeStep === 0} onClick={handleBack}>
            <ArrowBackIosIcon />
          </IconButton>
          {getStepContent(activeStep)}
          <IconButton disabled={activeStep === 2} onClick={handleNext}>
            <ArrowForwardIosIcon />
          </IconButton>
        </Box>
      </DialogContent>
      <DialogActions>
        <MuiButton onClick={onClose}>Cancel</MuiButton>
        <MuiButton
          onClick={activeStep === 2 ? handleSubmit : handleNext}
          color="primary"
        >
          {activeStep === 2 ? 'Submit' : 'Next'}
        </MuiButton>
      </DialogActions>
    </StyledDialog>
  );
};

export default ModuleForm;
