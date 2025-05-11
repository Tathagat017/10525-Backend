import {
  Button,
  Group,
  Modal,
  MultiSelect,
  NumberInput,
  Select,
  Stack,
  TextInput,
  Text,
  Paper,
  ActionIcon,
  Checkbox,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useQuery } from "@tanstack/react-query";
import { useStore } from "../../hooks/use-store";
import { ExpensePayload, ExpenseParticipant } from "../../types/expense";
import { Types } from "mongoose";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../../styles/date-picker.css";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEquals } from "@fortawesome/free-solid-svg-icons";

const CreateExpenseModal = observer(function CreateExpenseModal({
  householdId,
}: {
  householdId: string;
}) {
  const { uiViewStore, authStore, householdStore } = useStore();
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>(
    []
  );
  const [customShares, setCustomShares] = useState<{ [key: string]: number }>(
    {}
  );
  const [isEqualShare, setIsEqualShare] = useState(true);
  const [includePayer, setIncludePayer] = useState(false);

  const form = useForm<ExpensePayload>({
    initialValues: {
      householdId: new Types.ObjectId(householdId),
      name: "",
      amount: 0,
      date: new Date(),
      payer: new Types.ObjectId(),
      participants: [],
    },
    validate: {
      name: (value) => (!value ? "Name is required" : null),
      amount: (value) => (value <= 0 ? "Amount must be greater than 0" : null),
      payer: (value) => (!value ? "Payer is required" : null),
    },
  });

  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      return await authStore.getUsers();
    },
  });

  const handleClose = () => {
    uiViewStore.toggleCreateExpenseModal(false);
    form.reset();
    setSelectedParticipants([]);
    setCustomShares({});
    setIsEqualShare(true);
    setIncludePayer(false);
  };

  const handleSubmit = async (values: ExpensePayload) => {
    try {
      // Calculate shares based on mode
      const participants = selectedParticipants.map((userId) => {
        const share = isEqualShare
          ? 1 / selectedParticipants.length
          : (customShares[userId] || 0) / 100;
        return {
          user: new Types.ObjectId(userId),
          share,
        };
      });

      const expenseData = {
        ...values,
        participants,
      };

      await householdStore.createExpense(expenseData);
      handleClose();
    } catch (error) {
      console.error("Error creating expense:", error);
    }
  };

  const userOptions = [
    ...(users?.map((user) => ({
      value: user._id.toString(),
      label: user.name,
    })) || []),
    ...(authStore.User &&
    !users?.some(
      (user) => user._id.toString() === authStore.User?._id.toString()
    )
      ? [
          {
            value: authStore.User._id.toString(),
            label: authStore.User.name,
          },
        ]
      : []),
  ];

  const handleParticipantChange = (selectedUserIds: string[]) => {
    setSelectedParticipants(selectedUserIds);

    // Reset custom shares when participants change
    if (isEqualShare) {
      const equalShare = 1 / selectedUserIds.length;
      const participants: ExpenseParticipant[] = selectedUserIds.map(
        (userId) => ({
          user: new Types.ObjectId(userId),
          share: equalShare,
        })
      );
      form.setFieldValue("participants", participants);
    } else {
      // Maintain existing custom shares for remaining participants
      const newCustomShares = { ...customShares };
      selectedUserIds.forEach((userId) => {
        if (!newCustomShares[userId]) {
          newCustomShares[userId] = 100 / selectedUserIds.length;
        }
      });
      setCustomShares(newCustomShares);
    }
  };

  const handlePayerChange = (value: string | null) => {
    if (value) {
      form.setFieldValue("payer", new Types.ObjectId(value));
      if (!includePayer && selectedParticipants.includes(value)) {
        const newParticipants = selectedParticipants.filter(
          (id) => id !== value
        );
        setSelectedParticipants(newParticipants);
        handleParticipantChange(newParticipants);
      }
    }
  };

  const handleShareChange = (userId: string, value: number) => {
    const newCustomShares = { ...customShares, [userId]: value };
    setCustomShares(newCustomShares);
  };

  const toggleShareMode = () => {
    setIsEqualShare(!isEqualShare);
    if (!isEqualShare) {
      // Switch to equal share
      const equalShare = 1 / selectedParticipants.length;
      const participants: ExpenseParticipant[] = selectedParticipants.map(
        (userId) => ({
          user: new Types.ObjectId(userId),
          share: equalShare,
        })
      );
      form.setFieldValue("participants", participants);
    } else {
      // Switch to custom share
      const defaultShare = 100 / selectedParticipants.length;
      const newCustomShares = selectedParticipants.reduce(
        (acc, userId) => ({
          ...acc,
          [userId]: defaultShare,
        }),
        {}
      );
      setCustomShares(newCustomShares);
    }
  };

  const handleIncludePayerChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const checked = event.currentTarget.checked;
    setIncludePayer(checked);

    if (checked && form.values.payer) {
      const payerId = form.values.payer.toString();
      if (!selectedParticipants.includes(payerId)) {
        const newParticipants = [...selectedParticipants, payerId];
        setSelectedParticipants(newParticipants);
        handleParticipantChange(newParticipants);
      }
    } else if (!checked && form.values.payer) {
      const payerId = form.values.payer.toString();
      if (selectedParticipants.includes(payerId)) {
        const newParticipants = selectedParticipants.filter(
          (id) => id !== payerId
        );
        setSelectedParticipants(newParticipants);
        handleParticipantChange(newParticipants);
      }
    }
  };

  return (
    <Modal
      opened={uiViewStore.IsCreateExpenseModalOpen}
      onClose={handleClose}
      title="Create New Expense"
      size="md"
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack spacing="md">
          <TextInput
            label="Expense Name"
            placeholder="Enter expense name"
            required
            {...form.getInputProps("name")}
          />

          <NumberInput
            label="Amount"
            placeholder="Enter amount"
            required
            min={0}
            precision={2}
            {...form.getInputProps("amount")}
          />

          <Select
            label="Payer"
            placeholder="Select payer"
            data={userOptions}
            required
            value={form.values.payer.toString()}
            onChange={handlePayerChange}
          />

          <Checkbox
            label="Include payer in expense distribution"
            checked={includePayer}
            onChange={handleIncludePayerChange}
          />

          <MultiSelect
            label="Participants"
            placeholder="Select participants"
            data={userOptions.filter(
              (option) =>
                includePayer || option.value !== form.values.payer.toString()
            )}
            multiple
            value={selectedParticipants}
            onChange={handleParticipantChange}
            clearable
          />

          {selectedParticipants.length > 0 && (
            <Paper p="md" withBorder>
              <Group position="apart" mb="xs">
                <Text weight={500}>Share Distribution</Text>
                <ActionIcon
                  variant={isEqualShare ? "filled" : "light"}
                  color="blue"
                  onClick={toggleShareMode}
                  title={
                    isEqualShare
                      ? "Switch to custom shares"
                      : "Switch to equal shares"
                  }
                >
                  <FontAwesomeIcon icon={faEquals} size="lg" />
                </ActionIcon>
              </Group>

              {!isEqualShare && (
                <Stack spacing="xs">
                  {selectedParticipants.map((userId) => {
                    const user = userOptions.find((u) => u.value === userId);
                    return (
                      <Group key={userId} position="apart">
                        <Text size="sm">{user?.label}</Text>
                        <NumberInput
                          value={customShares[userId] || 0}
                          onChange={(value) =>
                            handleShareChange(userId, value || 0)
                          }
                          min={0}
                          max={100}
                          precision={1}
                          size="xs"
                          style={{ width: 100 }}
                          rightSection={<Text size="xs">%</Text>}
                        />
                      </Group>
                    );
                  })}
                  <Text size="xs" color="dimmed" align="right">
                    Total:{" "}
                    {Object.values(customShares)
                      .reduce((sum, share) => sum + share, 0)
                      .toFixed(1)}
                    %
                  </Text>
                </Stack>
              )}
            </Paper>
          )}

          <div>
            <label
              style={{
                display: "block",
                marginBottom: "5px",
                fontSize: "14px",
              }}
            >
              Date
            </label>
            <DatePicker
              selected={form.values.date}
              onChange={(date: Date | null) =>
                date && form.setFieldValue("date", date)
              }
              dateFormat="MMMM d, yyyy"
              wrapperClassName="date-picker-wrapper"
              className="mantine-Input-input"
            />
          </div>

          <Group position="right" mt="md">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">Create Expense</Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
});

export default CreateExpenseModal;
