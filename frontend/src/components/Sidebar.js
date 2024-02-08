import React from "react";
import Menu from "../assets/menu.svg";
import GoogleChrome from "../assets/addToChrome.svg";
import { Link } from "react-router-dom";
import useClickOutside from "../pages/overview/hooks/useClickOutside";

const Sidebar = () => {
  const hideSidebar = () => {
    const sidebar = document.getElementById("sidebar");
    sidebar.classList.remove("show");
  };
  const sidebarRef = useClickOutside(hideSidebar);

  return (
    <div className="sidebar" id="sidebar" ref={sidebarRef}>
      <img
        src={Menu}
        alt=""
        className="sidebar-menu-svg"
        onClick={hideSidebar}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          alignItems: "center",
        }}
      >
        <Link to="/signin" className="login-signup-container">
          <span className="login-signup-btn sidebar-btn">LOGIN/SIGN UP</span>
        </Link>
        <Link className="add-to-chrome-container">
          <img src={GoogleChrome} alt="" className="google-chrome-svg" />

          <span className="add-to-chrome-btn">Add To Chrome</span>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
