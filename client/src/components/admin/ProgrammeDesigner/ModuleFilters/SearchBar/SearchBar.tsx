import React from 'react';
import { Input, FormControl, FormLabel } from '@chakra-ui/react';
import { SearchBarProps } from '../../../../../types/admin/ProgrammeDesigner';

const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  onSearchChange,
}) => {
  return (
    <FormControl>
      <FormLabel htmlFor="search">Search modules</FormLabel>
      <Input
        id="search"
        type="text"
        value={searchQuery}
        onChange={onSearchChange}
        variant="outline"
        size="md"
        width="100%"
      />
    </FormControl>
  );
};

export default SearchBar;
