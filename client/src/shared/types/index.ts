export interface Programme {
  id: 'CSEE' | 'AVS' | 'MCR' | 'EEE';
  name: string;
  moduleIds: string[];
}

interface Distribution {
  week: number;
  hours: number;
}

interface CourseworkPrep {
  deadline: number;
  weightage: number;
  studyHours: number;
  distribution: {
    earlybird: Distribution[];
    moderate: Distribution[];
    procrastinator: Distribution[];
  };
}

interface ClasstestPrep {
  deadline: number;
  weightage: number;
  studyHours: number;
  distribution: {
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
  totalStudyHours: number;
  timetabledHours: number;
  privateStudyHours: number;
  lectures: {
    hours: number;
    distribution: Distribution[];
  };
  seminars: {
    hours: number;
    distribution: Distribution[];
  };
  tutorials: {
    hours: number;
    distribution: Distribution[];
  };
  labs: {
    hours: number;
    distribution: Distribution[];
  };
  fieldworkPlacement: {
    hours: number;
    distribution: Distribution[];
  };
  other: {
    hours: number;
    distribution: Distribution[];
  };
  examPrep: {
    deadline: number;
    weightage: number;
    studyHours: number;
    distribution: Distribution[];
  };
  courseworkPrep: CourseworkPrep[];
  classtestPrep: ClasstestPrep[];
  totalHours: Distribution[];
}
