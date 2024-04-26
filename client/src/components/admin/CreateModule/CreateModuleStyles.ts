export const createModuleStyles = {
  stepper: {
    mb: 8,
    '& .chakra-step__indicator': {
      borderRadius: 'full',
      width: '32px',
      height: '32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 'bold',
    },
    '& .chakra-step__title': {
      fontWeight: 'bold',
    },
    '& .chakra-step__description': {
      mt: 2,
    },
    '& .chakra-step__separator': {
      borderTopWidth: '1px',
      borderTopColor: 'gray.200',
      flexGrow: 1,
      height: 0,
    },
  },
  buttons: {
    mt: 8,
    '& > button': {
      mr: 4,
    },
  },
};
