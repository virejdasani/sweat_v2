import { Module, Programme } from '../../../shared/types';

export interface ModuleCardProps {
  module: Module;
  programmeId: string;
  moduleInstances: ModuleInstance[];
  setModuleInstances: React.Dispatch<React.SetStateAction<ModuleInstance[]>>;
  programmeState: Programme[];
  setProgrammeState: React.Dispatch<React.SetStateAction<Programme[]>>;
  onEdit: (module: Module) => void;
}

export interface ModuleListProps {
  modules: Module[];
  programmeId: string;
  moduleInstances: ModuleInstance[];
  setModuleInstances: React.Dispatch<React.SetStateAction<ModuleInstance[]>>;
  programmeState: Programme[];
  setProgrammeState: React.Dispatch<React.SetStateAction<Programme[]>>;
  onEdit: (module: Module) => void;
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

export interface DeleteModalProps {
  open: boolean;
  onClose: () => void;
  onRemoveFromProgramme: () => void;
  onRemoveFromDatabase: () => void;
}
