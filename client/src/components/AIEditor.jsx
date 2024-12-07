import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AIEditor = () => {
  const [inputText, setInputText] = useState("");
  const [noWords, setNoWords] = useState("");
  const [blogStyle, setBlogStyle] = useState("Researchers");
  const [title, setTitle] = useState("");
  const [images, setImages] = useState([]);
  const [generatedBlog, setGeneratedBlog] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedFile, setSelectedFile] = useState(null); // For image upload
  const [imagePreview, setImagePreview] = useState(null); // For image preview
  const [isEditable, setIsEditable] = useState(false); // Track if blog is being edited
  const [summary, setSummary] = useState("");
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summaryError, setSummaryError] = useState("");
  const navigate = useNavigate();

  // Helper function to trim the last incomplete sentence
  const trimIncompleteSentence = (text) => {
    const sentenceEndings = [".", "!", "?"];
    let trimmedText = text.trim();
  
    // Only trim if the last character isn't a valid sentence-ending punctuation
    if (!sentenceEndings.some((char) => trimmedText.endsWith(char))) {
      // Find the last full sentence by looking for the last period, exclamation mark, or question mark
      const lastSentenceEnd = Math.max(
        trimmedText.lastIndexOf("."),
        trimmedText.lastIndexOf("!"),
        trimmedText.lastIndexOf("?")
      );
  
      if (lastSentenceEnd !== -1) {
        trimmedText = trimmedText.slice(0, lastSentenceEnd + 1); // Keep the sentence-ending punctuation
      }
    }
  
    return trimmedText;
  };
  // Generate the blog post
  const handleGenerateBlog = async (e) => {
    e.preventDefault();
    if (!inputText || !noWords || !title) {
      setError("Please fill in all fields!");
      return;
    }

    const requestData = {
      input_text_field: inputText,
      no_words: parseInt(noWords),
      blog_style: blogStyle,
      title: title,
      image: images,
    };

    setIsLoading(true);
    setGeneratedBlog("");
    setError("");

    try {
      const response = await fetch("http://localhost:8501/generate_blog", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      if (response.ok) {
        let generatedText = data.generated_text;

        // Trim the last incomplete sentence
        generatedText = trimIncompleteSentence(generatedText);

        setGeneratedBlog(generatedText);
      } else {
        setError(data.error || "Something went wrong!");
      }
    } catch (err) {
      setError("Error generating blog. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  // Summarize the blog post
  const handleSummarize = async () => {
    if (!generatedBlog) {
      setSummaryError("Please generate content before summarizing.");
      return;
    }

    setIsSummarizing(true);
    setSummaryError("");

    try {
      const response = await axios.post("http://localhost:8501/summarize", {
        content: generatedBlog,
        max_length: 150, // Max number of words in the summary
        min_length: 100,  // Min number of words in the summary
      });

      if (response.data && response.data.summary) {
        setSummary(response.data.summary);  // Update the summary state with the response
      } else {
        setSummaryError("Failed to summarize content. Please try again.");
      }
    } catch (error) {
      setSummaryError("Error connecting to summarization service.");
    } finally {
      setIsSummarizing(false);
    }
  };

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];  // Get the first selected file
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result); // Set the preview image
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle post submission
  const handleAddPost = async () => {
    if (!generatedBlog || !title) {
      setError("Cannot add post without generated content and title.");
      return;
    }

    if (!selectedFile) {
      setError("No file selected. Please upload an image.");
      return;
    }

    const token = localStorage.getItem('token'); // Get the token from localStorage
    console.log('Retrieved token:', token); // Log the token to verify it's being retrieved

    if (!token) {
      setError("You are not logged in. Please log in first.");
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('title', title);
    formData.append('content', generatedBlog);

    try {
      // Send POST request with Authorization header
      const response = await axios.post('http://localhost:3000/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'auth-token':token, // Correctly send token as 'Bearer <token>'
        },
      });

   
        navigate('/');
      
    } catch (err) {
      console.error('Error adding post:', err);
      // Check if error is 401 Unauthorized and handle it
      if (err.response && err.response.status === 401) {
        setError("Unauthorized access. Please log in again.");
      } else {
        setError("Error adding post. Please try again.");
      }
    }
  };

  // Edit generated blog
  const handleEditBlog = () => {
    setIsEditable(true);
  };

  // Save edited blog
  const handleSaveBlog = () => {
    setIsEditable(false);

    // Trim the last incomplete sentence before saving
    const trimmedBlog = trimIncompleteSentence(generatedBlog);
    setGeneratedBlog(trimmedBlog);
    // Optionally, save to backend or local storage here
  };

  // Delete generated blog content
  const handleDeleteBlog = () => {
    setGeneratedBlog("");
    setIsEditable(false);
    setTitle("");
    setInputText("");
    setNoWords("");
  };

  return (

      <div className="col-8 offset-3 mt-4">
        <h3 className="mt-2">Generate a Blog Post</h3>
        <form onSubmit={handleGenerateBlog} novalidate className="needs-validation" enctype="multipart/form-data">
          <div className="mb-3">
            <label htmlFor="title" className="form-label">Title</label>
            <input
              type="text"
              className="form-control w-75"
              placeholder="Add a catchy title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="noWords" className="form-label">Word Count (Max: 1500 , Takes more time & needs high speed internet connection as word count is high)</label>
            <input
              type="number"
              className="form-control w-75"
              placeholder=''
              value={noWords}
              onChange={(e) => setNoWords(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="content" className="form-label">Enter topic to be generated by AI</label>
            <textarea
              className="form-control w-75"
              rows="3"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="blogStyle" className="form-label">Blog Style</label>
            <select
              className="form-control w-75"
              value={blogStyle}
              onChange={(e) => setBlogStyle(e.target.value)}
            >
              <option value="Researchers">Researchers</option>
              <option value="Data Scientists">Data Scientists</option>
              <option value="Business Executives">Business Executives</option>
              <option value="Students">Students</option>
              <option value="Tech Enthusiasts">Tech Enthusiasts</option>
              <option value="Entrepreneurs">Entrepreneurs</option>
              <option value="Healthcare Professionals">Healthcare Professionals</option>
              <option value="Marketers">Marketers</option>
              <option value="Educators">Educators</option> 
              <option value="Common Audience">Common Audience</option>
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="image" className="form-label">Upload Image</label>
            <input
              type="file"
              className="form-control w-75"
              onChange={handleImageChange}
            />
            {imagePreview && (
              <div className="mt-2">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="img-fluid"
                  style={{ maxWidth: '100%', maxHeight: '300px' }}
                />
              </div>
            )}
          </div>

          <button
            className="btn btn-dark w-auto"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Generating...' : 'Generate Blog'}
          </button>
        </form>

        {error && <div className="alert alert-danger mt-3" role="alert">{error}</div>}

        {generatedBlog && (
        <div className="mt-4">
          <h5>Generated Blog:</h5>
          <textarea
            className="form-control w-75"
            value={generatedBlog}
            onChange={(e) => setGeneratedBlog(e.target.value)}
            rows="12"
            disabled={!isEditable}
          />
          <div className="mt-2">
            {isEditable ? (
              <button className="btn edit-btn" onClick={handleSaveBlog}>
                Save
              </button>
            ) : (
              <button className="btn edit-btn" onClick={handleEditBlog}>
                Edit
              </button>
            )}
            <button className="btn delete-btn" onClick={handleDeleteBlog}>
              Clear
            </button>
          </div>

          <button
            className="btn sum-btn w-auto mt-4"
            style={{backgroundColor: '#4d718e', color:'#fff'}}
            onClick={handleSummarize}
            disabled={isSummarizing}
          >
            {isSummarizing ? "Summarizing..." : "Summarize"}
          </button>

          {summary && (
            <div className="mt-4">
              <h5>Summarized Content:</h5>
              <textarea
                className="form-control w-75"
                value={summary}
                rows="6"
                readOnly
              />
            </div>
          )}

          {summaryError && (
            <div className="alert alert-danger mt-3" role="alert">
              {summaryError}
            </div>
          )}
        </div>
      )}

      <button className="btn submit-btn w-auto mt-4 mb-4" onClick={handleAddPost}>
        Add Post
      </button>
    </div>
  );
};

export default AIEditor;
