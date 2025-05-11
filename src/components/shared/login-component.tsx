import {
  Button,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
  createStyles,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useStore } from "../../hooks/use-store";
import { getImage } from "../../utils/image-map";

const useStyles = createStyles((theme) => ({
  container: {
    display: "flex",
    width: "100vw",
    height: "100%",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.xl,
  },
  loginPaper: {
    width: 400,
    padding: theme.spacing.xl,
    backdropFilter: "blur(15px)",
    backgroundColor: "rgba(255, 255, 255, 0.26)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    borderRadius: theme.radius.lg,
    boxShadow: theme.shadows.md,
  },
  switchWrapper: {
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  linkText: {
    cursor: "pointer",
    color: theme.colors.blue[6],
    textDecoration: "underline",
  },
}));

export const LoginComponent = observer(function LoginComponent() {
  const { authStore } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const { classes, theme } = useStyles();

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const backgroundImage = getImage("login_background");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const from = (location.state as any)?.from?.pathname || "/dashboard";

  const validateEmail = (value: string) => {
    if (!value) return "Email is required";
    if (!/\S+@\S+\.\S+/.test(value)) return "Invalid email";
    return "";
  };

  const validatePassword = (value: string) => {
    if (!value) return "Password is required";
    if (value.length < 6) return "Password must be at least 6 characters";
    return "";
  };

  const handleLogin = async () => {
    const emailErr = validateEmail(email);
    const passErr = validatePassword(password);

    setEmailError(emailErr);
    setPasswordError(passErr);

    if (emailErr || passErr) return;

    const payload = { email, password };
    const success = await authStore.loginUser(payload);

    if (success) {
      notifications.show({
        title: "Login successful",
        message: `Welcome, ${success.name}!`,
        color: "green",
      });
      navigate(from, { replace: true });
    } else {
      notifications.show({
        title: "Login failed",
        message: "Invalid credentials",
        color: "red",
      });
    }
  };

  return (
    <div
      className={classes.container}
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <Paper className={classes.loginPaper} radius="lg" shadow="md">
        <Stack spacing="md">
          <Title order={2} align="center">
            {"Login to your account"}
          </Title>

          <TextInput
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.currentTarget.value)}
            onBlur={() => setEmailError(validateEmail(email))}
            error={emailError}
            required
          />

          <PasswordInput
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
            onBlur={() => setPasswordError(validatePassword(password))}
            error={passwordError}
            required
          />

          <Button onClick={handleLogin} fullWidth variant="gradient">
            Login
          </Button>

          <Text align="center" size="sm">
            New user?{" "}
            <Text
              span
              className={classes.linkText}
              onClick={() => navigate("/register")}
              style={{
                color: theme.colors.blue[6],
              }}
            >
              Sign up here
            </Text>
          </Text>
        </Stack>
      </Paper>
    </div>
  );
});
