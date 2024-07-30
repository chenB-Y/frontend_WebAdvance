import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Comment, Product } from '../services/product-services';
import apiClient from '../services/api-client';

interface LocationState {
  productId: string;
}

const ProductComments: React.FC = () => {
  const location = useLocation();
  const { productId } = (location.state as LocationState) || { productId: '' };
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!productId) return;

    const eventSource = new EventSource(`https://10.10.248.174:4000/events`);

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'COMMENT_ADDED' && data.productId === productId) {
        setComments((prevComments) => [...prevComments, data.comment]);
      }
    };

    return () => {
      eventSource.close();
    };
  }, [productId]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await apiClient.get<Product>(
          `/product/comments/${productId}`,
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
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchComments();
    } else {
      setLoading(false);
    }
  }, [productId]);

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Product Comments</h2>
      {loading ? (
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="sr-only"></span>
          </div>
        </div>
      ) : (
        <>
          {Array.isArray(comments) && comments.length > 0 ? (
            <ul className="list-group">
              {comments.map((comment, index) => (
                <li key={index} className="list-group-item">
                  <strong>{comment.username}</strong>: {comment.text}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted">No comments found.</p>
          )}
        </>
      )}
    </div>
  );
};

export default ProductComments;
