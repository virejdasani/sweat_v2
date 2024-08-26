import { ModuleDocument } from '../../admin/CreateModule';

export interface FiltersProps {
  year: number;
  setYear: (value: number) => void;
  programme: string;
  setProgramme: (value: string) => void;
  semester: 'first' | 'second' | 'whole session' | 'wholeSession';
  setSemester: (
    value: 'first' | 'second' | 'whole session' | 'wholeSession',
  ) => void;
}

export interface CourseworkCalendarProps {
  semester: 'first' | 'second' | 'whole session' | 'wholeSession';
  programme: string;
  modules: ModuleDocument[];
  readingWeeks?: number[] | { sem1: number[]; sem2: number[] };
}
