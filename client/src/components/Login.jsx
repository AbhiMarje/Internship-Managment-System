import React, { useState, useContext } from "react";
import banner from "./gitbanner.png";
import userContext from "./UserContext";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useContext(userContext);
  const navigate = useNavigate();

  const HandleSubmit = async (e) => {
    e.preventDefault();
    await AunthenticateUser(username, password);
    setUsername("");
    setPassword("");
  };

  const AunthenticateUser = async (username, password) => {
    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();

      if (data.message) {
        setUser(username);
        navigate("/admin");
      } else {
        window.alert(data.message);
      }
    } catch (error) {
      window.alert(error.message);
    }
  };

  return (
    <div>
      <nav>
        <img src={banner} alt="Banner" className="git-banner" />
        <h1>KLS Gogte Institute of Technology</h1>
      </nav>
      <div className="main-container">
        <div className="login-container">
          <form onSubmit={HandleSubmit}>
            <label className="column">
              Username:
              <input
                className="input-col"
                type="text"
                value={username}
                placeholder="Username"
                onChange={(e) => setUsername(e.target.value)}
              />
            </label>
            <label className="column">
              Password:
              <input
                className="input-col"
                type="text"
                value={password}
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
            <input className="login-button" type="submit" value="Login" />
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
