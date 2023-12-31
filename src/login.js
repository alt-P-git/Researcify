import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('/login', {
        email: email,
        password: password,
        role: role,
      });
      setErrorMessage('');
      if (role === 'peer') {
        navigate('/reviewpaperlist');
      } else if (role === 'publisher') {
        navigate('/publisher_dashboard');
      } else if (role === 'admin') {
        navigate('/admin_dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('An error occurred:', error);
      if (error.response && error.response.status === 401) {
        setErrorMessage('Incorrect email or password');
      }
    }
  };

  return (
    <div className="login-container">
      <h3>Login form</h3>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-group mb-3">
          <label>Role</label>
          <select
            className="form-control"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="peer">Peer</option>
            <option value="publisher">Publisher</option>
          </select>
        </div>
        <div className="form-group mb-3">
          <label>Email</label>
          <input
            type="email"
            className="form-control"
            placeholder="Email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group mb-3">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            placeholder="Password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="d-grid mt-3">
          <button type="submit" className="btn btn-primary form-control">
            Submit
          </button>
        </div>
      </form>
      <Link to="/register" className="register-link">
        Don't have an account? Register here.
      </Link>
    </div>
  );
}

export default Login;