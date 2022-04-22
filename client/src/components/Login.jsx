import React, { useState } from "react";
import banner from "./gitbanner.png";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const HandleSubmit = (e) => {
    e.preventDefault();
    alert(`${username} ${password}`);
    setUsername("");
    setPassword("");
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
