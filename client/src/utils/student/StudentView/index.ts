import httpClient from '../../../shared/api/httpClient';
import { ApiError } from '../../../shared/api/types';
import { ModuleDocument } from '../../../types/admin/CreateModule';

export const fetchFilteredModules = async (
  studyYear: number | undefined,
  programme: string,
  semester: string,
): Promise<ModuleDocument[]> => {
  try {
    const response = await httpClient.get<ModuleDocument[]>(
      '/modules/filtered',
      {
        params: {
          studyYear: studyYear !== undefined ? studyYear : undefined, // Pass studyYear only if it's defined
          programme,
          semester: semester === 'whole session' ? 'wholeSession' : semester,
        },
      },
    );
    return response.data;
  } catch (error: unknown) {
    const apiError = error as ApiError;
    if (apiError.status && apiError.message) {
      console.error('Error fetching filtered modules:', apiError.message);
    } else {
      console.error('Unknown error fetching filtered modules:', error);
    }
    return [];
  }
};
