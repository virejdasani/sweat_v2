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
  { title: 'Review', description: 'Review module details' },
];

export interface ModuleSetupFormData {
  moduleCode: string;
  moduleTitle: string;
  moduleCredit: number;
  courseworkPercentage: number;
  examPercentage: number;
  studyYear: number;
  programme: string[];
  semester: string;
  type: string;
}

export interface ModuleSetupProps {
  formData: ModuleSetupFormData;
  setFormData: React.Dispatch<React.SetStateAction<ModuleSetupFormData>>;
}
