import React, { ChangeEvent, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button as MuiButton,
  IconButton,
  styled,
  Box,
  SelectChangeEvent,
} from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Module } from '../../../shared/types';
import ModuleFormStep1 from './ModuleFormStep1';
import ModuleFormStep2 from './ModuleFormStep2';
import ModuleFormStep3 from './ModuleFormStep3';
import { ModuleModalProps } from '../../../types/admin/ProgrammeDesigner';
import {
  handleChangeStep1,
  handleChangeStep2,
  handleChangeStep3,
  handleNext,
  handleBack,
  addCoursework,
  removeCoursework,
} from '../../../utils/admin/ProgrammeDesigner';

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
  const [moduleData, setModuleData] = useState<Partial<Module>>({
    id: module?.id || '',
    name: module?.name || '',
    year: module?.year || undefined,
    type: module?.type || undefined,
    programme: module?.programme || [],
    semester: module?.semester || undefined,
    credits: module?.credits || undefined,
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

  const handleSubmit = () => {
    const mappedYear = [1, 2, 3, 4].includes(moduleData.studyYear)
      ? moduleData.studyYear
      : 1;

    const mappedModule: Module = {
      id: moduleData.id,
      name: moduleData.name,
      credits: moduleData.credits,
      year: mappedYear as 1 | 2 | 3 | 4,
      type: moduleData.type,
    };

    onSubmit(mappedModule);
    onClose();
  };

  const handleChangeStep1Wrapper = (
    event:
      | SelectChangeEvent<string | number | string[]>
      | ChangeEvent<{ value: unknown; name?: string | undefined }>,
  ) => {
    handleChangeStep1(event, setModuleData);
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
            handleChange={(event) => handleChangeStep2(event, setModuleData)}
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
          <IconButton
            disabled={activeStep === 0}
            onClick={handleBack(setActiveStep)}
          >
            <ArrowBackIosIcon />
          </IconButton>
          {getStepContent(activeStep)}
          <IconButton
            disabled={activeStep === 2}
            onClick={handleNext(setActiveStep)}
          >
            <ArrowForwardIosIcon />
          </IconButton>
        </Box>
      </DialogContent>
      <DialogActions>
        <MuiButton onClick={onClose}>Cancel</MuiButton>
        <MuiButton
          onClick={() =>
            activeStep === 2 ? handleSubmit() : handleNext(setActiveStep)()
          }
          color="primary"
        >
          {activeStep === 2 ? 'Submit' : 'Next'}
        </MuiButton>
      </DialogActions>
    </StyledDialog>
  );
};

export default ModuleForm;
