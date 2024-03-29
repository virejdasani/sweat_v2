import format from 'date-fns/format';
import getDay from 'date-fns/getDay';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import React, { useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import DatePicker from 'react-datepicker';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-datepicker/dist/react-datepicker.css';
import '../Calendar/CalendarView.css';
// import { Dropdown } from 'react-bootstrap';
// import Form from 'react-bootstrap/Form';

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

function DateSetter() {
  const [holidayEvent, setHolidayEvent] = useState({
    title: '',
    allDay: true,
    start: new Date(),
    end: new Date(),
  });

  const [semester1Event, setSemester1Event] = useState({
    title: '',
    allDay: true,
    start: new Date(),
    end: new Date(),
  });

  const [semester2Event, setSemester2Event] = useState({
    title: '',
    allDay: true,
    start: new Date(),
    end: new Date(),
  });

  const [allEvents, setAllEvents] = useState(eventsOnCalendar);

  const handleAddEvent = (event: Event) => {
    // if the event is semester 1 or semester 2, hardcode the title to be 'Semester 1' or 'Semester 2'
    if (event.title === semester1Event.title) {
      event.title = 'Semester 1 Start Date';
    } else if (event.title === semester2Event.title) {
      event.title = 'Semester 2 Start Date';
    }

    const clashDetected = checkClash(event, allEvents);

    if (clashDetected) {
      //   alert('Clash with another event detected');
    }
    // add new event to the calendar even if there is a clash
    setAllEvents([...allEvents, event]);
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

  // TODO: auto bank holidays add
  // TODO: click on event to CRUD
  return (
    <>
      <div className="calendar">
        <div className="calendarHeader">
          <h1>Academic Calendar</h1>
          <h3>Admin sets key dates here</h3>
          {/* Input field for adding semester 1 start date */}
          <div>
            <span>Semester 1 Start Date: </span>
            <DatePicker
              placeholderText="Start Date"
              selected={semester1Event.start}
              onChange={
                (start: Date) =>
                  setSemester1Event({ ...semester1Event, start, end: start }) // Set end date to start date
              }
            />
            <button
              style={{ marginTop: '10px' }}
              onClick={() => handleAddEvent(semester1Event)}
            >
              Add Semester 1 Start Date
            </button>
          </div>

          {/* Input field for adding semester 2 start date */}
          <div>
            <span>Semester 2 Start Date: </span>
            <DatePicker
              placeholderText="Start Date"
              selected={semester2Event.start}
              onChange={
                (start: Date) =>
                  setSemester2Event({ ...semester2Event, start, end: start }) // Set end date to start date
              }
            />
            <button
              style={{ marginTop: '10px' }}
              onClick={() => handleAddEvent(semester2Event)}
            >
              Add Semester 2 Start Date
            </button>
          </div>
          <div>
            <span>Add bank holiday(s): </span>

            {/* Input field for adding holidays */}
            <input
              type="text"
              placeholder="Bank holiday name"
              style={{ width: '20%', marginRight: '10px' }}
              value={holidayEvent.title}
              onChange={(e) =>
                setHolidayEvent({ ...holidayEvent, title: e.target.value })
              }
            />

            <DatePicker
              placeholderText="Add Holiday"
              selected={holidayEvent.start}
              onChange={(start: Date) =>
                setHolidayEvent({ ...holidayEvent, start })
              }
            />
            <DatePicker
              placeholderText="End Date"
              selected={holidayEvent.end}
              onChange={(end: Date) =>
                setHolidayEvent({ ...holidayEvent, end })
              }
            />
            <button
              style={{ marginTop: '10px' }}
              onClick={() => handleAddEvent(holidayEvent)}
            >
              Add Holiday
            </button>
          </div>
        </div>

        <hr className="rounded"></hr>

        {/* Calendar View */}
        <Calendar
          localizer={localizer}
          events={allEvents}
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

export default DateSetter;
