
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/ErrorPage.css';

const ErrorPage: React.FC = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate('/home'); // Navigate back to the home page
  };

  return (
    <div className="container text-center error-page">
      <div className="row justify-content-center align-items-center min-vh-100">
        <div className="col-md-6">
          <div className="card shadow-lg p-4">
            <h1 className="display-4 text-danger">Oops!</h1>
            <p className="lead">We're sorry, but an error occurred.</p>
            <button className="btn btn-primary" onClick={handleGoBack}>
              Go to Home Page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;