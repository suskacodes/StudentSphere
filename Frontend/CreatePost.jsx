import React, { useState,useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../assets/styles/CreatePost.css';
import profileIcon from '../assets/images/profile.png';

const localities = [
  'Kochi',
  'Banglore',
];
const name=sessionStorage.getItem("name");

export default function CreatePost() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState(null);
  useEffect(() => {
    const name = sessionStorage.getItem('name');
    if (!name) {
      alert("You must be logged in to access this page.");
      navigate('/Signin');
    }
  }, [navigate]);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [heading, setHeading] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [description, setDescription] = useState('');
  const [locality, setLocality] = useState('');
  const [errors, setErrors] = useState({});
  
  const validate = () => {
    let tempErrors = {};
    if (!heading.trim()) tempErrors.heading = 'Please enter a heading';
    if (!imageFile) tempErrors.image = 'Please upload an image';
    if (!description.trim()) tempErrors.description = 'Please enter a description';
    if (!locality) tempErrors.locality = 'Please select a locality';
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImageFile(null);
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!validate()) return;
  
    const formData = new FormData();
    formData.append("heading", heading);
    formData.append("image", imageFile);
    formData.append("description", description);
    formData.append("locality", locality);
    formData.append("name",name)
  
    try {
      const response = await fetch("http://localhost:8000/api/create-post/", {
        method: "POST",
        body: formData,
        
      });
  
      if (response.ok) {
        alert("Post created successfully!");
        // Reset form fields here
        setHeading("");
        setImageFile(null);
        setImagePreview(null);
        setDescription("");
        setLocality("");
        setErrors({});
      } else {
        const errorData = await response.json();
        alert("Failed to create post: " + JSON.stringify(errorData.errors || errorData));
      }
    } catch (error) {
      alert("Network error: " + error.message);
    }
  };

  const logoSrc = '/img/logo.png'; 

  const handleLogout = () => {
    sessionStorage.clear(); 
    setUserName(null); 
    navigate('/'); 
    window.location.reload(); 
  };

  return (
    <>
      <header className="header-section">
        <a href="/" className="site-logo">
          <img src={logoSrc} alt="Site Logo" />
        </a>
        <ul className="main-menu2">
          <li><a href="/">Home</a></li>
          <li><a href="CreatePost">Create</a></li>
          <li><a href="Library">Library</a></li>
        </ul>

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

      <div className="create-post-container blog-post single-post">
      <button
          className="back-button"
          aria-label="Go back"
          title="Go back"
          onClick={() => navigate(-1)}
        >
          
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <h3>Create a Post</h3>

        <form onSubmit={handleSubmit} noValidate>
          <label htmlFor="heading" className="create-post-label">
            Heading:
          </label>
          <input
            type="text"
            id="heading"
            className="create-post-input"
            value={heading}
            placeholder="Enter post heading"
            onChange={(e) => setHeading(e.target.value)}
          />
          {errors.heading && <small className="create-post-error">{errors.heading}</small>}

          <label htmlFor="image" className="create-post-label">
            Upload Image:
          </label>
          <input
            type="file"
            id="image"
            accept="image/*"
            className="create-post-file-input"
            onChange={handleImageChange}
          />
          {errors.image && <small className="create-post-error">{errors.image}</small>}

          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="create-post-img-preview"
            />
          )}

          <label htmlFor="description" className="create-post-label">
            Description:
          </label>
          <textarea
            id="description"
            className="create-post-textarea"
            value={description}
            placeholder="Enter description"
            onChange={(e) => setDescription(e.target.value)}
          />
          {errors.description && <small className="create-post-error">{errors.description}</small>}

          <label htmlFor="locality" className="create-post-label">
            Locality:
          </label>
          <select
            id="locality"
            className="create-post-select"
            value={locality}
            onChange={(e) => setLocality(e.target.value)}
          >
            <option value="" disabled>
              -- Select Locality --
            </option>
            {localities.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
          {errors.locality && <small className="create-post-error">{errors.locality}</small>}


          <input
            type="hidden"
            id="name"
            className="create-post-input"
            value={name}
            placeholder={name}
          />
          {errors.name && <small className="create-post-error">{errors.heading}</small>}

          <button type="submit" className="create-post-button">
            Create Post
          </button>
        </form>
      </div>
    </>
  );
}
