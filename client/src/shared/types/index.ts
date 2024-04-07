export interface Programme {
  id: string;
  name: string;
  moduleIds: string[];
}

export interface Distribution {
  week: number;
  hours: number;
}

export interface Coursework {
  cwTitle: string;
  weight: string;
  type: 'assignment' | 'class test' | 'lab report' | 'presentation' | 'other';
  deadlineWeek: string;
  releasedWeekEarlier: string;
  studyHours?: number;
  distribution?: {
    earlybird: Distribution[];
    moderate: Distribution[];
    procrastinator: Distribution[];
  };
}

export interface Module {
  id: string;
  name: string;
  year: 1 | 2 | 3 | 4;
  type: 'core' | 'optional';
  programme: string[];
  semester: 'first' | 'second' | 'whole session';
  credits: 7.5 | 15 | 30;
  totalStudyHours?: number;
  timetabledHours: number;
  privateStudyHours?: number;
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
  examPrep?: {
    deadline: number;
    weightage: number;
    studyHours: number;
    distribution: Distribution[];
  };
  courseworks: Coursework[];
  totalHours?: Distribution[];
}
