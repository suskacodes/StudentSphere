import React, { useState, useEffect  } from 'react';
import { Link, useNavigate} from 'react-router-dom';
import '../assets/styles/signin.css';
import backArrow from '../assets/images/backarrow.png';


export default function Signin() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userName] = useState(null);

  useEffect(() => {
    const name = sessionStorage.getItem('name');
    if (name) {
      alert("You are already logged in!!");
      navigate('/');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = isLogin ? 'http://localhost:8000/api/login' : 'http://localhost:8000/api/register';
    const payload = isLogin
      ? { email, password }
      : { name, email, password };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (response.ok) {
        alert(data.message || (isLogin ? 'Login successful!' : 'Registered successfully!'));
        if (!isLogin) setIsLogin(true); 
		sessionStorage.setItem("name",data.name);
    sessionStorage.setItem("email",email);
    sessionStorage.setItem("role",data.role);
		window.location.href="/";
      } else {
        alert(data.error || 'Something went wrong!');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to connect to server.');
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
          {!userName && <li><a href="/Signin">Login</a></li>}
        </ul>
        <div className={`dropdown ${dropdownOpen ? 'is-active' : ''}`}>
        <div className="dropdown-trigger">
          <button
            className="button"
            aria-haspopup="true"
            aria-controls="dropdown-menu"
            onClick={() => setDropdownOpen(prev => !prev)}
          >
            <span>Select City 🡇</span>
          </button>
        </div>
        <div className="dropdown-menu" id="dropdown-menu" role="menu">
          <div className="dropdown-content">
            <Link to="#" className="dropdown-item is-active">India</Link>
            <hr className="dropdown-divider" />
            <Link to="#" className="dropdown-item">Kochi</Link>
            <Link to="#" className="dropdown-item">Banglore</Link>
          </div>
        </div>
      </div>
      </header>
      
    <div className="auth-container">
      <div className="auth-box">

        {/* back arrow image */}
        <img
        src={backArrow}
        alt="Go back"
        className={`${isLogin ? 'back-buttonlogin' : 'back-buttonsignup'}`}
        onClick={() => window.history.back()}
        />

        <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">{isLogin ? 'Login' : 'Sign Up'}</button>
        </form>
        <p>
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <span onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Sign Up' : 'Login'}
          </span>
        </p>
      </div>
    </div>
    </>
  );
}
