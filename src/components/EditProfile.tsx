import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-solid-svg-icons';
import { uploadPhoto } from '../services/file-service';
import { refreshAccessToken } from '../services/user-services';
import apiClient from '../services/api-client';

const EditProfile: React.FC = () => {
  const [imgSrc, setImgSrc] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [username, setUsername] = useState<string>('');
  const [profilePicture, setProfilePicture] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [newUsername, setNewUsername] = useState<string>(''); // State for input field

  const accessToken = localStorage.getItem('accessToken');
  const userID = localStorage.getItem('userID');

  let isRefreshing = false;
  let pendingRequests: Array<(token: string) => void> = [];

  const imgSelected = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImgSrc(e.target.files[0]);
    }
  };

  const selectImg = () => {
    fileInputRef.current?.click();
  };

  // Get user data with ID
  const getUserData = async () => {
    if (!accessToken || !userID) {
      setError('No access token or user ID found');
      return;
    }

    const fetchWithToken = async (token: string) => {
      try {
        const response = await apiClient.get(
          `/auth/getUser/${userID}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            responseType: 'json',
          }
        );

        setUsername(response.data.username);
        setProfilePicture(response.data.imgUrl);
      } catch (err) {
        if (axios.isAxiosError(err) && err.response && err.response.status === 401) {
          if (!isRefreshing) {
            isRefreshing = true;
            setLoading(true); // Start loading indicator

            try {
              const newTokens = await refreshAccessToken();
              isRefreshing = false;

              pendingRequests.forEach(callback => callback(newTokens.accessToken));
              pendingRequests = [];
              await fetchWithToken(newTokens.accessToken); // Retry the original request

            } catch (refreshErr) {
              console.error('Failed to refresh token:', refreshErr);
              setError('Failed to refresh access token. Please log in again.');
              pendingRequests = [];
              isRefreshing = false;
            } finally {
              setLoading(false); // Stop loading indicator
            }
          } else {
            await new Promise<void>(resolve => {
              pendingRequests.push(async (newToken) => {
                await fetchWithToken(newToken);
                resolve();
              });
            });
          }
        } else {
          setError('Failed to load user data. Please try again.');
        }
      }
    };

    try {
      await fetchWithToken(accessToken);
    } catch (err) {
      console.error('Failed to load user data:', err);
      setError('Failed to load user data. Please try again.');
    } finally {
      setLoading(false); // Stop loading indicator
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewUsername(e.target.value);
  };

  const handleUpdateProfile = async () => {
    if (newUsername) {
      setUsername(newUsername);
    }
    setNewUsername('');
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      let url = '';

      // Update profile picture if a new one is selected
      if (imgSrc) {
        url = await uploadPhoto(imgSrc, 'user');
      }

      const updateProfile = async (token: string) => {
        try {
          await apiClient.put(
            '/auth/update-username',
            {
              userID,
              newUsername,
              url,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setSuccess('Profile updated successfully!');
        } catch (err) {
          if (axios.isAxiosError(err) && err.response && err.response.status === 401) {
            console.log('Refreshing token...');
            try {
              const newToken = await refreshAccessToken();
              await updateProfile(newToken);
            } catch (refreshErr) {
              console.error('Error refreshing token', refreshErr);
              setError('Failed to update profile. Please try again.');
            }
          } else {
            setError('Failed to update profile. Please try again.');
          }
        }
      };

      const token = localStorage.getItem('accessToken');
      if (token) {
        await updateProfile(token);
      } else {
        setError('Access token not found');
      }
    } catch (err) {
      console.error('Failed to update profile:', err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Edit Profile</h1>
      <h3>Hello {username}</h3>
      {loading && <p className="loading">Loading...</p>}
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
      </button>
    </div>
  );
};

export default EditProfile;