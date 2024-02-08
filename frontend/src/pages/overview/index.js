import React, { useState } from "react";
import "./style.css";
import { Link } from "react-router-dom";
import GoogleChrome from "../../assets/addToChrome.svg";
import Menu from "../../assets/menu.svg";
import Sidebar from "../../components/Sidebar";
import Hero from "./components/Hero";

const index = () => {
  const toggleSidebar = () => {
    const sidebar = document.getElementById("sidebar");
    sidebar.classList.toggle("show");
  };

  return (
    <>
      <div className="overview-nav-container">
        <Link to="/overview" className="logo-link">
          <img
            src={require("../../assets/logo.jpg")}
            className="logo-img"
            alt=""
          />
          <span className="logo-text">Twain</span>
        </Link>
        <div className="header-elements">
          <Link to="/signin" className="login-signup-container">
            <span className="login-signup-btn">LOGIN/SIGN UP</span>
          </Link>
          <Link className="add-to-chrome-container">
            <img src={GoogleChrome} alt="" className="google-chrome-svg" />

            <span className="add-to-chrome-btn">Add To Chrome</span>
          </Link>
        </div>
        <img src={Menu} alt="" className="menu-svg" onClick={toggleSidebar} />
      </div>

      <Sidebar />
      <Hero />
    </>
  );
};

export default index;
