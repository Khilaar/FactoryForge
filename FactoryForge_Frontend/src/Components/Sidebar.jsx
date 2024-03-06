import { useState } from "react";
import { useDispatch } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { logout_user } from "../store/slices/userSlice";

export default function Sidebar() {
  const [showSidebar, setShowSidebar] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setShowSidebar((prevShowSidebar) => !prevShowSidebar);
  };

  const triggerLogout = () => {
    dispatch(logout_user());
    navigate("/login");
  };

  return (
    <>
      <aside
        className={`sidebar-container ${showSidebar ? "sidebar-open" : "sidebar-closed"}`}
      >
        <button className="toggle-button" onClick={toggleSidebar}>
          <i className="fi fi-rr-menu-burger"></i>
        </button>
        <nav className="aside-nav">
          {showSidebar ? (
            <>
              <NavLink to="/">
                <i className="fi fi-rr-home"></i>
                <span>Dasboard</span>
              </NavLink>
              <NavLink to="/inventory">
                <i className="fi fi-rr-shop"></i>
                <span>Inventory</span>
              </NavLink>
              <NavLink to="/orders">
                <i className="fi fi-rr-shopping-cart"></i>
                <span>Orders</span>
              </NavLink>
              <NavLink to="/clients">
                <i className="fi fi-rr-users"></i>
                <span>Clients</span>
              </NavLink>
              <NavLink to="/suppliers">
                <i className="fi fi-rr-truck-loading"></i>
                <span>Suppliers</span>
              </NavLink>
              <NavLink to="/analytics">
                <i className="fi fi-rr-chart-histogram"></i>
                <span>Analytics</span>
              </NavLink>
              <NavLink to="/profile">
                <i className="fi fi-rr-user" />
                <span>Profile</span>
              </NavLink>
              <NavLink to="/settings">
                <i className="fi fi-rr-settings"></i>
                <span>Settings</span>
              </NavLink>
            </>
          ) : (
            <>
              <NavLink to="/">
                <i className="fi fi-rr-home"></i>
              </NavLink>
              <NavLink to="/inventory">
                <i className="fi fi-rr-shop"></i>
              </NavLink>
              <NavLink to="/orders">
                <i className="fi fi-rr-shopping-cart"></i>
              </NavLink>
              <NavLink to="/clients">
                <i className="fi fi-rr-users"></i>
              </NavLink>
              <NavLink to="/suppliers">
                <i className="fi fi-rr-truck-loading"></i>
              </NavLink>
              <NavLink to="/analytics">
                <i className="fi fi-rr-chart-histogram"></i>
              </NavLink>
              <NavLink to="/profile">
                <i className="fi fi-rr-user" />
              </NavLink>
              <NavLink to="/settings">
                <i className="fi fi-rr-settings"></i>
              </NavLink>
            </>
          )}
        </nav>
        <button className="toggle-button logout-button" onClick={triggerLogout}>
          <i className="fi fi-rr-sign-out-alt"></i>
        </button>
      </aside>
    </>
  );
}
