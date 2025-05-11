import {
  faBalanceScale,
  faMoneyBillWave,
  faPlus,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Badge,
  Button,
  Card,
  Divider,
  Group,
  Loader,
  ScrollArea,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { observer } from "mobx-react-lite";
import { Types } from "mongoose";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useStore } from "../../hooks/use-store";
import { ExpenseBalance, SettleUpSuggestion } from "../../types/expense";
import CreateExpenseModal from "../modals/create-expense-modal";

const ExpenseTab = observer(() => {
  const { householdStore, authStore, uiViewStore } = useStore();
  const { id } = useParams();

  const [balances, setBalances] = useState<ExpenseBalance[]>([]);
  const [suggestions, setSuggestions] = useState<SettleUpSuggestion[]>([]);

  const { data: expenses, isLoading: loadingExpenses } = useQuery({
    queryKey: ["expenses"],
    queryFn: async () => {
      const result = await householdStore.getExpenses(
        id! as unknown as Types.ObjectId
      );
      return result;
    },
  });

  const { isLoading: loadingBalances } = useQuery({
    queryKey: ["balances"],
    queryFn: async () => {
      const result = await householdStore.getBalances(
        id! as unknown as Types.ObjectId
      );
      return result;
    },
    onSuccess: (data) => {
      if (!data) return;
      setBalances(data);
    },
  });

  const { isLoading: loadingSuggestions } = useQuery({
    queryKey: ["settle-up", id],
    queryFn: async () => {
      const result = await householdStore.getSettleUpSuggestions(
        id! as unknown as Types.ObjectId
      );
      return result;
    },
    onSuccess: (data) => {
      if (!data) return;
      setSuggestions(data);
    },
  });

  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      return await authStore.getUsers();
    },
  });

  if (loadingExpenses || loadingBalances || loadingSuggestions) {
    return (
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
    );
  }

  const handleCreateExpense = () => {
    uiViewStore.toggleCreateExpenseModal(true);
  };

  return (
    <Stack>
      <Group position="apart">
        <Title order={3}>Expenses</Title>
        <Button
          leftIcon={<FontAwesomeIcon icon={faPlus} />}
          onClick={handleCreateExpense}
        >
          Add Expense
        </Button>
      </Group>

      {expenses && expenses.length > 0 ? (
        <>
          {" "}
          <Divider label="Expenses List" labelPosition="center" my="sm" />
          <ScrollArea h={250}>
            <Stack spacing="xs">
              {expenses?.map((exp) => (
                <Card
                  key={exp._id.toString()}
                  shadow="sm"
                  padding="md"
                  radius="md"
                  withBorder
                >
                  <Group position="apart">
                    <Text weight={500}>{exp.name}</Text>
                    <Badge color="blue">${exp.amount.toFixed(2)}</Badge>
                  </Group>
                  <Text size="sm" color="dimmed" mt={4}>
                    <FontAwesomeIcon icon={faUser} className="me-1" /> Paid by:{" "}
                    {users?.find((user) => user._id == exp.payer._id)?.name}
                  </Text>
                  <Text size="xs" mt={2}>
                    Participants:{" "}
                    {exp.participants
                      .map(
                        (p) =>
                          `${
                            users?.find((user) => user._id == p.user._id)?.name
                          } (${Math.round(p.share * 100)}%)`
                      )
                      .join(", ")}
                  </Text>
                  <Text size="xs" color="dimmed">
                    Date: {format(new Date(exp.date), "PP")}
                  </Text>
                </Card>
              ))}
            </Stack>
          </ScrollArea>
          <Divider label="Balances" labelPosition="center" my="sm" />
          <Stack spacing="xs">
            {balances &&
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              Object.entries(balances).map(([user, amt]: any) => (
                <Text key={user}>
                  <FontAwesomeIcon icon={faBalanceScale} className="me-2" />
                  {users?.find((user) => user._id == user._id)?.name}:{" "}
                  <span style={{ color: amt < 0 ? "red" : "green" }}>
                    {amt < 0 ? "-" : "+"}${Math.abs(amt).toFixed(2)}
                  </span>
                </Text>
              ))}
          </Stack>
          <Divider
            label="Settle Up Suggestions"
            labelPosition="center"
            my="sm"
          />
          <Stack spacing="xs">
            {suggestions?.length === 0 && (
              <Text size="sm">All settled up 🎉</Text>
            )}
            {suggestions?.map((tx: SettleUpSuggestion, idx: number) => (
              <Text key={idx} size="sm">
                <FontAwesomeIcon icon={faMoneyBillWave} className="me-2" />
                {users?.find((user) => user._id == tx.from)?.name} pays $
                {tx.amount.toFixed(2)} to{" "}
                {users?.find((user) => user._id == tx.to)?.name}
              </Text>
            ))}
          </Stack>
        </>
      ) : (
        <div>No expenses</div>
      )}

      <CreateExpenseModal householdId={id!} />
    </Stack>
  );
});

export default ExpenseTab;
