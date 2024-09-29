import React, { useState } from "react";
import axios from 'axios'
import "./Pages.scss";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handlesubmit = async(e)=>{
    e.preventDefault()
            try {
                const response = await axios.post("https://localhost:3000/api/auth/login", {email,password});
            } catch (error) {
                console.log(error)
            }
    
  }
  return (
    <div className="login">
      <h2>Employee Management system Login</h2>

      <form className="login-container" onSubmit={handlesubmit}>
        <h3>LOGIN</h3>

        <div className="input">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            onChange={(e) => {
              setEmail;
            }}
          />
        </div>

        <div className="input">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            placeholder="****"
            onChange={(e) => {
              setPassword;
            }}
          />
        </div>

        <button className="LoginBtn">Login</button>
      </form>
    </div>
  );
}

export default Login;
