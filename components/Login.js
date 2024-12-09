import React, { useState } from "react";

const Login = () => {
  // State variables to hold email, password, and error messages
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Function to handle login button click

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email, password }),
      });
      console.log(response);

      if (!response.ok) {
        throw new Error("Invalid email or password");
      }

      const userData = await response.json();
      localStorage.setItem("userData", JSON.stringify(userData.token));
      localStorage.setItem("userMail", email);
      localStorage.setItem("userId", userData.id);
      setEmail("");
      setPassword("");
      setError("");
      alert("Login successful!");
      window.location.replace("/feed");
    } catch (error) {
      setError(error.message);
    }
  };

  // Render login form
  return (
    <div
      style={{
        display: "flex",
        top: "25vh",
        position: "relative",
        width: "75%",
        margin: "auto",
        alignItems: "center",
      }}
    >
      <div style={{ width: 500 }}>
        <img
          height={106}
          style={{ marginLeft: "-28px" }}
          src="https://static.xx.fbcdn.net/rsrc.php/y1/r/4lCu2zih0ca.svg"
          alt="פייסבוק"
        />
        <h2 style={{ fontSize: 28 }}>
          Connect with friends and the world around you on Facebook.
        </h2>
      </div>
      <div
        className="shadow-lg container mt-5 bg-white p-6"
        style={{ maxWidth: 400, borderRadius: 8 }}
      >
        <div className="mb-3">
          {/* Input field for email */}
          <input
            type="text"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="mb-3">
          {/* Input field for password */}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-control"
          />
        </div>
        {/* Login button */}
        <button
          onClick={handleLogin}
          className="btn btn-primary"
          style={{
            fontSize: "20px",
            fontWeight: "bold",
          }}
        >
          Login
        </button>
        {/* Error message display */}
        {error && <p className="error mt-2">{error}</p>}
        {/* Registration button */}
        <button
          onClick={() => window.location.replace("/registration")}
          className="btn text-white mt-3 m-auto"
          style={{
            background: "#42B729",
            height: "50px",
            display: "flex",
            justifyContent: "center",
            fontSize: "17px",
            fontWeight: "bold",
          }}
        >
          Create New Account
        </button>
      </div>
    </div>
  );
};

export default Login;
