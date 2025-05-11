import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import { Card, Loader, Title } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { observer } from "mobx-react-lite";
import { Types } from "mongoose";
import { useStore } from "../../hooks/use-store";

const CalendarTab = observer(function CalendarTab({
  householdId,
}: {
  householdId: string;
}) {
  const { householdStore } = useStore();
  const { data, isLoading } = useQuery({
    queryKey: ["calendar-events"],
    queryFn: async () => {
      const result = await householdStore.getCalendarEvents(
        householdId as unknown as Types.ObjectId
      );
      return result;
    },
  });

  return (
    <Card p="md" radius="md" shadow="sm" withBorder>
      <Title order={3} mb="sm">
        Calendar
      </Title>
      {isLoading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <Loader />
        </div>
      ) : (
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={data ?? []}
          height="auto"
          eventDisplay="block"
          displayEventTime={false}
          eventContent={(eventInfo) => {
            return (
              <div style={{ padding: "2px" }}>
                <div style={{ fontWeight: "bold" }}>
                  {eventInfo.event.title}
                </div>
                {eventInfo.event.extendedProps.description && (
                  <div style={{ fontSize: "0.9em" }}>
                    {eventInfo.event.extendedProps.description}
                  </div>
                )}
              </div>
            );
          }}
          headerToolbar={{
            start: "prev,next today",
            center: "title",
            end: "dayGridMonth,dayGridWeek,dayGridDay",
          }}
        />
      )}
    </Card>
  );
});

export default CalendarTab;
