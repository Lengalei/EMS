import React, { useState } from "react";
import "./Pages.scss";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <div className="login">
      <h2>Employee Management system Login</h2>

      <form className="login-container">
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
