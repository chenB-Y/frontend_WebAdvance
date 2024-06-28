import React, { useState } from 'react';
import axios from 'axios';
import StudentForm from './StudentForm';

const RegisterForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [showStudentForm, setShowStudentForm] = useState(false); // State to control showing StudentForm

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:3000/auth/register', {
        email: email,
        password: password,
      });

      // Registration successful
      const accessToken = response.data.accessToken; // Assuming accessToken is received from server
      console.log('Response Data: ', response.data);
      localStorage.setItem('accessToken', accessToken);
      setSuccessMessage('Registration successful!');
      setError(null);
      setShowStudentForm(true); // Show StudentForm after successful registration
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
      {showStudentForm && <StudentForm />}{' '}
    </div>
  );
};

export default RegisterForm;
