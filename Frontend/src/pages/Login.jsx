import React, { useState } from "react";
import axios from "axios";
// import { TailSpin } from "react-loader-spinner";
import "./Pages.scss";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setloading] = useState(true);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/login",
        {
          email,
          password,
        }
      );
      setloading(false);

      if (response.data.success) {
        alert("Login successful");
      }
    } catch (error) {
      if (error.response && !error.response.data.success) {
        setError(error.response.data.error);
      } else {
        setError("server error" || message.error);
      }
    }
  };

  // if (loading) {
  //   return <TailSpin color="#00BFFF" height={80} width={80} />;
  // }

  return (
    <div className="login">
      <h2>Employee Management system Login</h2>

      <form className="login-container" onSubmit={handleSubmit}>
        <h3>LOGIN</h3>
        {error && <p className="error">{error}</p>}
        <div className="input">
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
        </div>

        <div className="input">
          <label>Password</label>
          <input
            type="password"
            placeholder="****"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </div>

        <button className="LoginBtn">Login</button>
      </form>
    </div>
  );
}

export default Login;
