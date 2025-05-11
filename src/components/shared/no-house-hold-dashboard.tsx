import { Title, Text, Button, Stack, Flex } from "@mantine/core";
import { observer } from "mobx-react-lite";
import { getImage } from "../../utils/image-map";
import { useStore } from "../../hooks/use-store";
import CreateHouseHoldModal from "../modals/create-house-hold-modal";
import { useState } from "react";

const NoHouseHoldDashboard = observer(() => {
  const { uiViewStore } = useStore();
  const [type, setType] = useState<"create" | "join">("create");
  const handleCreateHouseHold = () => {
    setType("create");
    uiViewStore.toggleCreateHouseHoldModal(true);
  };
  const handleJoinHouseHold = () => {
    setType("join");
    uiViewStore.toggleCreateHouseHoldModal(true);
  };

  return (
    <div
      style={{
        padding: 30,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        flexDirection: "column",
      }}
    >
      <Title order={2}>No House Hold Found</Title>
      <img
        style={{ width: "300px", height: "300px" }}
        src={getImage("empty_house_hold")}
        alt="No House Hold"
      />
      <Stack>
        <Text>
          You don't have any house hold yet. Please create a new house hold or
          join an existing house hold to continue.
        </Text>
        <Flex gap={10} justify="center">
          <Button onClick={handleCreateHouseHold}>Create New House Hold</Button>
          <Button onClick={handleJoinHouseHold}>
            Join Existing House Hold
          </Button>
        </Flex>
      </Stack>
      <CreateHouseHoldModal type={type} />
    </div>
  );
});

export default NoHouseHoldDashboard;
