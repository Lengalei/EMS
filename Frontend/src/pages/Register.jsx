import { useState } from 'react';
import axios from 'axios';
import { TailSpin } from 'react-loader-spinner';
import './register.scss';
import { Link, useNavigate } from 'react-router-dom';

function Register() {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setloading] = useState(false);
  const [error, setError] = useState(null);
  // const {login} = useAuth()
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setloading(true);
    try {
      const response = await axios.post(
        'http://localhost:6500/api/auth/register',
        {
          userName,
          email,
          password,
        }
      );

      if (response.status) {
        navigate('/login');
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
    <div className="register">
      <h2>Employee Management system Login</h2>

      <form className="register-container" onSubmit={handleSubmit}>
        <h3>Register</h3>
        {error && <p className="error">{error}</p>}
        <div className="input">
          <label>UserName</label>
          <input
            type="userName"
            placeholder="Enter your userName"
            value={userName}
            onChange={(e) => {
              setUserName(e.target.value);
            }}
          />
        </div>

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
        <span>
          <h6>
            Already Have an Account? <Link to={'/login'}>Login</Link>
          </h6>
        </span>
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

export default Register;
