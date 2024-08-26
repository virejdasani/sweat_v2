import { TableProps, ResponsiveValue } from '@chakra-ui/react';

// Styles
export const tableStyle: TableProps = {
  size: 'sm',
  variant: 'simple',
  colorScheme: 'gray',
};

export const headerStyle = {
  fontSize: 'xs',
  textAlign: 'center' as ResponsiveValue<'left' | 'center' | 'right'>,
  fontWeight: 'semibold',
};

export const cellStyle = {
  border: '1px solid',
  borderColor: 'gray.300',
  px: 2,
};
