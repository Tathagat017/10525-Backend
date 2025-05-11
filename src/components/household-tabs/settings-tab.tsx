import {
  Button,
  Group,
  Paper,
  Stack,
  Text,
  Title,
  Modal,
  Flex,
} from "@mantine/core";
import { observer } from "mobx-react-lite";
import { useStore } from "../../hooks/use-store";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Types } from "mongoose";
import { notifications } from "@mantine/notifications";
interface SettingsTabProps {
  householdId: string;
  ownerId: Types.ObjectId;
  householdName: string;
}

const SettingsTab = observer(
  ({ householdId, ownerId, householdName }: SettingsTabProps) => {
    const { authStore, householdStore } = useStore();
    const navigate = useNavigate();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isUnjoinModalOpen, setIsUnjoinModalOpen] = useState(false);

    const isOwner = authStore.user?._id.toString() === ownerId.toString();

    const handleDeleteHousehold = async () => {
      try {
        await householdStore.deleteHousehold(
          householdId as unknown as Types.ObjectId
        );
        notifications.show({
          title: "Household deleted",
          message: "Your household has been deleted",
          color: "green",
        });
        navigate("/dashboard");
      } catch (error) {
        console.error("Error deleting household:", error);
        notifications.show({
          title: "Error deleting household",
          message: "Please try again",
          color: "red",
        });
      }
    };

    const handleUnjoinHousehold = async () => {
      try {
        await householdStore.removeSelfFromHousehold(
          householdId as unknown as Types.ObjectId
        );
        notifications.show({
          title: "Household left",
          message: "You have left the household",
          color: "green",
        });
        navigate("/dashboard");
      } catch (error) {
        console.error("Error leaving household:", error);
        notifications.show({
          title: "Error leaving household",
          message: "Please try again",
          color: "red",
        });
      }
    };

    return (
      <Stack spacing="xl">
        <Paper p="xl" withBorder>
          <Stack spacing="md">
            <Title order={3}>Household Settings</Title>
            <Flex
              style={{ width: "100%" }}
              align="center"
              justify="space-between"
            >
              <Text size="sm" color="dimmed">
                {isOwner
                  ? "As the owner, you can manage household settings and delete the household."
                  : "As a member, you can leave the household at any time."}
              </Text>

              {isOwner ? (
                <Button
                  color="red"
                  variant="filled"
                  onClick={() => setIsDeleteModalOpen(true)}
                >
                  Delete Household
                </Button>
              ) : (
                <Button
                  color="red"
                  variant="outline"
                  onClick={() => setIsUnjoinModalOpen(true)}
                >
                  Leave Household
                </Button>
              )}
            </Flex>
          </Stack>
        </Paper>

        {/* Delete Confirmation Modal */}
        <Modal
          opened={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          title="Delete Household"
          size="md"
        >
          <Stack spacing="md">
            <Text>
              Are you sure you want to delete {householdName}? This action
              cannot be undone.
            </Text>
            <Group position="right">
              <Button
                variant="outline"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </Button>
              <Button color="red" onClick={handleDeleteHousehold}>
                Delete
              </Button>
            </Group>
          </Stack>
        </Modal>

        {/* Unjoin Confirmation Modal */}
        <Modal
          opened={isUnjoinModalOpen}
          onClose={() => setIsUnjoinModalOpen(false)}
          title="Leave Household"
          size="md"
        >
          <Stack spacing="md">
            <Text>
              Are you sure you want to leave {householdName}? You can rejoin
              later if you have the invite code.
            </Text>
            <Group position="right">
              <Button
                variant="outline"
                onClick={() => setIsUnjoinModalOpen(false)}
              >
                Cancel
              </Button>
              <Button color="red" onClick={handleUnjoinHousehold}>
                Leave
              </Button>
            </Group>
          </Stack>
        </Modal>
      </Stack>
    );
  }
);

export default SettingsTab;
