import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./admin.css";

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {

    sessionStorage.clear();

    navigate("/");
  };
  return (
    <div className="sidebar1">
      <a href="/overview" className="site-logo1">
        <img src="img/logo.png" alt="logo" />
      </a>
      <Link to="/overview">Overview</Link>
      <Link to="/pending-posts">Pending Posts</Link>
      <Link to="/accepted-posts">Accepted Posts</Link>
      <Link to="/deleted-posts">Deleted Posts</Link>
      <Link to="/">Homepage</Link>
      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}
