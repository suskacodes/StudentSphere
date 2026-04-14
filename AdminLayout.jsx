import React from "react";
import { Link, Outlet } from "react-router-dom";
import "./admin.css";

export default function AdminLayout({ children }) {
  return (
    <div className="admin-container">
      <div className="sidebar">
        <h2>Admin</h2>
        <Link to="/admin/overview">Overview</Link>
        <Link to="/admin/pending-posts">Pending Posts</Link>
        <Link to="/admin/accepted-posts">Accepted Posts</Link>
        <Link to="/admin/deleted-posts">Deleted Posts</Link>
        <Link to="/admin/homepage-preview">Homepage</Link>
      </div>
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
}
