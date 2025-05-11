import {
  Avatar,
  Burger,
  Button,
  Container,
  createStyles,
  Drawer,
  Group,
  Menu,
  Stack,
  Text,
} from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useStore } from "../../hooks/use-store";
import { getImage } from "../../utils/image-map";
import { notifications } from "@mantine/notifications";

const useStyles = createStyles((theme) => ({
  navbar: {
    display: "flex",
    maxHeight: "55px",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100vw",
    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
    position: "sticky",
    top: 0,
    zIndex: 100,
    background: `linear-gradient(
  45deg,
  ${theme.fn.rgba(theme.colors.violet[5], 0.93)},
  ${theme.fn.rgba(theme.colors.indigo[6], 0.93)},
  ${theme.fn.rgba(theme.colors.indigo[6], 0.93)}
 
)`,
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    borderBottom: `1px solid ${theme.fn.rgba(theme.colors.gray[9], 0.2)}`,
    boxShadow: theme.shadows.md,
    color: theme.white,
  },
}));

export const NavBar = observer(function NavBar() {
  const [opened, { toggle, close }] = useDisclosure(false);
  const [active, setActive] = useState("Home");
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { classes } = useStyles();
  const { authStore } = useStore();
  const navigate = useNavigate();

  const isLoggedIn = authStore.IsAuthenticated;

  const loginLink = [
    { label: "Login", href: "/login" },
    { label: "Register", href: "/register" },
  ];
  const logoutLink = [
    {
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      label: "Logout",
      href: "/",
    },
  ];

  const getLinks = () => {
    return isLoggedIn ? logoutLink : loginLink;
  };

  const items = getLinks().map((link) => (
    <Button
      key={link.label}
      variant="white"
      h={30}
      color={active === link.label ? "blue" : "gray"}
      onClick={() => {
        if (link.label === "Logout") {
          authStore.logout();
          navigate(link.href);
        } else {
          setActive(link.label);
          close();
          navigate(link.href);
        }
      }}
      component="a"
    >
      {link.label}
    </Button>
  ));

  const handleLogout = () => {
    authStore.logout();
    notifications.show({
      title: "Logged out",
      message: "You have been logged out",
      color: "green",
    });
    navigate("/");
  };

  return (
    <Container fluid px="md" py="sm" className={classes.navbar}>
      <img
        src={getImage("logo")}
        alt="Logo"
        onClick={() => navigate("/")}
        style={{
          objectFit: "cover",
          cursor: "pointer",
          width: "40px",
          height: "40px",
        }}
      />

      {!isMobile && (
        <Group spacing="md">
          {items}
          {isLoggedIn && (
            <Menu position="bottom-end" shadow="md" withArrow withinPortal>
              <Menu.Target>
                <Avatar
                  radius="xl"
                  size="md"
                  src={authStore.User?.profilePictureUrl || undefined}
                  style={{ cursor: "pointer" }}
                >
                  {authStore.User?.name?.charAt(0) || "U"}
                </Avatar>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item>
                  <Stack spacing={0}>
                    <Text size="sm" weight={500}>
                      {authStore.User?.name}
                    </Text>
                    <Text size="xs" color="dimmed">
                      {authStore.User?.email}
                    </Text>
                  </Stack>
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item
                  color="red"
                  icon={<FontAwesomeIcon icon={faSignOutAlt} />}
                  onClick={handleLogout}
                >
                  Logout
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          )}
        </Group>
      )}

      {isMobile && (
        <>
          {!opened && <Burger opened={false} onClick={toggle} />}
          <Drawer
            opened={opened}
            onClose={close}
            title={
              <img width={30} height={30} src={getImage("logo")} alt="Logo" />
            }
            padding="md"
            size="xs"
          >
            <Stack spacing="md" align="center">
              {isLoggedIn && (
                <Menu position="bottom-end" shadow="md">
                  <Menu.Target>
                    <Avatar
                      radius="xl"
                      size="md"
                      src={authStore.User?.profilePictureUrl || undefined}
                    >
                      {authStore.User?.name?.charAt(0) || "U"}
                    </Avatar>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Item>
                      <Text size="sm" color="dimmed">
                        {authStore.User?.email}
                      </Text>
                    </Menu.Item>
                    <Menu.Divider />
                    <Menu.Item
                      color="red"
                      icon={<FontAwesomeIcon icon={faSignOutAlt} />}
                      onClick={handleLogout}
                    >
                      Logout
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              )}
              {items}
            </Stack>
          </Drawer>
        </>
      )}
    </Container>
  );
});
