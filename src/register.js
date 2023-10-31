import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function Register() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [registerMessage, setregisterMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('/register', {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password
      });
      setregisterMessage('User registration successful, redirecting to login page...');
      /* console.log('Registration successful'); */
      //wait for 2 seconds
        await new Promise(resolve => setTimeout(resolve, 2000));
      navigate('/login');
    } catch (error) {
      console.error('An error occurred:', error);
      if (error.response && error.response.status === 401) {
        setregisterMessage('Email is already registered');
      }
    }
  };

  return (
    <div className="container">
      <h2>Register</h2>
      <h3>Register form</h3>
      {registerMessage && <p>{registerMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group mb-3">
            <label>First name</label>
            <input type="text" className="form-control" placeholder="First name" name="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
        </div>
        <div className="form-group mb-3">
            <label>Last name</label>
            <input type="text" className="form-control" placeholder="Last name" name="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} />
        </div>
        <div className="form-group mb-3">
            <label>Email</label>
            <input type="email" className="form-control" placeholder="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="form-group mb-3">
            <label>Password</label>
            <input type="password" className="form-control" placeholder="Password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div className="d-grid mt-3">
          <button type="submit" className="btn btn-primary form-control">Submit</button>
        </div>
      </form>
      <Link to="/login">Already have an account? Login here.</Link>
    </div>
  );
}

export default Register;