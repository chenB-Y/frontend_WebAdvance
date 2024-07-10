import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiClient from '../services/api-client';

export default function HomeLayout() {
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('refreshToken');
      const response = await apiClient.get('/auth/logout', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userID');
        localStorage.removeItem('groupID');
        setIsLoggedIn(false);
        navigate('/home');
      }
    } catch (err) {
      console.error('Logout failed', err);
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
