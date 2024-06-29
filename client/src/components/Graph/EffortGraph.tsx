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

function EffortGraph() {
  const data = [
    {
      week: '1',
      ELEC330: 3,
      ELEC340: 9,
      ELEC317: 3,
      ELEC382: 6,
      ELEC309: 3,
      ELEC372: 2,
      ELEC373: 22,
      AERO350: 3,
      COMP323: 3,
      COMP390: 3,
      total: 54,
    },
    {
      week: '2',
      ELEC330: 4,
      ELEC340: 13,
      ELEC317: 3,
      ELEC382: 6,
      ELEC309: 3,
      ELEC372: 3,
      ELEC373: 43,
      AERO350: 4,
      COMP323: 4,
      COMP390: 4,
      total: 87,
    },

    {
      week: '3',
      ELEC330: 4,
      ELEC340: 7,
      ELEC317: 3,
      ELEC382: 7,
      ELEC309: 3,
      ELEC372: 3,
      ELEC373: 7,
      AERO350: 4,
      COMP323: 4,
      COMP390: 4,
      total: 46,
    },

    {
      week: '4',
      ELEC330: 2,
      ELEC340: 7,
      ELEC317: 3,
      ELEC382: 6,
      ELEC309: 3,
      ELEC372: 3,
      ELEC373: 6,
      AERO350: 2,
      COMP323: 2,
      COMP390: 2,
      total: 34,
    },

    {
      week: '5',
      ELEC330: 4,
      ELEC340: 7,
      ELEC317: 3,
      ELEC382: 3,
      ELEC309: 3,
      ELEC372: 21,
      ELEC373: 3,
      AERO350: 4,
      COMP323: 4,
      COMP390: 4,
      total: 56,
    },

    {
      week: '6',
      ELEC330: 4,
      ELEC340: 7,
      ELEC317: 3,
      ELEC382: 6,
      ELEC309: 3,
      ELEC372: 3,
      ELEC373: 6,
      AERO350: 4,
      COMP323: 4,
      COMP390: 4,
      total: 44,
    },
    {
      week: '7',
      ELEC330: 2,
      ELEC340: 10,
      ELEC317: 1,
      ELEC382: 2,
      ELEC309: 2,
      ELEC372: 2,
      ELEC373: 2,
      AERO350: 2,
      COMP323: 2,
      COMP390: 2,
      total: 25,
    },
    {
      week: '8',
      ELEC330: 4,
      ELEC340: 13,
      ELEC317: 3,
      ELEC382: 6,
      ELEC309: 3,
      ELEC372: 3,
      ELEC373: 22,
      AERO350: 4,
      COMP323: 6,
      COMP390: 4,
      total: 68,
    },
    {
      week: '9',
      ELEC330: 8,
      ELEC340: 70,
      ELEC317: 3,
      ELEC382: 7,
      ELEC309: 3,
      ELEC372: 4,
      ELEC373: 7,
      AERO350: 8,
      COMP323: 8,
      COMP390: 64,
      total: 182,
    },
    {
      week: '10',
      ELEC330: 76,
      ELEC340: 10,
      ELEC317: 3,
      ELEC382: 6,
      ELEC309: 3,
      ELEC372: 3,
      ELEC373: 6,
      AERO350: 10,
      COMP323: 10,
      COMP390: 10,
      total: 137,
    },
    {
      week: '11',
      ELEC330: 2,
      ELEC340: 13,
      ELEC317: 3,
      ELEC382: 7,
      ELEC309: 3,
      ELEC372: 13,
      ELEC373: 7,
      AERO350: 4,
      COMP323: 2,
      COMP390: 2,
      total: 56,
    },
    {
      week: '12',
      ELEC330: 3,
      ELEC340: 7,
      ELEC317: 0,
      ELEC382: 7,
      ELEC309: 4,
      ELEC372: 8,
      ELEC373: 2,
      AERO350: 3,
      COMP323: 5,
      COMP390: 157,
      total: 196,
    },
    {
      week: '13',
      ELEC330: 0,
      ELEC340: 0,
      ELEC317: 0,
      ELEC382: 0,
      ELEC309: 0,
      ELEC372: 1,
      ELEC373: 30,
      AERO350: 0,
      COMP323: 0,
      COMP390: 0,
      total: 31,
    },
    {
      week: '14',
      ELEC330: 0,
      ELEC340: 0,
      ELEC317: 0,
      ELEC382: 1,
      ELEC309: 0,
      ELEC372: 2,
      ELEC373: 4,
      AERO350: 0,
      COMP323: 1,
      COMP390: 0,
      total: 8,
    },
    {
      week: '15',
      ELEC330: 0,
      ELEC340: 0,
      ELEC317: 0,
      ELEC382: 5,
      ELEC309: 0,
      ELEC372: 6,
      ELEC373: 11,
      AERO350: 0,
      COMP323: 5,
      COMP390: 0,
      total: 27,
    },
  ];

  // get the totals of each week dont get the week
  // const totals = data.map((week) => {
  //   let total = 0;
  //   for (const key in week) {
  //     if (key !== 'week') {
  //       total += week[key];
  //     }
  //   }
  //   return total;
  // });

  // console.log(totals);

  return (
    <div>
      <h1 className="text-center my-4">
        Total modelled effort (timetabled + private study)
      </h1>

      <ResponsiveContainer width="95%" height={500}>
        <LineChart
          width={900}
          height={500}
          data={data}
          margin={{ top: 5, right: 20, bottom: 5, left: 20 }}
        >
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <XAxis dataKey="week" />
          <YAxis />
          <Legend />
          <Line type="monotone" dataKey="ELEC330" stroke="#8884d8" />
          <Line type="monotone" dataKey="ELEC340" stroke="#82ca9d" />
          <Line type="monotone" dataKey="ELEC317" stroke="#800000" />
          <Line type="monotone" dataKey="ELEC382" stroke="#FFA500" />
          <Line type="monotone" dataKey="ELEC309" stroke="#008000" />
          <Line type="monotone" dataKey="ELEC372" stroke="#000080" />
          <Line type="monotone" dataKey="ELEC373" stroke="#FF00FF" />
          <Line type="monotone" dataKey="AERO350" stroke="#00FFFF" />
          <Line type="monotone" dataKey="COMP323" stroke="#FF0000" />
          <Line type="monotone" dataKey="COMP390" stroke="#0000FF" />
          <Line name="Total" type="monotone" dataKey="total" stroke="#000000" />

          <Tooltip />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default EffortGraph;
