import { PasswordInput, Popover, Progress, Stack, Text } from "@mantine/core";
import { useState } from "react";

function getStrength(password: string) {
  let strength = 0;
  const requirements = [/[a-z]/, /[A-Z]/, /[0-9]/, /[^A-Za-z0-9]/, /.{8,}/];

  requirements.forEach((regex) => {
    if (regex.test(password)) strength += 20;
  });

  return strength;
}

function getRequirementChecks(password: string) {
  return [
    { label: "At least 8 characters", isValid: password.length >= 8 },
    { label: "One lowercase letter", isValid: /[a-z]/.test(password) },
    { label: "One uppercase letter", isValid: /[A-Z]/.test(password) },
    { label: "One number", isValid: /[0-9]/.test(password) },
    { label: "One special character", isValid: /[^A-Za-z0-9]/.test(password) },
  ];
}

export function PasswordWithValidation({
  password,
  setPassword,
  error,
  onBlur,
}: {
  password: string;
  setPassword: (val: string) => void;
  error?: string | null;
  onBlur?: () => void;
}) {
  const [popoverOpened, setPopoverOpened] = useState(false);
  const strength = getStrength(password);
  const requirementChecks = getRequirementChecks(password);

  return (
    <Popover
      opened={popoverOpened}
      position="bottom"
      trapFocus={false}
      shadow="md"
      withArrow
      width="target"
      transitionProps={{ transition: "pop" }}
    >
      <Popover.Target>
        <div
          onFocusCapture={() => setPopoverOpened(true)}
          onBlurCapture={() => {
            setPopoverOpened(false);
            onBlur?.();
          }}
        >
          <PasswordInput
            size="xs"
            label="Password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
            error={error}
            withAsterisk
          />
        </div>
      </Popover.Target>
      <Popover.Dropdown>
        <Progress
          color={strength === 100 ? "teal" : strength > 50 ? "yellow" : "red"}
          value={strength}
          size={5}
          mb="sm"
        />
        <Stack spacing={4}>
          {requirementChecks.map((req, idx) => (
            <Text key={idx} color={req.isValid ? "teal" : "red"} size="xs">
              {req.label}
            </Text>
          ))}
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );
}
