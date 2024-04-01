import { Button as MuiButton } from '@mui/material';
import { ModuleTypeFilterButtonsProps } from '../../../types/admin/ProgrammeDesigner';

function ModuleTypeFilterButtons({
  onFilterChange,
  selectedModuleType,
}: ModuleTypeFilterButtonsProps) {
  const moduleTypes = ['core', 'optional'];

  return (
    <div className="module-type-filter-buttons">
      <MuiButton
        variant={selectedModuleType === null ? 'contained' : 'outlined'}
        color="primary"
        onClick={() => onFilterChange(null)}
      >
        All
      </MuiButton>
      {moduleTypes.map((type) => (
        <MuiButton
          key={type}
          variant={selectedModuleType === type ? 'contained' : 'outlined'}
          color="primary"
          onClick={() => onFilterChange(type)}
        >
          {type}
        </MuiButton>
      ))}
    </div>
  );
}

export default ModuleTypeFilterButtons;
