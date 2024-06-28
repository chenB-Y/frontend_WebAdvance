import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import studentServices from '../services/student-services';
import { useState } from 'react';

const schema = z.object({
  _id: z.string().min(5, 'name must contain at least 5 letters').max(10),
  name: z.string().nonempty('Name is required'),
  age: z
    .number({ invalid_type_error: 'Age is required' })
    .min(18, 'you must be at least 18 years old'),
});

type FormData = z.infer<typeof schema>;
7;
function StudentForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const onSubmit = async (data: FormData) => {
    try {
      // Replace with your actual logic to get access token from local storage or state
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        throw new Error('Access token not found');
        setSuccessMessage('');
      }
      await studentServices.addStudent(data, accessToken);
      console.log('Student add Successfully!');
      setSuccessMessage('Student add Successfully!');
      setError(null);
      // Handle success, maybe redirect or show success message
    } catch (error) {
      setSuccessMessage('');
      console.error('Error adding student:', error);
    }
  };

  return (
    <form className="m-3" onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-3">
        <label htmlFor="id" className="form-label">
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
