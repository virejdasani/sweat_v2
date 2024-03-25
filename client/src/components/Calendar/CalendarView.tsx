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
    title: 'Easter break',
    allDay: true,
    start: new Date(2024, 2, 22),
    end: new Date(2024, 3, 15),
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

  // hardcoded state that will be used to render the calendar
  const [events, setEvents] = useState(eventsOnCalendar);

  const [showModal, setShowModal] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [selectEvent, setSelectEvent] = useState<Event | null>(null);

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

  // checks for clash with another event (overlap on the calendar)
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
      <div className="calendar">
        <div className="calendarHeader">
          <h1>Admin panel 2023/2024 Calendar</h1>
          <h4>Click on a date to add an event</h4>
        </div>

        <Calendar
          localizer={localizer}
          events={events}
          views={['month', 'week', 'day']}
          defaultView="month"
          startAccessor="start"
          endAccessor="end"
          selectable={true}
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
                    {/* TODO: change to dd/mm instead of mm/dd */}
                    <DatePicker
                      placeholderText="Start Date"
                      selected={newEvent.start}
                      onChange={(start: Date) =>
                        setNewEvent({ ...newEvent, start })
                      }
                    />
                  </div>
                  <div className="datePickerContainer">
                    <DatePicker
                      placeholderText="End Date"
                      selected={newEvent.end}
                      onChange={(end: Date) =>
                        setNewEvent({ ...newEvent, end })
                      }
                    />
                  </div>
                </div>
                <div className="modal-footer">
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

export default CalendarView;
