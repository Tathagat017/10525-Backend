import {
  Avatar,
  Button,
  Divider,
  Group,
  Paper,
  Stack,
  Text,
} from "@mantine/core";
import { observer } from "mobx-react-lite";
import { useQuery } from "@tanstack/react-query";
import { useStore } from "../../hooks/use-store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserMinus } from "@fortawesome/free-solid-svg-icons";
import { Types } from "mongoose";
import InviteMemberModal from "../modals/invite-member-modal";
import { useParams } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import { User } from "../../types/user";

interface MemberTabProps {
  members: User[];
  ownerId: Types.ObjectId;
  inviteCode: string;
  pendingInvites: Types.ObjectId[];
  householdId: Types.ObjectId;
}

const MemberTab = observer(
  ({ members, ownerId, inviteCode, pendingInvites }: MemberTabProps) => {
    const { authStore, uiViewStore, householdStore } = useStore();
    const isOwner = authStore.user?._id.toString() === ownerId.toString();
    const { id } = useParams();
    const { data: users } = useQuery({
      queryKey: ["users"],
      queryFn: async () => {
        return await authStore.getUsers();
      },
    });

    const handleRemoveMember = async (memberId: string) => {
      const result = await householdStore.removeMember(
        id! as unknown as Types.ObjectId,
        memberId as unknown as Types.ObjectId
      );

      if (result) {
        notifications.show({
          title: "Member removed",
          message: "Member removed from household",
          color: "green",
        });
        const newMembers = members.filter(
          (member) => member.toString() !== memberId
        );
        members = newMembers;
      } else {
        notifications.show({
          title: "Failed to remove member",
          message: "Please try again",
          color: "red",
        });
      }
    };

    const owner = users?.find(
      (user) => user._id.toString() === ownerId.toString()
    );

    const getMemberName = (memberId: string) => {
      const member = users?.find(
        (user) => user._id.toString() === memberId.toString()
      );
      return member?.name || "Unknown User";
    };

    const getMemberAvatar = (memberId: string) => {
      const member = users?.find(
        (user) => user._id.toString() === memberId.toString()
      );
      return member?.profilePictureUrl;
    };

    if (owner) {
      members = [...members, owner];
    }
    return (
      <Stack spacing="md">
        {isOwner && (
          <Group position="right">
            <Button onClick={() => uiViewStore.toggleInviteMemberModal(true)}>
              Invite Member
            </Button>
          </Group>
        )}

        {members.length > 0 ? (
          <Stack spacing="xs">
            {members.map((houseHoldMember) => (
              <Paper
                key={houseHoldMember._id.toString()}
                p="md"
                withBorder
                h={80}
              >
                <Group position="apart">
                  <Group>
                    <Avatar
                      src={getMemberAvatar(houseHoldMember._id.toString())}
                      radius="xl"
                      size="md"
                    />
                    <Stack spacing={0}>
                      <Text size="lg" weight={500}>
                        {getMemberName(houseHoldMember._id.toString())}
                      </Text>
                      <Text size="sm" color="dimmed">
                        {houseHoldMember._id.toString() === ownerId.toString()
                          ? "Owner"
                          : "Member"}
                      </Text>
                    </Stack>
                  </Group>
                  {isOwner &&
                    houseHoldMember._id.toString() !== ownerId.toString() && (
                      <Button
                        variant="subtle"
                        color="red"
                        onClick={() =>
                          handleRemoveMember(houseHoldMember._id.toString())
                        }
                      >
                        <FontAwesomeIcon icon={faUserMinus} />
                      </Button>
                    )}
                </Group>
              </Paper>
            ))}
          </Stack>
        ) : (
          <Text align="center" color="dimmed" size="sm">
            No members present
          </Text>
        )}

        <Divider my="sm" label="Pending Invitations" labelPosition="center" />
        {pendingInvites.length > 0 ? (
          <Stack spacing="xs">
            {pendingInvites.map((inviteId) => (
              <Paper key={inviteId.toString()} p="md" withBorder h={80}>
                <Group position="apart">
                  <Group>
                    <Avatar
                      src={getMemberAvatar(inviteId.toString())}
                      radius="xl"
                      size="md"
                    />
                    <Stack spacing={0}>
                      <Text size="lg" weight={500}>
                        {getMemberName(inviteId.toString())}
                      </Text>
                      <Text size="sm" color="dimmed">
                        Pending Invitation
                      </Text>
                    </Stack>
                  </Group>
                </Group>
              </Paper>
            ))}
          </Stack>
        ) : (
          <Text align="center" color="dimmed" size="sm">
            No pending invitations
          </Text>
        )}

        <InviteMemberModal
          inviteCode={inviteCode}
          householdId={id!}
          members={members.map((member) => member._id)}
        />
      </Stack>
    );
  }
);

export default MemberTab;
