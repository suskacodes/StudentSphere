import React, { useState, useEffect } from 'react';
import { Link , useNavigate} from 'react-router-dom';
import profileIcon from '../assets/images/profile.png'; 

export default function Library() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [name, setUserName] = useState(null);
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [uploadFile, setUploadFile] = useState(null);


  useEffect(() => {
    const name = sessionStorage.getItem('name');
    if (name) {
      setUserName(name);
    }
  }, []);

  useEffect(() => {
    fetch('http://localhost:8000/api/library/')
      .then(res => res.json())
      .then(data => setFiles(data))
      .catch(err => console.error('Fetch error:', err));
  }, []);

  useEffect(() => {
    const name = sessionStorage.getItem('name');
    if (!name) {
      alert("You must be logged in to access this page.");
      navigate('/Signin');
    }
  }, [navigate]);
  
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadFile || uploadFile.size > 10 * 1024 * 1024) {
      alert("Please upload a file smaller than 10MB");
      return;
    }

    const formData = new FormData();
    formData.append('file', uploadFile);
    formData.append('name', uploadFile.name);
    formData.append('uploaded_by', name);

    const response = await fetch('http://localhost:8000/api/library/', {
      method: 'POST',
      body: formData
    });

    if (response.ok) {
      const newFile = await response.json();
      setFiles([newFile, ...files]);
      setUploadFile(null);
      alert('Uploaded successfully!');
    } else {
      alert('Upload failed.');
    }
  };

  if (!name) {
    return <div className="container1"><h3>You must be logged in to access the Library.</h3></div>;
  }

  const handleLogout = () => {
    sessionStorage.clear(); 
    setUserName(null); 
    navigate('/'); 
    window.location.reload(); 
  };

  return (
    <>
    <div>
          {/* Header section */}
          <header className="header-section">
        <a href="/" className="site-logo">
          <img src="img/logo.png" alt="logo" />
        </a>
        <ul className="main-menu">
          <li><a href="/">Home</a></li>

          {!name && <li><a href="/Signin">Login</a></li>}
          <li><a href="CreatePost">Create</a></li>
          <li><a href="Library">Library</a></li>
        </ul>

      
       {/* Right Side: User Profile */}
       {name && (
        <div className="profile-container" style={{ position: 'relative' }}>
          <span style={{ marginRight: '10px' }}>Welcome, {name}</span>
          <img
            src={profileIcon}
            alt="profile"
            style={{ width: '30px', height: '30px', cursor: 'pointer' }}
            onClick={() => setShowDropdown(!showDropdown)}
          />
          {showDropdown && (
            <div
              className="dropdown-content"
              style={{
                position: 'absolute',
                top: '40px',
                right: '0px',
                backgroundColor: '#fff',
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
    </div>
    <section className="blog-section spad">
      <div className="library-content" style={{ marginTop: "50px" }}>
        <h2>📚 Student Library</h2>

        <form onSubmit={handleUpload} style={{ marginTop: "20px" }}>
          <input
            type="file"
            accept="application/pdf"
            onChange={e => setUploadFile(e.target.files[0])}
          />
          <button type="submit" className="site-btn1" style={{ marginLeft: "10px" }}>Upload PDF</button>
        </form>

        <div style={{ marginTop: "30px" }}>
          <h4>Available PDFs:</h4>
          <ul>
            {files.map((file, idx) => {
              return (
                <li key={idx}>
                  📄 {file.name} &nbsp; — Uploaded by: {file.uploaded_by} &nbsp;
                  <a 
                    href={`http://localhost:8000/api/library/${file.id}/download/`} 
                    download={file.name} 
                    rel="noreferrer"
                  >
                    Download
                  </a>

                </li>
              );
            })}
          </ul>

        </div>
      </div>
    </section>
    </>
  );
}
