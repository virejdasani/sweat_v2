import httpClient from '../../../shared/api/httpClient';

export const getDefaultFormFactor = async (): Promise<number | null> => {
  try {
    const response = await httpClient.get('admin-settings/defaultFormFactor');
    return response.data.formFactor ?? null;
  } catch (error) {
    console.error('Error fetching default form factor', error);
    throw error;
  }
};

export const saveFormFactor = async (formFactor: number): Promise<void> => {
  try {
    await httpClient.post('admin-settings/defaultFormFactor', { formFactor });
  } catch (error) {
    console.error('Error saving form factor', error);
    throw error;
  }
};
