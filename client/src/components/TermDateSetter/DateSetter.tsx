import axios from 'axios';
import format from 'date-fns/format';
import getDay from 'date-fns/getDay';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import DatePicker from 'react-datepicker';
import Modal from './Modal'; // Import the Modal component
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-datepicker/dist/react-datepicker.css';
import './DateSetter.css';

interface Event {
  _id?: string;
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
}

const locales = {
  // require not defined
  //   'en-US': require('date-fns/locale/en-US'),
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

// TODO: add data to centralised database
// TODO: (MAYBE) make input take input like 'week 1 thursday' and auto populate the date (maybe natural language processing)
// TODO: (LOW PRIORITY) push all date pickers in .datePickerContainer divs because this prevents the overlap in UI bug
// TODO: (LOW PRIORITY) make it so that events can be added by clicking on a date on the calendar too

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
  const [events, setEvents] = useState<Event[]>(eventsOnCalendar);

  const [fetchedItems, setFetchedItems] = useState<Event[]>([]);
  // fetch events from the server and set the events state
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('http://localhost:8000/');
      const data = await res.json();
      setFetchedItems(data);
    };
    fetchData();
  }, []);

  // This adds the fetched items to existing events
  // // Update events state when fetchedItems change
  // useEffect(() => {
  //   const localNewEvents = fetchedItems.map((item: Event) => {
  //     return {
  //       title: item.title,
  //       start: new Date(item.start),
  //       end: new Date(item.end),
  //       allDay: item.allDay,
  //     };
  //   });

  //   setEvents((prevEvents) => [...prevEvents, ...localNewEvents]); // Update events here
  // }, [fetchedItems]); // Add fetchedItems to dependency array

  // This replaces the existing events with the fetched items so only events from the server are displayed
  // Update events state with fetched items
  useEffect(() => {
    const localNewEvents = fetchedItems.map((item: Event) => ({
      title: item.title,
      start: new Date(item.start),
      end: new Date(item.end),
      allDay: item.allDay,
    }));
    setEvents(localNewEvents); // Update events directly with fetched items
  }, [fetchedItems]);

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

  // Function to add event to MongoDB via API
  const addEventToMongoDB = (event: Event) => {
    axios
      .post('http://localhost:8000/add-event', event)
      .then((res) => {
        console.log('Event added to MongoDB: ', res);
      })
      .catch((err) => {
        console.error('Error adding event to MongoDB: ', err);
      });
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
    console.log('Events: ', events);

    // Add event to MongoDB
    addEventToMongoDB(event);
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
      console.log('Events: ', events);
    }
    // add the new event to the events array
    else {
      setEvents([...events, updatedEvent]);
      console.log('Events: ', events);
    }
    // reset modal state
    setShowModal(false);
  }

  function deleteEvents() {
    if (selectEvent) {
      const newEvents = events.filter((event) => event !== selectEvent);
      setEvents(newEvents);
      console.log('Events: ', events);
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
          <h1 className="mb-4">Academic Calendar</h1>
          {/* <h3>Admin sets key dates here</h3> */}
          {/* Input field for adding semester 1 start date */}
          <div className="formInput">
            <span>Semester 1 Start Date: </span>
            <div className="d-inline">
              <DatePicker
                dateFormat="dd/MM/yyyy"
                placeholderText="Start Date"
                selected={semester1Event.start}
                onChange={(start: Date) =>
                  // Set end date to start date because it's a one day event element
                  setSemester1Event({ ...semester1Event, start, end: start })
                }
              />
            </div>
            <button
              className="eventButton"
              onClick={() => handleAddEvent(semester1Event)}
            >
              Add Semester 1 Start Date
            </button>
          </div>

          {/* Input field for adding semester 2 start date */}
          <div className="formInput">
            <span>Semester 2 Start Date: </span>
            <div className="d-inline">
              <DatePicker
                dateFormat="dd/MM/yyyy"
                placeholderText="Start Date"
                selected={semester2Event.start}
                onChange={(start: Date) =>
                  // Set end date to start date because it's a one day event element
                  setSemester2Event({ ...semester2Event, start, end: start })
                }
              />
            </div>
            <button
              className="eventButton"
              onClick={() => handleAddEvent(semester2Event)}
            >
              Add Semester 2 Start Date
            </button>
          </div>
          <div>
            <span>Add bank holiday: </span>

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
            <div className="datePickers">
              <span>Start date: </span>
              <div className="d-inline">
                <DatePicker
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Add Holiday"
                  selected={holidayEvent.start}
                  onChange={(start: Date) =>
                    setHolidayEvent({ ...holidayEvent, start })
                  }
                />
              </div>
            </div>
            <div className="datePickers">
              <span>End date: </span>
              <div className="d-inline">
                <DatePicker
                  dateFormat="dd/MM/yyyy"
                  placeholderText="End Date"
                  selected={holidayEvent.end}
                  onChange={(end: Date) =>
                    setHolidayEvent({ ...holidayEvent, end })
                  }
                />
              </div>
            </div>

            <button
              className="eventButton"
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

        <Modal
          eventTitle={eventTitle}
          showModal={showModal}
          selectEvent={selectEvent}
          newEvent={newEvent}
          selectedEventStartDate={selectedEventStartDate}
          selectedEventEndDate={selectedEventEndDate}
          setShowModal={setShowModal}
          setEventTitle={setEventTitle}
          setSelectEvent={setSelectEvent}
          setNewEvent={setNewEvent}
          saveEvent={saveEvent}
          deleteEvents={deleteEvents}
        />
      </div>
    </>
  );
}

export default DateSetter;
