import format from 'date-fns/format';
import getDay from 'date-fns/getDay';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import React, { useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import DatePicker from 'react-datepicker';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-datepicker/dist/react-datepicker.css';
import './CalendarView.css';

interface Event {
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
}

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

const eventsOnCalendar: Event[] = [
  // note: months are 0 indexed, days are 1 indexed
  // note: end date is 11:59pm of the day before the end date
  {
    title: 'COMP222 Assignment 1',
    allDay: true,
    start: new Date(2024, 2, 6),
    end: new Date(2024, 2, 10),
  },
];

// TODO: add all bank holidays to the calendar
// note: renaming this to Calendar causes conflicts with external imports
function CalendarView() {
  const [newEvent, setNewEvent] = useState({
    title: '',
    allDay: true,
    start: new Date(),
    end: new Date(),
  });

  const [allEvents, setAllEvents] = useState(eventsOnCalendar);

  const handleAddEvent = () => {
    // TODO: add event to mongodb so it persists
    // TODO: check that there is an event title

    const clashDetected = checkClash(newEvent, allEvents);

    if (clashDetected) {
      alert('Clash with another event detected');
    }
    // add new event to the calendar even if there is a clash
    setAllEvents([...allEvents, newEvent]);
  };

  function checkClash(newEvent: Event, allEvents: Event[]): boolean {
    for (let i = 0; i < allEvents.length; i++) {
      const d1 = new Date(allEvents[i].start);
      const d2 = new Date(newEvent.start);
      const d3 = new Date(allEvents[i].end);
      const d4 = new Date(newEvent.end);

      if ((d1 <= d2 && d2 <= d3) || (d1 <= d4 && d4 <= d3)) {
        return true; // Clash detected
      }
    }
    return false; // No clash detected
  }

  return (
    <>
      {/* TODO separate calendar view and add event view into separate components */}
      <div className="calendar">
        <h1>Admin panel 2023/2024 Calendar</h1>
        <h2>Add Key Dates👇</h2>

        <div>
          <input
            type="text"
            placeholder="Add Sem start, Reading week, etc."
            style={{ width: '20%', marginRight: '10px' }}
            value={newEvent.title}
            onChange={(e) =>
              setNewEvent({ ...newEvent, title: e.target.value })
            }
          />
          {/* DatePickers need to be in their own <div> or else there is unexpected overlapping in modal style */}
          <div className="datePickerContainer">
            <DatePicker
              placeholderText="Start Date"
              selected={newEvent.start}
              onChange={(start: Date) => setNewEvent({ ...newEvent, start })}
            />
          </div>
          <div className="datePickerContainer">
            <DatePicker
              placeholderText="End Date"
              selected={newEvent.end}
              onChange={(end: Date) => setNewEvent({ ...newEvent, end })}
            />
          </div>
          <button style={{ marginTop: '10px' }} onClick={handleAddEvent}>
            Add Event
          </button>
        </div>

        <Calendar
          localizer={localizer}
          events={allEvents}
          views={['month', 'week', 'day']}
          defaultView="month"
          startAccessor="start"
          endAccessor="end"
          style={{
            height: 800,
            marginLeft: '50px',
            marginRight: '50px',
            marginTop: '20px',
            marginBottom: '20px',
          }}
        />
      </div>
    </>
  );
}

export default CalendarView;
