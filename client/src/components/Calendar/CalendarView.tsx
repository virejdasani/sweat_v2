import format from 'date-fns/format';
import getDay from 'date-fns/getDay';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
// import React, { useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
// import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const locales = {
  //   'en-US': require('date-fns/locale/en-US'), // require not defined
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const showOnCalendar = [
  {
    title: 'Big Meeting',
    allDay: true,
    start: new Date(2024, 3, 0),
    end: new Date(2024, 3, 0),
  },
  {
    title: 'Vacation',
    start: new Date(2024, 2, 7),
    end: new Date(2024, 2, 10),
  },
  {
    title: 'Conference',
    start: new Date(2024, 1, 20),
    end: new Date(2024, 4, 23),
  },
];

function CalendarView() {
  return (
    <>
      <div>
        <Calendar
          localizer={localizer}
          events={showOnCalendar}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500, margin: '50px' }}
        />
      </div>
    </>
  );
}

export default CalendarView;
