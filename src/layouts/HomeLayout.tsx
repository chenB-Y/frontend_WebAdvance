import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiClient from '../services/api-client';
import { refreshToken } from '../services/user-services';
import axios from 'axios';
import { useState } from 'react';

export default function HomeLayout() {
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogout = async () => {
    console.log('Attempting to logout...');
    try {
      const token = localStorage.getItem('refreshToken');
      const response = await apiClient.get('/auth/logout', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        console.log('Logout successful');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userID');
        localStorage.removeItem('groupID');
        localStorage.removeItem('username');
        setIsLoggedIn(false);
        navigate('/home');
      } else {
        console.log('Logout response status:', response.status);
        setError('Logout failed');
        console.log(error);
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response && err.response.status === 401) {
          // Refresh token logic
          console.log();
          const newToken = await refreshToken();
          if (newToken.accessToken && newToken.refreshToken) {
            handleLogout(); // Retry logout with new token
            console.log();
          } else {
            console.log();
            console.log('Token refresh failed');
            // Handle token refresh failure, e.g., redirect to login
            navigate('/login');
          }
        } else {
          console.error('Logout failed', err);
          setError('Logout failed');
        }
      } else {
        console.error('Logout failed', err);
        setError('Logout failed');
      }
    }
  };

  return (
    <div className="root-layout">
      <header>
        <nav>
          <h1>NameOfTheAPP</h1>
          {isLoggedIn ? (
            <>
              <NavLink to="/products">Products</NavLink>
              <NavLink to="/productForm">Add Product</NavLink>
              <NavLink to="/EditP">Edit Profile</NavLink>
              <NavLink to="/userProducts">My Products</NavLink>
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <NavLink to="/home">Home</NavLink>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/register">Register</NavLink>
            </>
          )}
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
