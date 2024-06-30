export interface WeekDistribution {
  week: number;
  hours: number;
}

export interface TeachingActivity {
  hours: number;
  distribution: WeekDistribution[];
}

export interface TeachingSchedule {
  lectures: TeachingActivity;
  seminars: TeachingActivity;
  tutorials: TeachingActivity;
  labs: TeachingActivity;
  fieldworkPlacement: TeachingActivity;
  other: TeachingActivity;
}

export interface ModuleSetup {
  moduleCode: string;
}

export interface Module {
  teachingSchedule: TeachingSchedule;
  moduleSetup: ModuleSetup;
}

export interface InputData {
  module: Module;
  programmeId: string;
  uniqueId: string;
}

export const inputTestData: InputData[] = [
  {
    module: {
      teachingSchedule: {
        lectures: {
          hours: 24,
          distribution: [
            { week: 1, hours: 2 },
            { week: 2, hours: 2 },
            { week: 3, hours: 2 },
            { week: 4, hours: 2 },
            { week: 5, hours: 2 },
            { week: 6, hours: 2 },
            { week: 7, hours: 2 },
            { week: 8, hours: 2 },
            { week: 9, hours: 2 },
            { week: 10, hours: 2 },
            { week: 11, hours: 2 },
            { week: 12, hours: 2 },
          ],
        },
        seminars: { hours: 0, distribution: [] },
        tutorials: {
          hours: 12,
          distribution: [
            { week: 1, hours: 1 },
            { week: 2, hours: 1 },
            { week: 3, hours: 1 },
            { week: 4, hours: 1 },
            { week: 5, hours: 1 },
            { week: 6, hours: 1 },
            { week: 7, hours: 1 },
            { week: 8, hours: 1 },
            { week: 9, hours: 1 },
            { week: 10, hours: 1 },
            { week: 11, hours: 1 },
            { week: 12, hours: 1 },
          ],
        },
        labs: { hours: 0, distribution: [] },
        fieldworkPlacement: { hours: 0, distribution: [] },
        other: { hours: 0, distribution: [] },
      },
      moduleSetup: {
        moduleCode: 'ELEC362',
      },
    },
    programmeId: 'AVS',
    uniqueId: 'ELEC362-AVS',
  },
  {
    module: {
      teachingSchedule: {
        lectures: {
          hours: 24,
          distribution: [
            { week: 1, hours: 2 },
            { week: 2, hours: 2 },
            { week: 3, hours: 2 },
            { week: 4, hours: 2 },
            { week: 5, hours: 2 },
            { week: 6, hours: 2 },
            { week: 7, hours: 2 },
            { week: 8, hours: 2 },
            { week: 9, hours: 2 },
            { week: 10, hours: 2 },
            { week: 11, hours: 2 },
            { week: 12, hours: 2 },
          ],
        },
        seminars: { hours: 0, distribution: [] },
        tutorials: {
          hours: 12,
          distribution: [
            { week: 1, hours: 1 },
            { week: 2, hours: 1 },
            { week: 3, hours: 1 },
            { week: 4, hours: 1 },
            { week: 5, hours: 1 },
            { week: 6, hours: 1 },
            { week: 7, hours: 1 },
            { week: 8, hours: 1 },
            { week: 9, hours: 1 },
            { week: 10, hours: 1 },
            { week: 11, hours: 1 },
            { week: 12, hours: 1 },
          ],
        },
        labs: { hours: 0, distribution: [] },
        fieldworkPlacement: { hours: 0, distribution: [] },
        other: { hours: 0, distribution: [] },
      },
      moduleSetup: {
        moduleCode: 'ELEC399',
      },
    },
    programmeId: 'AVS',
    uniqueId: 'ELEC399',
  },
  {
    module: {
      teachingSchedule: {
        lectures: {
          hours: 24,
          distribution: [
            { week: 1, hours: 2 },
            { week: 2, hours: 0 },
            { week: 3, hours: 2 },
            { week: 4, hours: 2 },
            { week: 5, hours: 4 },
            { week: 6, hours: 2 },
            { week: 7, hours: 2 },
            { week: 8, hours: 0 },
            { week: 9, hours: 0 },
            { week: 10, hours: 6 },
            { week: 11, hours: 2 },
            { week: 12, hours: 2 },
          ],
        },
        seminars: { hours: 0, distribution: [] },
        tutorials: {
          hours: 12,
          distribution: [
            { week: 1, hours: 1 },
            { week: 2, hours: 1 },
            { week: 3, hours: 1 },
            { week: 4, hours: 1 },
            { week: 5, hours: 1 },
            { week: 6, hours: 1 },
            { week: 7, hours: 1 },
            { week: 8, hours: 1 },
            { week: 9, hours: 1 },
            { week: 10, hours: 1 },
            { week: 11, hours: 1 },
            { week: 12, hours: 1 },
          ],
        },
        labs: { hours: 0, distribution: [] },
        fieldworkPlacement: { hours: 0, distribution: [] },
        other: { hours: 0, distribution: [] },
      },
      moduleSetup: {
        moduleCode: 'ELEC300',
      },
    },
    programmeId: 'AVS',
    uniqueId: 'ELEC300',
  },
  // add more modules here
];

export const defaultFormattedData = [
  {
    week: '1',
    total: 9,
    'ELEC362-AVS': 6,
    ELEC300: 3,
  },
  {
    week: '2',
    total: 9,
    'ELEC362-AVS': 6,
    ELEC300: 3,
  },
  {
    week: '3',
    total: 9,
    'ELEC362-AVS': 6,
    ELEC300: 3,
  },
  {
    week: '4',
    total: 9,
    'ELEC362-AVS': 6,
    ELEC300: 3,
  },
  {
    week: '5',
    total: 9,
    'ELEC362-AVS': 6,
    ELEC300: 3,
  },
  {
    week: '6',
    total: 9,
    'ELEC362-AVS': 6,
    ELEC300: 3,
  },
  {
    week: '7',
    total: 9,
    'ELEC362-AVS': 6,
    ELEC300: 3,
  },
  {
    week: '8',
    total: 9,
    'ELEC362-AVS': 6,
    ELEC300: 3,
  },
  {
    week: '9',
    total: 9,
    'ELEC362-AVS': 6,
    ELEC300: 3,
  },
  {
    week: '10',
    total: 9,
    'ELEC362-AVS': 6,
    ELEC300: 3,
  },
  {
    week: '11',
    total: 9,
    'ELEC362-AVS': 6,
    ELEC300: 3,
  },
  {
    week: '12',
    total: 9,
    'ELEC362-AVS': 6,
    ELEC300: 3,
  },
];
