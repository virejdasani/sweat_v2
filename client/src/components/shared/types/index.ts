export interface CalendarKeyDateEvent {
  id?: string;
  _id?: string; // For MongoDB (tsx throws errors if _id is not included)
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
}
