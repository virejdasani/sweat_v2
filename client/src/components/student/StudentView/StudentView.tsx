import React, { useState, useEffect } from 'react';
import { Box, Text, Flex } from '@chakra-ui/react';
import Filters from './Filters/Filters';
import CourseworkCalendar from './CourseworkCalendar/CourseworkCalendar';
import StudentWorkloadGraph from './WorkloadGraphs/StackedModuleGraphs/StudentWorkloadGraph';
import { fetchFilteredModules } from '../../../utils/student/StudentView';
import { ModuleDocument } from '../../../types/admin/CreateModule';
import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL + 'calendar/';

const StudentView: React.FC = () => {
  const [year, setYear] = useState<number>(1);
  const [programme, setProgramme] = useState<string>('EEE');
  const [semester, setSemester] = useState<
    'first' | 'second' | 'whole session' | 'wholeSession'
  >('first');
  const [modules, setModules] = useState<ModuleDocument[]>([]); // State to store modules
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  // States for semester start dates
  const [semester1Start, setSemester1Start] = useState<Date | null>(null);
  const [semester2Start, setSemester2Start] = useState<Date | null>(null);

  // Fetch filtered modules from the backend
  useEffect(() => {
    const fetchModules = async () => {
      setLoading(true);
      setError(null);

      try {
        // Programmes for which the year should be ignored
        const programmesToIgnoreYear = ['EEEP', 'EEMS', 'EETW'];

        const data = await fetchFilteredModules(
          programmesToIgnoreYear.includes(programme) ? undefined : year,
          programme,
          semester,
        );
        setModules(data);
        if (data.length === 0) {
          setError('No modules found');
        }
      } catch (err) {
        setError('Failed to load modules');
      } finally {
        setLoading(false);
      }
    };

    fetchModules();
  }, [year, programme, semester]);

  // Fetch semester start dates
  useEffect(() => {
    const fetchSemesterStartDates = async () => {
      try {
        const res = await axios.get(`${baseURL}`);
        const data = res.data;
        console.log(data);

        // Search for events with titles "Semester 1 Start Date" and "Semester 2 Start Date"
        // ignore type errors
        // @ts-expect-error any type here works
        const semester1StartDateEvent = data.find((event) =>
          event.title.includes('Semester 1 Start Date'),
        );
        // @ts-expect-error any type here works
        const semester2StartDateEvent = data.find((event) =>
          event.title.includes('Semester 2 Start Date'),
        );

        // Extract semester start dates
        let semester1Start: Date | null = null;
        let semester2Start: Date | null = null;
        if (semester1StartDateEvent) {
          semester1Start = new Date(semester1StartDateEvent.start);
          setSemester1Start(semester1Start);
          console.log('Semester 1 start date:', semester1Start);
        }
        if (semester2StartDateEvent) {
          semester2Start = new Date(semester2StartDateEvent.start);
          setSemester2Start(semester2Start);
          console.log('Semester 2 start date:', semester2Start);
        }
      } catch (err) {
        console.error('Failed to fetch semester start dates:', err);
      }
    };

    fetchSemesterStartDates();
  }, []);

  // Define readingWeeks based on the selected semester
  const readingWeeks = (() => {
    if (semester === 'first') {
      return [7]; // Week 7 is a reading week for the first semester
    } else if (semester === 'second') {
      return []; // No reading weeks for the second semester
    } else if (semester === 'wholeSession') {
      return {
        sem1: [7], // Week 7 is a reading week for the first semester
        sem2: [], // No reading weeks in the second semester
      };
    }
    return [];
  })();

  return (
    <Box p={4} bg="gray.100" minHeight="100vh">
      <Flex justifyContent="center" alignItems="center" direction="column">
        <Text
          fontSize="xxx-large"
          fontWeight="bold"
          mb={6}
          color="teal.600"
          padding="40px"
          textAlign={'center'}
        >
          Coursework Calendar
        </Text>

        <Filters
          year={year}
          setYear={setYear}
          programme={programme}
          setProgramme={setProgramme}
          semester={semester}
          setSemester={setSemester}
        />

        {loading ? (
          <Text>Loading modules...</Text>
        ) : error ? (
          <Text color="red.500">{error}</Text>
        ) : modules.length === 0 ? (
          <Text>No modules found</Text>
        ) : (
          <>
            <CourseworkCalendar
              semester={semester}
              programme={programme}
              modules={modules}
              readingWeeks={readingWeeks}
              semester1Start={semester1Start}
              semester2Start={semester2Start}
            />
            <Text fontSize="xx-large" fontWeight="bold" mb={6} color="teal.600">
              Simulated Workload
            </Text>
            <StudentWorkloadGraph modules={modules} semester={semester} />
          </>
        )}
        <Box mt={50}>
          <div
            className="effortInfo"
            style={{
              marginLeft: '50px',
              marginRight: '50px',
              marginTop: '20px',
              marginBottom: '2rem',
              fontSize: 'small',
              border: '1px solid black',
              padding: '20px',
            }}
          >
            <h4>Effort Information</h4>
            <p>
              In the UK, each credit corresponds to 10 hours of notional
              learning. Therefore, a 15 credit module requires a total of 150
              hours of student effort, including contact time and private study.{' '}
              <></>
              <a href="https://www.qaa.ac.uk/docs/qaa/quality-code/what-is-credit-guide-for-students.pdf?sfvrsn=4460d981_14">
                Source
              </a>
            </p>
          </div>
        </Box>
      </Flex>
    </Box>
  );
};

export default StudentView;
