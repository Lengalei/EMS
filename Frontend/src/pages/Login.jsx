import { useContext, useState } from 'react';
// import { TailSpin } from "react-loader-spinner";
import './Pages.scss';
import { Link, useNavigate } from 'react-router-dom';
import { userContext } from '../context/authContext';
import { TailSpin } from 'react-loader-spinner';
import apiRequest from '../lib/apiRequest';
// import useAuth from "../context/authContext.jsx"

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setloading] = useState(false);
  const [error, setError] = useState(null);
  // const {login} = useAuth()
  const { login } = useContext(userContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setloading(true);
    try {
      const response = await apiRequest.post('/auth/login', {
        email,
        password,
      });

      if (response.data.success) {
        // alert("Login successful");
        login(response.data.user);
        localStorage.setItem('token', response.data.token);
        if (response.data.user.role === 'Admin') {
          navigate('/admin-dashboard');
        } else {
          navigate('/employee-dashboard');
        }
      }
    } catch (error) {
      if (error.response && !error.response.data.error) {
        setError(error.response.data.error);
      } else {
        setError(error.message || 'server error');
      }
    } finally {
      setloading(false);
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
        <h6>
          Don{"'"}t have an Account?{' '}
          <Link to={'/register'} className="forgot-password-link">
            Sign Up
          </Link>
        </h6>
        <button className="LoginBtn">Login</button>
      </form>
      {loading && (
        <div className="loader-overlay">
          <TailSpin
            height="100" // Set desired height
            width="100" // Set desired width
            color="#4fa94d"
            ariaLabel="rings-loading"
            visible={true}
          />
        </div>
      )}
    </div>
  );
}

export default Login;
