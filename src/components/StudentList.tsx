import axios from 'axios';
import useStudents from '../hooks/useStudents';
import { useNavigate } from 'react-router-dom';

function StudentList() {
  const { students, error, loading } = useStudents();
  const navigate = useNavigate();

  async function logoutfunc() {
    try {
      const token = localStorage.getItem('refreshToken');
      console.log('refreshToken:', token);
      const response = axios.get('http://localhost:3000/auth/logout', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if ((await response).status === 200) {
        console.log('Logged out');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userID');
        navigate('/login');
      }
    } catch (err) {
      console.error('Logout failed', err);
    }
  }

  return (
    <div>
      <h1>Students</h1>
      {loading && <div className="spinner-border text-primary" />}
      {error && <div className="alert alert-danger">{error}</div>}
      <ul className="list-group">
        {students?.map((item, index) => (
          <li className="list-group-item" key={index}>
            {item.name}
          </li>
        ))}
      </ul>
      <button onClick={logoutfunc} className="btn btn-primary">
        Logout
      </button>
    </div>
  );
}

export default StudentList;
