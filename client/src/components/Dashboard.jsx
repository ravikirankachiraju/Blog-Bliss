import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import {
  BsFillBellFill,
  BsChatDotsFill,
  BsFillArchiveFill,
  BsFillGrid3X3GapFill,
  BsMenuButtonWideFill,
  BsBoxArrowRight,
} from 'react-icons/bs';
import { Link, useNavigate } from 'react-router-dom';

function Dashboard() {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  const [totalComments, setTotalComments] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const [recentComments, setRecentComments] = useState([]);

  const navigate = useNavigate();

  const OpenSidebar = () => setOpenSidebarToggle(!openSidebarToggle);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.setItem('isLoggedIn', 'false');
    window.location.href = '/';
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Session expired. Please log in again.');
        navigate('/');
        return;
      }

      try {
        const [commentsRes, postsRes, recentRes] = await Promise.all([
          axios.get('http://localhost:3000/user/comments', { headers: { 'auth-token': token } }),
          axios.get('http://localhost:3000/user/posts', { headers: { 'auth-token': token } }),
          axios.get('http://localhost:3000/user/recent-comments', { headers: { 'auth-token': token } }),
        ]);

        setTotalComments(commentsRes.data.totalComments);
        setTotalPosts(postsRes.data.totalPosts);
        setRecentComments(recentRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load data');
      }
    };

    fetchData();
  }, [navigate]);

  return (
    <div className="dashboard-container">
      <Toaster position="top-right" />

      {/* Sidebar */}
      <aside id="sidebar" className={openSidebarToggle ? 'sidebar-responsive' : ''}>
        <ul className="sidebar-list">
          <li className="sidebar-list-item">
            <Link to="/">
              <BsFillArchiveFill className="icon" /> Home
            </Link>
          </li>
          <li className="sidebar-list-item">
            <Link to="/MyPosts">
              <BsFillGrid3X3GapFill className="icon" /> My Posts
            </Link>
          </li>
          <li className="sidebar-list-item">
            <Link to="/profile">
              <BsMenuButtonWideFill className="icon" /> Profile
            </Link>
          </li>
          <li className="sidebar-list-item" onClick={handleLogout}>
            <BsBoxArrowRight className="icon" /> Logout
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="main-container">
        <h2 className="mb-3">Dashboard</h2>
        <div className="main-cards">
          <div className="d-card w-auto">
            <div className="d-card-inner">
              <h4>Total Comments</h4>
              <span className="material-symbols-outlined">comment</span>
            </div>
            <h2>{totalComments}</h2>
          </div>
          <div className="d-card w-auto">
            <div className="d-card-inner">
              <h4>Total Posts</h4>
              <span className="material-symbols-outlined">post</span>
            </div>
            <h2>{totalPosts}</h2>
          </div>
        </div>
        <div className="recent-comments">
          <h4 className='mt-1 mb-3'>Recent Comments</h4>
          <table className="table table-striped table-bordered table-hover tbl">
            <thead className="thead-light">
              <tr>
                <th scope="col">#</th>
                <th scope="col">Username</th>
                <th scope="col">Comment</th>
                <th scope="col">Date & Time</th>
              </tr>
            </thead>
            <tbody>
              {recentComments.map((comment, index) => (
                <tr key={index}>
                  <th scope="row">{index + 1}</th>
                  <td>{comment.username}</td>
                  <td>{comment.text}</td>
                  <td>{new Date(comment.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;