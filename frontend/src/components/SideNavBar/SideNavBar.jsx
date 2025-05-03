import React, { useContext } from "react";
import "./SideNavBar.css";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext";

const SideNavBar = ({ role }) => {
  console.log("Received role:", role);

  const { setToken } = useContext(AppContext);
  const navigate = useNavigate();

  const navItems = {
    Admin: [
      { name: "User Management", path: "/admin-users" },
      { name: "Export Orders", path: "/admin/view-orders" },
      { name: "Supplier Requests", path: "/admin/view-farm-orders" },
      { name: "Order Requests", path: "/admin/view-order-requests" },
      { name: "View Deliveries", path: "/admin/view-deliveries" },
      { name: "Manage Inventory", path: "/admin/manage-inventory" },
      { name: "Full Inventory", path: "/view/inventory" },
      { name: "View Leave Requests", path: "/admin/view-leaves" },

     
    ],
    Exporter: [
      { name: "Place Order", path: "/exporter/place-order" },
      { name: "View Orders", path: "/exporter/view-order" },
      { name: "Fish Inventory", path: "/exporter/inventory" },
      { name: "User Profile", path: "/exporter-view-profile" },
      { name: "Reviews", path: "/admin/post-review" },
    ],
    Supplier: [
      { name: "Manage Fish Inventory", path: "/supplier/add-fish" },
      { name: "Pending Requests", path: "/supplier/view-order" },
      { name: "User Profile", path: "/supplier-view-profile" },
    ],
    Employer: [
      { name: "Request Leave", path: "/employee/add-leave" },
      { name: "View Leave Requests", path: "/employee/view-leaves" },
      { name: "User Profile", path: "/employee-view-profile" },
    ],
  };

  const handleLogout = async () => {
    localStorage.removeItem("token");
    await setToken("");
    navigate("/"); // Navigate to the homepage
  };

  return (
    <div className="sidebar">
      <h2 className="sidebar-title">
        {role.charAt(0).toUpperCase() + role.slice(1)} Dashboard
      </h2>
      <ul className="sidebar-menu">
        {navItems[role]?.map((item, index) => (
          <li key={index} className="sidebar-item">
            <Link to={item.path} className="sidebar-link">
              {item.name}
            </Link>
          </li>
        ))}
      </ul>

      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default SideNavBar;
