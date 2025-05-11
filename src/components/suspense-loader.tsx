import { Center, Loader } from "@mantine/core";

const SuspenseLoader = () => (
  <Center style={{ width: "100%", height: "100vh" }}>
    <Loader size="xl" />
  </Center>
);

export default SuspenseLoader;
