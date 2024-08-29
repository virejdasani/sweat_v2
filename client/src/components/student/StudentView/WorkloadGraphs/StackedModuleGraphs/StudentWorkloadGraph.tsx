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
import { Dropdown } from 'primereact/dropdown';
import { Tooltip as PrimeTooltip } from 'primereact/tooltip';
import {
  OptionType,
  StudentWorkloadGraphProps,
  AggregatedData,
} from '../../../../../types/student/StudentView';
import {
  fetchAggregatedData,
  studyStyleOptions,
  ratioOptions,
} from '../../../../../utils/student/StudentView/WorkloadGraphs';

const CustomOption = (props: OptionProps<OptionType>) => {
  const { data, innerRef, innerProps, isSelected } = props;

  if (data.value === '*') {
    return (
      <div
        ref={innerRef}
        {...innerProps}
        style={{ display: 'flex', alignItems: 'center' }}
      >
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => {}}
          style={{ marginRight: '8px' }}
        />
        <span>{data.label}</span>
      </div>
    );
  }

  return <components.Option {...props} />;
};

const StudentWorkloadGraph: React.FC<StudentWorkloadGraphProps> = ({
  modules,
}) => {
  const [selectedModules, setSelectedModules] = useState<
    MultiValue<OptionType>
  >([]);
  const [closeMenuOnSelect, setCloseMenuOnSelect] = useState<boolean>(true);
  const [studyStyle, setStudyStyle] = useState<string>('steady');
  const [ratio, setRatio] = useState<string>('1');
  const [data, setData] = useState<AggregatedData[]>([]);
  const [lineColors, setLineColors] = useState<{ [key: string]: string }>({});

  const moduleOptions: OptionType[] = modules.map((module) => ({
    label: module.moduleSetup.moduleCode,
    value: module.moduleSetup.moduleCode,
  }));

  const selectAllOption: OptionType = { label: 'Select All', value: '*' };

  const handleModuleChange = (selected: MultiValue<OptionType>) => {
    if (selected?.some((option) => option.value === selectAllOption.value)) {
      setSelectedModules(moduleOptions);
      setCloseMenuOnSelect(true);
    } else {
      setSelectedModules(selected);
      setCloseMenuOnSelect(false);
    }
  };

  useEffect(() => {
    setSelectedModules((prevSelectedModules) =>
      prevSelectedModules.filter((module) =>
        modules.some((m) => m.moduleSetup.moduleCode === module.value),
      ),
    );
  }, [modules]);

  useEffect(() => {
    fetchAggregatedData(
      Array.from(selectedModules),
      studyStyle,
      ratio,
      setData,
      lineColors,
      setLineColors,
    );
  }, [selectedModules, studyStyle, ratio]);

  return (
    <Box width="80%" height="80vh" p={4} bg="white">
      <button
        className="backButton btn btn-secondary mx-3 my-3 fixed-top col-sm-1"
        onClick={() => {
          window.history.back();
        }}
      >
        Home
      </button>
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
                  position: 'insideBottom',
                  dy: 20,
                }}
                tickFormatter={(value) => value.replace('Week ', '')}
              />
              <YAxis
                label={{
                  value: 'Effort Hours',
                  angle: -90,
                  position: 'insideLeft',
                }}
              />
              <Tooltip />
              <Legend
                verticalAlign="bottom"
                wrapperStyle={{ paddingTop: 30 }}
              />
              {selectedModules.map((module) => (
                <Line
                  key={module.value}
                  type="monotone"
                  dataKey={module.value}
                  stroke={lineColors[module.value]}
                  activeDot={{ r: 8 }}
                />
              ))}
              {/* Add the total effort line */}
              <Line
                type="monotone"
                dataKey="totalEffort"
                stroke="#000000"
                strokeWidth={3}
                dot={false}
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
            options={[selectAllOption, ...moduleOptions]}
            classNamePrefix="react-select"
            placeholder="Select Modules"
            closeMenuOnSelect={closeMenuOnSelect}
            isSearchable
            components={{ Option: CustomOption }}
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
