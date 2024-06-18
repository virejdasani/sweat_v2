import { ButtonProps } from '@chakra-ui/react';

interface FilterButtonStyles {
  baseStyle: ButtonProps;
  selectedStyle: ButtonProps;
  unselectedStyle: ButtonProps;
}

export const filterButtonStyles: FilterButtonStyles = {
  baseStyle: {
    borderRadius: 'full',
    fontWeight: 'medium',
    px: 6,
    py: 3,
    textTransform: 'uppercase',
    letterSpacing: 'wider',
    fontSize: 'sm',
    _focus: {
      boxShadow: 'none',
    },
  },
  selectedStyle: {
    bgColor: 'blue.500',
    color: 'white',
    _hover: {
      bgColor: 'blue.600',
    },
  },
  unselectedStyle: {
    bgColor: 'white',
    color: 'blue.500',
    borderWidth: '1px',
    borderColor: 'blue.500',
    _hover: {
      bgColor: 'blue.50',
    },
  },
};
