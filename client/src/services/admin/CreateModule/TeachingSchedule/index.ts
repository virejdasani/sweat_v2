import httpClient from '../../../../shared/api/httpClient';
import { ApiError } from '../../../../shared/api/types';

export const fetchModuleTemplate = async (
  moduleCredit: number,
  semester: string,
): Promise<number[][][]> => {
  try {
    const response = await httpClient.get<number[][][]>(
      '/modules/module-template',
      {
        params: {
          moduleCredit,
          semester,
        },
      },
    );
    return response.data;
  } catch (error: unknown) {
    const apiError = error as ApiError;
    if (apiError.status && apiError.message) {
      console.error('Error fetching module template:', apiError.message);
    } else {
      console.error('Unknown error fetching module template:', error);
    }
    return [[]];
  }
};
