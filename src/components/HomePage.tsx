import { useNavigate } from 'react-router-dom';
import '../style/HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();

  const handleRegister = () => {
    navigate('/register');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div className="homepage">
      <h1 className="title">Welcome to Shopping List App</h1>
      <div className="button-container">
        <button className="btn register-btn" onClick={handleRegister}>
          Register
        </button>
        <button className="btn login-btn" onClick={handleLogin}>
          Log In
        </button>
      </div>
    </div>
  );
};

export default HomePage;
