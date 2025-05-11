// pages/JoinHouseholdPage.tsx
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";

import { Button, Center, Loader, Stack, Text, Title } from "@mantine/core";
import { useStore } from "../../hooks/use-store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { notifications } from "@mantine/notifications";

export const JoinHouseholdPage = observer(() => {
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");
  const { householdStore } = useStore();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const navigate = useNavigate();

  useEffect(() => {
    const join = async () => {
      if (!code) {
        setStatus("error");
        return;
      }

      try {
        await householdStore.joinHousehold(code);
        setStatus("success");
        notifications.show({
          title: "Household joined",
          message: "You have successfully joined the household",
          color: "green",
        });
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        setStatus("error");
        notifications.show({
          title: "Household join failed",
          message: "Please try again",
          color: "red",
        });
      }
    };

    join();
  }, [code, householdStore]);

  if (status === "loading") {
    return (
      <Center h="80vh">
        <Stack align="center">
          <Loader />
          <Text>Joining household...</Text>
        </Stack>
      </Center>
    );
  }

  if (status === "error") {
    return (
      <Center h="80vh">
        <Stack align="center">
          <Text color="red">Invalid or expired invite code.</Text>
          <Button onClick={() => navigate("/dashboard")}>
            Go to Dashboard
          </Button>
        </Stack>
      </Center>
    );
  }

  return (
    <Center h="80vh">
      <Stack align="center" spacing="lg">
        <FontAwesomeIcon icon={faCheck} size="2x" color="green" />
        <Title order={3}>You've successfully joined the household!</Title>
        <Button onClick={() => navigate("/dashboard")}>Go to Dashboard</Button>
      </Stack>
    </Center>
  );
});
