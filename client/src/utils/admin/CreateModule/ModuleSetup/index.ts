import { ModuleSetupFormData } from '../../../../types/admin/CreateModule/ModuleSetup';

export const handleInputChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  formData: ModuleSetupFormData,
  setFormData: React.Dispatch<React.SetStateAction<ModuleSetupFormData>>,
) => {
  const { name, value } = e.target;
  setFormData({ ...formData, [name]: value });
};

export const handleTeachingStaffChange = (
  index: number,
  value: string,
  formData: ModuleSetupFormData,
  setFormData: React.Dispatch<React.SetStateAction<ModuleSetupFormData>>,
) => {
  const newTeachingStaff = [...formData.teachingStaff];
  newTeachingStaff[index] = value;
  setFormData({ ...formData, teachingStaff: newTeachingStaff });
};

export const addTeachingStaff = (
  formData: ModuleSetupFormData,
  setFormData: React.Dispatch<React.SetStateAction<ModuleSetupFormData>>,
) => {
  if (formData.teachingStaff.length < 2) {
    setFormData({
      ...formData,
      teachingStaff: [...formData.teachingStaff, ''],
    });
  }
};

export const removeTeachingStaff = (
  index: number,
  formData: ModuleSetupFormData,
  setFormData: React.Dispatch<React.SetStateAction<ModuleSetupFormData>>,
) => {
  const newTeachingStaff = formData.teachingStaff.filter(
    (_: string, i: number) => i !== index,
  );
  setFormData({ ...formData, teachingStaff: newTeachingStaff });
};
