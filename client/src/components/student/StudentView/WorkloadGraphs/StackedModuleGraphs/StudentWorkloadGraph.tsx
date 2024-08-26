import React, { useState, useEffect } from 'react';
import { Box, Flex } from '@chakra-ui/react';
import { MultiSelect, MultiSelectChangeEvent } from 'primereact/multiselect';
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

interface StudentWorkloadGraphProps {
  modules: ModuleDocument[];
  displayedModules: string[];
  addModule: (moduleCode: string) => void;
}

const StudentWorkloadGraph: React.FC<StudentWorkloadGraphProps> = ({
  modules,
  displayedModules,
  addModule,
}) => {
  const [selectedModules, setSelectedModules] =
    useState<string[]>(displayedModules);

  const moduleOptions = modules.map((module) => ({
    label: module.moduleSetup.moduleCode, // This is the correct label to display in the MultiSelect
    value: module.moduleSetup.moduleCode, // This should match what's in selectedModules
  }));

  useEffect(() => {
    setSelectedModules(displayedModules);
  }, [displayedModules]);

  const handleModuleChange = (e: MultiSelectChangeEvent) => {
    setSelectedModules(e.value);
    e.value.forEach((moduleCode: string) => {
      if (!displayedModules.includes(moduleCode)) {
        addModule(moduleCode);
      }
    });
  };

  // Example data for the graph
  const data = [
    { week: 'Week 1', Module1: 10 },
    { week: 'Week 2', Module1: 20 },
    { week: 'Week 3', Module1: 30 },
    { week: 'Week 4', Module1: 40 },
    { week: 'Week 5', Module1: 50 },
  ];

  return (
    <Box width="80%" height="80vh" p={4} bg="white">
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
          <MultiSelect
            value={selectedModules}
            options={moduleOptions}
            onChange={handleModuleChange}
            display="chip"
            optionLabel="label" // This should match the label key in moduleOptions
            placeholder="Select Modules"
            maxSelectedLabels={3}
            className="w-full"
          />
        </Box>
      </Flex>
    </Box>
  );
};

export default StudentWorkloadGraph;
