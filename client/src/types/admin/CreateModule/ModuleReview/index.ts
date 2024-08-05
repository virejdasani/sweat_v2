import { ModuleSetupFormData } from '../../../../types/admin/CreateModule/ModuleSetup';
import {
  Coursework,
  StudyStyleDistribution,
} from '../../../../types/admin/CreateModule/CourseworkSetup';
import { TeachingScheduleSaveData } from '../TeachingSchedule';

export interface ModuleReviewProps {
  templateData: number[][][];
  formData: ModuleSetupFormData;
  courseworkList: Coursework[];
  readingWeeks?: number[] | { sem1: number[]; sem2: number[] };
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
  semester: string;
}

export interface DistributionTableProps {
  templateData: number[][][];
  privateStudyDistributions: StudyStyleDistribution[];
  preparationDistributions: Coursework[];
}
