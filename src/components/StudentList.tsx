import axios from 'axios';
import useStudents from '../hooks/useStudents';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import StudentEditModal from './EditProduct';
import { Student } from '../services/student-services';

function StudentList() {
  const { students: initialStudents, error, loading } = useStudents();
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  useEffect(() => {
    setStudents(initialStudents || []);
  }, [initialStudents]);

  const updateStudent = (updatedStudent: Student) => {
    setStudents(students.map(student => 
      student._id === updatedStudent._id ? updatedStudent : student
    ));
  };

  async function logoutfunc() {
    try {
      const token = localStorage.getItem('refreshToken');
      console.log('refreshToken:', token);
      const response = await axios.get('http://localhost:3000/auth/logout', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
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

  const handleEditClick = (student: Student) => {
    setSelectedStudent(student);
  };

  return (
    <div>
      <h1>Students</h1>
      {loading && <div className="spinner-border text-primary" />}
      {error && <div className="alert alert-danger">{error}</div>}
      <ul className="list-group">
        {students.length > 0 ? students.map((item, index) => (
          <li
            className="list-group-item d-flex justify-content-between align-items-center"
            key={index}
          >
            <div className="d-flex align-items-center">
              <img
                src={item.url}
                alt={`${item.name}'s photo`}
                style={{ width: '50px', height: '50px', marginRight: '10px' }}
              />
              {item.name}
            </div>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => handleEditClick(item)}
            >
              Edit
            </button>
          </li>
        )) : <div>No students found</div>}
      </ul>
      <button onClick={logoutfunc} className="btn btn-primary">
        Logout
      </button>

      {selectedStudent && (
        <StudentEditModal
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
          onSave={updateStudent}
        />
      )}
    </div>
  );
}

export default StudentList;
