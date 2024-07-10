import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const { setIsLoggedIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:3000/auth/login', {
        email,
        password,
      });
      console.log(response);
      // Login successful
      setSuccessMessage('Login successful!');
      const accessToken = response.data.accessToken;
      const refreshToken = response.data.refreshToken;
      const userID = response.data.userID;
      const username = response.data.username;
      
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('userID', userID);
      localStorage.setItem('username', username);

      // Update the login status
      setIsLoggedIn(true);

      // Navigate to products page on successful login
      if (response.status === 200) {
        if (response.data.groupID) {
          localStorage.setItem('groupID', response.data.groupID);
          navigate('/products');
        } else {
          navigate('/groupForm');
        }
      } else {
        setError('Invalid Credentials');
      }
    } catch (err) {
      // Handle login error
      setSuccessMessage('');
      setError('Invalid Credentials');
    }
  };

  return (
    <div className="login-form">
      <h2>Log-In</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            className="form-control"
            id="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            className="form-control"
            id="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Login
        </button>
      </form>
      {error && <p className="text-danger mt-3">{error}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}
    </div>
  );
};

export default LoginForm;
