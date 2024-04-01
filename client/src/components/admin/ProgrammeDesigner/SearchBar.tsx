import React from 'react';
import { TextField } from '@mui/material';
import { SearchBarProps } from '../../../types/admin/ProgrammeDesigner';

const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  onSearchChange,
}) => {
  return (
    <TextField
      label="Search modules"
      value={searchQuery}
      onChange={onSearchChange}
      variant="outlined"
      fullWidth
    />
  );
};

export default SearchBar;
