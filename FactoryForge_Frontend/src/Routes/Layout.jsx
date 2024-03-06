import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../Components/Sidebar";

export default function Layout() {
  const location = useLocation();

  const showSidebar = () => {
    const { pathname } = location;
    return !["/login", "/register", "/validation"].includes(pathname);
  };

  return (
    <div className="layout-container">
      {showSidebar() && <Sidebar />}
      <main>
        <Outlet />
      </main>
    </div>
  );
}
