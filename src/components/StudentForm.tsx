import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import studentServices from '../services/student-services';
import { ChangeEvent, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-solid-svg-icons';
import avatar from '../assets/avatar.jpeg';
import { uploadPhoto } from '../services/file-service';

const schema = z.object({
  _id: z.string().min(5, 'ID must contain at least 5 letters').max(10),
  name: z.string().nonempty('Name is required'),
  age: z
    .number({ invalid_type_error: 'Age is required' })
    .min(18, 'You must be at least 18 years old'),
  url: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

function StudentForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [imgSrc, setImgSrc] = useState<File | null>(null);
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

  const onSubmit = async (data: FormData) => {
    try {
      // Replace with your actual logic to get access token from local storage or state
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        throw new Error('Access token not found');
      }

      const formData = new FormData();
      formData.append('_id', data._id);
      formData.append('name', data.name);
      formData.append('age', data.age.toString());

      const url = await uploadPhoto(imgSrc!, 'product');
      console.log('upload returned:' + url);
      if (imgSrc) {
        formData.append('url', url);
      }

      await studentServices.addStudent(formData, accessToken);
      console.log('Student added successfully!');
      setSuccessMessage('Student added successfully!');
      setError(null);
    } catch (error) {
      setSuccessMessage('');
      console.error('Error adding student:', error);
      setError('Error adding student');
    }
  };

  return (
    <form className="m-3" onSubmit={handleSubmit(onSubmit)}>
      <div className="m-3">
        <img
          src={imgSrc ? URL.createObjectURL(imgSrc) : avatar}
          style={{ height: '230px', width: '230px' }}
          className="img-fluid"
        />
        <button type="button" className="btn mt-3" onClick={selectImg}>
          <FontAwesomeIcon icon={faImage} className="fa-xl" />
        </button>
      </div>

      <input
        style={{ display: 'none' }}
        ref={fileInputRef}
        type="file"
        onChange={imgSelected}
      />

      <div className="mb-3">
        <label htmlFor="_id" className="form-label">
          ID:
        </label>
        <input
          type="text"
          id="_id"
          {...register('_id', { required: true, minLength: 5, maxLength: 10 })}
          className="form-control"
        />
        {errors._id && <div className="text-danger">{errors._id.message}</div>}
      </div>

      <div className="mb-3">
        <label htmlFor="name" className="form-label">
          Name:
        </label>
        <input
          type="text"
          id="name"
          {...register('name', { required: true })}
          className="form-control"
        />
        {errors.name && (
          <div className="text-danger">{errors.name.message}</div>
        )}
      </div>

      <div className="mb-3">
        <label htmlFor="age" className="form-label">
          Age:
        </label>
        <input
          type="number"
          id="age"
          {...register('age', { valueAsNumber: true, min: 18 })}
          className="form-control"
        />
        {errors.age && <div className="text-danger">{errors.age.message}</div>}
      </div>

      <button type="submit" className="btn btn-primary">
        Submit
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
    </form>
  );
}

export default StudentForm;
