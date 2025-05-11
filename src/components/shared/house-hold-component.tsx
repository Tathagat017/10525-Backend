import {
  faCalendar,
  faDollarSign,
  faGear,
  faHistory,
  faListCheck,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Container, Group, Paper, Tabs, Title } from "@mantine/core";
import { useState } from "react";
import { useParams } from "react-router-dom";
import CalendarTab from "../household-tabs/calendar-tab";
import ChoresTab from "../household-tabs/chores-tab";
import ExpenseTab from "../household-tabs/expense-tab";
import HistoryTab from "../household-tabs/history-tab";
import MemberTab from "../household-tabs/member-tab";
import SettingsTab from "../household-tabs/settings-tab";
import { useStore } from "../../hooks/use-store";
import { useQuery } from "@tanstack/react-query";
import { Types } from "mongoose";

const HouseholdComponent = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState<string>("chores");

  const { householdStore } = useStore();
  const { data: household } = useQuery({
    queryKey: ["household", id],
    queryFn: async () => {
      const result = await householdStore.getHouseholdById(
        id as unknown as Types.ObjectId
      );
      return result;
    },
  });

  console.log(id);
  return (
    <Container size="lg" py="md" w="100%">
      <Group position="apart" mb="lg">
        <Title order={2}>{`🏠  ${household?.name}`}</Title>
      </Group>

      <Paper shadow="xs" radius="md" p="lg" withBorder>
        <Tabs
          value={activeTab}
          onTabChange={(value) => setActiveTab(value as string)}
          variant="outline"
          radius="md"
          keepMounted={false}
          defaultValue="chores"
        >
          <Tabs.List grow>
            <Tabs.Tab
              value="chores"
              icon={<FontAwesomeIcon icon={faListCheck} size={"1x"} />}
            >
              Chores
            </Tabs.Tab>
            <Tabs.Tab
              value="expenses"
              icon={<FontAwesomeIcon icon={faDollarSign} size={"1x"} />}
            >
              Expenses
            </Tabs.Tab>
            <Tabs.Tab
              value="members"
              icon={<FontAwesomeIcon icon={faUsers} size={"1x"} />}
            >
              Members
            </Tabs.Tab>
            <Tabs.Tab
              value="calendar"
              icon={<FontAwesomeIcon icon={faCalendar} size={"1x"} />}
            >
              Calendar
            </Tabs.Tab>
            <Tabs.Tab
              value="history"
              icon={<FontAwesomeIcon icon={faHistory} size={"1x"} />}
            >
              History
            </Tabs.Tab>
            <Tabs.Tab
              value="settings"
              icon={<FontAwesomeIcon icon={faGear} size={"1x"} />}
            >
              Settings
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="chores" pt="md">
            <ChoresTab householdId={id as string} />
          </Tabs.Panel>

          <Tabs.Panel value="expenses" pt="md">
            <ExpenseTab />
          </Tabs.Panel>

          <Tabs.Panel value="members" pt="md">
            <MemberTab
              members={household?.members as Types.ObjectId[]}
              ownerId={household?.owner as Types.ObjectId}
              inviteCode={household?.inviteCode as string}
              pendingInvites={household?.pendingInvites as Types.ObjectId[]}
              householdId={id as unknown as Types.ObjectId}
            />
          </Tabs.Panel>

          <Tabs.Panel value="calendar" pt="md">
            <CalendarTab householdId={id as string} />
          </Tabs.Panel>

          <Tabs.Panel value="history" pt="md">
            <HistoryTab householdId={id as string} />
          </Tabs.Panel>

          <Tabs.Panel value="settings" pt="md">
            <SettingsTab
              householdId={id as string}
              ownerId={household?.owner as Types.ObjectId}
              householdName={household?.name as string}
            />
          </Tabs.Panel>
        </Tabs>
      </Paper>
    </Container>
  );
};

export default HouseholdComponent;
