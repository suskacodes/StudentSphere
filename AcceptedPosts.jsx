import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom";

export default function AcceptedPosts() {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [likes, setLikes] = useState({});
  const [comments, setComments] = useState({});
  const [commentInput, setCommentInput] = useState("");
  const navigate = useNavigate();

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
    fetch("http://127.0.0.1:8000/api/accepted-posts/")
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => setPosts(data))
      .catch((err) => console.error("Error fetching accepted posts:", err));
  }, []);

  const handleAction = (id, action) => {
    let method = "POST";
    if (action === "delete") method = "DELETE"; 
  
    fetch(`http://127.0.0.1:8000/api/accepted-posts/${id}/${action}/`, {
      method: method,
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed request");
        return res.json();
      })
      .then(() => setPosts(posts.filter((p) => p.id !== id)))
      .catch((err) => console.error("Error updating post:", err));
  };

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
        <h2>Accepted Posts</h2>
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
                  <button className="btn" onClick={() => setSelectedPost(post)}>
                    Preview
                  </button>
                  <button
                    className="btn reject"
                    onClick={() => handleAction(post.id, "delete")}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Overlay */}
      {selectedPost && (
        <div className="modal-overlay" onClick={() => setSelectedPost(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={() => setSelectedPost(null)}>
              ✖
            </button>

            <img
              src={`http://127.0.0.1:8000${selectedPost.image}`}
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
                ❤️ {likes[selectedPost.id] || 0} Likes
              </button>
            </div>

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
