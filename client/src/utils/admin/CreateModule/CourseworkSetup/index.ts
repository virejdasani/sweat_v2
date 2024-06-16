import {
  Coursework,
  CourseworkSetupFunctionsProps,
} from '../../../../types/admin/CreateModule/CourseworkSetup';

export const CourseworkSetupFunctions = ({
  courseworkList = [],
  onCourseworkListChange,
}: CourseworkSetupFunctionsProps) => {
  const handleAddCoursework = () => {
    const newCoursework: Coursework = {
      title: '',
      weight: 0,
      type: 'assignment',
      deadlineWeek: 1,
      releasedWeekEarlier: 1,
      feedbackTime: 1,
    };
    onCourseworkListChange([...courseworkList, newCoursework]);
  };

  const handleDeleteCoursework = (index: number) => {
    const updatedList = [...courseworkList];
    updatedList.splice(index, 1);
    onCourseworkListChange(updatedList);
  };

  const handleInputChange = (
    index: number,
    field: keyof Coursework,
    value: string | number | Date | null,
  ) => {
    const updatedList = [...courseworkList];
    const updatedValue = value === null ? undefined : value; // Handle null values

    updatedList[index] = {
      ...updatedList[index],
      [field]:
        field === 'weight'
          ? parseInt(value as string, 10)
          : field === 'deadlineDate'
            ? updatedValue
            : updatedValue,
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

export const addExamCoursework = (
  examPercentage: number,
  courseworkList: Coursework[],
  onCourseworkListChange: (updatedCourseworkList: Coursework[]) => void,
) => {
  if (
    examPercentage > 0 &&
    !courseworkList.some((coursework) => coursework.type === 'exam')
  ) {
    const examCoursework: Coursework = {
      title: 'Exam',
      weight: examPercentage,
      type: 'exam',
      deadlineWeek: 15,
      releasedWeekEarlier: 1,
      feedbackTime: 1,
    };
    onCourseworkListChange([...courseworkList, examCoursework]);
  }
};
