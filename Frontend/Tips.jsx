import React, {useState,useEffect} from "react";
import { Link , useNavigate} from 'react-router-dom';
import profileIcon from '../assets/images/profile.png'; 


export default function Index(){
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const [userName, setUserName] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);

  useEffect(() => {
    const name = sessionStorage.getItem('name');
    if (name) {
      setUserName(name);
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.clear(); 
    setUserName(null); 
    navigate('/'); 
    window.location.reload(); 
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
            <Link to="#" className="dropdown-item" onClick={() => setSelectedCity(null)}>
              All
            </Link>
            <hr className="dropdown-divider" />
            <Link to="#" className="dropdown-item" onClick={() => setSelectedCity("Kochi")}>
              Kochi
            </Link>
            <Link to="#" className="dropdown-item" onClick={() => setSelectedCity("Banglore")}>
              Banglore
            </Link>
          </div>
        </div>

      </div>
      
       {/* Right Side: User Profile */}
       {userName && (
        <div className="profile-container" style={{ position: 'relative' }}>
          <span className="profile-welcome-text" onClick={() => setShowDropdown(!showDropdown)}>Welcome, {userName}</span>
          <img
            src={profileIcon}
            alt="profile"
            classname="profile-icon"
            onClick={() => setShowDropdown(!showDropdown)}
          />
          {showDropdown && (
            <div
              className="dropdown-content"
              style={{
                position: 'absolute',
                top: '40px',
                right: '0px',
                backgroundColor: '#000',
                boxShadow: '0px 4px 6px rgba(0,0,0,0.1)',
                padding: '10px',
                borderRadius: '8px',
                zIndex: '999'
              }}
            >
              <a href="#" onClick={handleLogout}>Logout</a>
            </div>
          )}
        </div>
      )}

      </header>

      {/* Page Top Section */}
      <section data-setbg="img/header-bg/1.jpg">
        <div className="container">
          <h2> T </h2>
        </div>
      </section>
    </>
  );
};
