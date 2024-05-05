export interface Coursework {
  title: string;
  weight: number;
  type: string;
  deadlineWeek: number;
  deadlineDate?: Date;
  releasedWeekEarlier: number;
  contactTimeLecture?: number;
  contactTimeTutorial?: number;
  contactTimeLab?: number;
  contactTimeBriefing?: number;
  formativeAssessment?: number;
  privateStudyPreparation?: number;
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
