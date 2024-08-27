import React, { useState, useEffect } from 'react';
import { Box, Flex } from '@chakra-ui/react';
import Select, { MultiValue, components, OptionProps } from 'react-select';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { ModuleDocument } from '../../../../../types/admin/CreateModule';
import { Dropdown } from 'primereact/dropdown';
import { Tooltip as PrimeTooltip } from 'primereact/tooltip';

interface OptionType {
  label: string;
  value: string;
}

interface StudentWorkloadGraphProps {
  modules: ModuleDocument[];
}

const CustomOption = (props: OptionProps<OptionType>) => {
  const { data, innerRef, innerProps, isSelected } = props;

  if (data.value === '*') {
    // Custom rendering for "Select All"
    return (
      <div
        ref={innerRef}
        {...innerProps}
        style={{ display: 'flex', alignItems: 'center' }}
      >
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => {}} // Prevent the default behavior to avoid an additional click event
          style={{ marginRight: '8px' }}
        />
        <span>{data.label}</span>
      </div>
    );
  }

  // Default rendering for other options
  return <components.Option {...props} />;
};

const StudentWorkloadGraph: React.FC<StudentWorkloadGraphProps> = ({
  modules,
}) => {
  const [selectedModules, setSelectedModules] = useState<
    MultiValue<OptionType>
  >([]);
  const [closeMenuOnSelect, setCloseMenuOnSelect] = useState<boolean>(true);
  const [studyStyle, setStudyStyle] = useState<string>('earlyStarter');
  const [ratio, setRatio] = useState<string>('1');

  const moduleOptions: OptionType[] = modules.map((module) => ({
    label: module.moduleSetup.moduleCode,
    value: module.moduleSetup.moduleCode,
  }));

  const selectAllOption: OptionType = { label: 'Select All', value: '*' };

  const handleModuleChange = (selected: MultiValue<OptionType>) => {
    if (selected?.some((option) => option.value === selectAllOption.value)) {
      // Select all modules
      setSelectedModules(moduleOptions);
      setCloseMenuOnSelect(true); // Close the menu when "Select All" is chosen
    } else {
      setSelectedModules(selected);
      setCloseMenuOnSelect(false); // Keep the menu open for individual selections
    }
  };

  useEffect(() => {
    // Filter out selected modules that are no longer in the module options
    setSelectedModules((prevSelectedModules) =>
      prevSelectedModules.filter((module) =>
        modules.some((m) => m.moduleSetup.moduleCode === module.value),
      ),
    );
  }, [modules]);

  // Example data for the graph (this would typically be dynamic based on selectedModules)
  const data = [
    { week: 'Week 1', Module1: 10 },
    { week: 'Week 2', Module1: 20 },
    { week: 'Week 3', Module1: 30 },
    { week: 'Week 4', Module1: 40 },
    { week: 'Week 5', Module1: 50 },
  ];

  const studyStyleOptions = [
    { label: 'Early Starter', value: 'earlyStarter' },
    { label: 'Steady', value: 'steady' },
    { label: 'Just In Time', value: 'justInTime' },
  ];

  const ratioOptions = [
    { label: '0', value: '0' },
    { label: '0.5', value: '0_5' },
    { label: '1', value: '1' },
    { label: '2', value: '2' },
  ];

  return (
    <Box width="80%" height="80vh" p={4} bg="white">
      {/* Filters */}
      <Flex justifyContent="center" mb={4}>
        <Box mr={8}>
          <span>
            Select study style{' '}
            <i
              className="pi pi-info-circle ml-2"
              data-pr-tooltip="3 different study styles for students with different studying habits"
            />
          </span>{' '}
          <Dropdown
            value={studyStyle}
            options={studyStyleOptions}
            onChange={(e) => setStudyStyle(e.value)}
            placeholder="Select a Study Style"
            className="w-full md:w-10rem"
          />
          <PrimeTooltip target=".pi-info-circle" />
        </Box>{' '}
        <Box>
          <span>
            Select study hour ratio{' '}
            <i
              className="pi pi-info-circle ml-2"
              data-pr-tooltip={`For every 1 hour spent in class, the student will study ${ratio} hour(s) at home`}
            />
          </span>{' '}
          <Dropdown
            value={ratio}
            options={ratioOptions}
            onChange={(e) => setRatio(e.value)}
            placeholder="Select a Ratio"
            className="w-full md:w-10rem"
          />
          <PrimeTooltip target=".pi-info-circle" />
        </Box>
      </Flex>

      <Flex direction="row" height="100%">
        {/* Recharts Graph - 80% */}
        <Box width="80%" height="100%">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="week"
                label={{
                  value: 'Weeks',
                  position: 'insideBottomRight',
                  offset: 0,
                }}
              />
              <YAxis
                label={{
                  value: 'Effort Hours',
                  angle: -90,
                  position: 'insideLeft',
                }}
              />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="Module1"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>

        {/* Multi-select Dropdown - 20% */}
        <Box width="20%" pl={4}>
          <Select
            isMulti
            value={selectedModules}
            onChange={handleModuleChange}
            options={[selectAllOption, ...moduleOptions]} // Include the "Select All" option
            classNamePrefix="react-select"
            placeholder="Select Modules"
            closeMenuOnSelect={closeMenuOnSelect} // Dynamically set this based on selection
            isSearchable // Enables the search functionality
            components={{ Option: CustomOption }} // Use the custom option component
            styles={{
              multiValue: (base) => ({
                ...base,
                display: 'flex',
                flexWrap: 'wrap',
              }),
              multiValueLabel: (base) => ({
                ...base,
                marginRight: 6,
              }),
              multiValueRemove: (base) => ({
                ...base,
                marginLeft: 6,
              }),
            }}
          />
        </Box>
      </Flex>
    </Box>
  );
};

export default StudentWorkloadGraph;
