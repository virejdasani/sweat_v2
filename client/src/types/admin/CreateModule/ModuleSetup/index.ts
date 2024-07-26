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
  teachingStaff: string[];
  formFactor: number;
  archived?: boolean;
}

export interface ModuleSetupProps {
  formData: ModuleSetupFormData;
  setFormData: React.Dispatch<React.SetStateAction<ModuleSetupFormData>>;
}
