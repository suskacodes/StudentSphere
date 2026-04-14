import React, {useState,useEffect} from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import "../assets/styles/AdminLogin.css"; 
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

export default function Overview() {
  const [userName, setUserName] = useState(null);
  const navigate = useNavigate();
  const [kochiCount,setKochiCount] = useState(0);
  const [bangCount, setBangCount] = useState(0);
  const [pendingCount,setPendingCount] = useState(0);
  const [approvedCount,setApprovedCount] = useState(0);
  const [rejectedCount,setRejectedCount] = useState(0);
  const [totalCount,setTotalCount] = useState(0);
  
  const [totalFiles, setTotalFiles] = useState(0);
  const [topContributors, setTopContributors] = useState([]);

  useEffect(() => {
    const name = sessionStorage.getItem('name');
    const role = sessionStorage.getItem("role");

    if (!name) {
      alert("You must be logged in to access this page.");
      navigate("/");
    } else if (role !== "admin") {
      alert("Unauthorized: Admins only.");
      navigate("/");
    } else {
      setUserName(name);
    }
  }, [navigate]);

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
    fetch('http://localhost:8000/api/posts-count/')
      .then(res => res.json())
      .then(data => {
        setPendingCount(data.count_pending);
        setApprovedCount(data.count_approved);
        setRejectedCount(data.count_rejected);
        setTotalCount(data.count_pending+data.count_approved+data.count_rejected);

        setTotalFiles(data.count_files);
        setTopContributors(data.top_contributors);
      })
      .catch(err => console.error('Failed to fetch post counts:', err));
  }, []);


  const postsData = [
    { name: "Kochi", posts: kochiCount },
    { name: "Bangalore", posts: bangCount },
  ];

  const statusData = [
    { name: "Approved", value: approvedCount },
    { name: "Pending", value: pendingCount },
    { name: "Rejected", value: rejectedCount },
  ];

  const COLORS = ["#10ddb4", "#ffbb28", "#ff4444"];

  return (
    <div className="admin-container">
      <Sidebar />
      <div className="content">
        <h2 className="page-title">Admin Overview </h2>

        <div className="overview-cards1">
          <div className="card1" >
            <h3>Total Posts</h3>
            <p>{totalCount}</p>
          </div>
          <div className="card1">
            <h3><a className="aclass" href='pending-posts/'>Pending Posts</a></h3>
            <p>{pendingCount}</p>
          </div>
          <div className="card1">
            <h3><a className="aclass" href='accepted-posts/'>Accepted Posts</a></h3>
            <p>{approvedCount}</p>
          </div>
          <div className="card1">
            <h3><a className="aclass" href='deleted-posts/'>Deleted Posts</a></h3>
            <p>{rejectedCount}</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="charts-section1">
          <div className="chart-box1">
            <h3>Posts by Locality</h3>
            <BarChart width={500} height={300} data={postsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="posts" fill="#10ddb4" />
            </BarChart>
          </div>

          <div className="chart-box1">
            <h3>Posts Status</h3>
            <PieChart width={400} height={300}>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </div>
        </div>

        <div className="card1 full-width-card">
            <div className="card-left">
                <h3>Library Stats</h3>
                <p>Total Files Uploaded: {totalFiles}</p>
            </div>
            <div className="card-right">
                <h4>Top Contributors:</h4>
                {topContributors.length > 0 ? (
                    topContributors.map((contributor, index) => (
                        <h6 key={index}>
                            {index + 1}. {contributor.uploaded_by} - {contributor.file_count} files
                        </h6>
                    ))
                ) : (
                    <h6>No files have been uploaded yet.</h6>
                )}
            </div>
        </div>
      </div>
    </div>
  );
}
