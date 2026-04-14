import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom";

export default function DeletedPosts() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [likes, setLikes] = useState({});
  const [comments, setComments] = useState({});
  const [commentInput, setCommentInput] = useState("");

  useEffect(() => {
    const name = sessionStorage.getItem('name');
    const role = sessionStorage.getItem("role");
    
    if (!name) {
      alert("You must be logged in to access this page.");
      navigate("/");
    } else if (role !== "admin") {
      alert("Unauthorized: Admins only.");
      navigate("/");
    }
  }, [navigate]);
  
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/deleted-posts/")
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => setPosts(data))
      .catch((err) => console.error("Error fetching pending posts:", err));
  }, []);

  const handleLike = (postId) => {
    setLikes((prev) => ({
      ...prev,
      [postId]: (prev[postId] || 0) + 1,
    }));
  };

  const handleComment = (postId) => {
    if (!commentInput.trim()) return;
    setComments((prev) => ({
      ...prev,
      [postId]: [...(prev[postId] || []), { user: "Admin", text: commentInput }],
    }));
    setCommentInput("");
  };

  return (
    <div className="admin-container">
      <Sidebar />
      <div className="content">
        <h2>Deleted Posts</h2>
        <table>
          <thead>
            <tr>
              <th>Heading</th>
              <th>Locality</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id}>
                <td>{post.heading}</td>
                <td>{post.locality}</td>
                <td>{new Date(post.created_at).toLocaleString()}</td>
                <td>
                  <button
                    className="btn"
                    onClick={() => setSelectedPost(post)}
                  >
                    Preview
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- Modal Overlay --- */}
      {selectedPost && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedPost(null)}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              className="close-button"
              onClick={() => setSelectedPost(null)}
            >
              ✖
            </button>

            {/* Image */}
            <img
              src={`http://127.0.0.1:8000${selectedPost.image}`}
              alt={selectedPost.heading}
              className="modal-image"
            />

            {/* Heading */}
            <h2 className="modal-heading">{selectedPost.heading}</h2>

            
            <div className="modal-meta">
              <span>By {selectedPost.name}</span> |{" "}
              <span>{selectedPost.locality}</span> |{" "}
              <span>
                {new Date(selectedPost.created_at).toLocaleDateString()}
              </span>
            </div>

            {/* Description */}
            <p className="modal-description">{selectedPost.description}</p>

            {/* Like button */}
            <div className="modal-actions">
              <button
                onClick={() => handleLike(selectedPost.id)}
                className="like-button"
              >
                ❤️ {likes[selectedPost.id] || 0} Likes
              </button>
            </div>

            {/* Comments section */}
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
                onClick={() => handleComment(selectedPost.id)}
                className="comment-button"
              >
                Post Comment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
