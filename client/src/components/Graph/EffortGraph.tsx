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

import { useEffect, useState } from 'react';

import { Programme } from '../../shared/types';
import { fetchData } from '../../utils/admin/ProgrammeDesigner';

import { ModuleInstance } from '../../types/admin/ProgrammeDesigner';
import { ModuleDocument } from '../../types/admin/CreateModule';

import { TeachingSchedule, inputTestData } from './GraphTypes';

function EffortGraph() {
  // TODO: fixed some typescript errors by doing type: any and console logging states (not sure how to fix some of them without doing this)
  // TODO: weeks are only 12 in abu's data, but 15 in the excel file

  // TODO: cleanup. some of this code is yanked from abu's side of the code
  const [programmeState, setProgrammeState] = useState<Programme[]>([]);
  const [searchResults, setSearchResults] = useState<ModuleDocument[]>([]);

  const [moduleInstances, setModuleInstances] = useState<ModuleInstance[]>([]);

  useEffect(() => {
    fetchData(setProgrammeState, setSearchResults, setModuleInstances);
  }, []);

  console.log(moduleInstances);
  console.log(inputTestData);
  console.log(programmeState);
  console.log(searchResults);

  // Function to aggregate hours by week for each module
  function aggregateData(input: any[]): any[] {
    const result: { [key: string]: any } = {};

    input.forEach((item) => {
      const moduleCode = item.uniqueId;
      const { teachingSchedule } = item.module;

      teachingSchedule.lectures.distribution.forEach((dist: any) => {
        if (!result[dist.week])
          result[dist.week] = { week: dist.week.toString(), total: 0 };
        if (!result[dist.week][moduleCode]) result[dist.week][moduleCode] = 0;
        result[dist.week][moduleCode] += dist.hours;
        result[dist.week].total += dist.hours;
      });

      teachingSchedule.tutorials.distribution.forEach((dist: any) => {
        if (!result[dist.week])
          result[dist.week] = { week: dist.week.toString(), total: 0 };
        if (!result[dist.week][moduleCode]) result[dist.week][moduleCode] = 0;
        result[dist.week][moduleCode] += dist.hours;
        result[dist.week].total += dist.hours;
      });

      // Repeat for other teaching activities (seminars, labs, fieldworkPlacement, other)
      // Assuming they also have distribution arrays like lectures and tutorials
      const otherActivities = [
        'seminars',
        'labs',
        'fieldworkPlacement',
        'other',
      ];
      otherActivities.forEach((activity) => {
        teachingSchedule[
          activity as keyof TeachingSchedule
        ].distribution.forEach((dist: any) => {
          if (!result[dist.week])
            result[dist.week] = { week: dist.week.toString(), total: 0 };
          if (!result[dist.week][moduleCode]) result[dist.week][moduleCode] = 0;
          result[dist.week][moduleCode] += dist.hours;
          result[dist.week].total += dist.hours;
        });
      });
    });

    return Object.values(result);
  }

  // this is the data that will be passed to the graph (inputTestData for testing, moduleInstances for real data)
  const dataToGraph = moduleInstances;

  const graphReadableData = aggregateData(dataToGraph);

  console.log(graphReadableData);

  const colors = [
    '#8884d8',
    '#82ca9d',
    '#800000',
    '#FFA500',
    '#008000',
    '#000080',
    '#FF00FF',
    '#00FFFF',
    '#FF0000',
    '#0000FF',
  ];

  const moduleNames = dataToGraph.map((item) => item.uniqueId);

  return (
    <div>
      <h1 className="text-center my-4">
        Total modelled effort (timetabled + private study)
      </h1>

      <ResponsiveContainer width="95%" height={500}>
        <LineChart
          width={900}
          height={500}
          data={graphReadableData}
          margin={{ top: 5, right: 20, bottom: 5, left: 20 }}
        >
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <XAxis dataKey="week" />
          <YAxis />
          <Legend />
          {moduleNames.map((moduleName, index) => (
            <Line
              key={moduleName}
              type="monotone"
              dataKey={moduleName}
              stroke={colors[index % colors.length]}
            />
          ))}

          {/* <Line type="monotone" dataKey="ELEC399" stroke="#8884d8" />
          <Line type="monotone" dataKey="ELEC300" stroke="#82ca9d" />
          <Line type="monotone" dataKey="ELEC362-AVS" stroke="#800000" />
          <Line type="monotone" dataKey="ELEC382" stroke="#FFA500" />
          <Line type="monotone" dataKey="ELEC309" stroke="#008000" />
          <Line type="monotone" dataKey="ELEC372" stroke="#000080" />
          <Line type="monotone" dataKey="ELEC373" stroke="#FF00FF" />
          <Line type="monotone" dataKey="AERO350" stroke="#00FFFF" />
          <Line type="monotone" dataKey="COMP323" stroke="#FF0000" />
          <Line type="monotone" dataKey="COMP390" stroke="#0000FF" /> */}

          <Line name="Total" type="monotone" dataKey="total" stroke="#000000" />

          <Tooltip />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default EffortGraph;
