import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-solid-svg-icons';
import { uploadPhoto } from '../services/file-service';

const EditProfile: React.FC = () => {
  let url = '';
  const [imgSrc, setImgSrc] = useState<File>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [username, setUsername] = useState<string>('');
  const [profilePicture, setProfilePicture] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [newUsername, setNewUsername] = useState<string>(''); // State for input field
  const accessToken = localStorage.getItem('accessToken');
  console.log('Access Token: ', accessToken);
  if (!accessToken) {
    throw new Error('Access token not found');
  }

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

  // Get user data with ID
  const userID = localStorage.getItem('userID');
  console.log('userID:', userID);

  const getUserData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/auth/getUser/${userID}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setUsername(response.data.username);
      setProfilePicture(response.data.imgUrl);
    } catch (err) {
      setError('Failed to load user data. Please try again.');
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewUsername(e.target.value); // Update local state on input change
  };

  const handleUpdateProfile = async () => {
    if (newUsername) {
      setUsername(newUsername); // Update username state with new input value
    }
    setNewUsername('');
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Update profile picture if a new one is selected
      if (imgSrc) {
        url = await uploadPhoto(imgSrc!, 'user');
        console.log('upload returned:' + url);
      }

      // Update username
      const response = await axios.put(
        'http://localhost:3000/auth/update-username',
        {
          userID,
          newUsername,
          url,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log('Response Data: ', response.data);
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Edit Profile</h1>
      <h3>Hello {username}</h3>
      <div className="d-flex justify-content-center position-relative">
        <img
          src={imgSrc ? URL.createObjectURL(imgSrc) : profilePicture}
          alt="Profile Picture"
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

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="form-group">
        <label htmlFor="username">Rename username</label>
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            id="username"
            placeholder={username}
            value={newUsername}
            onChange={handleUsernameChange}
          />
        </div>
      </div>

      <button
        className="btn btn-primary"
        onClick={handleUpdateProfile}
        disabled={loading}
      >
        {loading ? 'Updating...' : 'Update Profile'}
      </button>
    </div>
  );
};

export default EditProfile;
