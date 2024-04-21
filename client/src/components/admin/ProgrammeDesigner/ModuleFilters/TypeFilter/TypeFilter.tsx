import { Button, ButtonGroup } from '@chakra-ui/react';
import { ModuleTypeFilterProps } from '../../../../../types/admin/ProgrammeDesigner';
import { filterButtonStyles } from '../filterButtonStyles';

function ModuleTypeFilter({
  onFilterChange,
  selectedModuleType,
}: ModuleTypeFilterProps) {
  const moduleTypes = ['core', 'optional'];

  return (
    <ButtonGroup isAttached variant="outline">
      <Button
        {...filterButtonStyles.baseStyle}
        {...(selectedModuleType === null && filterButtonStyles.selectedStyle)}
        onClick={() => onFilterChange(null)}
      >
        All
      </Button>

      {moduleTypes.map((type) => (
        <Button
          key={type}
          {...filterButtonStyles.baseStyle}
          {...(selectedModuleType === type && filterButtonStyles.selectedStyle)}
          onClick={() => onFilterChange(type)}
        >
          {type}
        </Button>
      ))}
    </ButtonGroup>
  );
}

export default ModuleTypeFilter;
