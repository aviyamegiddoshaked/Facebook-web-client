import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Registration from "./components/Registration";
import Login from "./components/Login";
import Feed from "./components/Feed";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [theme, setTheme] = React.useState("light");

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <BrowserRouter>
      <div className={theme}>
        <button onClick={toggleTheme} className="toggle">
          {theme === "light" ? "dark" : "light"}
        </button>{" "}
        {/* Button to toggle theme */}
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/feed" element={<Feed />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
