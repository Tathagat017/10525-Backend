import { createContext, ReactNode } from "react";
import { AuthStore } from "./auth-store";
import { UiViewStore } from "./ui-view-store";
import { QueryClient } from "@tanstack/react-query";
import { HouseHoldStore } from "./household-store";
import { ChoreStore } from "./chore-store";

const queryClient = new QueryClient();

export const store = {
  authStore: new AuthStore(queryClient),
  householdStore: new HouseHoldStore(queryClient),
  choreStore: new ChoreStore(queryClient),
  uiViewStore: new UiViewStore(),
  queryClient,
};

export const StoreContext = createContext(store);

export const StoreProvider = ({ children }: { children: ReactNode }) => (
  <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
);
