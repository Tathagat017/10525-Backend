import { useContext } from "react";
import { StoreContext } from "../stores/store-context";

export const useStore = () => useContext(StoreContext);
