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
import EditTermDateModal from './EditTermDateModal';
import { CalendarKeyDateEvent } from '../shared/types/';

const locales = {};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const eventsOnCalendar: CalendarKeyDateEvent[] = [];

const baseURL = import.meta.env.VITE_API_BASE_URL;

// Add all to calendar does not work because it will open a new tab with the calendar event for each event
// TODO: move the bank holidays fetching func to a separate file
// TODO: move code to respective components
// TODO: (MAYBE) make input take input like 'week 1 thursday' and auto populate the date (maybe natural language processing package)

function DateSetter() {
  const [course, setCourse] = useState('CS'); // State for selected course
  const [readingWeekStart, setReadingWeekStart] = useState(new Date());
  const [readingWeekEnd, setReadingWeekEnd] = useState(new Date());

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

  const [easterBreakEvent, setEasterBreakEvent] = useState({
    title: 'Easter Break',
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
      const res = await fetch(baseURL);
      const data = await res.json();

      // Search for events with titles "Semester 1 Start Date" and "Semester 2 Start Date"
      const semester1StartDateEvent = data.find((event: CalendarKeyDateEvent) =>
        event.title.includes('Semester 1 Start Date'),
      );
      const semester2StartDateEvent = data.find((event: CalendarKeyDateEvent) =>
        event.title.includes('Semester 2 Start Date'),
      );

      // Log the dates of these events and assign them to global variables
      if (semester1StartDateEvent) {
        const sem1StartDate = semester1StartDateEvent.start;
        console.log('Sem 1 start date:', sem1StartDate);
      }
      if (semester2StartDateEvent) {
        const sem2StartDate = semester2StartDateEvent.start;
        console.log('Sem 2 start date:', sem2StartDate);
      }

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

    // Filter out "Reading Week" event if the course is CS
    const filteredEvents =
      course === 'CS'
        ? localNewEvents.filter((event) => event.title !== 'Reading Week')
        : localNewEvents;

    setEvents((prevEvents) => {
      // Filter out events that already exist in the events array
      const uniqueNewEvents = filteredEvents.filter((newEvent) =>
        prevEvents.every((existingEvent) => existingEvent._id !== newEvent._id),
      );

      // Concatenate unique new events with existing events
      const updatedEvents = [...prevEvents, ...uniqueNewEvents];

      // If switching from EE to CS, remove the Reading Week event locally
      if (course === 'CS') {
        return updatedEvents.filter((event) => event.title !== 'Reading Week');
      }

      // Concatenate unique new events with existing events
      return [...prevEvents, ...uniqueNewEvents];
    });
  }, [fetchedItems, course]);

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

  const handleAddEasterBreak = () => {
    // Check that both start and end dates are selected
    if (!easterBreakEvent.start || !easterBreakEvent.end) {
      toast('Please select both start and end dates for the Easter break');
      return;
    }

    // Make sure start date is before end date
    if (easterBreakEvent.start >= easterBreakEvent.end) {
      toast('Easter break start date must be before end date');
      return;
    }

    // Add the Easter break event
    handleAddEvent(easterBreakEvent);

    // Reset the Easter break input fields
    setEasterBreakEvent({
      title: 'Easter Break',
      allDay: true,
      start: new Date(),
      end: new Date(),
    });
  };

  // Function to handle course selection
  const handleCourseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCourse = e.target.value;
    setCourse(selectedCourse);
  };

  const getSemesterWeekNumber = (
    date: Date,
    sem1Start: Date,
    sem2Start: Date,
  ) => {
    console.log('Semester 1 start date:', semester1Event.start);
    console.log('Semester 2 start date:', semester2Event.start);
    console.log('Date:', date);

    // TODO: get the semester start dates from the database

    const semester1StartDate = sem1Start;
    const semester2StartDate = sem2Start;

    // Check if the date is in semester 1
    if (date >= semester1StartDate && date < semester2StartDate) {
      console.log('Date is in semester 1');
      // Calculate the difference in milliseconds between the date and the semester 1 start date
      const millisecondsDifference =
        date.getTime() - semester1StartDate.getTime();

      // Calculate the number of full weeks elapsed
      const fullWeeksElapsed = Math.floor(
        millisecondsDifference / (7 * 24 * 60 * 60 * 1000),
      );

      // Add 1 to start counting from week 1
      const weekNumber = fullWeeksElapsed + 1;

      return weekNumber;
    }

    // Check if the date is in semester 2
    if (date >= semester2StartDate) {
      console.log('Date is in semester 2');
      // Calculate the difference in milliseconds between the date and the semester 2 start date
      const millisecondsDifference =
        date.getTime() - semester2StartDate.getTime();

      // Calculate the number of full weeks elapsed
      const fullWeeksElapsed = Math.floor(
        millisecondsDifference / (7 * 24 * 60 * 60 * 1000),
      );

      // Add 1 to start counting from week 1
      const weekNumber = fullWeeksElapsed + 1;

      return weekNumber;
    }

    return 0;
  };

  // Called when the user clicks the add event button (for semester start dates and holidays)
  const handleAddEvent = (event: CalendarKeyDateEvent) => {
    // check that event title is not empty (so bank holidays can't be added without a title)
    if (!event.title) {
      toast('Please enter a name for the date');
      return;
    }

    // Calculate week number based on difference between event start date and Semester 1 start date
    const weekNumber = getSemesterWeekNumber(
      event.start,
      semester1Event.start,
      semester2Event.start,
    );

    // Add week number to the event title
    event.title += ` (Week ${weekNumber})`;

    // Check for clashes with existing events and warn user
    const clashDetected = checkClash(event, events);

    // Make POST request to add the event to MongoDB
    axios
      .post(baseURL + 'add-event', event)
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
        .delete(baseURL + `delete-event/${selectEvent._id}`)
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
        .put(baseURL + `update-event/${selectEvent._id}`, updatedEvent)
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
          {/* Dropdown for selecting course */}
          <span>Select Course: </span>
          <select className="mb-4" value={course} onChange={handleCourseChange}>
            <option value="CS">CS</option>
            <option value="EE">EE</option>
          </select>

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
          <hr className="lightRounded"></hr>
          <div>
            <div className="datePickers">
              <span>Easter start date: </span>
              <div className="d-inline">
                <DatePicker
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Start Date"
                  selected={easterBreakEvent.start}
                  onChange={(start: Date) =>
                    setEasterBreakEvent({ ...easterBreakEvent, start })
                  }
                />
              </div>
            </div>
            <div className="datePickers">
              <span>Easter end date: </span>
              <div className="d-inline">
                <DatePicker
                  dateFormat="dd/MM/yyyy"
                  placeholderText="End Date"
                  selected={easterBreakEvent.end}
                  onChange={(end: Date) =>
                    setEasterBreakEvent({ ...easterBreakEvent, end })
                  }
                />
              </div>
            </div>
            <button className="eventButton mb-2" onClick={handleAddEasterBreak}>
              Add Easter Break
            </button>
          </div>

          {/* Easter break section with conditional rendering */}
          {course === 'EE' && (
            <>
              <hr className="lightRounded"></hr>
              <div>
                <div className="datePickers">
                  <span>Reading Week Start Date: </span>
                  <div className="d-inline">
                    <DatePicker
                      dateFormat="dd/MM/yyyy"
                      placeholderText="Start Date"
                      selected={readingWeekStart}
                      onChange={(start: Date) => setReadingWeekStart(start)}
                    />
                  </div>
                </div>
                <div className="datePickers">
                  <span>Reading Week End Date: </span>
                  <div className="d-inline">
                    <DatePicker
                      dateFormat="dd/MM/yyyy"
                      placeholderText="End Date"
                      selected={readingWeekEnd}
                      onChange={(end: Date) => setReadingWeekEnd(end)}
                    />
                  </div>
                </div>
                <button
                  className="eventButton"
                  onClick={() =>
                    handleAddEvent({
                      title: 'Reading Week',
                      allDay: true,
                      start: readingWeekStart,
                      end: readingWeekEnd,
                    })
                  }
                >
                  Add Reading Week
                </button>
              </div>
            </>
          )}

          <hr className="lightRounded"></hr>

          {/* Input field for adding holidays */}
          <div>
            <span>Add holiday: </span>
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

        {/* delete all events from mongodb */}
        <button
          className="eventButton"
          onClick={() => {
            axios
              .delete(baseURL + 'delete-all-events')
              .then((res: { data: CalendarKeyDateEvent }) => {
                console.log('All events deleted from MongoDB');
                console.log(res);
              })
              .catch((err: { data: CalendarKeyDateEvent }) => {
                console.error('Error deleting all events from MongoDB: ', err);
              });

            setEvents([]); // Update local state to reflect the event deletion
            toast('All events deleted');
          }}
        >
          Delete All Events
        </button>

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
          // selectable={true} // this is being able to select a date slot (not event)
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

        <EditTermDateModal
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
