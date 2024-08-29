import React, { useState, useEffect } from 'react';
import { Box, Text, Flex, Input, Button, Select } from '@chakra-ui/react';
import Filters from './Filters/Filters';
import CourseworkCalendar from './CourseworkCalendar/CourseworkCalendar';
import StudentWorkloadGraph from './WorkloadGraphs/StackedModuleGraphs/StudentWorkloadGraph';
import { fetchFilteredModules } from '../../../utils/student/StudentView';
import { ModuleDocument } from '../../../types/admin/CreateModule';

const StudentView: React.FC = () => {
  const [year, setYear] = useState<number>(1);
  const [programme, setProgramme] = useState<string>('EEE');
  const [semester, setSemester] = useState<
    'first' | 'second' | 'whole session' | 'wholeSession'
  >('first');
  const [modules, setModules] = useState<ModuleDocument[]>([]); // State to store modules
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state
  const [currentVersion, setCurrentVersion] = useState<string>(''); // State to store current version
  const [availableVersions, setAvailableVersions] = useState<string[]>([]); // State to store available versions
  const [selectedVersion, setSelectedVersion] = useState<string>(''); // State to store selected version for viewing

  // Fetch filtered modules from the backend
  useEffect(() => {
    const fetchModules = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchFilteredModules(year, programme, semester);
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

  const handleSetVersion = () => {
    if (currentVersion) {
      const prefixedModules = modules.map((module) => ({
        ...module,
        courseworkList: module.courseworkList.map((coursework) => {
          const { longTitle = '' } = coursework; // Ensure longTitle is a string

          // Create a dynamic pattern to match the current version prefix at the start of the title
          const versionPattern = new RegExp(`^${availableVersions.join('|')}`);

          // Replace the matched version string with the new version or prepend if no match
          const updatedTitle = longTitle
            .replace(versionPattern, currentVersion)
            .trim();

          return {
            ...coursework,
            longTitle: updatedTitle,
          };
        }),
      }));

      setModules(prefixedModules);
      setAvailableVersions((prev) => [...prev, currentVersion]);
      setCurrentVersion('');

      // here we need to send the local coursework names to the backend
      // TODO here
    }
  };

  const handleVersionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedVersion(e.target.value);
  };

  const filteredModules = selectedVersion
    ? modules
        .map((module) => ({
          ...module,
          courseworkList: module.courseworkList.filter(
            (coursework) =>
              coursework.longTitle.startsWith(selectedVersion) &&
              !/exam/i.test(coursework.longTitle), // Filter out courseworks with "exam" in their title
          ),
        }))
        .filter((module) => module.courseworkList.length > 0) // Only include modules that have remaining courseworks
    : modules.map((module) => ({
        ...module,
        courseworkList: module.courseworkList.filter(
          (coursework) => !/exam/i.test(coursework.longTitle), // Filter out courseworks with "exam" in their title
        ),
      }));

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

        <Box mb={6} mt={6}>
          <Input
            placeholder="Enter Calendar Version (e.g., CV1)"
            value={currentVersion}
            onChange={(e) => setCurrentVersion(e.target.value)}
            mr={2}
          />
          <Button onClick={handleSetVersion} colorScheme="teal">
            Set New Calendar Version
          </Button>
        </Box>

        <Box mb={6}>
          <Select
            placeholder="View All Calendar Versions"
            onChange={handleVersionChange}
          >
            {availableVersions.map((version) => (
              <option key={version} value={version}>
                {version}
              </option>
            ))}
          </Select>
        </Box>

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
              modules={filteredModules} // Now filtered by the selected version and excluding exams
              readingWeeks={readingWeeks}
            />
            <Text fontSize="xx-large" fontWeight="bold" mb={6} color="teal.600">
              Workload Graph
            </Text>
            <StudentWorkloadGraph modules={filteredModules} />
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
