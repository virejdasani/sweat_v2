/* eslint-disable @typescript-eslint/no-explicit-any */
import httpClient from '../../../../shared/api/httpClient';
import { ApiError } from '../../../../shared/api/types';
import { Coursework } from '../../../../types/admin/CreateModule/CourseworkSetup';
import { ModuleSetupFormData } from '../../../../types/admin/CreateModule/ModuleSetup';

interface FetchWorkloadGraphDataParams {
  formData: ModuleSetupFormData;
  courseworkList: Coursework[];
  templateData: number[][][];
  studyStyle: string;
}

export const fetchWorkloadGraphData = async (
  params: FetchWorkloadGraphDataParams,
): Promise<any[]> => {
  try {
    const response = await httpClient.post<any[]>(
      '/modules/workload-graph',
      params,
    );
    return response.data;
  } catch (error: unknown) {
    const apiError = error as ApiError;
    if (apiError.status && apiError.message) {
      console.error('Error fetching workload graph data:', apiError.message);
    } else {
      console.error('Unknown error fetching workload graph data:', error);
    }
    throw error;
  }
};
