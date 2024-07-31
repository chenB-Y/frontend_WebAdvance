import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import productServices from '../services/product-services';
import { ChangeEvent, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-solid-svg-icons';
import avatar from '../assets/avatar.jpeg';
import { uploadPhoto } from '../services/file-service';
import { useNavigate } from 'react-router-dom';
import '../style/ProductForm.css'; // Importing CSS file for custom styles

const schema = z.object({
  name: z.string().nonempty('Name is required'),
  amount: z
    .number({ invalid_type_error: 'Amount is required' })
    .min(1, 'The amount must be above zero!'),
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
  const navigate = useNavigate();

  const imgSelected = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImgSrc(e.target.files[0]);
    }
  };

  const selectImg = () => {
    fileInputRef.current?.click();
  };

  const onSubmit = async (data: FormData) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        navigate('/Error');
        throw new Error('Access token not found');
      }

      const ownerId = localStorage.getItem('userID') ?? '';
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('amount', data.amount.toString());
      formData.append('ownerId', ownerId);

      let url = '';
      if (imgSrc) {
        url = await uploadPhoto(imgSrc, 'product');
        formData.append('imageUrl', url);
      }

      const groupID = localStorage.getItem('groupID') ?? '';
      await productServices.addProduct(formData, accessToken, groupID);
      setSuccessMessage('Product added successfully!');
      setError(null);
    } catch (error) {
      setSuccessMessage('');
      setError('Error adding Product');
      navigate('/Error');
    }
  };

  return (
    <div className="container mt-5">
      <form className="product-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="text-center mb-4">
          <img
            src={imgSrc ? URL.createObjectURL(imgSrc) : avatar}
            className="img-thumbnail"
            alt="Product"
          />
          <div className="button-container">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={selectImg}
            >
              <FontAwesomeIcon icon={faImage} className="fa-xl" /> Select Image
            </button>
          </div>
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
            {...register('name')}
            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
          />
          {errors.name && (
            <div className="invalid-feedback">{errors.name.message}</div>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="amount" className="form-label">
            Amount:
          </label>
          <input
            type="number"
            id="amount"
            {...register('amount', { valueAsNumber: true })}
            className={`form-control ${errors.amount ? 'is-invalid' : ''}`}
          />
          {errors.amount && (
            <div className="invalid-feedback">{errors.amount.message}</div>
          )}
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Submit
        </button>
        {error && <div className="alert alert-danger mt-3">{error}</div>}
        {successMessage && (
          <div className="alert alert-success mt-3">{successMessage}</div>
        )}
      </form>
    </div>
  );
}

export default ProductForm;