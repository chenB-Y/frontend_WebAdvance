import { zodResolver } from '@hookform/resolvers/zod';
import { FieldValues, useForm } from 'react-hook-form';
import { z } from 'zod';

const schema = z.object({
  id: z.string().min(5, 'name must contain at least 5 letters').max(10),
  name: z.string().nonempty('Name is required'),
  age: z.number().min(18, 'you must be at least 18 years old'),
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

  const onSubmit = (data: FieldValues) => {
    console.log('on submit', data);
  };

  return (
    <form className="m-3" onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-3">
        <label htmlFor="id" className="form-label">
          ID:
        </label>
        <input
          type="text"
          id="id"
          {...register('id', { required: true, minLength: 5, maxLength: 10 })}
          className="form-control"
        />
        {errors.id && <div className="text-danger">{errors.id.message}</div>}
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
          {...register('age', { required: true, min: 18 })}
          className="form-control"
        />
        {errors.age && <div className="text-danger">{errors.age.message}</div>}
      </div>
      <button type="submit" className="btn btn-primary">
        Submit
      </button>
    </form>
  );
}

export default StudentForm;
