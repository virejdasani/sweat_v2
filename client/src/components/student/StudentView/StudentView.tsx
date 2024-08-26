import React, { useState, useEffect } from 'react';
import { Box, Text, Flex } from '@chakra-ui/react';
import Filters from './Filters/Filters';
import CourseworkCalendar from './CourseworkCalendar/CourseworkCalendar';
import { fetchFilteredModules } from '../../../utils/student/StudentView';
import { ModuleDocument } from '../../../types/admin/CreateModule';

const StudentView: React.FC = () => {
  const [year, setYear] = useState<number>(1);
  const [programme, setProgramme] = useState<string>('');
  const [semester, setSemester] = useState<
    'first' | 'second' | 'whole session' | 'wholeSession'
  >('first');
  const [modules, setModules] = useState<ModuleDocument[]>([]); // State to store modules
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  // Fetch filtered modules from the backend
  useEffect(() => {
    const fetchModules = async () => {
      setLoading(true);
      setError(null);
      const data = await fetchFilteredModules(year, programme, semester);
      if (data.length === 0 && error) {
        setError('Failed to load modules');
      }
      setModules(data);
      setLoading(false);
    };

    fetchModules();
  }, [year, programme, semester, error]);

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
        <Text fontSize="xxx-large" fontWeight="bold" mb={6} color="teal.600">
          Student View
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
        ) : (
          <CourseworkCalendar
            semester={semester}
            programme={programme}
            modules={modules} // Now filtered by the backend
            readingWeeks={readingWeeks}
          />
        )}

        <div
          className="effortInfo"
          style={{
            marginLeft: '50px',
            marginRight: '50px',
            marginTop: '20px',
            marginBottom: '20px',
            fontSize: 'small',
            border: '1px solid black',
            padding: '20px',
          }}
        >
          <h4>Effort Information</h4>
          <p>
            In the UK, each credit corresponds to 10 hours of notional learning.
            Therefore, a 15 credit module requires a total of 150 hours of
            student effort, including contact time and private study. <></>
            <a href="https://www.qaa.ac.uk/docs/qaa/quality-code/what-is-credit-guide-for-students.pdf?sfvrsn=4460d981_14">
              Source
            </a>
          </p>
        </div>
      </Flex>
    </Box>
  );
};

export default StudentView;
