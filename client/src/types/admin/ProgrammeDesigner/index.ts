/* eslint-disable @typescript-eslint/no-explicit-any */
import { Programme } from '../../../shared/types';
import { ModuleDocument } from '../CreateModule';
import { Coursework } from '../CreateModule/CourseworkSetup';

export interface ModuleListProps {
  modules: ModuleDocument[];
  programmeId: string;
  moduleInstances: ModuleInstance[];
  setModuleInstances: React.Dispatch<React.SetStateAction<ModuleInstance[]>>;
  programmeState: Programme[];
  setProgrammeState: React.Dispatch<React.SetStateAction<Programme[]>>;
  onEdit: (module: ModuleDocument) => void;
}

export interface ModuleCardProps {
  module: ModuleDocument;
  programmeId: string;
  moduleInstances: ModuleInstance[];
  setModuleInstances: React.Dispatch<React.SetStateAction<ModuleInstance[]>>;
  programmeState: Programme[];
  setProgrammeState: React.Dispatch<React.SetStateAction<Programme[]>>;
  onEdit: (module: ModuleDocument) => void;
}

export interface ModuleModalProps {
  mode: 'add' | 'edit';
  module?: ModuleDocument;
  onClose: () => void;
  onSubmit: (
    moduleData: Partial<ModuleDocument>,
    toast: any,
    onClose: any,
  ) => Promise<void>;
  moduleInstances: ModuleInstance[];
  setModuleInstances: React.Dispatch<React.SetStateAction<ModuleInstance[]>>;
  programmeState: Programme[];
  setProgrammeState: React.Dispatch<React.SetStateAction<Programme[]>>;
}

export interface ModuleInstance {
  module: ModuleDocument;
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
  onSearch: (results: ModuleDocument[]) => void;
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
  moduleData: Partial<ModuleDocument>;
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
