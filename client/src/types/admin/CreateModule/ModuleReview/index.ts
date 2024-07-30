import { ModuleSetupFormData } from '../../../../types/admin/CreateModule/ModuleSetup';
import {
  Coursework,
  StudyStyleDistribution,
} from '../../../../types/admin/CreateModule/CourseworkSetup';
import { TeachingScheduleSaveData } from '../TeachingSchedule';

export interface ModuleReviewProps {
  formData: ModuleSetupFormData;
  courseworkList: Coursework[];
  templateData: number[][][];
}

export interface CombinedData {
  week: number;
  [key: string]: number;
}

export interface DistributionGraphProps {
  teachingSchedule: TeachingScheduleSaveData;
  privateStudyDistributions: StudyStyleDistribution[];
  preparationTimeDistributions: Coursework[];
  moduleCredit: number;
}

export interface DistributionTableProps {
  templateData: number[][][];
  privateStudyDistributions: StudyStyleDistribution[];
  preparationDistributions: Coursework[];
}
