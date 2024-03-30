import format from 'date-fns/format';
import getDay from 'date-fns/getDay';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import React, { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { AddToCalendarButton } from 'add-to-calendar-button-react';
import DatePicker from 'react-datepicker';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-datepicker/dist/react-datepicker.css';
import '../Calendar/CalendarView.css';

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

// TODO: make input take input like 'week 1 thursday' and auto populate the date
// TODO: fix styling (spacing of input form fields and buttons)
// TODO: add data to centralised database
// TODO: put show modal element in its own component so it can be rendered here and professor calendar view too
// TODO: change from DatePicker to mui date picker if that looks better (tried mui, the documentation is terrible and not worth it)
// TODO: push all date pickers in .datePickerContainer divs because this prevents the overlap in UI bug
// TODO: change color of bank holidays fetched from api (big react calendar doesn't have props for this, need to use css)

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

  const [newEvent, setNewEvent] = useState({
    title: '',
    allDay: true,
    start: new Date(),
    end: new Date(),
  });

  // state that will be used to render the calendar
  const [events, setEvents] = useState(eventsOnCalendar);

  const [showModal, setShowModal] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [selectEvent, setSelectEvent] = useState<Event | null>(null);

  // state to store the start and end dates of the selected event
  const [selectedEventStartDate, setSelectedEventStartDate] = useState<Date>(
    new Date(),
  );

  const [selectedEventEndDate, setSelectedEventEndDate] = useState<Date>(
    new Date(),
  );

  // Function to format date to "YYYY-MM-DD" format
  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Adding 1 because months are zero-indexed
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleAddEvent = (event: Event) => {
    // if the event is semester 1 or semester 2, hardcode the title to be 'Semester 1' or 'Semester 2'
    if (event.title === semester1Event.title) {
      event.title = 'Semester 1 Start Date';
    } else if (event.title === semester2Event.title) {
      event.title = 'Semester 2 Start Date';
    }

    const clashDetected = checkClash(event, events);

    if (clashDetected) {
      //   alert('Clash with another event detected');
    }
    // add new event to the calendar even if there is a clash
    setEvents([...events, event]);
  };

  // called when a user clicks on a calendar slot
  function handleSelectSlot(slotInfo: { start: Date; end: Date }) {
    setNewEvent({
      title: '',
      allDay: true,
      start: slotInfo.start,
      end: slotInfo.end,
    });
    setShowModal(true);
  }

  // called when a user clicks on an existing event
  function handleSelectedEvent(event: Event) {
    setEventTitle(event.title);
    setNewEvent(event);
    setSelectEvent(event);
    setShowModal(true);
    // Set the selected event start and end dates for the add to calendar button
    setSelectedEventStartDate(event.start);
    setSelectedEventEndDate(event.end);
  }

  // called when a user clicks save on the modal
  function saveEvent() {
    // Combine new event properties with its title
    const updatedEvent = { ...newEvent, title: eventTitle };

    // check if there is a clash only if saving a new event not editing an existing event
    if (!selectEvent && checkClash(updatedEvent, events)) {
      alert('Clash with another event');
    }

    // update the events array with the new event
    if (selectEvent) {
      const newEvents = events.map((event) =>
        event === selectEvent ? updatedEvent : event,
      );
      setEvents(newEvents);
    }
    // add the new event to the events array
    else {
      setEvents([...events, updatedEvent]);
    }
    // reset modal state
    setShowModal(false);
  }

  function deleteEvents() {
    if (selectEvent) {
      const newEvents = events.filter((event) => event !== selectEvent);
      setEvents(newEvents);
      setShowModal(false);
    }
  }

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

  // fetch bank holidays from api and add to calendar
  useEffect(() => {
    fetch('https://www.gov.uk/bank-holidays.json')
      .then((response) => response.json())
      .then((data) => {
        const bankHolidays = data['england-and-wales'].events;
        setEvents((prevEvents) => {
          // Filter out duplicate bank holidays
          const uniqueBankHolidays = bankHolidays.filter(
            (holiday: { date: string }) => {
              const holidayDate = new Date(holiday.date).toISOString();
              return !prevEvents.some(
                (event) => event.start.toISOString() === holidayDate,
              );
            },
          );
          // Merge unique bank holidays with previous events
          return [
            ...prevEvents,
            ...uniqueBankHolidays.map(
              (holiday: { title: string; date: string }) => ({
                title: holiday.title,
                start: new Date(holiday.date),
                end: new Date(holiday.date),
                allDay: true,
              }),
            ),
          ];
        });
      })
      .catch((error) => {
        console.error('Error fetching bank holidays: ', error);
      });
  }, []);

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
              dateFormat="dd/MM/yyyy"
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
              dateFormat="dd/MM/yyyy"
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
              dateFormat="dd/MM/yyyy"
              placeholderText="Add Holiday"
              selected={holidayEvent.start}
              onChange={(start: Date) =>
                setHolidayEvent({ ...holidayEvent, start })
              }
            />
            <DatePicker
              dateFormat="dd/MM/yyyy"
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

        {/* divider */}
        <hr className="rounded"></hr>

        {/* Calendar View */}
        <Calendar
          localizer={localizer}
          events={events}
          views={['month', 'week', 'day']}
          defaultView="month"
          startAccessor="start"
          endAccessor="end"
          // selectable={true} // this is being able to select a date (not an event)
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectedEvent}
          style={{
            height: 800,
            marginLeft: '50px',
            marginRight: '50px',
            marginTop: '20px',
            marginBottom: '20px',
          }}
        />

        {showModal && (
          <div
            className="modal"
            style={{
              display: 'block',
              backgroundColor: 'rgba(0,0,0,0.5)',
              position: 'fixed',
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
            }}
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    {selectEvent ? 'Edit key date' : 'Add key date'}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => {
                      setShowModal(false);
                      setEventTitle('');
                      setSelectEvent(null);
                    }}
                  ></button>
                </div>
                <div className="modal-body">
                  <label htmlFor="eventTitle" className="form-label">
                    Event Title:
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="eventTitle"
                    value={eventTitle}
                    onChange={(e) => setEventTitle(e.target.value)}
                  />
                  {/* DatePickers need to be in their own <div> or else there is unexpected overlapping in modal style */}
                  <div className="datePickerContainer">
                    <DatePicker
                      dateFormat="dd/MM/yyyy"
                      placeholderText="Start Date"
                      selected={newEvent.start}
                      onChange={(start: Date) =>
                        setNewEvent({ ...newEvent, start })
                      }
                    />
                  </div>
                  <div className="datePickerContainer">
                    <DatePicker
                      dateFormat="dd/MM/yyyy"
                      placeholderText="End Date"
                      selected={newEvent.end}
                      onChange={(end: Date) =>
                        setNewEvent({ ...newEvent, end })
                      }
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  {/* new add to calendar button but this one dynamically gets date and event name */}
                  <AddToCalendarButton
                    name={eventTitle + ' (Added from SWEAT)'}
                    options={['Apple', 'Google', 'Outlook.com']}
                    location="World Wide Web"
                    startDate={formatDate(selectedEventStartDate)}
                    endDate={formatDate(selectedEventEndDate)}
                    timeZone="Europe/London"
                  ></AddToCalendarButton>

                  {/* Delete and save buttons */}
                  {selectEvent && (
                    <button
                      type="button"
                      className="btn btn-danger me-2"
                      onClick={deleteEvents}
                    >
                      Delete Event
                    </button>
                  )}
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={saveEvent}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default DateSetter;
