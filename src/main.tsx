import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { QueryClientProvider } from "@tanstack/react-query";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { StoreProvider, store } from "./stores/store-context";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={store.queryClient}>
    <StoreProvider>
      <MantineProvider withGlobalStyles withNormalizeCSS>
        <Notifications position="bottom-right" zIndex={2077} />
        <App />
      </MantineProvider>
    </StoreProvider>
  </QueryClientProvider>
);
