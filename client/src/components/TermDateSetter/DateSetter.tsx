import axios from 'axios';
import format from 'date-fns/format';
import getDay from 'date-fns/getDay';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import DatePicker from 'react-datepicker';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-datepicker/dist/react-datepicker.css';
import './DateSetter.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'awesome-notifications/dist/style.css';
import Modal from './Modal';
import { CalendarKeyDateEvent } from '../shared/types/';

const locales = {};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const eventsOnCalendar: CalendarKeyDateEvent[] = [
  // note: months are 0 indexed, days are 1 indexed
  // note: end date is 11:59pm of the day before the end date
  // {
  //   title: 'COMP222 Assignment 1',
  //   allDay: true,
  //   start: new Date(2024, 2, 6),
  //   end: new Date(2024, 2, 10),
  // },
];

// TODO: move the bank holidays fetching func to a separate file
// TODO: move code to respective components
// TODO: (MAYBE) make input take input like 'week 1 thursday' and auto populate the date (maybe natural language processing package)

function DateSetter() {
  const [holidayEvent, setHolidayEvent] = useState({
    title: '',
    allDay: true,
    start: new Date(),
    end: new Date(),
  });

  const [semester1Event, setSemester1Event] = useState({
    title: 'Semester 1 Start Date', // hardcoded to prevent changing the title to anything else
    allDay: true,
    start: new Date(),
    end: new Date(),
  });

  const [semester2Event, setSemester2Event] = useState({
    title: 'Semester 2 Start Date', // hardcoded to prevent changing the title to anything else
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
  const [events, setEvents] =
    useState<CalendarKeyDateEvent[]>(eventsOnCalendar);

  const [fetchedItems, setFetchedItems] = useState<CalendarKeyDateEvent[]>([]);
  // fetch events from the server and set the events state
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('http://localhost:8000/');
      const data = await res.json();
      setFetchedItems(data);
      console.log('Fetched items: ', data);
    };
    fetchData();
  }, []);

  // this if we want to keep the fetched bank holidays stored only locally (not in MongoDB)
  // Add the fetched items to existing events
  useEffect(() => {
    const localNewEvents = fetchedItems.map((item: CalendarKeyDateEvent) => ({
      _id: item._id,
      title: item.title,
      start: new Date(item.start),
      end: new Date(item.end),
      allDay: item.allDay,
    }));

    setEvents((prevEvents) => {
      // Filter out events that already exist in the events array
      const uniqueNewEvents = localNewEvents.filter((newEvent) =>
        prevEvents.every((existingEvent) => existingEvent._id !== newEvent._id),
      );

      // Concatenate unique new events with existing events
      return [...prevEvents, ...uniqueNewEvents];
    });
  }, [fetchedItems]);

  // this is if we have added all bank holidays to MongoDB
  // this replaces the existing events with the fetched items so only events from the server are displayed
  // Update events state with fetched items
  // useEffect(() => {
  //   const localNewEvents = fetchedItems.map((item: CalendarKeyDateEvent) => ({
  //     _id: item._id,
  //     title: item.title,
  //     start: new Date(item.start),
  //     end: new Date(item.end),
  //     allDay: item.allDay,
  //   }));
  //   setEvents(localNewEvents); // Update events directly with fetched items
  // }, [fetchedItems]);

  const [showModal, setShowModal] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [selectEvent, setSelectEvent] = useState<CalendarKeyDateEvent | null>(
    null,
  );

  // state to store the start and end dates of the selected event
  const [selectedEventStartDate, setSelectedEventStartDate] = useState<Date>(
    new Date(),
  );

  const [selectedEventEndDate, setSelectedEventEndDate] = useState<Date>(
    new Date(),
  );

  // Called when the user clicks the add event button (for semester start dates and holidays)
  const handleAddEvent = (event: CalendarKeyDateEvent) => {
    // check that event title is not empty (so bank holidays can't be added without a title)
    if (!event.title) {
      toast('Please enter a name for the date');
      return;
    }

    // Check for clashes with existing events and warn user
    const clashDetected = checkClash(event, events);

    // Make POST request to add the event to MongoDB
    axios
      .post('http://localhost:8000/add-event', event)
      .then((res: { data: CalendarKeyDateEvent }) => {
        console.log('Event added to MongoDB: ', event);
        console.log(res);

        // Update the event with the _id returned from MongoDB locally, to allow deletion without refreshing the page
        const newEvent = { ...event, _id: res.data._id };
        // Add the new event to the events array in the local state
        setEvents([...events, newEvent]);
      })
      .catch((err: { data: CalendarKeyDateEvent }) => {
        console.error('Error adding event to MongoDB: ', err);
      });

    // Add the new event to the calendar even if there is a clash
    setEvents([...events, event]);

    if (clashDetected) {
      toast('Clash with another event detected'); // warning
    }

    toast(event.title + ' added');
  };

  // deletes from mongodb and updates the events state locally
  function deleteEvents() {
    if (selectEvent) {
      // Make DELETE request to backend API endpoint to delete the event from MongoDB
      axios
        .delete(`http://localhost:8000/delete-event/${selectEvent._id}`)
        .then((res: { data: CalendarKeyDateEvent }) => {
          console.log('Event deleted from MongoDB: ', selectEvent);
          console.log(res);
        })
        .catch((err: { data: CalendarKeyDateEvent }) => {
          console.error('Error deleting event from MongoDB: ', err);
        });

      // Update local state to reflect the event deletion
      const newEvents = events.filter((event) => event !== selectEvent);
      setEvents(newEvents);
      setShowModal(false);

      toast(selectEvent.title + ' deleted');
    }
  }

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
  function handleSelectedEvent(event: CalendarKeyDateEvent) {
    // Prevent editing or deleting bank holidays
    // Bank holidays have '(BH)' in their title
    // an alternative way to check if it's a bank holiday is to check if the event has an _id because only mongodb events have an _id
    if (event.title.includes('(BH)')) {
      toast('Bank holidays cannot be edited or deleted'); // alert
      return;
    }

    setEventTitle(event.title);
    setNewEvent(event);
    setSelectEvent(event);
    setShowModal(true);
    // Set the selected event start and end dates for the add to calendar button
    setSelectedEventStartDate(event.start);
    setSelectedEventEndDate(event.end);
  }

  // called when a user clicks save on the modal
  // this function also has support for adding events by clicking on a calendar slot and editing events by clicking on an existing event
  function saveEvent() {
    // Check if the event title is empty
    if (!eventTitle) {
      toast('Please enter a title for the event');
      return;
    }

    // Combine new event properties with its title
    const updatedEvent = { ...newEvent, title: eventTitle };

    // check if there is a clash only if saving a new event not editing an existing event
    if (!selectEvent && checkClash(updatedEvent, events)) {
      toast('Clash with another event');
    }

    // If it's an existing event (selectEvent is defined), update the event
    if (selectEvent) {
      // Make PUT request to update the event in MongoDB
      axios
        .put(
          `http://localhost:8000/update-event/${selectEvent._id}`,
          updatedEvent,
        )
        .then((res: { data: CalendarKeyDateEvent }) => {
          console.log('Event updated in MongoDB: ', updatedEvent);
          console.log(res);
        })
        .catch((err: { data: CalendarKeyDateEvent }) => {
          console.error('Error updating event in MongoDB: ', err);
        });

      // Update the event in the local state
      const updatedEvents = events.map((event) =>
        event === selectEvent ? updatedEvent : event,
      );
      setEvents(updatedEvents);

      toast(eventTitle + ' updated');
    }
    // If it's a new event, add it to the events array
    else {
      setEvents([...events, updatedEvent]);
      console.log('Events: ', [...events, updatedEvent]);
    }

    // Reset modal state
    setShowModal(false);
  }

  function checkClash(
    newEvent: CalendarKeyDateEvent,
    allEvents: CalendarKeyDateEvent[],
  ): boolean {
    // Iterate over all existing events
    for (const event of allEvents) {
      // Extract the date part of the start and end times of the events
      const existingEventStartDate = new Date(event.start.setHours(0, 0, 0, 0));
      const existingEventEndDate = new Date(event.end.setHours(0, 0, 0, 0));
      const newEventStartDate = new Date(newEvent.start.setHours(0, 0, 0, 0));
      const newEventEndDate = new Date(newEvent.end.setHours(0, 0, 0, 0));

      // Check if the new event overlaps with the existing event
      if (
        (newEventStartDate >= existingEventStartDate &&
          newEventStartDate <= existingEventEndDate) || // New event starts during the existing event
        (newEventEndDate >= existingEventStartDate &&
          newEventEndDate <= existingEventEndDate) || // New event ends during the existing event
        (newEventStartDate <= existingEventStartDate &&
          newEventEndDate >= existingEventEndDate) // New event spans the entire existing event
      ) {
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
                title: '(BH) ' + holiday.title,
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
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
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
            <span>Add holiday: </span>

            {/* Input field for adding holidays */}
            <input
              type="text"
              placeholder="Holiday name"
              style={{ width: '20%', marginRight: '10px' }}
              value={holidayEvent.title}
              onChange={(e) =>
                setHolidayEvent({ ...holidayEvent, title: e.target.value })
              }
            />
            <div className="datePickers">
              <span>Holiday start date: </span>
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
              <span>Holiday end date: </span>
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
