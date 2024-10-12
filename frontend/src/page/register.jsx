import React, { useState } from 'react';
import '../style/register.css';
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
    const [usermame, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const nav = useNavigate();

    const submitForm = async (e) =>{
        e.preventDefault();
        try{
            const response = await fetch("/api/user/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: usermame,
                    password: password,
                    email: email
                })
            })
            const data = await response.json();
            switch(data.status){
                case 201:{
                    alert("Registration successful");
                    nav("/login-page")
                    break;
                }
                case 409:{
                    alert("Username or Email already exists");
                }
            }
        }catch(error){
            console.error(error);
            alert("try reload web")
        }
    }

    return (
        <div className="register-container">
        <div className="register-box">
            <h2>Register</h2>
            <form id="reg-form" onSubmit={submitForm}>
            <div className="input-box">
                <input
                    type="text"
                    required
                    id="username"
                    value={usermame}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <label>Username</label>
            </div>
            <div className="input-box">
                <input
                    type="email"
                    required
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <label>Email</label>
            </div>
            <div className="input-box">
                <input
                    type="password"
                    required
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <label>Password</label>
            </div>
            <button type="submit">Register</button>
            <p>
                Not a Member? <Link to="/login-page">Signup</Link>
            </p>
            </form>
        </div>
        </div>
    );
};

export default Register;
