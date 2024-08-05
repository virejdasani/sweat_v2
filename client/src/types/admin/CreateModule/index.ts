import { Coursework, StudyStyleDistribution } from './CourseworkSetup';
import { ModuleSetupFormData } from './ModuleSetup';
import { TeachingScheduleSaveData } from './TeachingSchedule';

export interface Step {
  title: string;
  description: string;
}
export const steps: Step[] = [
  { title: 'Module Setup', description: 'Set up module' },
  {
    title: 'Teaching Schedule',
    description: 'Modify teaching schedule',
  },
  { title: 'Coursework Setup', description: 'Add courseworks' },
  {
    title: 'Coursework Schedule',
    description: 'Modify coursework properties',
  },
  { title: 'Module Review', description: 'Review module details' },
];

export interface ModuleDocument {
  moduleSetup: ModuleSetupFormData;
  teachingSchedule: TeachingScheduleSaveData;
  courseworkList: Coursework[];
  privateStudyDistributions?: StudyStyleDistribution[];
}
