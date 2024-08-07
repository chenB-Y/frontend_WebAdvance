import React, { ChangeEvent, useRef, useState } from 'react';
import { uploadPhotoForRegister } from '../services/file-service';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-solid-svg-icons';
import avatar from '../assets/avatar.jpeg';
import { googleSignin } from '../services/user-services';
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiClient from '../services/api-client';

const RegisterForm = () => {
  const navigate = useNavigate();
  const [imgSrc, setImgSrc] = useState<File>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const { setIsLoggedIn } = useAuth();

  const imgSelected = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImgSrc(e.target.files[0]);
    }
  };

  const selectImg = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email || !username || !password || !imgSrc) {
      setError('Please fill in all fields and select an image.');
      return;
    }

    try {
      console.log("11111111111111111111111111111111111111111111111111111")
      const url = await uploadPhotoForRegister(imgSrc);
      console.log("2222222222222222222222222222222222222222222222222222222222")
      const response = await apiClient.post('/auth/register', {
        email: email,
        username: username,
        password: password,
        imgUrl: url,
      });
      console.log("333333333333333333333333333333333333333333333333")
      const accessToken = response.data.accessToken;
      const refreshToken = response.data.refreshToken;
      const userID = response.data.userID;
      const userName = response.data.username;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('userID', userID);
      localStorage.setItem('username', userName);
      setSuccessMessage('Registration successful!');
      setError(null);
      setIsLoggedIn(true);
      navigate('/groupForm');
    } catch (err) {
      setError('Registration failed. Please try again.');
      setSuccessMessage('');
    }
  };

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
        setSuccessMessage('Registration successful!');
        setError(null);
        navigate('/groupForm');
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

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">Register</h2>
              <form onSubmit={handleSubmit}>
                <div className="d-flex justify-content-center position-relative">
                  <img
                    src={imgSrc ? URL.createObjectURL(imgSrc) : avatar}
                    style={{ height: '230px', width: '230px' }}
                    className="img-fluid"
                  />
                  <button
                    type="button"
                    className="btn position-absolute bottom-0 end-0"
                    onClick={selectImg}
                  >
                    <FontAwesomeIcon icon={faImage} className="fa-xl" />
                  </button>
                </div>

                <input
                  style={{ display: 'none' }}
                  ref={fileInputRef}
                  type="file"
                  onChange={imgSelected}
                />

                <div className="form-group">
                  <label>Email:</label>
                  <input
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Username:</label>
                  <input
                    type="text"
                    className="form-control"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Password:</label>
                  <input
                    type="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-block mt-4"
                >
                  Register
                </button>
              </form>
              {error && <p className="text-danger mt-3">{error}</p>}
              {successMessage && (
                <p className="text-success mt-3">{successMessage}</p>
              )}
              <br></br>
              <GoogleLogin
                onSuccess={onGoogleLoginSuccess}
                onError={onGoogleLoginFailure}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
