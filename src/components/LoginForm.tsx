import React, { useState } from 'react';
import axios from 'axios';
import StudentList from './StudentList';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:3000/auth/login', {
        email: email,
        password: password,
      });

      // Login successful
      setSuccessMessage('Login successful!');
      const accessToken = response.data.accessToken; // Assuming accessToken is received from server
      console.log('Response Data: ', response.data);
      localStorage.setItem('accessToken', accessToken);
      const refreshToken = response.data.refreshToken; // Assuming accessToken is received from server
      console.log('Response Data: ', response.data);
      localStorage.setItem('refreshToken', refreshToken);
      if (response.status === 200) {
        navigate('/students');
      }
    } catch (err) {
      // Handle Login error
      setSuccessMessage('');
      setError('Invalid Credentials');
    }
  };

  return (
    <div className="LogIn-form">
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
          login
        </button>
      </form>
      {error && <p className="text-danger mt-3">{error}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}
      {successMessage && <StudentList />}{' '}
    </div>
  );
};

export default LoginForm;
