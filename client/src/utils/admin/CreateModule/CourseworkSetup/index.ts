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
      shortTitle: '',
      longTitle: '',
      weight: 0,
      type: 'assignment',
      deadlineWeek: 1,
      releasedWeekPrior: 2,
      feedbackTime: 1,
      deadlineDay: 'Monday', // Set default value
      deadlineTime: '23:59', // Set default value
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
    let updatedValue = value === null ? undefined : value;

    if (field === 'deadlineTime' && typeof value === 'string') {
      // Ensure 24-hour format
      const isValidTime = /^([01]\d|2[0-3]):([0-5]\d)$/.test(value);
      if (!isValidTime) {
        alert('Please enter a valid time in 24-hour HH:mm format');
        return;
      }
      // optionally format it to ensure consistency
      const [hours, minutes] = value.split(':');
      updatedValue = `${hours.padStart(2, '0')}:${minutes}`;
    }

    if (field === 'weight' && typeof value === 'string') {
      updatedValue = parseFloat(value);
    }

    updatedList[index] = {
      ...updatedList[index],
      [field]: updatedValue,
    };

    onCourseworkListChange(updatedList);
  };

  const totalWeight = courseworkList.reduce(
    (total, coursework) => total + (coursework.weight || 0),
    0,
  );

  const isFormValid =
    totalWeight === 100 &&
    courseworkList.every(
      (coursework) =>
        coursework.weight >= 1 &&
        coursework.weight <= 100 &&
        (coursework.releasedWeekPrior ?? 2) <= coursework.deadlineWeek,
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
  semester: string,
): Coursework[] | null => {
  let updatedCourseworkList = [...courseworkList];
  const examIndex = updatedCourseworkList.findIndex(
    (coursework) => coursework.type === 'exam',
  );

  const examDeadlineWeek =
    semester === 'whole session' ? 33 : semester === 'second' ? 18 : 15;

  if (examPercentage > 0) {
    if (examIndex >= 0) {
      // Update existing exam coursework
      updatedCourseworkList[examIndex].weight = examPercentage;
      updatedCourseworkList[examIndex].deadlineWeek = examDeadlineWeek;
    } else {
      // Add new exam coursework
      const examCoursework: Coursework = {
        shortTitle: 'Exam',
        longTitle: 'Final Exam',
        weight: examPercentage,
        type: 'exam',
        deadlineWeek: examDeadlineWeek,
        releasedWeekPrior: 1,
        feedbackTime: 1,
        deadlineDay: '',
        deadlineTime: '',
      };
      updatedCourseworkList = [...updatedCourseworkList, examCoursework];
    }
    return updatedCourseworkList;
  } else if (examIndex >= 0) {
    // Remove exam coursework if examPercentage is 0
    updatedCourseworkList.splice(examIndex, 1);
    return updatedCourseworkList;
  }
  return null;
};
