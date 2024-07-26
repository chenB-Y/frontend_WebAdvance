import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { Comment, Product } from '../services/product-services';

interface LocationState {
  productId: string;
}

const ProductComments: React.FC = () => {
  const location = useLocation();
  const { productId } = (location.state as LocationState) || { productId: '' };
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get<Product>(
          `https://10.10.248.174:4000/product/comments/${productId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log('Comments:', response.data.comments);
        setComments(response.data.comments);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    if (productId) {
      fetchComments();
    }
  }, [productId]);

  return (
    <div>
      <h2>Product Comments</h2>
      {Array.isArray(comments) && comments.length > 0 ? (
        <ul>
          {comments.map((comment, index) => (
            <li key={index}>
              {comment.text} - <strong>{comment.username}</strong>
            </li>
          ))}
        </ul>
      ) : (
        <p>No comments found.</p>
      )}
    </div>
  );
};

export default ProductComments;
