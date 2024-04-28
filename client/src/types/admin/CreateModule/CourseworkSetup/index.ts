export interface Coursework {
  title: string;
  weight: number;
  type: string;
  deadlineWeek: number;
  releasedWeekEarlier: number;
  contactTimeLectureTutorial?: number;
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
}
