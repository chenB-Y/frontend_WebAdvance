import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Comment, Product } from '../services/product-services';
import apiClient from '../services/api-client';
import axios from 'axios';
import { refreshAccessToken } from '../services/user-services';

interface LocationState {
  productId: string;
}

const ProductComments: React.FC = () => {
  const location = useLocation();
  const { productId } = (location.state as LocationState) || { productId: '' };
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate()

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

let isRefreshing = false;
let pendingRequests: Array<(token: string) => void> = [];

  useEffect(() => {

const fetchComments = async () => {
  setLoading(true);
  try {
    const fetchWithToken = async (token: string) => {
      try {
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
      } catch (err) {
        if (axios.isAxiosError(err) && err.response && err.response.status === 401) {
          if (!isRefreshing) {
            isRefreshing = true;
            try {
              const newToken = await refreshAccessToken();
              isRefreshing = false;
              // Retry all pending requests with the new token
              pendingRequests.forEach(callback => callback(newToken));
              pendingRequests = [];
              await fetchWithToken(newToken); // Retry the original request
            } catch (refreshErr) {
              console.error('Error refreshing token', refreshErr);
              pendingRequests = [];
              navigate('/Error');
            }
          } else {
            // Add the request to pending requests if a refresh is already in progress
            await new Promise<void>(resolve => {
              pendingRequests.push(async (newToken) => {
                await fetchWithToken(newToken);
                resolve();
              });
            });
          }
        } else {
          navigate('/Error')
          throw err;
        }
      }
    };

    const token = localStorage.getItem('accessToken');
    if (token) {
      await fetchWithToken(token);
    }
  } catch (err) {
    console.error('Error fetching comments:', err);
    navigate('/Error')
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
