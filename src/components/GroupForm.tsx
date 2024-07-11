import React, { useState } from 'react';
import '../style/group.css';
import apiClient from '../services/api-client';
import { useNavigate } from 'react-router-dom';

const GroupForm = () => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [existingGroupName, setExistingGroupName] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const userID = localStorage.getItem('userID');
    const groupData = { name, participants: userID };

    try {
      const response = await apiClient.post('/group/createGroup', groupData);
      setMessage('Group created successfully');
      console.log(response.data);
      setName('');
      localStorage.setItem('groupID', response.data._id);
      navigate('/products');
    } catch (error) {
      setMessage('Error creating group');
    }
  };

  const handleFetchGroup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      console.log(existingGroupName);
      const userID = localStorage.getItem('userID');
      const groupData = { name, userID: userID };
      const res = await apiClient.put(
        `/group/updateGroup/${existingGroupName}`,
        groupData
      );
      console.log(res.data);
      setMessage('Group data fetched successfully');
      localStorage.setItem('groupID', res.data._id);
      navigate('/products');
    } catch (error) {
      setMessage('Error fetching group data');
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <label>
          Group Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <button type="submit">Create Group</button>
      </form>

      <form onSubmit={handleFetchGroup}>
        <label>
          Do you already have a group? Enter Group Name:
          <input
            type="text"
            value={existingGroupName}
            onChange={(e) => setExistingGroupName(e.target.value)}
            required
          />
        </label>
        <button type="submit">Fetch Group</button>
      </form>

      {message && (
        <p
          className={`message ${
            message.startsWith('Error') ? 'error' : 'success'
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
};
export default GroupForm;
