import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useState } from "react";
import userContext from "./components/UserContext";
import Home from "./components/Home";
import Login from "./components/Login";
import Admin from "./components/Admin";
import "./App.css";
import Posts from "./components/Posts";
import AdminPosts from "./components/AdminPosts";

function App() {
  const [user, setUser] = useState(null);

  return (
    <userContext.Provider value={{ user, setUser }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/posts" element={<Posts />} />
          <Route path="/addposts" element={<AdminPosts />} />
        </Routes>
      </BrowserRouter>
    </userContext.Provider>
  );
}

export default App;
