export interface TeachingScheduleProps {
  moduleCredit: number;
  semester: string;
  templateData: number[][][];
  setTemplateData: React.Dispatch<React.SetStateAction<number[][][]>>;
}
