import {
  faCalendarDay,
  faCheck,
  faCirclePlus,
  faClock,
  faHistory,
  faHourglassEnd,
  faRedo,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Badge,
  Box,
  Button,
  Group,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useQuery } from "@tanstack/react-query";
import { format, formatDistanceToNow } from "date-fns";
import { observer } from "mobx-react-lite";
import { Types } from "mongoose";
import { useStore } from "../../hooks/use-store";
import { Chore } from "../../types/chore";
import CreateChoreModal from "../modals/create-chore-modal";

// Placeholder: You can implement this

const ChoresTab = observer(({ householdId }: { householdId: string }) => {
  const { choreStore, authStore, uiViewStore } = useStore();

  const { data: chores, isLoading } = useQuery({
    queryKey: ["chores"],
    queryFn: async () => {
      const result = await choreStore.getAllChoresByHouseholdId(
        householdId as unknown as Types.ObjectId
      );
      return result;
    },
  });

  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      return await authStore.getUsers();
    },
  });

  const assigneeName = (userId: string) => {
    const user = users?.find((user) => user._id.toString() === userId);
    return user?.name;
  };

  const markAsComplete = async (id: string) => {
    const result = await choreStore.markChoreAsComplete(
      id as unknown as Types.ObjectId
    );
    if (result) {
      notifications.show({
        title: "Chore marked as complete",
        message: "The chore has been marked as complete",
        color: "green",
      });
    } else {
      notifications.show({
        title: "Error marking chore as complete",
        message: "The chore was not marked as complete",
        color: "red",
      });
    }
  };

  const handleCreateChore = () => {
    uiViewStore.toggleCreateChoreModal(true);
  };

  return (
    <Box>
      <Group position="apart" mb="md">
        <Title order={4}>Chores</Title>
        <Button
          leftIcon={<FontAwesomeIcon icon={faCirclePlus} />}
          onClick={handleCreateChore}
        >
          Create Chore
        </Button>
      </Group>

      <CreateChoreModal householdId={householdId} />

      <Stack>
        {isLoading ? (
          <Text>Loading chores...</Text>
        ) : (chores && chores.length === 0 && !isLoading) || !chores ? (
          <Text>No chores yet. Start by creating one.</Text>
        ) : (
          chores?.map((chore: Chore) => (
            <Paper
              key={chore._id.toString()}
              withBorder
              radius="md"
              p="md"
              shadow="xs"
            >
              <Group position="apart">
                <Box>
                  <Title order={5}>{chore.name}</Title>
                  <Group spacing="xs" mt="xs">
                    {chore.assignedTo && (
                      <Badge leftSection={<FontAwesomeIcon icon={faUser} />}>
                        Assigned to:{" "}
                        {assigneeName(chore.assignedTo._id.toString())}
                      </Badge>
                    )}
                    <Badge leftSection={<FontAwesomeIcon icon={faRedo} />}>
                      {chore.frequency}
                    </Badge>
                    <Badge
                      leftSection={<FontAwesomeIcon icon={faCalendarDay} />}
                    >
                      Due: {format(new Date(chore.dueDate), "PPP")}
                    </Badge>
                    {chore.isOverDue && (
                      <Badge
                        color="red"
                        leftSection={<FontAwesomeIcon icon={faHourglassEnd} />}
                      >
                        Missed
                      </Badge>
                    )}
                  </Group>
                  <Group spacing="xs" mt="sm">
                    <Text size="xs" color="dimmed">
                      <FontAwesomeIcon icon={faClock} /> Created{" "}
                      {formatDistanceToNow(new Date(chore.createdAt))} ago
                    </Text>
                    <Text size="xs" color="dimmed">
                      <FontAwesomeIcon icon={faHistory} /> Updated{" "}
                      {formatDistanceToNow(new Date(chore.updatedAt))} ago
                    </Text>
                  </Group>
                </Box>
                <Button
                  size="xs"
                  variant="light"
                  color="green"
                  onClick={() => markAsComplete(chore._id.toString())}
                  leftIcon={<FontAwesomeIcon icon={faCheck} />}
                >
                  Mark as Complete
                </Button>
              </Group>
            </Paper>
          ))
        )}
      </Stack>
    </Box>
  );
});

export default ChoresTab;
