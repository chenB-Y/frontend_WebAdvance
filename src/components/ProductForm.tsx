import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import productServices from '../services/product-services';
import { ChangeEvent, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-solid-svg-icons';
import avatar from '../assets/avatar.jpeg';
import { uploadPhoto } from '../services/file-service';

const schema = z.object({
  name: z.string().nonempty('Name is required'),
  amount: z
    .number({ invalid_type_error: 'Age is required' })
    .min(18, 'You must be at least 18 years old'),
  url: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

function ProductForm() {
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
    console.log('Form submitted:', data);
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        throw new Error('Access token not found');
        return;
      } else {
        const ownerId = localStorage.getItem('userID') ?? '';
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('amount', data.amount.toString());
        formData.append('ownerId', ownerId);

        console.log('Selected image:', imgSrc);
        const url = await uploadPhoto(imgSrc!, 'product');
        console.log('upload returned:', url);

        if (imgSrc) {
          formData.append('imageUrl', url);
        }

        console.log('FormData to be sent:', formData);

        const groupID = localStorage.getItem('groupID') ?? '';
        await productServices.addProduct(formData, accessToken, groupID);
        console.log('Product added successfully!');
        setSuccessMessage('Product added successfully!');
        setError(null);
      }
    } catch (error) {
      setSuccessMessage('');
      console.error('Error adding Product:', error);
      setError('Error adding Product');
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
        <label htmlFor="amount" className="form-label">
          Amount:
        </label>
        <input
          type="number"
          id="amount"
          {...register('amount', { valueAsNumber: true, min: 18 })}
          className="form-control"
        />
        {errors.amount && (
          <div className="text-danger">{errors.amount.message}</div>
        )}
      </div>

      <button type="submit" className="btn btn-primary">
        Submit
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
    </form>
  );
}

export default ProductForm;
