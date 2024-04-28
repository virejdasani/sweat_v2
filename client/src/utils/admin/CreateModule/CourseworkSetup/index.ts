import { Coursework } from '../../../../types/admin/CreateModule/CourseworkSetup';

interface CourseworkSetupFunctionsProps {
  courseworkList: Coursework[];
  onCourseworkListChange: (updatedCourseworkList: Coursework[]) => void;
}

export const CourseworkSetupFunctions = ({
  courseworkList,
  onCourseworkListChange,
}: CourseworkSetupFunctionsProps) => {
  const handleAddCoursework = () => {
    const updatedCourseworkList = [
      ...courseworkList,
      {
        title: '',
        weight: 0,
        type: 'exam',
        deadlineWeek: 1,
        releasedWeekEarlier: 1,
      },
    ];
    onCourseworkListChange(updatedCourseworkList);
  };

  const handleDeleteCoursework = (index: number) => {
    const updatedList = [...courseworkList];
    updatedList.splice(index, 1);
    onCourseworkListChange(updatedList);
  };

  const handleInputChange = (
    index: number,
    field: keyof Coursework,
    value: string,
  ) => {
    const updatedList = [...courseworkList];
    updatedList[index] = {
      ...updatedList[index],
      [field]: field === 'weight' ? parseInt(value, 10) : value,
    };
    onCourseworkListChange(updatedList);
  };

  const totalWeight = courseworkList.reduce(
    (total, coursework) => total + coursework.weight,
    0,
  );

  const isFormValid =
    totalWeight === 100 &&
    courseworkList.every(
      (coursework) =>
        coursework.weight >= 1 &&
        coursework.weight <= 100 &&
        coursework.releasedWeekEarlier <= coursework.deadlineWeek,
    );

  return {
    handleAddCoursework,
    handleDeleteCoursework,
    handleInputChange,
    totalWeight,
    isFormValid,
  };
};
