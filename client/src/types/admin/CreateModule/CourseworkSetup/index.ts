import { ModuleSetupFormData } from '../ModuleSetup';

export interface Coursework {
  shortTitle: string;
  longTitle: string;
  weight: number;
  type: string;
  deadlineWeek: number;
  deadlineDate?: Date;
  releaseWeek: number;
  deadlineDay?: string;
  deadlineTime?: string;
  contactTimeLectures?: number;
  contactTimeTutorials?: number;
  contactTimeLabs?: number;
  contactTimeSeminars?: number;
  contactTimeFieldworkPlacement?: number;
  contactTimeOthers?: number;
  formativeAssessmentTime?: number;
  privateStudyTime?: number;
  preparationTime?: number;
  keyboardTime?: number;
  feedbackTime?: number;
  [key: string]: number | string | Date | undefined;
}

export interface CourseworkSetupProps {
  courseworkList: Coursework[];
  onCourseworkListChange: (updatedCourseworkList: Coursework[]) => void;
  semester: string;
  examPercentage: number;
  formFactor: number;
  onFormFactorChange: (formFactor: number) => void;
  formData: ModuleSetupFormData;
}

export interface CourseworkSetupFunctionsProps {
  courseworkList: Coursework[];
  onCourseworkListChange: (updatedCourseworkList: Coursework[]) => void;
}
