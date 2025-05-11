import {
  faCalendarAlt,
  faChartLine,
  faCheckCircle,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Box,
  Button,
  Container,
  Group,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { getImage } from "../../utils/image-map";

export default function LandingPage() {
  const navigate = useNavigate();
  const backgroundImage = getImage("landing_background_image");

  const features = [
    {
      icon: faUsers,
      title: "Shared Household",
      description: "Create and manage your shared living space with ease",
    },
    {
      icon: faCalendarAlt,
      title: "Smart Calendar",
      description: "Keep track of chores, expenses, and events in one place",
    },
    {
      icon: faChartLine,
      title: "Expense Tracking",
      description: "Automatically calculate and split shared expenses",
    },
    {
      icon: faCheckCircle,
      title: "Chore Management",
      description: "Assign and track rotating chores efficiently",
    },
  ];

  return (
    <Box>
      <Box
        style={{
          minHeight: "calc(100vh - 60px)", // Subtract navbar height
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        <Container size="xl" py={80}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Stack spacing={50} align="center">
              <Stack align="center" spacing="xl">
                <Title
                  order={1}
                  size="4rem"
                  sx={(theme) => ({
                    color: theme.white,
                    textShadow: "0 4px 12px rgba(0,0,0,0.4)",
                    textAlign: "center",
                    fontWeight: 800,
                  })}
                >
                  Welcome to Roommate 🏡
                </Title>
                <Text
                  size="xl"
                  align="center"
                  sx={(theme) => ({
                    maxWidth: 800,
                    color: theme.colors.gray[0],
                    textShadow: "0 2px 8px rgba(0,0,0,0.3)",
                    fontSize: "1.25rem",
                    lineHeight: 1.6,
                  })}
                >
                  Join a shared household, assign rotating chores, log shared
                  expenses, and automatically calculate who owes what, with a
                  unified calendar view.
                </Text>
              </Stack>

              <Group position="center" spacing="xl" mt="xl">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="lg"
                    w={250}
                    h={60}
                    radius="xl"
                    variant="gradient"
                    gradient={{ from: "orange", to: "indigo" }}
                    onClick={() => navigate("/login")}
                    sx={() => ({
                      boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: "0 6px 16px rgba(0,0,0,0.3)",
                      },
                    })}
                  >
                    Get started
                  </Button>
                </motion.div>
              </Group>

              <Group grow spacing="xl" mt={50}>
                {features.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Paper
                      p="xl"
                      radius="md"
                      sx={() => ({
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                        backdropFilter: "blur(10px)",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        transition: "transform 0.2s ease",
                        "&:hover": {
                          transform: "translateY(-5px)",
                        },
                      })}
                    >
                      <Stack align="center" spacing="md">
                        <FontAwesomeIcon
                          icon={feature.icon}
                          size="2x"
                          style={{ color: "#fff" }}
                        />
                        <Title order={3} size="h4" color="white" align="center">
                          {feature.title}
                        </Title>
                        <Text color="gray.3" align="center" size="sm">
                          {feature.description}
                        </Text>
                      </Stack>
                    </Paper>
                  </motion.div>
                ))}
              </Group>
            </Stack>
          </motion.div>
        </Container>
      </Box>
    </Box>
  );
}
