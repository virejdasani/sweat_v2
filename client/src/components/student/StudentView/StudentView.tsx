import React, { useState, useEffect } from 'react';
import { Box, Text, Flex } from '@chakra-ui/react';
import Filters from './Filters/Filters';
import CourseworkCalendar from './CourseworkCalendar/CourseworkCalendar';
import httpClient from '../../../shared/api/httpClient';
import { ApiError } from '../../../shared/api/types';
import { ModuleDocument } from '../../../types/admin/CreateModule';

const fetchFilteredModules = async (
  studyYear: number,
  programme: string,
  semester: string,
): Promise<ModuleDocument[]> => {
  try {
    const response = await httpClient.get<ModuleDocument[]>(
      '/modules/filtered',
      {
        params: {
          studyYear,
          programme,
          semester: semester === 'whole session' ? 'wholeSession' : semester, // Normalize for backend
        },
      },
    );
    return response.data;
  } catch (error: unknown) {
    const apiError = error as ApiError;
    if (apiError.status && apiError.message) {
      console.error('Error fetching filtered modules:', apiError.message);
    } else {
      console.error('Unknown error fetching filtered modules:', error);
    }
    return [];
  }
};

const StudentView: React.FC = () => {
  const [year, setYear] = useState<number>(1);
  const [programme, setProgramme] = useState<string>('');
  const [semester, setSemester] = useState<
    'first' | 'second' | 'whole session'
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
    } else if (semester === 'whole session') {
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
        <Text fontSize="3xl" fontWeight="bold" mb={6} color="teal.600">
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

        <Box mt={8} textAlign="center">
          <Text fontSize="sm" color="gray.600">
            © 2024 Your University Name. All rights reserved.
          </Text>
        </Box>
      </Flex>
    </Box>
  );
};

export default StudentView;
