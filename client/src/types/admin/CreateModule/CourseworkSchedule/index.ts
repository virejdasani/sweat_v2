import { Coursework } from '../CourseworkSetup';

export interface CourseworkScheduleProps {
  courseworkList: Coursework[];
  moduleCredit: number;
  handleScheduleChange: (
    index: number,
    field: keyof Omit<
      Coursework,
      'title' | 'weight' | 'type' | 'deadlineWeek' | 'releasedWeekEarlier'
    >,
    value: number | undefined,
  ) => void;
  templateData: number[][][];
  handleCourseworkListChange: (updatedCourseworkList: Coursework[]) => void;
  formFactor: number;
  isEditing: boolean;
}
