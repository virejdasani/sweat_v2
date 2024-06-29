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

function Graph() {
  const data = [
    {
      name: '1',
      ELEC330: 1,
      ELEC340: 9,
      ELEC317: 3,
      ELEC382: 6,
      ELEC309: 3,
      ELEC372: 2,
      ELEC373: 22,
      AERO350: 3,
      COMP323: 3,
      COMP390: 3,
    },
  ];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <div>
        <h1>Total modelled effort (timetabled + private study)</h1>

        <LineChart
          width={600}
          height={300}
          data={data}
          margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
        >
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <XAxis dataKey="name" />
          <YAxis />
          <Legend />
          {/* <Line type="monotone" dataKey="pv" stroke="#8884d8" />
          <Line type="monotone" dataKey="uv" stroke="#82ca9d" /> */}
          <Line type="monotone" dataKey="ELEC330" stroke="#8884d8" />
          <Line type="monotone" dataKey="ELEC340" stroke="#82ca9d" />
          <Tooltip />
        </LineChart>
      </div>
    </ResponsiveContainer>
  );
}

export default Graph;
