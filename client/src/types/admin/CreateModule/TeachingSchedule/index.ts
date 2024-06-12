export interface TeachingScheduleProps {
  moduleCredit: number;
  semester: string;
  templateData: number[][][];
  setTemplateData: React.Dispatch<React.SetStateAction<number[][][]>>;
  editingScheduleData?: TeachingScheduleSaveData;
}

export interface Distribution {
  week: number;
  hours: number;
}

export interface TeachingScheduleSaveData {
  lectures: {
    hours: number;
    distribution?: Distribution[];
  };
  seminars: {
    hours: number;
    distribution?: Distribution[];
  };
  tutorials: {
    hours: number;
    distribution?: Distribution[];
  };
  labs: {
    hours: number;
    distribution?: Distribution[];
  };
  fieldworkPlacement: {
    hours: number;
    distribution?: Distribution[];
  };
  other: {
    hours: number;
    distribution?: Distribution[];
  };
}
