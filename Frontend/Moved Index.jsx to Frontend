import React, {useState,useEffect} from "react";
import { Link , useNavigate} from 'react-router-dom';
import profileIcon from '../assets/images/profile.png'; 


export default function Index(){
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();
  const [userName, setUserName] = useState(null);
  const [kochiCount,setKochiCount] = useState(0);
  const [bangCount, setBangCount] = useState(0);
  const [selectedPost, setSelectedPost] = useState(null);

  const [likes, setLikes] = useState({});
  const [comments, setComments] = useState({});
  const [commentInput, setCommentInput] = useState("");

  const [selectedCity, setSelectedCity] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch("http://localhost:8000/api/posts/")
      .then(response => response.json())
      .then(data => setPosts(data))
      .catch(error => console.error("Error fetching posts:", error));
  }, []);

  useEffect(() => {
    const name = sessionStorage.getItem('name');
    if (name) {
      setUserName(name);
    }
  }, []);

  useEffect(() => {
    fetch('http://localhost:8000/api/locality-count/')
      .then(res => res.json())
      .then(data => {
        setKochiCount(data.count_kochi);
        setBangCount(data.count_bang);
      })
      .catch(err => console.error('Failed to fetch post counts:', err));
  }, []);

  useEffect(() => {
    fetch("http://localhost:8000/api/posts/")
      .then(response => response.json())
      .then(data => {
        setPosts(data);
        
        const initialLikes = {};
        const initialComments = {};
        data.forEach(post => {
          initialLikes[post.id] = post.likes_count || 0;
          initialComments[post.id] = post.comments || [];
        });
        setLikes(initialLikes);
        setComments(initialComments);
      })
      .catch(error => console.error("Error fetching posts:", error));
  }, []);

  const handleLike = (postId) => {
    const userEmail = sessionStorage.getItem("email");
    console.log("Attempting to like post with ID:", postId);
    if (!userEmail) {
      navigate("/Signin");
      return;
    }
  
    fetch(`http://localhost:8000/api/posts/${postId}/like/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: userEmail })
    })
      .then(res => res.json())
      .then(data => {
        setLikes(prev => ({ ...prev, [postId]: data.likes }));
      })
      .catch(err => console.error("Like error:", err));
  };
  
  const handleComment = (postId) => {
    if (!commentInput.trim()) return;
  
    fetch(`http://localhost:8000/api/posts/${postId}/comment/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        text: commentInput,
        user_name: sessionStorage.getItem("name") || "Anonymous"
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.user) {
          setComments((prev) => ({
            ...prev,
            [postId]: [...(prev[postId] || []), { text: data.text, user: data.user }],
          }));
          setCommentInput("");
        }
      })
      .catch((err) => console.error("Comment error:", err));
  };


  const handleLogout = () => {
    sessionStorage.clear(); 
    setUserName(null); 
    navigate('/'); 
    window.location.reload(); 
  };

  const normalize = (str) => str?.toLowerCase().trim();

  const filteredPosts = selectedCity
    ? posts.filter(post => normalize(post.locality) === normalize(selectedCity))
    : posts;

  const searchSuggestions = searchTerm
    ? posts.filter(post =>
        normalize(post.heading).includes(normalize(searchTerm))
      )
    : [];

    
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

      {/* Blog Section */}
      <section className="blog-section spad">
        <div className="container">
          <div className="row">
          <div className="col-lg-8">
          {filteredPosts.map((post, index) => (
            <div className="blog-post review-post" key={index}>
              <img src={`http://localhost:8000${post.image}`} alt={post.heading} />
              <div className="post-date">{post.created_at}</div>
              <h3>{post.heading}</h3>
              <div className="post-metas">
                <div className="post-meta">By <a>{post.name}</a></div>
                <div className="post-meta">in <a href="#" onClick={(e) => { e.preventDefault(); setSelectedCity(post.locality); }}>{post.locality}</a></div>
                <div className="post-meta">{post.comments_count} Comments</div>
              </div>
              <p>{post.description}</p>
              <button
                className="site-btn"
                onClick={() => {
                  setSelectedPost({
                    ...post,
                    likes_count: likes[post.id] || 0,
                    comments: comments[post.id] || [],
                  });
                }}
              >
                Read More
              </button>
            </div>
          ))}
          </div>
          {/* Modal Popup */}
          {selectedPost && (
            <>
            {console.log(selectedPost)}
            <div className="modal-overlay" onClick={() => setSelectedPost(null)}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                
                <button className="close-button" onClick={() => setSelectedPost(null)}>✖</button>


                <img
                  src={`http://localhost:8000${selectedPost.image}`}
                  alt={selectedPost.heading}
                  className="modal-image"
                />


                <h2 className="modal-heading">{selectedPost.heading}</h2>


                <div className="modal-meta">
                  <span>By {selectedPost.name}</span> |{" "}
                  <span>{selectedPost.locality}</span> |{" "}
                  <span>{new Date(selectedPost.created_at).toLocaleDateString()}</span>
                </div>


                <p className="modal-description">{selectedPost.description}</p>


                <div className="modal-actions">
                  <button
                    onClick={() => handleLike(selectedPost.id)}
                    className="like-button"
                  >
                    ❤️ {likes[selectedPost.id] || selectedPost.likes_count || 0} Likes
                  </button>
                </div>
                

                {/* Comments Section */}
                <div className="comments-section">
                  <h4>Comments</h4>
                  <div className="comments-list">
                    {comments[selectedPost.id]?.length > 0 ? (
                      comments[selectedPost.id].map((c, idx) => (
                        <div key={idx} className="comment">
                          <strong>{c.user}</strong>: {c.text}
                        </div>
                      ))
                    ) : (
                      <p className="no-comments">No comments yet.</p>
                    )}
                  </div>
                  <textarea
                    placeholder="Write a comment..."
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                  />
                  <button
                    onClick={() => {
                      handleComment(selectedPost.id);
                      setCommentInput("");
                    }}
                    className="comment-button"
                  >
                    Post Comment
                  </button>
                </div>
              </div>
            </div>
            </>
          )}

            {/* Sidebar */} 
            <div className="col-lg-4 sidebar">
              <div className="sb-widget">
              <form className="sb-search" onSubmit={(e) => e.preventDefault()}>
                <input 
                  type="text" 
                  placeholder="Search Posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button 
                    type="button" 
                    className="clear-search-btn"
                    onClick={() => setSearchTerm("")}
                  >
                    &times;
                  </button>
                )}
              </form>
              {searchSuggestions.length > 0 && (
                <div className="search-suggestions">
                  <ul>
                    {searchSuggestions.map(post => (
                      <li
                        key={post.id}
                        onClick={() => {
                          const fullPost = posts.find(p => p.id === post.id);
                          setSelectedPost({
                            ...fullPost,
                            likes_count: likes[fullPost.id] || 0,
                            comments: comments[fullPost.id] || [],
                          });
                          setSearchTerm(""); 
                        }}
                      >
                        {post.heading}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              </div>
              <div className="sb-widget">
                <h2 className="sb-title">Locations</h2>
                <ul className="sb-cata-list">
                  {[
                    ["📍 Kochi", kochiCount],
                    ["📍 Banglore", bangCount],
                  ].map(([label, count], idx) => (
                    <li key={idx}><a href="">{label}<span>{count}</span></a></li>
                  ))}
                </ul>
              </div>
              <div className="sb-widget">
                <h2 className="sb-title">Latest Posts</h2>
                <div className="latest-news-widget">
                  {posts.map((post, index) =>(
                    <div className="ln-item" key={index}
                      
                    >
                      <div className="ln-text">
                        <div className="ln-date">{post.created_at}</div>
                        <h6 onClick={() => {
                          setSelectedPost({
                            ...post,
                            likes_count: likes[post.id] || 0,
                            comments: comments[post.id] || [],
                          });
                        }}
                        style={{ cursor: "pointer" }}
                        >
                        {post.heading}</h6>
                        <div className="ln-metas">
                          <div className="ln-meta">{post.name}</div>
                          <div className="ln-meta">in <a href="#" onClick={(e) => { e.preventDefault(); setSelectedCity(post.locality); }}>{post.locality}</a></div>
                          <div className="ln-meta">{post.comments_count} Comments</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="sb-widget">
                <a href="#" className="add">
                
                </a>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <div className="footer-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-3">
              <div className="footer-widget">
                <div className="about-widget">
                  <img src="img/logo.png" alt="" />
                  <p>The ultimate goal of the StudentSphere project is to create and implement an integrated web-based platform for closing the information divide between local and visiting students.</p>
                </div>
              </div>
            </div>
            {["Services"].map((title, idx) => (
              <div className="col-lg-2 col-sm-6" key={idx}>
                <div className="footer-widget">
                  <h2 className="fw-title">{title}</h2>
                  <ul>
                    {[
                      { name: "Home", link: "/" },
                      { name: "Create Post", link: "/CreatePost" },
                      { name: "Library", link: "/Library" },
                      { name: "Admin Login", link: "/adminlogin" }
                    ].map((item, i) => (
                      <li key={i}>
                        <a href={item.link}>{item.name}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
            {["Contact"].map((title, idx) => (
              <div className="col-lg-2 col-sm-6" key={idx}>
                <div className="footer-widget">
                  <h2 className="fw-title">{title}</h2>
                  <ul>
                    {[
                      { name: "GitHub", link: "https://github.com/suskacodes" },
                      { name: "Linkedn", link: "https://www.google.com/" },
                    ].map((item, i) => (
                      <li key={i}>
                        <a href={item.link}>{item.name}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
            <div className="col-lg-3 col-sm-6">
              <div className="footer-widget fw-latest-post">
                <h2 className="fw-title">Useful Posts</h2>
                <div className="latest-news-widget">
                  {posts.map((post, index) =>(
                    <div className="ln-item" key={index}>
                      <div className="ln-text">
                        <h6>{post.heading}</h6>
                        <div className="ln-metas">
                          <div className="ln-meta">{post.name}</div>
                          <div className="ln-meta">in <a href="#">{post.locality}</a></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
