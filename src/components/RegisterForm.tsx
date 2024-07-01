import React, { ChangeEvent, useRef, useState } from 'react';
import axios from 'axios';
import { uploadPhoto } from '../services/file-service';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-solid-svg-icons';
import avatar from '../assets/avatar.jpeg';

const RegisterForm = () => {
  const [imgSrc, setImgSrc] = useState<File>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [email, setEmail] = useState('');
  const [username, setusername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const imgSelected = (e: ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
    if (e.target.files && e.target.files.length > 0) {
      setImgSrc(e.target.files[0]);
    }
  };
  const selectImg = () => {
    console.log('Selecting image...');
    fileInputRef.current?.click();
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const url = await uploadPhoto(imgSrc!);
      console.log('upload returned:' + url);

      const response = await axios.post('http://localhost:3000/auth/register', {
        email: email,
        username: username,
        password: password,
        imgUrl: url,
      });

      // Registration successful
      const accessToken = response.data.accessToken; // Assuming accessToken is received from server
      console.log('Response Data: ', response.data);
      localStorage.setItem('accessToken', accessToken);
      setSuccessMessage('Registration successful!');
      setError(null);
    } catch (err) {
      // Handle registration error
      setSuccessMessage('');
    }
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
                ></input>
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
                  <label>UserName:</label>
                  <input
                    type="username"
                    className="form-control"
                    value={username}
                    onChange={(e) => setusername(e.target.value)}
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
