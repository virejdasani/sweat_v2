export interface Coursework {
  title: string;
  weight: number;
  type: string;
  deadlineWeek: number;
  deadlineDate?: Date;
  releasedWeekEarlier: number;
  contactTimeLectures?: number;
  contactTimeTutorials?: number;
  contactTimeLabs?: number;
  contactTimeSeminars?: number;
  contactTimeFieldworkPlacement?: number;
  contactTimeOthers?: number;
  formativeAssessment?: number;
  privateStudy?: number;
  preparationTime?: number;
  keyboardTime?: number;
  feedbackTime?: number;
}

export interface CourseworkSetupProps {
  courseworkList: Coursework[];
  onCourseworkListChange: (updatedCourseworkList: Coursework[]) => void;
  semester: string;
  examPercentage: number;
}

export interface CourseworkSetupFunctionsProps {
  courseworkList: Coursework[];
  onCourseworkListChange: (updatedCourseworkList: Coursework[]) => void;
}
