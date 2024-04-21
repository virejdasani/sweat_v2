/* eslint-disable @typescript-eslint/no-explicit-any */
import { Coursework, Module, Programme } from '../../../shared/types';

export interface ModuleListProps {
  modules: Module[];
  programmeId: string;
  moduleInstances: ModuleInstance[];
  setModuleInstances: React.Dispatch<React.SetStateAction<ModuleInstance[]>>;
  programmeState: Programme[];
  setProgrammeState: React.Dispatch<React.SetStateAction<Programme[]>>;
  onEdit: (module: Module) => void;
}

export interface ModuleCardProps {
  module: Module;
  programmeId: string;
  moduleInstances: ModuleInstance[];
  setModuleInstances: React.Dispatch<React.SetStateAction<ModuleInstance[]>>;
  programmeState: Programme[];
  setProgrammeState: React.Dispatch<React.SetStateAction<Programme[]>>;
  onEdit: (module: Module) => void;
}

export interface ModuleModalProps {
  mode: 'add' | 'edit';
  module?: Module;
  onClose: () => void;
  onSubmit: (
    moduleData: Partial<Module>,
    toast: any,
    onClose: any,
  ) => Promise<void>;
  moduleInstances: ModuleInstance[];
  setModuleInstances: React.Dispatch<React.SetStateAction<ModuleInstance[]>>;
  programmeState: Programme[];
  setProgrammeState: React.Dispatch<React.SetStateAction<Programme[]>>;
}

export interface ModuleInstance {
  module: Module;
  programmeId: string;
  uniqueId: string;
}

export interface ModuleYearFilterProps {
  onFilterChange: (year: string | null) => void;
  selectedYear: number | null;
}

export interface ModuleTypeFilterProps {
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

export interface TeachingSchedule {
  lectures: number;
  seminars: number;
  tutorials: number;
  labs: number;
  fieldworkPlacement: number;
  other: number;
}

export interface ModuleFormStep1Props {
  moduleData: Partial<Module>;
  handleChange: (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => void;
}

export interface ModuleFormStep2Props {
  teachingSchedule: TeachingSchedule;
  handleChange: (
    event: React.ChangeEvent<{ value: unknown; name?: string }>,
  ) => void;
}

export interface ModuleFormStep3Props {
  courseworks: Coursework[];
  handleChange: (
    index: number,
    field: keyof Coursework,
    value: string | number,
  ) => void;
  addCoursework: () => void;
  removeCoursework: (index: number) => void;
}
