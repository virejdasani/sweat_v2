import { styled, Dialog } from '@mui/material';

export const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-container': {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  '& .MuiDialog-paper': {
    width: '70%',
    maxWidth: '1000px',
    maxHeight: '80vh',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(4),
    borderRadius: '2rem',
  },
}));

export const BoxStyles = {
  display: 'flex',
  alignItems: 'center',
  marginBottom: '16px',
};
