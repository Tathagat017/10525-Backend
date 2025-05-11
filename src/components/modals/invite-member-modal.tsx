/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Button,
  Group,
  Modal,
  MultiSelect,
  Paper,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useClipboard } from "@mantine/hooks";
import { observer } from "mobx-react-lite";
import { useStore } from "../../hooks/use-store";
import { notifications } from "@mantine/notifications";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy, faCheck } from "@fortawesome/free-solid-svg-icons";
import { useQuery } from "@tanstack/react-query";
import { Types } from "mongoose";
import { useState } from "react";

interface InviteMemberModalProps {
  inviteCode: string;
  householdId: string;
  members: Types.ObjectId[];
}

const InviteMemberModal = observer(
  ({ inviteCode, householdId, members }: InviteMemberModalProps) => {
    const { uiViewStore, authStore, householdStore } = useStore();
    const clipboard = useClipboard({ timeout: 2000 });
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const { data: users } = useQuery({
      queryKey: ["users"],
      queryFn: async () => {
        return await authStore.getUsers();
      },
    });

    const handleClose = () => {
      uiViewStore.toggleInviteMemberModal(false);
      setSelectedUsers([]);
    };

    const handleCopyCode = () => {
      clipboard.copy(inviteCode);
      notifications.show({
        title: "Success",
        message: "Invite code copied to clipboard!",
        color: "green",
      });
    };

    const handleInvite = async () => {
      if (selectedUsers.length === 0) {
        notifications.show({
          title: "Error",
          message: "Please select at least one user to invite",
          color: "red",
        });
        return;
      }

      setLoading(true);
      try {
        const userIds = selectedUsers.map((id) => new Types.ObjectId(id));
        let result;
        if (selectedUsers.length > 1) {
          result = await householdStore.sendBulkInvite(
            new Types.ObjectId(householdId),
            userIds
          );
        } else {
          result = await householdStore.sendInvite(
            new Types.ObjectId(householdId),
            userIds[0]
          );
        }

        if (result?.success) {
          notifications.show({
            title: "Success",
            message: "Invites sent successfully!",
            color: "green",
          });
          handleClose();
        } else {
          notifications.show({
            title: "Error",
            message: "Failed to send invites",
            color: "red",
          });
        }
      } catch (error) {
        notifications.show({
          title: "Error",
          message: "An error occurred while sending invites",
          color: "red",
        });
      }
      setLoading(false);
    };

    // Filter out existing members from the user list
    const availableUsers =
      users?.filter(
        (user) =>
          !members.some(
            (memberId) => memberId.toString() === user._id.toString()
          )
      ) || [];

    const userOptions = availableUsers.map((user) => ({
      value: user._id.toString(),
      label: user.name,
    }));

    return (
      <Modal
        opened={uiViewStore.IsInviteMemberModalOpen}
        onClose={handleClose}
        title="Invite Member"
        size="md"
        centered
      >
        <Stack spacing="md">
          <Text size="sm" color="dimmed">
            Share this invite code with the person you want to invite to your
            household. They can use this code to join your household.
          </Text>

          <Paper p="md" withBorder>
            <Group position="apart">
              <TextInput value={inviteCode} readOnly style={{ flex: 1 }} />
              <Button
                onClick={handleCopyCode}
                variant="light"
                color={clipboard.copied ? "green" : "blue"}
              >
                {clipboard.copied ? (
                  <FontAwesomeIcon icon={faCheck} />
                ) : (
                  <FontAwesomeIcon icon={faCopy} />
                )}
              </Button>
            </Group>
          </Paper>

          <MultiSelect
            label="Select Users to Invite"
            placeholder="Choose users"
            data={userOptions}
            value={selectedUsers}
            onChange={setSelectedUsers}
            searchable
            clearable
          />

          <Group position="right" mt="md">
            <Button variant="light" onClick={handleClose}>
              Cancel
            </Button>
            <Button onClick={handleInvite} loading={loading}>
              Send Invites
            </Button>
          </Group>
        </Stack>
      </Modal>
    );
  }
);

export default InviteMemberModal;
