import { Card, Center, Grid, Group, Loader, Stack, Text } from "@mantine/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { useQuery } from "@tanstack/react-query";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../hooks/use-store";
import { Household } from "../../types/household";

const HouseHoldCardListDashboard = observer(() => {
  const { householdStore, authStore } = useStore();
  const [households, setHouseholds] = useState<Household[]>([]);
  const navigate = useNavigate();
  const userId = authStore.user?._id;

  const { isLoading: isHouseholdsLoading } = useQuery({
    queryKey: ["households"],
    queryFn: async () => {
      const result = await householdStore.getAllUserHouseHolds(userId);
      return result;
    },
    onSuccess: (data) => {
      if (!data) return;
      setHouseholds(data);
    },
  });

  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      return await authStore.getUsers();
    },
  });

  if (isHouseholdsLoading) {
    return (
      <Center h="50vh">
        <Loader />
      </Center>
    );
  }

  const getOwnerName = (ownerId: string) => {
    const owner = users?.find(
      (user) => user._id.toString() === ownerId.toString()
    );
    return owner?.name || authStore.user?.name || "Unknown";
  };

  return (
    <Grid gutter="md" p="lg">
      {households.map((household) => (
        <Grid.Col key={household._id.toString()} span={4}>
          <Card
            shadow="sm"
            padding="lg"
            radius="md"
            withBorder
            onClick={() => navigate(`/households/${household._id}`)}
            style={{ cursor: "pointer" }}
          >
            <Group position="apart" mb="xs">
              <Text fw={700} size="lg">
                {household.name}
              </Text>
              <FontAwesomeIcon icon={faArrowRight} size="lg" />
            </Group>

            <Stack spacing={4}>
              <Text size="sm" c="dimmed">
                Owner: {getOwnerName(household.owner._id.toString())}
              </Text>
              <Text size="sm">Members: {household.members.length}</Text>
              <Text size="sm">
                Pending Invites: {household.pendingInvites?.length ?? 0}
              </Text>
            </Stack>
          </Card>
        </Grid.Col>
      ))}
    </Grid>
  );
});

export default HouseHoldCardListDashboard;
