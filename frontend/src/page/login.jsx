import React, {useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import "../style/login.css"

function Login() {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const res = useNavigate();

  const formSubmit = async (event) =>{
    event.preventDefault();
    const response = await fetch("/api/user/login",{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({username: username, password: password})
    });
    const data = await response.json();
    const localData = JSON.stringify(data);

    switch (data.status) {
      case 200: {
        localStorage.setItem("user", localData);
        res("/")
        break;
      }
      case 401: {
        alert("Invalid username or password");
        break;
      }
      default: {
        alert("An unexpected error occurred. Please try again later.");
      }
    }
  }

    return (
      <div className="login-container">
        <div className="login-box">
          <h2>Login</h2>
          <form id="login-form" onSubmit={formSubmit}>
            <div className="input-box">
              <input type="text" required id="name" value={username} onChange={(e) => setUsername(e.target.value)}/>
              <label>Username</label>
            </div>
            <div className="input-box">
              <input type="password" required id="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
              <label>Password</label>
            </div>
            <div className="forgot-password">
            <Link to="/">forget password?</Link>
            </div>
            <button type="submit">Login</button>
            <p>
              Not a Member? <Link to="/register-page">Signup</Link>
            </p>
          </form>
        </div>
      </div>
    );
  }
  
  export default Login;