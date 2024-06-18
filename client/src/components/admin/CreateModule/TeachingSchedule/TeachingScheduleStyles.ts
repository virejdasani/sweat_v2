import { TableProps, InputProps, ButtonProps } from '@chakra-ui/react';

export const tableStyle: TableProps = {
  size: 'sm',
  variant: 'striped',
  colorScheme: 'gray',
};

export const headerStyle = {
  fontSize: 'xs',
  textAlign: 'center',
  fontWeight: 'semibold',
};

export const rowStyle = {
  py: 4,
};

export const inputStyle: InputProps = {
  size: 'sm',
  width: '100%',
  textAlign: 'center',
};

export const buttonStyle: ButtonProps = {
  mt: 4,
  size: 'sm',
  colorScheme: 'blue',
};
