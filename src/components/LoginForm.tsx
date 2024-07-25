import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { googleSignin } from '../services/user-services';
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import 'bootstrap/dist/css/bootstrap.min.css';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const { setIsLoggedIn } = useAuth();
  const navigate = useNavigate();

  const onGoogleLoginSuccess = async (
    credentialResponse: CredentialResponse
  ) => {
    try {
      const res = await googleSignin(credentialResponse);

      if (
        res?.accessToken &&
        res?.refreshToken &&
        res?.userID &&
        res?.username
      ) {
        localStorage.setItem('accessToken', res.accessToken);
        localStorage.setItem('refreshToken', res.refreshToken);
        localStorage.setItem('userID', res.userID);
        localStorage.setItem('username', res.username);
        setIsLoggedIn(true);

        if (res.groupID) {
          localStorage.setItem('groupID', res.groupID);
          navigate('/products');
        } else {
          navigate('/groupForm');
        }
      } else {
        setError('Google sign-in failed');
        throw new Error('Access token is undefined');
      }
    } catch (error) {
      console.error('Google sign-in failed:', error);
      setError('Google sign-in failed');
    }
  };

  const onGoogleLoginFailure = () => {
    console.log('Google login failed');
    setError('Google sign-in failed');
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:3000/auth/login', {
        email,
        password,
      });
      console.log(response);
      // Login successful
      if (response.status === 200) {
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
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">Log In</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group mb-3">
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
                <div className="form-group mb-3">
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
                <button type="submit" className="btn btn-primary w-100">
                  Login
                </button>
              </form>
              {error && <p className="text-danger mt-3">{error}</p>}
              {successMessage && (
                <p className="text-success mt-3">{successMessage}</p>
              )}
              <div className="text-center mt-4">
                <GoogleLogin
                  onSuccess={onGoogleLoginSuccess}
                  onError={onGoogleLoginFailure}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
