export type CalendarEvent = {
  id: string;
  title: string;
  start: string; // ISO date
  end?: string;
  backgroundColor?: string;
  borderColor?: string;
  color?: string; // FullCalendar uses `color` too
  extendedProps?: {
    type?: "expense" | "chore";
    description?: string;
    amount?: number;
    isOverDue?: boolean;
    assignedTo?: string;
  };
};
