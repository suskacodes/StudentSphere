import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/styles/AdminLogin.css"; 

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8000/api/admin-login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        alert("Invalid credentials");
        return;
      }

      const data = await response.json();

      
      if (data.role !== "admin") {
        alert("Access denied: Only admins can log in here.");
        return;
      }

      
      sessionStorage.setItem("name", data.name);
      sessionStorage.setItem("email", data.email);
      sessionStorage.setItem("role", data.role);
      navigate("/overview"); 
    } catch (error) {
      console.error("Login error:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <>
        {/* Header section */}
        <header className="header-section">
            <a href="/" className="site-logo">
            <img src="img/logo.png" alt="logo" />
            </a>
            <ul className="main-menu">
            <li><a href="/">Home</a></li>
            <li><a href="CreatePost">Create</a></li>
            <li><a href="Library">Library</a></li>
            </ul>
        </header>
        <section className="blog-section spad">
        <p> ‎ </p>
        <div className="admin-login-page">
        <div className="login-container">
        <h1>ADMIN LOGIN</h1>

        <form onSubmit={handleSubmit}>
            <div className="input-group">
            <label htmlFor="email">EMAIL</label>
            <input
                type="email"
                id="email"
                placeholder="someone@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            </div>

            <div className="input-group">
            <label htmlFor="password">PASSWORD</label>
            <input
                type="password"
                id="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            </div>

            <button type="submit">SIGN IN</button>
        </form>
        </div>
        </div>
        </section>
    </>
  );
}
