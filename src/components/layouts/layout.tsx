import { Outlet } from "react-router-dom";
import { NavBar } from "../shared/navbar";

export const Layout = () => (
  <>
    <NavBar />
    <div style={{ height: "100%", overflowY: "auto", overflowX: "hidden" }}>
      <Outlet />
    </div>
  </>
);
