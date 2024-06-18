import React from 'react';
import { Button, ButtonGroup } from '@chakra-ui/react';
import { ModuleYearFilterProps } from '../../../../../types/admin/ProgrammeDesigner';
import { filterButtonStyles } from '../filterButtonStyles';

const ModuleYearFilter: React.FC<ModuleYearFilterProps> = ({
  onFilterChange,
  selectedYear,
}) => {
  const years = [1, 2, 3, 4];

  return (
    <ButtonGroup isAttached variant="outline">
      <Button
        {...filterButtonStyles.baseStyle}
        {...(selectedYear === null
          ? filterButtonStyles.selectedStyle
          : filterButtonStyles.unselectedStyle)}
        onClick={() => onFilterChange(null)}
      >
        All
      </Button>
      {years.map((year) => (
        <Button
          key={year}
          {...filterButtonStyles.baseStyle}
          {...(selectedYear !== null &&
          selectedYear.toString() === year.toString()
            ? filterButtonStyles.selectedStyle
            : filterButtonStyles.unselectedStyle)}
          onClick={() => onFilterChange(year.toString())}
        >
          Year {year}
        </Button>
      ))}
    </ButtonGroup>
  );
};

export default ModuleYearFilter;
