import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import {
  FaUserEdit,
  FaKey,
} from "react-icons/fa";

const ProfilePage = () => {
  const [profileImage, setProfileImage] = useState(null);
  const fileInputRef = useRef(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [socialLinks, setSocialLinks] = useState({
    facebook: "",
    instagram: "",
    twitter: "",
    linkedin: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:3000/profile", {
          headers: { "auth-token": token },
        });

        const { username, email, bio, socialLinks, profileImage } = response.data;
        setUsername(username || "");
        setEmail(email || "");
        setBio(bio || "");
        setSocialLinks(socialLinks || {});
        setProfileImage(profileImage || null);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
  
      reader.onloadend = () => {
        setProfileImage({ url: reader.result }); // Directly store the base64 string for preview
      };
  
      reader.readAsDataURL(file); // Convert the file to base64
    }
  };
  

  const handleUploadClick = () => fileInputRef.current.click();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSocialLinks((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("username", username);
      formData.append("bio", bio);
      formData.append("facebook", socialLinks.facebook || "");
      formData.append("instagram", socialLinks.instagram || "");
      formData.append("twitter", socialLinks.twitter || "");
      formData.append("linkedin", socialLinks.linkedin || "");
  
      if (fileInputRef.current.files[0]) {
        formData.append("profilePic", fileInputRef.current.files[0]); // Send image file to server
        
      }
     
      // Send the formData (including profile image) to the server
      const response = await axios.put("http://localhost:3000/profile", formData, {
        headers: {
          "auth-token": token,
          "Content-Type": "multipart/form-data", // Ensure the content type is set for FormData
        },
      });
  
      // Handle successful update
      alert("Profile updated successfully!");
      setProfileImage(response.data.profileImage.url); // Assuming the server returns the profile image URL
      setIsEditing(false);
      window.location.reload();
      
    } catch (error) {
      console.error("Error updating profile:", error.response?.data || error.message);
      alert("Failed to update profile.");
    }
  };
  

  const handleSocialLinkClick = (platform) => {
    if (!isEditing) {
      const url = socialLinks[platform];
      if (url) {
        window.open(url, "_blank");
      }
    }
  };

  return (
    <div style={styles.pageContainer}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <div style={styles.sidebarItem}>
          <h2>Settings</h2>
        </div>
        <div
          style={styles.sidebarItem} className="sidebarItem"
          onClick={() => setIsEditing(!isEditing)}
        >
          <FaUserEdit style={styles.icon} />
          <span>{isEditing ? "Update Profile" : "Edit Profile"}</span>
        </div>
  
      </div>

      {/* Profile Section */}
      <div style={styles.container}>
        <div style={styles.profileContainer}>
          <h2 style={styles.header}>Profile</h2>
          {/* Profile Image */}
          <div style={styles.profileImageSection}>
            <label htmlFor="uploadImage" style={styles.imageLabel}>
              {profileImage && profileImage.url ? (
                <img
                  src={profileImage.url}
                  alt="profile_image"
                  style={styles.profileImage}
                />
              ) : (
                <div style={styles.uploadPlaceholder}>Upload Image</div>
              )}
            </label>
            <input
              type="file"
              id="uploadImage"
              style={styles.fileInput}
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageChange}
              disabled={!isEditing}
            />
          </div>
          <button
            onClick={handleUploadClick}
            style={styles.uploadButton}
            disabled={!isEditing}
          >
            Upload
          </button>

          {/* Profile Details */}
          <div style={styles.formSection}>
            <div style={styles.inputGroup}>
              <label>Username</label>
              <input
                type="text"
                value={username}
                style={styles.input}
                onChange={(e) => setUsername(e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div style={styles.inputGroup}>
              <label>Email</label>
              <input
                type="email"
                value={email}
                style={styles.input}
                disabled
              />
            </div>
            <div style={styles.inputGroup}>
              <label>Bio</label>
              <textarea
                maxLength="200"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                style={styles.textarea}
                disabled={!isEditing}
              />
            </div>

            {/* Social Links */}
            <h3 style={styles.subHeader}>Add Your Social Handles Below</h3>
            {["facebook", "instagram", "twitter", "linkedin"].map((platform) => (
              <div
                key={platform}
                style={styles.socialInputGroup}
                onClick={() => handleSocialLinkClick(platform)}
              >
                <input
                  type="text"
                  name={platform}
                  placeholder={`${platform.charAt(0).toUpperCase() + platform.slice(1)} URL`}
                  value={socialLinks[platform]}
                  onChange={handleInputChange}
                  style={{
                    ...styles.socialInput,
                    cursor: isEditing ? "text" : "pointer",
                  }}
                  disabled={!isEditing}
                />
              </div>
            ))}
          </div>

          {/* Update Button */}
          {isEditing && (
            <button onClick={handleUpdateProfile} style={styles.updateButton}>
              Save Changes
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  pageContainer: {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "#f8f9fa",
  },
  sidebar: {
    width: "300px",
    backgroundColor: "#f8f9fa",
    color: "#000",
    display: "flex",
    flexDirection: "column",
    padding: "20px",
    marginBottom: "0.5rem",
    border: "1px solid #e0e0e0"
  },
  sidebarItem: {
    display: "flex",
    alignItems: "center",
    marginBottom: "20px",
    cursor: "pointer",
  },
  icon: {
    marginRight: "10px",
    fontSize: "20px",
  },
  container: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    padding: "40px 20px",
  },
  profileContainer: {
    width: "800px",
    backgroundColor: "#ffffff",
    padding: "30px",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  },
  header: {
    marginBottom: "20px",
    textAlign: "center",
    color: "#333",
  },
  profileImageSection: {
    textAlign: "center",
    marginBottom: "10px",
  },
  imageLabel: {
    display: "inline-block",
    cursor: "pointer",
  },
  profileImage: {
    width: "150px",
    height: "150px",
    borderRadius: "50%",
    objectFit: "cover",
  },
  uploadPlaceholder: {
    width: "150px",
    height: "150px",
    borderRadius: "50%",
    backgroundColor: "#e0e0e0",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#777",
    fontSize: "16px",
  },
  fileInput: {
    display: "none",
  },
  uploadButton: {
    marginTop: "10px",
    padding: "8px 16px",
    backgroundColor: "#4d718e",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    display: "block",
    margin: "0 auto",
  },
  formSection: {
    marginBottom: "20px",
  },
  inputGroup: {
    marginBottom: "15px",
  },
  input: {
    width: "100%",
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    marginTop: "5px",
  },
  textarea: {
    width: "100%",
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    height: "100px",
    marginTop: "5px",
  },
  charCounter: {
    textAlign: "right",
    fontSize: "12px",
    color: "#888",
  },
  socialInputGroup: {
    marginBottom: "15px",
    cursor: "pointer", // Indicates the input is clickable
  },
  socialInput: {
    width: "100%",
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  subHeader: {
    marginBottom: "10px",
    fontSize: "18px",
    fontWeight: "bold",
  },
  updateButton: {
    padding: "10px 20px",
    backgroundColor: "#4d8e8b",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    display: "block",
    margin: "20px auto",
  },
};

export default ProfilePage;
