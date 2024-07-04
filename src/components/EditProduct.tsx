import { ChangeEvent, useRef, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-solid-svg-icons';
import { uploadPhoto } from '../services/file-service';

interface Student {
  _id: string;
  name: string;
  age: number;
  url: string;
}

interface StudentEditModalProps {
  student: Student;
  onClose: () => void;
}

function StudentEditModal({ student, onClose }: StudentEditModalProps) {
  let url = '';
  const [imgSrc, setImgSrc] = useState<File>();
  const [name, setName] = useState(student.name);
  const [age, setAge] = useState(student.age);
  const [imgUrl, setImgUrl] = useState(student.url);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Access token not found');
      }

      if (imgSrc) {
        url = await uploadPhoto(imgSrc!, 'product');
        setImgUrl(url);
        console.log('upload returned:' + imgUrl);
      }

      const updatedStudent: Student = {
        _id: student._id,
        name,
        age,
        url: url,
      };

      const response = await axios.put(
        `http://localhost:3000/student/update-student/${student._id}`,
        updatedStudent,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setSuccessMessage('Student updated successfully!');
        setError(null);
        onClose();
      }
    } catch (err) {
      console.error('Error updating student:', err);
      setError('Error updating student');
      setSuccessMessage('');
    }
  };

  return (
    <div
      className="modal show d-block"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit Student</h5>
            <button type="button" className="close" onClick={onClose}>
              <span>&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <div className="form-group">
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                id="name"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="age">Age:</label>
              <input
                type="number"
                id="age"
                className="form-control"
                value={age}
                onChange={(e) => setAge(parseInt(e.target.value))}
              />
            </div>
            <div className="d-flex justify-content-center position-relative">
              <img
                src={imgSrc ? URL.createObjectURL(imgSrc) : imgUrl}
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
            ></input>
            {error && <div className="alert alert-danger">{error}</div>}
            {successMessage && (
              <div className="alert alert-success">{successMessage}</div>
            )}
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Close
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSave}
            >
              Save changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentEditModal;
