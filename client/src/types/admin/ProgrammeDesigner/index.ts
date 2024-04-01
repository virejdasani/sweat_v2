export interface Module {
  id: string;
  name: string;
  credits: number;
  year: 1 | 2 | 3 | 4;
  type: 'core' | 'optional';
}

export interface Programme {
  id: string;
  name: string;
  moduleInstanceIds: string[];
}

export interface ProgrammeModuleMap {
  [programmeId: string]: string[];
}

export interface ModuleCardProps {
  module: Module;
}

export interface ModuleListProps {
  modules: Module[];
}

export interface ModuleInstance {
  id: string;
  moduleId: string;
  programmeId: string;
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
  onSearch: (results: Module[]) => void;
}

export const modules: Module[] = [
  {
    id: 'ELEC101',
    name: 'Programming Fundamentals',
    credits: 4,
    year: 1,
    type: 'core',
  },
  {
    id: 'ELEC202',
    name: 'Digital Electronics',
    credits: 3,
    year: 2,
    type: 'core',
  },
  {
    id: 'ELEC303',
    name: 'Data Structures and Algorithms',
    credits: 4,
    year: 3,
    type: 'core',
  },
  {
    id: 'ELEC404',
    name: 'Control Systems',
    credits: 4,
    year: 4,
    type: 'optional',
  },
  {
    id: 'ELEC505',
    name: 'Embedded Systems',
    credits: 3,
    year: 3,
    type: 'optional',
  },
  {
    id: 'ELEC606',
    name: 'Aircraft Systems',
    credits: 4,
    year: 4,
    type: 'optional',
  },
  {
    id: 'ELEC707',
    name: 'Avionics Communication',
    credits: 3,
    year: 4,
    type: 'optional',
  },
  {
    id: 'ELEC808',
    name: 'Robotics Principles',
    credits: 4,
    year: 4,
    type: 'optional',
  },
  {
    id: 'ELEC909',
    name: 'Mechatronics Design',
    credits: 4,
    year: 4,
    type: 'optional',
  },
  {
    id: 'ELEC010',
    name: 'Power Electronics',
    credits: 3,
    year: 3,
    type: 'optional',
  },
  {
    id: 'ELEC111',
    name: 'Signals and Systems',
    credits: 4,
    year: 3,
    type: 'optional',
  },
];
export const moduleInstances: ModuleInstance[] = [
  { id: 'instance1', moduleId: 'ELEC101', programmeId: 'CSEE' },
  { id: 'instance2', moduleId: 'ELEC202', programmeId: 'CSEE' },
  { id: 'instance3', moduleId: 'ELEC303', programmeId: 'CSEE' },
  { id: 'instance4', moduleId: 'ELEC404', programmeId: 'CSEE' },
  { id: 'instance5', moduleId: 'ELEC505', programmeId: 'CSEE' },
  { id: 'instance6', moduleId: 'ELEC202', programmeId: 'AVS' },
  { id: 'instance7', moduleId: 'ELEC606', programmeId: 'AVS' },
  { id: 'instance8', moduleId: 'ELEC707', programmeId: 'AVS' },
  { id: 'instance9', moduleId: 'ELEC808', programmeId: 'AVS' },
  { id: 'instance10', moduleId: 'ELEC909', programmeId: 'AVS' },
  { id: 'instance11', moduleId: 'ELEC404', programmeId: 'MCR' },
  { id: 'instance12', moduleId: 'ELEC808', programmeId: 'MCR' },
  { id: 'instance13', moduleId: 'ELEC909', programmeId: 'MCR' },
  { id: 'instance14', moduleId: 'ELEC010', programmeId: 'MCR' },
  { id: 'instance15', moduleId: 'ELEC111', programmeId: 'MCR' },
  { id: 'instance16', moduleId: 'ELEC202', programmeId: 'EEE' },
  { id: 'instance17', moduleId: 'ELEC010', programmeId: 'EEE' },
  { id: 'instance18', moduleId: 'ELEC111', programmeId: 'EEE' },
  { id: 'instance19', moduleId: 'ELEC505', programmeId: 'EEE' },
  { id: 'instance20', moduleId: 'ELEC606', programmeId: 'EEE' },
];

export const programmes: Programme[] = [
  {
    id: 'CSEE',
    name: 'Computer Science and Electronics Engineering',
    moduleInstanceIds: [
      'instance1',
      'instance2',
      'instance3',
      'instance4',
      'instance5',
    ],
  },
  {
    id: 'AVS',
    name: 'Avionics Systems',
    moduleInstanceIds: [
      'instance6',
      'instance7',
      'instance8',
      'instance9',
      'instance10',
    ],
  },
  {
    id: 'MCR',
    name: 'Mechatronics and Robotics',
    moduleInstanceIds: [
      'instance11',
      'instance12',
      'instance13',
      'instance14',
      'instance15',
    ],
  },
  {
    id: 'EEE',
    name: 'Electrical and Electronics Engineering',
    moduleInstanceIds: [
      'instance16',
      'instance17',
      'instance18',
      'instance19',
      'instance20',
    ],
  },
];

export const programmeModuleMap: ProgrammeModuleMap = {
  CSEE: ['ELEC101', 'ELEC202', 'ELEC303', 'ELEC404', 'ELEC505'],
  AVS: ['ELEC202', 'ELEC606', 'ELEC707', 'ELEC808', 'ELEC909'],
  MCR: ['ELEC404', 'ELEC808', 'ELEC909', 'ELEC010', 'ELEC111'],
  EEE: ['ELEC202', 'ELEC010', 'ELEC111', 'ELEC505', 'ELEC606'],
};

export interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch: (results: Module[]) => void;
}
