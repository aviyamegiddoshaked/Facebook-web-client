import React, { useState, useEffect, useRef } from "react";
import jsonData from "../data.json";

const Feed = () => {
  const [userData, setUserData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [newPostImage, setNewPostImage] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [friendRequestsReceived, setFriendRequestsReceived] = useState([]);
  const [friendRequestsSent, setFriendRequestsSent] = useState([]);
  const [message, setMessage] = useState([]);
  const [sortBy, setSortBy] = useState("date");
  const [filterBy, setFilterBy] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [newPostMessage, setNewPostMessage] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [editingPostId, setEditingPostId] = useState(null);
  const [editedPostMessage, setEditedPostMessage] = useState("");
  const [likesData, setLikesData] = useState({});
  useEffect(() => {
    fetchUserData();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      setNewPostImage(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };
  // Function to search users
  const searchUsers = async () => {
    try {
      const params = { name: searchQuery };
      const queryString = new URLSearchParams(params).toString();
      const url = `http://localhost:4000/api/search/?${queryString}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to search users");
      }
      const data = await response.json();
      setSearchResults(data.users);
    } catch (error) {
      console.error("Error searching users:", error);
    }
  };

  // Function to send friend request
  const sendFriendRequest = async (userId) => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/users/${userId}/friend-request`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("userData")}`,
          },
          body: JSON.stringify({ user: userData }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to send friend request");
      }
      setFriendRequestsSent([...friendRequestsSent, userId]);
    } catch (error) {
      console.error("Error sending friend request:", error);
    }
  };

  // Function to approve friend request
  const approveFriendRequest = async (userId) => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/users/${userId}/approve-friend-request`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("userData")}`,
          },
          body: JSON.stringify({ user: userData }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to approve friend request");
      }
      const updatedRequestsReceived = await Promise.all(
        friendRequestsReceived
          .filter((u) => u.userId !== userId)
          .map(async (u) => {
            console.log(u);
            const response = await fetch(
              `http://localhost:4000/api/users/${u.userId}`
            );
            const data = await response.json();
            return { userId: u.userId, name: u.name };
          })
      );
      console.log(updatedRequestsReceived);
      setFriendRequestsReceived(updatedRequestsReceived);
    } catch (error) {
      console.error("Error approving friend request:", error);
    }
  };

  // Function to decline friend request
  const declineFriendRequest = async (userId) => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/users/${userId}/decline-friend-request`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("userData")}`,
          },
          body: JSON.stringify({ user: userData }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to decline friend request");
      }

      // Update the list of friend requests received after declining
      const updatedRequestsReceived = friendRequestsReceived.filter(
        (u) => u.userId !== userId
      );
      setFriendRequestsReceived(updatedRequestsReceived);
    } catch (error) {
      console.error("Error declining friend request:", error);
    }
  };

  const fetchPosts = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/posts/${id ?? userData._id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userData")}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch posts");
      }
      const data = await response.json();

      setPosts(data.posts);
      const likesData = {};
      data.posts.forEach((post) => {
        likesData[post._id] = post.likes;
      });
      setLikesData(likesData);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const handleLikePost = async (post) => {
    try {
      // Check if the post is already liked
      const isLiked = post.likes && post.likes.includes(userData.email);

      // Toggle like status
      const updatedLikes = isLiked
        ? post.likes.filter((email) => email !== userData.email) // Remove user email from likes array if already liked
        : [...(post.likes || []), userData.email]; // Add user email to likes array if not liked

      const response = await fetch(
        `http://localhost:4000/api/posts/${post._id}/like`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("userData")}`,
          },
          body: JSON.stringify({ likes: updatedLikes }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update post likes");
      }

      // Update the post state with the updated likes array
      const updatedPost = post;
      updatedPost.likes = updatedLikes;
      fetchPosts();
    } catch (error) {
      console.error("Error liking/unliking post:", error);
    }
  };

  const fetchUserData = async () => {
    try {
      const id = localStorage.getItem("userId");
      const response = await fetch(`http://localhost:4000/api/users/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userData")}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch user details");
      }
      const data = await response.json();
      setUserData(data);
      await fetchPosts(data._id);
      const friendRequests = await Promise.all(
        data.friendRequestsReceived.map(async (u) => {
          const response = await fetch(`http://localhost:4000/api/users/${u}`);
          const userData = await response.json();
          return { userId: u, name: userData.name };
        })
      );
      setFriendRequestsReceived(friendRequests);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
  console.log(userData);
  console.log(friendRequestsReceived);
  // Function to handle unliking a post
  const handleUnlikePost = async (postId) => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/posts/${postId}/unlike`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("userData")}`,
          },
          body: JSON.stringify({ email: userData.email }), // Send user's email
        }
      );

      if (!response.ok) {
        throw new Error("Failed to unlike post");
      }

      fetchPosts(); // Refresh posts after liking/unliking
    } catch (error) {
      console.error("Error unliking post:", error);
    }
  };

  const handleAddPost = async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/users/${userData._id}/posts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("userData")}`,
          },
          body: JSON.stringify({
            message: newPostMessage,
            image: newPostImage,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to add post");
      }
      setNewPostMessage("");
      fetchPosts(); // Refresh posts after adding a new one
    } catch (error) {
      console.error("Error adding post:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userData");
    window.location.replace("/");
  };

  // Function to handle sorting posts
  const handleSortChange = (e) => {
    // Update the sortBy state based on user selection
    setSortBy(e.target.value);
  };

  // Function to handle filtering posts by mail
  const handleFilterChange = (e) => {
    // Update the filterBy state based on user input
    setFilterBy(e.target.value);
  };

  // Function to handle deleting a post
  const handleDeletePost = async (postId) => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/users/${userData._id}/posts/${postId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userData")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete post");
      }

      // Refresh posts after deleting the post
      fetchPosts();
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  // Function to handle initiating post editing
  const handleEditPost = (postId) => {
    // Set the post id being edited and retrieve its message
    setEditingPostId(postId);
    const postToEdit = posts.find((post) => post._id === postId);
    setEditedPostMessage(postToEdit.message);
  };

  // Function to handle saving edited post
  const handleSaveEditedPost = async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/users/${userData._id}/posts/${editingPostId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("userData")}`,
          },
          body: JSON.stringify({ message: editedPostMessage }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to save edited post");
      }
      // Refresh posts after saving the edited post
      fetchPosts();
      setEditingPostId(null);
      setEditedPostMessage("");
    } catch (error) {
      console.error("Error saving edited post:", error);
    }
  };

  // Function to handle adding a comment to a post
  const handleAddComment = (postId, message) => {
    // Check if user data is available
    if (!userData) {
      // Alert the user if user data is not found
      alert("User data not found. Please log in again.");
      return;
    }

    // Create a new comment object
    const newComment = {
      commentFor: postId,
      name: userData.name, // Use display name from local storage
      message: message,
      email: userData.email, // Use mail from local storage
      image: userData.image, // Use image from local storage
      date: new Date().toLocaleDateString(),
    };

    // Update the comments state with the new comment
    setComments([...comments, newComment]);
  };

  // Function to toggle dark mode
  const toggleDarkMode = () => {
    // Toggle the darkMode state
    setDarkMode((prevMode) => !prevMode);
  };

  useEffect(() => {
    fetchPosts();
    fetchUserData();
  }, []);

  return (
    <>
      {userData && (
        <div className={`${darkMode ? "dark-mode" : ""}`}>
          <nav
            style={{ height: 56, zIndex: 5 }}
            className="navbar navbar-expand-lg bg-white shadow-lg  sticky-top "
          >
            <div className="container-fluid">
              <div>
                <img
                  className="mx-3"
                  height={40}
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Facebook_Logo_%282019%29.png/1024px-Facebook_Logo_%282019%29.png"
                />
              </div>{" "}
              <div style={{ alignItems: "center", gap: 20, display: "flex" }}>
                <input
                  type="text"
                  placeholder="Filter by user name"
                  value={filterBy}
                  style={{ borderRadius: "20px", background: "#eff2f5" }}
                  onChange={handleFilterChange}
                  className="form-control"
                />
                {userData && (
                  <>
                    <span
                      style={{ fontWeight: "bolder" }}
                      className="navbar-brand"
                    >
                      {userData.name}
                    </span>
                    <img
                      src={userData.image}
                      className="profile-image"
                      style={{ marginRight: 12 }}
                    />
                  </>
                )}
                <i
                  className="fa fa-bars"
                  type="button"
                  onClick={() => setShowMenu(!showMenu)}
                ></i>
              </div>
            </div>
          </nav>
          {/* Sliding Navigation Menu */}
          <div className={`sliding-menu ${showMenu ? "open" : ""}`}>
            <ul className="menu-items">
              <li>
                <a href="#">
                  <i className="bi bi-gear"></i> Settings
                </a>
              </li>
              <li>
                <a href="#">
                  <i className="bi bi-question-circle"></i> Support
                </a>
              </li>
              <li>
                <button
                  className="btn btn-outline-danger"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
          <div
            className="m-auto  mt-5 "
            style={{ maxWidth: 680, display: "grid", gap: 20 }}
          >
            <div className="d-flex" style={{ maxWidth: 280, gap: 20 }}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-control"
                placeholder="Search users"
              />
              <button onClick={searchUsers} className="btn btn-primary">
                Search
              </button>
            </div>

            <div style={{ maxWidth: 280, gap: 20 }}>
              <ul className="list-group">
                {searchResults
                  .filter((u) => u._id !== userData._id)
                  .map((user) => (
                    <li
                      key={user._id}
                      className="list-group-item d-flex justify-content-between align-items-center"
                    >
                      {user.name}
                      {!friendRequestsSent.includes(user._id) &&
                        !userData.friends.includes(user._id) &&
                        !userData.friendRequestsSent.includes(user._id) && (
                          <button
                            onClick={() => sendFriendRequest(user._id)}
                            className="btn btn-primary"
                          >
                            Send Friend Request
                          </button>
                        )}
                    </li>
                  ))}
              </ul>
            </div>

            <div style={{ maxWidth: 280, gap: 20 }}>
              <ul className="list-group">
                {friendRequestsReceived &&
                  friendRequestsReceived.map((user) => (
                    <li
                      key={user.userId}
                      className="list-group-item d-flex justify-content-between align-items-center"
                    >
                      {user.name}
                      <div>
                        <button
                          onClick={() => approveFriendRequest(user.userId)}
                          className="btn btn-success me-2"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => declineFriendRequest(user.userId)}
                          className="btn btn-danger"
                        >
                          Decline
                        </button>
                      </div>
                    </li>
                  ))}
              </ul>
            </div>

            <h2 className="mb-4">Feed</h2>
            <div style={{ maxWidth: 640 }} className="card-body shadow-lg">
              <h5 className="card-title">
                <div className="mb-3">
                  {userData && (
                    <>
                      <input
                        type="text"
                        className="form-control "
                        placeholder={`About what do you think ${userData.name} ?`}
                        value={newPostMessage}
                        style={{ background: "#eff2f5", borderRadius: "20px" }}
                        onChange={(e) => setNewPostMessage(e.target.value)}
                      />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="form-control"
                        capture="camera"
                      />
                    </>
                  )}
                  <button
                    className="btn btn-primary mt-2"
                    onClick={handleAddPost}
                  >
                    Add Post
                  </button>
                </div>
              </h5>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="sortSelect" className="mr-2">
                  Sort By:
                </label>
                <select
                  id="sortSelect"
                  value={sortBy}
                  onChange={handleSortChange}
                  className="form-select"
                >
                  <option value="date">Date</option>
                  <option value="popularity">Popularity</option>
                </select>
              </div>
            </div>
            {posts.length > 0 &&
              posts
                .filter((post) =>
                  post.user.name.toLowerCase().includes(filterBy.toLowerCase())
                )
                .map((post, index) => (
                  <div
                    style={{ maxWidth: 640 }}
                    className="card-body shadow-lg"
                    key={index}
                  >
                    {/* Post Content */}
                    <h5 className="card-title">{post.user.name}</h5>
                    {editingPostId === post._id ? (
                      // Editing Post
                      <>
                        <textarea
                          className="form-control mb-2"
                          value={editedPostMessage}
                          onChange={(e) => setEditedPostMessage(e.target.value)}
                        />
                        <button
                          className="btn btn-primary"
                          onClick={handleSaveEditedPost}
                        >
                          Save
                        </button>
                      </>
                    ) : (
                      // Displaying Post
                      <>
                        {!friendRequestsSent.includes(post.user._id) &&
                          !userData.friends.includes(post.user._id) &&
                          userData._id !== post.user._id &&
                          !userData.friendRequestsSent.includes(
                            post.user._id
                          ) && (
                            <button
                              onClick={() => sendFriendRequest(post.user._id)}
                              className="btn btn-primary"
                            >
                              Send Friend Request
                            </button>
                          )}
                        <h6 className="card-text">{post.message}</h6>
                        <img
                          className="image"
                          src={post.image}
                          alt={post.image}
                        />
                      </>
                    )}
                    {/* Post Footer */}
                    <p className="card-text">
                      <small className="text-muted">{post.date}</small>
                    </p>
                    <p className="card-text">
                      {likesData[post._id]?.length || 0} Likes
                    </p>
                    Liked:
                    <div className="likes-hover">
                      {likesData[post._id] &&
                        likesData[post._id].map((userEmail, i) => (
                          <span key={i}>{userEmail}</span>
                        ))}
                    </div>
                    {/* Like and Delete buttons */}
                    <button
                      className="btn"
                      onClick={() => handleLikePost(post)}
                    >
                      {post.likes && post.likes.includes(userData.email) ? (
                        <i className="fas fa-thumbs-up text-primary"></i>
                      ) : (
                        <i className="far fa-thumbs-up text-primary"></i>
                      )}
                    </button>
                    {post.user.email === userData.email && (
                      <button
                        className="btn"
                        onClick={() => handleDeletePost(post._id)}
                      >
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    )}
                    {post.user.email === userData.email && (
                      <button
                        className="btn"
                        onClick={() => handleEditPost(post._id)}
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                    )}
                    {/* Comments Section */}
                    <div className="mt-3">
                      {/* Display Comments */}
                      {comments
                        .filter(
                          (comment) => comment.commentFor === post.user.email
                        )
                        .map((comment, cIndex) => (
                          <div key={cIndex} className=" mb-2">
                            <div className="card-body comment shadow-sm">
                              <p className="card-title">{comment.name}</p>
                              <h6 className="card-text">{comment.message}</h6>
                            </div>
                          </div>
                        ))}
                      {/* Add Comment Input */}
                      <div>
                        <input
                          type="text"
                          onChange={(e) => setMessage(e.target.value)}
                          className="form-control d-inline-block mr-2"
                          placeholder="Add a comment..."
                          style={{ background: " #eff2f5" }}
                        />
                        {/* Add Comment Button */}
                        <button
                          className="btn btn-primary mt-3"
                          onClick={() =>
                            handleAddComment(post.user.email, message)
                          }
                        >
                          Add Comment
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Feed;
