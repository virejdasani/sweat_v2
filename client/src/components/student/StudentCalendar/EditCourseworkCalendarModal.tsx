import React from 'react';
import { AddToCalendarButton } from 'add-to-calendar-button-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// TODO: move interfaces to types/index.ts
// Custom Event interface to match the event object
interface CustomEvent {
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
}

// interface to define props for the Modal component
interface ModalProps {
  eventTitle: string;
  showModal: boolean;
  selectEvent: CustomEvent | null;
  newEvent: CustomEvent;
  selectedEventStartDate: Date;
  selectedEventEndDate: Date;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  setEventTitle: React.Dispatch<React.SetStateAction<string>>;
  setSelectEvent: React.Dispatch<React.SetStateAction<CustomEvent | null>>;
  setNewEvent: React.Dispatch<React.SetStateAction<CustomEvent>>;
  // these are needed to be able to call the functions from parent component
  saveEvent: () => void;
  deleteEvents: () => void;
}

// Modal component with props
const EditTermDateModal: React.FC<ModalProps> = ({
  eventTitle,
  showModal,
  selectEvent,
  newEvent,
  selectedEventStartDate,
  selectedEventEndDate,
  setShowModal,
  setEventTitle,
  setSelectEvent,
  setNewEvent,
  saveEvent,
  deleteEvents,
}) => {
  // Function to format date to "YYYY-MM-DD" format
  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Adding 1 because months are zero-indexed
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Return modal only if showModal is true
  return (
    showModal && (
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
        {/* Modal Content */}
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
                  onChange={(end: Date) => setNewEvent({ ...newEvent, end })}
                />
              </div>
            </div>
            <div className="modal-footer">
              <AddToCalendarButton
                name={eventTitle + ' (Added from CW Calendar)'}
                options={['Apple', 'Google', 'Outlook.com']}
                location="World Wide Web"
                startDate={formatDate(selectedEventStartDate)}
                endDate={formatDate(selectedEventEndDate)}
                timeZone="Europe/London"
                styleLight="z-index: 0;"
                styleDark="z-index: 0;"
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
    )
  );
};

export default EditTermDateModal;
