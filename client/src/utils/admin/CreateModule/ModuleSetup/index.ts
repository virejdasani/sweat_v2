import { ModuleSetupFormData } from '../../../../types/admin/CreateModule/ModuleSetup';

export const handleInputChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  formData: ModuleSetupFormData,
  setFormData: React.Dispatch<React.SetStateAction<ModuleSetupFormData>>,
) => {
  const { name, value } = e.target;
  setFormData({ ...formData, [name]: value });
};
