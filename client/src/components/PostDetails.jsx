import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { toast, Toaster } from 'react-hot-toast';
import { ThumbsUp } from 'lucide-react';


const PostDetails = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  // checking where the page was loaded from or checking if state was passed to it
  const isFromMyPosts = location.state?.fromMyPosts;

  useEffect(() => {
    const fetchPost = async () => {
      try {

        // rendering the post using id
        const response = await axios.get(`http://localhost:3000/posts/${postId}`);
        setPost(response.data.post);
        setComments(response.data.post.comments || []);
      } catch (err) {
        toast.error('Failed to load post details');
      }
    };
    fetchPost();
  }, [postId]);

  const OnEdit = () => {
    navigate(`/posts/edit/${postId}`);
  };

  const OnDelete = async () => {
    try {
      await axios.delete(`http://localhost:3000/posts/${postId}`);
      toast.success("Post deleted successfully");

      setTimeout(() => {
        navigate('/MyPosts');

      }, 2000);
    } catch (err) {
      console.error('Error deleting post:', err);
      toast.error('Failed to delete post');
    }
  };

  // comments
  const handleAddComment = async (commentText) => {

    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        toast.error('You must be logged in to add a comment');
        return;
      }
      
      const response = await axios.post(`http://localhost:3000/posts/comments/${postId}`,
        { text: commentText },
        { headers: { 'auth-token': token } }
      );

      window.location.reload();

      // loads the prev comments again when the button is clicked due to which new comments appear immediately
      setComments((prevComments) => [
        ...prevComments,
        { username: response.data.comments.at(-1).username, text: commentText }
      ]);

      setNewComment(''); // Clear the input field
      toast.success('Comment added successfully');
    } catch (error) {
      console.error('Error adding comment:', error.response?.data?.message || error.message);
      toast.error('Failed to add comment');
    }
  };

  // deletion of comments
  const handleDeleteComment = async (commentId) => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        toast.error('You must be logged in to delete a comment');
        return;
      }

      // Send a DELETE request to the backend to delete the comment
      await axios.delete(`http://localhost:3000/posts/comments/${commentId}`, {
        headers: { 'auth-token': token }
      });

      // Remove the comment from the state
      setComments((prevComments) => prevComments.filter(comment => comment._id !== commentId));

      toast.success('Comment deleted successfully');
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error('You are not author of this comment!');
    }
  };


  return (
    <div className="container mt-4">
      <Toaster />
      {post ? (
        <div className="row mt-3">
          <div className="col-8 mb-3"> <h3> {post.title} </h3></div><br />
          <div className="card border-0" style={{width:'40rem'}}>
            <img
              src={post.image.url}
              alt="post_image"
              className='card-img-top'
            />
            </div>
            <div className="card ms-auto border-0" style={{width:'40rem'}}>
              <div className="card-body">

              <h5 class="card-title">Post Details</h5>
              <p className="card-text"> Posted by : {post.user.username ? post.user.username : 'Anonymous'}</p>
              <p className="card-text"> Posted on : {post.createdAt ? new Date(post.createdAt).toLocaleString() : "less than a minute"}</p>
                {/* Conditional rendering for "Last updated on" */}
                {post.updatedAt && post.createdAt && 
                new Date(post.updatedAt).getTime() !== new Date(post.createdAt).getTime() && (
                 <p className="card-text">
                   Last updated on: {new Date(post.updatedAt).toLocaleString()}
                 </p>
                )}


              
              {
                isFromMyPosts ?
                  <div className="btns">
                    <button
                      onClick={OnEdit}
                      className="btn btn-dark col-0.5 offset-3 edit-btn ms-0"
                      style={{ padding: '8px 16px' }}
                    >
                      Edit
                    </button> <br />
                    <button
                      onClick={OnDelete}
                      className="btn btn-dark offset-3 delete-btn ms-0"
                    >
                      Delete
                    </button>
                  </div> : ""

              }
              </div>
            </div>

          
          <div className="mt-3 post-content">
            <p>{post.content}</p>
          </div>
     
          {/* comments section */}
          <h4 className="mt-4">Comments</h4>

          <div className="d-flex align-items-center mb-3"> 
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="form-control me-2" // Adds margin to the right
              rows="1" // Single line height
              style={{ resize: 'none', width: '100%' }} // Removes resize handle, makes it fill the container
            ></textarea>

            <button
              onClick={() => handleAddComment(newComment)}
              className="btn btn-primary d-flex align-items-center submit-btn"
              style={{ borderRadius: '10px', padding: '10px 20px' }} // Rounded corners
            >
              <i className="fas fa-paper-plane me-2"></i> Post
            </button>
          </div>



          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {comments.slice().reverse().map((comment, index) => (
              // made a copy of comments to display them in reverse in order casue react changes on basis of reference
              
              <li
                key={index}
                style={{
                  marginBottom: '20px',
                  marginTop: '10px',
                  padding: '15px',
                  border: '1px solid #ddd',
                  borderRadius: '10px',
                  backgroundColor: '#f9f9f9',
                  boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                  marginBottom: '1rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                  <div>
                    <strong style={{ display: 'block', fontSize: '16px' }}>{comment.username}</strong>
                    <span style={{ fontSize: '12px', color: '#888' }}> {comment.createdAt ? formatDistanceToNow(new Date(comment.createdAt)):'unknown'}</span>
                    
                  </div>

                  {/* delete button */}
                  <button
                    onClick={() => handleDeleteComment(comment._id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#e74c3c',
                      cursor: 'pointer',
                      fontSize: '18px',
                      marginLeft: 'auto'
                    }}
                  >
                    <i className="fas fa-trash-alt"></i>
                  </button>

                </div>
                <p style={{ fontSize: '14px', color: '#333', marginBottom: '10px' }}>{comment.text}</p>
             
              </li>
            ))}
          </ul>


        </div>
      ) : (
        <div className="loader-container">
          <div className="loader"></div>
        </div>
      )}
    </div>
  );
};

export default PostDetails;
