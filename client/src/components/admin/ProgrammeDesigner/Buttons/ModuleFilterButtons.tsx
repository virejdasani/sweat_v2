import { Button as MuiButton } from '@mui/material';
import { ModuleFilterButtonsProps } from '../../../../types/admin/ProgrammeDesigner';

function ModuleFilterButtons({
  onFilterChange,
  selectedYear,
}: ModuleFilterButtonsProps) {
  const years = [1, 2, 3, 4];

  return (
    <div className="module-filter-buttons">
      <MuiButton
        variant={selectedYear === null ? 'contained' : 'outlined'}
        color="primary"
        onClick={() => onFilterChange(null)}
      >
        All
      </MuiButton>
      {years.map((year) => (
        <MuiButton
          key={year}
          variant={selectedYear === year ? 'contained' : 'outlined'}
          color="primary"
          onClick={() => onFilterChange(year)}
        >
          Year {year}
        </MuiButton>
      ))}
    </div>
  );
}

export default ModuleFilterButtons;
