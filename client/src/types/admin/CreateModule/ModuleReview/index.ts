import { ModuleSetupFormData } from '../../../../types/admin/CreateModule/ModuleSetup';
import { Coursework } from '../../../../types/admin/CreateModule/CourseworkSetup';

export interface ModuleReviewProps {
  formData: ModuleSetupFormData;
  courseworkList: Coursework[];
  templateData: number[][][];
}
