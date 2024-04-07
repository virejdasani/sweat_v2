import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  styled,
} from '@mui/material';
import { DeleteModalProps } from '../../../types/admin/ProgrammeDesigner';

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  padding: theme.spacing(2),
}));

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  padding: theme.spacing(3),
}));

const StyledDialogActions = styled(DialogActions)(({ theme }) => ({
  padding: theme.spacing(2),
  justifyContent: 'flex-end',
}));

const StyledRemoveButton = styled(Button)(({ theme }) => ({
  marginRight: theme.spacing(1),
}));

const DeleteModal: React.FC<DeleteModalProps> = ({
  open,
  onClose,
  onRemoveFromProgramme,
  onRemoveFromDatabase,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <StyledDialogTitle>Delete Module</StyledDialogTitle>
      <StyledDialogContent>
        <Typography variant="body1" gutterBottom>
          Do you want to remove the module from the programme or remove it from
          the database?
        </Typography>
      </StyledDialogContent>
      <StyledDialogActions>
        <StyledRemoveButton
          variant="contained"
          color="secondary"
          onClick={onRemoveFromProgramme}
        >
          Remove from Programme
        </StyledRemoveButton>
        <StyledRemoveButton
          variant="contained"
          color="secondary"
          onClick={onRemoveFromDatabase}
        >
          Remove from Database
        </StyledRemoveButton>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
      </StyledDialogActions>
    </Dialog>
  );
};

export default DeleteModal;
