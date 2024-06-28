import React, { useState } from 'react';
import axios from 'axios';
import StudentList from './StudentList';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

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
      setError(null);
    } catch (err) {
      // Handle Login error
      setSuccessMessage('');
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
      {error && <p className="error-message">{error}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}
      {successMessage && <StudentList />}{' '}
    </div>
  );
};

export default LoginForm;
