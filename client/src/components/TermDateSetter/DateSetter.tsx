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

function DateSetter() {
  // course CS means no reading week, EE means reading week.
  // This is used to filter out reading week events, but this distinction is not shown to the user, they can just select yes or no for reading week
  const [course, setCourse] = useState('CS'); // State for selected course

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

  const [christmasBreakEvent, setChristmasBreakEvent] = useState({
    title: 'Christmas Break',
    allDay: true,
    start: new Date(),
    end: new Date(),
  });

  const [readingWeekEvent, setReadingWeekEvent] = useState({
    title: 'Reading Week',
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

      // Extract semester start dates
      let semester1Start: Date | null = null;
      let semester2Start: Date | null = null;
      if (semester1StartDateEvent) {
        semester1Start = new Date(semester1StartDateEvent.start);
      }
      if (semester2StartDateEvent) {
        semester2Start = new Date(semester2StartDateEvent.start);
      }

      // Log the dates of these events and assign them to global variables
      if (semester1Start) {
        console.log('Semester 1 start date:', semester1Start);
        setSemester1Event({
          ...semester1Event,
          start: semester1Start,
        });
      } else {
        console.log('Semester 1 start date not found');
      }
      if (semester2Start) {
        console.log('Semester 2 start date:', semester2Start);
        setSemester2Event({
          ...semester2Event,
          start: semester2Start,
        });
      } else {
        console.log('Semester 2 start date not found');
      }

      // extract easter start and end dates
      const easterBreakEvent = data.find((event: CalendarKeyDateEvent) =>
        event.title.includes('Easter Break'),
      );

      if (easterBreakEvent) {
        console.log('Easter break start date:', easterBreakEvent.start);
        console.log('Easter break end date:', easterBreakEvent.end);
        setEasterBreakEvent({
          ...easterBreakEvent,
          start: new Date(easterBreakEvent.start),
          end: new Date(easterBreakEvent.end),
        });
      }

      // extract christmas start and end dates
      const christmasBreakEvent = data.find((event: CalendarKeyDateEvent) =>
        event.title.includes('Christmas Break'),
      );

      if (christmasBreakEvent) {
        console.log('Christmas break start date:', christmasBreakEvent.start);
        console.log('Christmas break end date:', christmasBreakEvent.end);
        setChristmasBreakEvent({
          ...christmasBreakEvent,
          start: new Date(christmasBreakEvent.start),
          end: new Date(christmasBreakEvent.end),
        });
      }

      // extract reading week start and end dates
      const readingWeekEvent = data.find((event: CalendarKeyDateEvent) =>
        event.title.includes('Reading Week'),
      );

      if (readingWeekEvent) {
        console.log('Reading week start date:', readingWeekEvent.start);
        console.log('Reading week end date:', readingWeekEvent.end);
        setReadingWeekEvent({
          ...readingWeekEvent,
          start: new Date(readingWeekEvent.start),
          end: new Date(readingWeekEvent.end),
        });
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
        ? localNewEvents.filter(
            (event) => !event.title.includes('Reading Week'),
          )
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
        return updatedEvents.filter(
          (event) => !event.title.includes('Reading Week'),
        );
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

  const handleAddChristmasBreak = () => {
    if (!christmasBreakEvent.start || !christmasBreakEvent.end) {
      toast('Please select both start and end dates for the Christmas break');
      return;
    }
    if (christmasBreakEvent.start >= christmasBreakEvent.end) {
      toast('Christmas break start date must be before end date');
      return;
    }
    handleAddEvent(christmasBreakEvent);
    setChristmasBreakEvent({
      title: 'Christmas Break',
      allDay: true,
      start: new Date(),
      end: new Date(),
    });
  };

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
    easterBreakStart: Date,
    easterBreakEnd: Date,
    christmasBreakStart: Date,
    christmasBreakEnd: Date,
  ) => {
    console.log('Date:', date);

    const semester1StartDate = sem1Start;
    const semester2StartDate = sem2Start;
    const easterBreakStartDate = easterBreakStart;
    const easterBreakEndDate = easterBreakEnd;
    const christmasBreakStartDate = christmasBreakStart;
    const christmasBreakEndDate = christmasBreakEnd;

    // Calculate the difference in milliseconds between the date and the semester 1 start date
    const millisecondsDifferenceSem1 =
      date.getTime() - semester1StartDate.getTime();

    // Calculate the difference in milliseconds between the date and the semester 2 start date
    const millisecondsDifferenceSem2 =
      date.getTime() - semester2StartDate.getTime();

    // if date is semester 1
    if (date >= semester1StartDate && date < semester2StartDate) {
      console.log('Date is in semester 1');

      // Check if the date is in semester 1 and not in christmas break
      if (
        date >= semester1StartDate &&
        !(date >= christmasBreakStartDate && date <= christmasBreakEndDate)
      ) {
        console.log('Date is in semester 1, not in Christmas break');
        // Calculate the number of full weeks elapsed
        const fullWeeksElapsed = Math.floor(
          millisecondsDifferenceSem1 / (7 * 24 * 60 * 60 * 1000),
        );

        console.log('weeks elapsed: ' + fullWeeksElapsed);

        // Add 1 to start counting from week 1
        const weekNumber = fullWeeksElapsed + 1;

        // Subtract 3 to account for the Christmas break weeks
        if (date > christmasBreakEndDate) {
          return weekNumber - 3;
        }

        return weekNumber;
      }

      // calculate the number of days between the date and the christmas break start date
      // Math.ceil because daysDifference give numbers like 6.9 which should be 7
      const christmasDaysDifference = Math.ceil(
        (date.getTime() - christmasBreakStartDate.getTime()) /
          (24 * 60 * 60 * 1000),
      );

      console.log('Days difference:', christmasDaysDifference);

      // if date is in week 1 of christmas break
      if (christmasDaysDifference >= 0 && christmasDaysDifference < 7) {
        return 'C1';
      }

      // if date is in week 2 of christmas break
      if (christmasDaysDifference >= 7 && christmasDaysDifference < 14) {
        return 'C2';
      }

      // if date is in week 3 of christmas break

      if (christmasDaysDifference >= 14 && christmasDaysDifference < 21) {
        return 'C3';
      }
    }

    if (date >= semester2StartDate) {
      console.log('Date is in semester 2');

      // Check if the date is in semester 2 and not in Easter break
      if (
        date >= semester2StartDate &&
        !(date >= easterBreakStartDate && date <= easterBreakEndDate)
      ) {
        console.log('Date is in semester 2, not in Easter break');
        // Calculate the number of full weeks elapsed
        const fullWeeksElapsed = Math.floor(
          millisecondsDifferenceSem2 / (7 * 24 * 60 * 60 * 1000) + 0.01,
        );

        console.log('weeks elapsed: ' + fullWeeksElapsed);

        // Add 1 to start counting from week 1
        const weekNumber = fullWeeksElapsed + 1;

        // Subtract 3 to account for the Easter break weeks
        if (date > easterBreakEndDate) {
          return weekNumber - 3;
        }

        return weekNumber;
      }

      // Calculate the number of days between the date and the Easter break start date
      // Math.ceil because daysDifference give numbers like 6.9 which should be 7
      const easterDaysDifference = Math.ceil(
        (date.getTime() - easterBreakStartDate.getTime()) /
          (24 * 60 * 60 * 1000),
      );

      console.log('Days difference:', easterDaysDifference);

      // if date is in week 1 of Easter break
      if (easterDaysDifference >= 0 && easterDaysDifference < 7) {
        return 'E1';
      }

      // if date is in week 2 of Easter break
      if (easterDaysDifference >= 7 && easterDaysDifference < 14) {
        return 'E2';
      }

      // if date is in week 3 of Easter break
      if (easterDaysDifference >= 14 && easterDaysDifference < 21) {
        return 'E3';
      }
    }
  };

  // Called when the user clicks the add event button (for semester start dates and holidays)
  const handleAddEvent = (event: CalendarKeyDateEvent) => {
    // check that event title is not empty (so bank holidays can't be added without a title)
    if (!event.title) {
      toast('Please enter a name for the date');
      return;
    }

    event.start.setHours(0, 0, 0, 0);

    // Calculate week number based on difference between event start date and Semester 1 start date
    const weekNumber = getSemesterWeekNumber(
      event.start,
      semester1Event.start,
      semester2Event.start,
      easterBreakEvent.start,
      easterBreakEvent.end,
      christmasBreakEvent.start,
      christmasBreakEvent.end,
    );

    // when adding easter break, don't add week number to the title
    if (!event.title.includes('Easter Break')) {
      // Add week number to the event title
      event.title += ` (Week ${weekNumber})`;
    }

    // Check for clashes with existing events and warn user
    const clashDetected = checkClash(event, events);

    let posted = false;

    // Make POST request to add the event to MongoDB
    axios
      .post(baseURL + 'add-event', event)
      .then((res: { data: CalendarKeyDateEvent }) => {
        console.log('Event added to MongoDB: ', event);
        console.log(res);
        posted = true;

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

    // netlify breaks if we reload the page
    // if (posted) {
    //   // reload the page to show the new event
    //   window.location.reload();
    // } else {
    //   setTimeout(() => {
    //     window.location.reload();
    //   }, 1000);
    // }
  };

  // deletes from mongodb and updates the events state locally
  function deleteEvents() {
    if (selectEvent) {
      let deleted = false;

      // Make DELETE request to backend API endpoint to delete the event from MongoDB
      axios
        .delete(baseURL + `delete-event/${selectEvent._id}`)
        .then((res: { data: CalendarKeyDateEvent }) => {
          console.log('Event deleted from MongoDB: ', selectEvent);
          console.log(res);
          deleted = true;
        })
        .catch((err: { data: CalendarKeyDateEvent }) => {
          console.error('Error deleting event from MongoDB: ', err);
        });

      // Update local state to reflect the event deletion
      const newEvents = events.filter((event) => event !== selectEvent);
      setEvents(newEvents);
      setShowModal(false);

      toast(selectEvent.title + ' deleted');

      // netlify breaks if we reload the page
      // if (deleted) {
      //   // reload the page to show the event has been deleted
      //   window.location.reload();
      // } else {
      //   setTimeout(() => {
      //     window.location.reload();
      //   }, 1000);
      // }
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

          <a
            href="https://www.liverpool.ac.uk/term-dates/"
            target="_blank"
            rel="noreferrer"
          >
            University of Liverpool Term Dates
          </a>

          <hr className="lightRounded"></hr>

          {/* Dropdown for selecting course */}
          <span>Show reading week </span>
          <select className="mb-4" value={course} onChange={handleCourseChange}>
            <option value="CS">No</option>
            <option value="EE">Yes</option>
          </select>

          {/* dont let user set new dates, if dates already exist */}
          {
            // check if there are atleast 2 events with titles that include "Semester" in the fetched items
            fetchedItems.filter((event) => event.title.includes('Semester'))
              .length === 2 ? (
              // show semester 1 and 2 dates
              <div className="mb-4">
                <div>
                  Semester 1 Start Date: {semester1Event.start.toDateString()}
                </div>
                <div className="ml-4">
                  Semester 2 Start Date: {semester2Event.start.toDateString()}
                </div>
                <div className="mt-2">
                  <div>Semester dates have been set</div>
                  To edit these, navigate to the date and click it
                </div>
              </div>
            ) : (
              <>
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
                        setSemester1Event({
                          ...semester1Event,
                          start,
                          end: start,
                        })
                      }
                    />
                  </div>
                  <button
                    className="eventButton"
                    onClick={() => handleAddEvent(semester1Event)}
                  >
                    Set Semester 1 Start Date
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
                        setSemester2Event({
                          ...semester2Event,
                          start,
                          end: start,
                        })
                      }
                    />
                  </div>
                  <button
                    className="eventButton"
                    onClick={() => handleAddEvent(semester2Event)}
                  >
                    Set Semester 2 Start Date
                  </button>
                </div>
              </>
            )
          }

          <hr className="lightRounded"></hr>

          {
            // check if there is an event with title that includes "Christmas Break" in the fetched items
            fetchedItems.filter((event) =>
              event.title.includes('Christmas Break'),
            ).length === 1 ? (
              // show christmas break date
              <div className="mb-4">
                <div>
                  Christmas Break: {christmasBreakEvent.start.toDateString()} -{' '}
                  {christmasBreakEvent.end.toDateString()}
                </div>
                <div className="mt-2">
                  <div>Christmas dates have been set</div>
                  To edit these, navigate to the date and click it
                </div>
              </div>
            ) : (
              <>
                {/* Christmas break section */}
                <div className="datePickers">
                  <span>Christmas start date: </span>
                  <div className="d-inline">
                    <DatePicker
                      dateFormat="dd/MM/yyyy"
                      placeholderText="Start Date"
                      selected={christmasBreakEvent.start}
                      onChange={(start: Date) =>
                        setChristmasBreakEvent({
                          ...christmasBreakEvent,
                          start,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="datePickers">
                  <span>Christmas end date: </span>
                  <div className="d-inline">
                    <DatePicker
                      dateFormat="dd/MM/yyyy"
                      placeholderText="End Date"
                      selected={christmasBreakEvent.end}
                      onChange={(end: Date) =>
                        setChristmasBreakEvent({ ...christmasBreakEvent, end })
                      }
                    />
                  </div>
                </div>
                <button
                  className="eventButton mb-2"
                  onClick={handleAddChristmasBreak}
                >
                  Set Christmas Break
                </button>
              </>
            )
          }

          {/* Easter break section */}
          <hr className="lightRounded"></hr>

          {
            // check if there is an event with title that includes "Easter Break" in the fetched items
            fetchedItems.filter((event) => event.title.includes('Easter Break'))
              .length === 1 ? (
              // show easter break date
              <div className="mb-4">
                <div>
                  Easter Break: {easterBreakEvent.start.toDateString()} -{' '}
                  {easterBreakEvent.end.toDateString()}
                </div>
                <div className="mt-2">
                  <div>Easter dates have been set</div>
                  To edit these, navigate to the date and click it To edit
                </div>
              </div>
            ) : (
              <>
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
                  <button
                    className="eventButton mb-2"
                    onClick={handleAddEasterBreak}
                  >
                    Set Easter Break
                  </button>
                </div>
              </>
            )
          }

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
                      selected={readingWeekEvent.start}
                      onChange={(start: Date) =>
                        setReadingWeekEvent({ ...readingWeekEvent, start })
                      }
                    />
                  </div>
                </div>
                <div className="datePickers">
                  <span>Reading Week End Date: </span>
                  <div className="d-inline">
                    <DatePicker
                      dateFormat="dd/MM/yyyy"
                      placeholderText="End Date"
                      selected={readingWeekEvent.end}
                      onChange={(end: Date) => {
                        setReadingWeekEvent({ ...readingWeekEvent, end });
                      }}
                    />
                  </div>
                </div>
                <button
                  className="eventButton"
                  onClick={() =>
                    handleAddEvent({
                      title: 'Reading Week',
                      allDay: true,
                      start: readingWeekEvent.start,
                      end: readingWeekEvent.end,
                    })
                  }
                >
                  Set Reading Week
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
              Set new Holiday
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
