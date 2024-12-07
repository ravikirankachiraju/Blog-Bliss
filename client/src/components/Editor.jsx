import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Toaster, toast } from "react-hot-toast";

const Editor = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState('');
  const [summary, setSummary] = useState("");
  const [summaryError, setSummaryError] = useState("");
  const [isSummarizing, setIsSummarizing] = useState(false);
  const navigate = useNavigate();
  const handleSummarize = async () => {
    if (!content) {
      setSummaryError("Please input content to summarize.");
      return;
    }

    setIsSummarizing(true);
    setSummaryError("");

    try {
      const response = await axios.post("http://localhost:8501/summarize", {
        content,
        max_length: 250, // Maximum words for summary
        min_length: 100,  // Minimum words for summary
      });

      if (response.data && response.data.summary) {
        setSummary(response.data.summary); // Set summary state
      } else {
        setSummaryError("Failed to summarize content. Please try again.");
      }
    } catch (error) {
      setSummaryError("Error connecting to summarization service.");
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    if (image) {
      formData.append('image', image);
    }

    try {
      const response = await axios.post('http://localhost:3000/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'auth-token': localStorage.getItem('token'),
        },
      });

      toast.success(response.data.message);

      setTimeout(() => {
        navigate('/');
      }, 500);
    } catch (err) {
      console.error('Error creating post:', err.response || err);
      toast.error('Error creating post');
    }
  };

  useEffect(() => {
    let isLoggedIn = localStorage.getItem('isLoggedIn') === "true";
    if (!isLoggedIn) {
      localStorage.setItem('addpostsrm', 'You must be logged in to post.');
      navigate('/signin');
    }
  }, []); 

  return (
    <div className="col-8 offset-2 mt-3 mb-3">
      <Toaster />
        <h3 className='mt-2'>Upload a New Post</h3>

      <form onSubmit={handleSubmit} noValidate className="needs-validation" encType="multipart/form-data">
      <button
          className="btn btn-info submit-btn form-control w-auto mt-2 mb-3"
          onClick={() => navigate('/generate-ai')}
        >
          Generate with AI
        </button>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">Title</label>
          <input
            type="text"
            name="post[title]"
            placeholder="Add a catchy title"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="content" className="form-label">Content</label>
          <textarea
            name="post[content]"
            className="form-control"
            rows="8"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          ></textarea>
          <div className="invalid-feedback">Please input some content to post</div>
        </div>

        <div className="mb-3">
          <label htmlFor="image" className="form-label">Upload Image</label>
          <input
            type="file"
            name="post[image]"
            className="form-control"
            onChange={(e) => setImage(e.target.files[0])}
            required
          />
        </div>

        <button className="btn btn-dark add-btn mb-2" type="submit">Add</button>
      </form>
      <div className="mt-4">
        <button
          className="btn btn-primary w-auto"
          onClick={handleSummarize}
          disabled={isSummarizing}
        >
          {isSummarizing ? "Summarizing..." : "Summarize"}
        </button>

        {summary && (
          <div className="mt-3">
            <h5>Summarized Content:</h5>
            <textarea
              className="form-control"
              value={summary}
              rows="6"
              readOnly
            ></textarea>
          </div>
        )}

        {summaryError && (
          <div className="alert alert-danger mt-3" role="alert">
            {summaryError}
          </div>
        )}
      </div>

      {message && <p>{message}</p>}
    </div>
  );
};

export default Editor;

