import { makeStyles, createStyles } from '@mui/material/styles';

const useStylesInternal = makeStyles(() =>
  createStyles({
    formControl: {
      marginTop: 8,
      marginBottom: 8,
    },
    textField: {
      marginTop: 8,
      marginBottom: 8,
    },
  }),
);

export const useStyles = useStylesInternal;
