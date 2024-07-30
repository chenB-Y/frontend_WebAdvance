import { ChangeEvent, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-solid-svg-icons';
import { uploadPhoto } from '../services/file-service';
import apiClient from '../services/api-client';
import { z } from 'zod';

export interface Comment {
  userId: string;
  username: string;
  text: string;
}

export interface Product {
  _id: string;
  name: string;
  amount: number;
  imageUrl: string;
  ownerId: string;
  comments: Comment[];
}

interface ProductEditModalProps {
  product: Product;
  onClose: () => void;
  onSave: (updatedProduct: Product) => void;
}

const amountSchema = z.number().min(1, { message: "Amount must be greater than 0" });

function ProductEditModal({ product, onClose, onSave }: ProductEditModalProps) {
  const [imgSrc, setImgSrc] = useState<File | null>(null);
  const [name, setName] = useState(product.name);
  const [amount, setAmount] = useState(product.amount);
  const [imgUrl, setImgUrl] = useState(product.imageUrl);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const imgSelected = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImgSrc(e.target.files[0]);
    }
  };

  const selectImg = () => {
    fileInputRef.current?.click();
  };

  const handleSave = async () => {
    try {
      // Validate amount with Zod
      amountSchema.parse(amount);

      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Access token not found');
      }

      let updatedImgUrl = imgUrl;
      console.log('444444545555454554545454455555544444');
      if (imgSrc) {
        console.log('*******************Uploading image:', imgSrc);
        updatedImgUrl = await uploadPhoto(imgSrc, 'product');
        setImgUrl(updatedImgUrl);
      }

      const updatedProduct: Product = {
        ...product,
        name,
        amount,
        imageUrl: updatedImgUrl,
      };

      const response = await apiClient.put(
        `/product/update-product/${product._id}`,
        updatedProduct,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );

      if (response.status === 200) {
        setSuccessMessage('Product updated successfully!');
        setError(null);
        onSave(updatedProduct);
        onClose();
      }
    } catch (err) {
      console.error('Error updating product:', err);
      setError(err instanceof z.ZodError ? err.errors[0].message : 'Error updating product');
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
            <h5 className="modal-title">Edit Product</h5>
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
              <label htmlFor="amount">Amount:</label>
              <input
                type="number"
                id="amount"
                className="form-control"
                value={amount}
                onChange={(e) => setAmount(parseInt(e.target.value))}
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
            />
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

export default ProductEditModal;
