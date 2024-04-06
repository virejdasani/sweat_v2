import { Module } from '../../../shared/types';

export interface ModuleCardProps {
  module: Module;
  programmeId: string;
  onEdit: (module: Module) => void;
  onRemove: (moduleId: string, programmeId: string) => void;
}

export interface ModuleListProps {
  modules: Module[];
  programmeId: string;
  onEdit: (module: Module) => void;
  onRemove: (moduleId: string, programmeId: string) => void;
}

export interface ModuleInstance {
  module: Module;
  programmeId: string;
  uniqueId: string;
}

export interface ModuleFilterButtonsProps {
  onFilterChange: (year: number | null) => void;
  selectedYear: number | null;
}

export interface ModuleTypeFilterButtonsProps {
  onFilterChange: (moduleType: string | null) => void;
  selectedModuleType: string | null;
}

export interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch: (results: Module[]) => void;
}
