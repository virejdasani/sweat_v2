export interface Module {
  id: string;
  name: string;
  credits: number;
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

export const modules: Module[] = [
  { id: 'ELEC101', name: 'Programming Fundamentals', credits: 4 },
  { id: 'ELEC202', name: 'Digital Electronics', credits: 3 },
  { id: 'ELEC303', name: 'Data Structures and Algorithms', credits: 4 },
  { id: 'ELEC404', name: 'Control Systems', credits: 4 },
  { id: 'ELEC505', name: 'Embedded Systems', credits: 3 },
  { id: 'ELEC606', name: 'Aircraft Systems', credits: 4 },
  { id: 'ELEC707', name: 'Avionics Communication', credits: 3 },
  { id: 'ELEC808', name: 'Robotics Principles', credits: 4 },
  { id: 'ELEC909', name: 'Mechatronics Design', credits: 4 },
  { id: 'ELEC010', name: 'Power Electronics', credits: 3 },
  { id: 'ELEC111', name: 'Signals and Systems', credits: 4 },
];

export const moduleInstances: ModuleInstance[] = [
  { id: 'instance1', moduleId: 'ELEC101', programmeId: 'CSEE' },
  { id: 'instance2', moduleId: 'ELEC202', programmeId: 'CSEE' },
  { id: 'instance3', moduleId: 'ELEC303', programmeId: 'CSEE' },
  { id: 'instance4', moduleId: 'ELEC202', programmeId: 'AVS' },
  { id: 'instance5', moduleId: 'ELEC606', programmeId: 'AVS' },
  { id: 'instance6', moduleId: 'ELEC707', programmeId: 'AVS' },
  { id: 'instance7', moduleId: 'ELEC404', programmeId: 'MCR' },
  { id: 'instance8', moduleId: 'ELEC808', programmeId: 'MCR' },
  { id: 'instance9', moduleId: 'ELEC909', programmeId: 'MCR' },
  { id: 'instance10', moduleId: 'ELEC202', programmeId: 'EEE' },
  { id: 'instance11', moduleId: 'ELEC010', programmeId: 'EEE' },
  { id: 'instance12', moduleId: 'ELEC111', programmeId: 'EEE' },
];

export const programmes: Programme[] = [
  {
    id: 'CSEE',
    name: 'Computer Science and Electronics Engineering',
    moduleInstanceIds: ['instance1', 'instance2', 'instance3'],
  },
  {
    id: 'AVS',
    name: 'Avionics Systems',
    moduleInstanceIds: ['instance4', 'instance5', 'instance6'],
  },
  {
    id: 'MCR',
    name: 'Mechatronics and Robotics',
    moduleInstanceIds: ['instance7', 'instance8', 'instance9'],
  },
  {
    id: 'EEE',
    name: 'Electrical and Electronics Engineering',
    moduleInstanceIds: ['instance10', 'instance11', 'instance12'],
  },
];

export const programmeModuleMap: ProgrammeModuleMap = {
  CSEE: ['ELEC101', 'ELEC202', 'ELEC303'],
  AVS: ['ELEC202', 'ELEC606', 'ELEC707'],
  MCR: ['ELEC404', 'ELEC808', 'ELEC909'],
  EEE: ['ELEC202', 'ELEC010', 'ELEC111'],
};
