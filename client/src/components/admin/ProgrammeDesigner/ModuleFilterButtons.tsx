import { Button as MuiButton } from '@mui/material';

interface ModuleFilterButtonsProps {
  onFilterChange: (year: number) => void;
}

function ModuleFilterButtons({ onFilterChange }: ModuleFilterButtonsProps) {
  const years = [1, 2, 3, 4];

  return (
    <div className="module-filter-buttons">
      {years.map((year) => (
        <MuiButton
          key={year}
          variant="outlined"
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
