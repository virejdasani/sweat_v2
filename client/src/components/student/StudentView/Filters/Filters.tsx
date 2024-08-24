import React from 'react';
import { Dropdown } from 'primereact/dropdown';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

interface FiltersProps {
  year: number;
  setYear: (value: number) => void;
  programme: string;
  setProgramme: (value: string) => void;
  semester: 'first' | 'second' | 'whole session';
  setSemester: (value: 'first' | 'second' | 'whole session') => void;
}

const Filters: React.FC<FiltersProps> = ({
  year,
  setYear,
  programme,
  setProgramme,
  semester,
  setSemester,
}) => {
  const yearOptions = [
    { label: '1', value: 1 },
    { label: '2', value: 2 },
    { label: '3', value: 3 },
    { label: '4', value: 4 },
  ];

  const programmeOptions = [
    { label: 'CSEE', value: 'CSEE' },
    { label: 'AVS', value: 'AVS' },
    { label: 'MCR', value: 'MCR' },
    { label: 'EEE', value: 'EEE' },
    { label: 'EEEP', value: 'EEEP' },
  ];

  const semesterOptions = [
    { label: 'First', value: 'first' },
    { label: 'Second', value: 'second' },
    { label: 'Whole Session', value: 'wholeSession' },
  ];

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
      }}
    >
      <div style={{ flex: '1', maxWidth: '150px' }}>
        <label
          htmlFor="year"
          style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontSize: '0.875rem',
          }}
        >
          Year
        </label>
        <Dropdown
          id="year"
          value={year}
          options={yearOptions}
          onChange={(e) => setYear(e.value)}
          placeholder="Select Year"
          style={{ width: '100%', fontSize: '0.875rem', padding: '0.25rem' }}
          panelClassName="custom-dropdown-panel"
        />
      </div>

      <div style={{ flex: '1', maxWidth: '200px' }}>
        <label
          htmlFor="programme"
          style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontSize: '0.875rem',
          }}
        >
          Programme
        </label>
        <Dropdown
          id="programme"
          value={programme}
          options={programmeOptions}
          onChange={(e) => setProgramme(e.value)}
          placeholder="Select Programme"
          style={{ width: '100%', fontSize: '0.875rem', padding: '0.25rem' }}
          panelClassName="custom-dropdown-panel"
        />
      </div>

      <div style={{ flex: '1', maxWidth: '250px' }}>
        <label
          htmlFor="semester"
          style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontSize: '0.875rem',
          }}
        >
          Semester
        </label>
        <Dropdown
          id="semester"
          value={semester}
          options={semesterOptions}
          onChange={(e) => setSemester(e.value)}
          placeholder="Select Semester"
          style={{ width: '100%', fontSize: '0.875rem', padding: '0.25rem' }}
          panelClassName="custom-dropdown-panel"
        />
      </div>
    </div>
  );
};

export default Filters;
