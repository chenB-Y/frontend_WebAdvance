import useProducts from '../hooks/useProducts';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { Product } from '../services/product-services';
import apiClient from '../services/api-client';
import { refreshAccessToken } from '../services/user-services';
import axios from 'axios';
import { z } from 'zod';

function ProductList() {
  const groupID = localStorage.getItem('groupID') ?? '';
  const userId = localStorage.getItem('userID') ?? '';
  const username = localStorage.getItem('username') ?? '';
  const { products: initialProducts, error, loading } = useProducts(groupID);
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [newComment, setNewComment] = useState<{ [key: string]: string }>({});
  const ws = useRef<WebSocket | null>(null);
  const [commentCounts, setCommentCounts] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    setProducts(initialProducts || []);
    const initialCounts = initialProducts?.reduce((acc, product) => {
      acc[product._id] = product.comments?.length || 0;
      return acc;
    }, {} as { [key: string]: number });
    setCommentCounts(initialCounts || {});
  }, [initialProducts]);

  useEffect(() => {
    const eventSource = new EventSource('https://10.10.248.174:4000/events');

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      switch (data.type) {
        case 'PRODUCT_ADDED':
          setProducts((prevProducts) => [...prevProducts, data.newProduct]);
          break;
        case 'PRODUCT_UPDATED':
          setProducts((prevProducts) =>
            prevProducts.map((product) =>
              product._id === data.product._id ? data.product : product
            )
          );
          break;
        case 'PRODUCT_DELETED':
          setProducts((prevProducts) =>
            prevProducts.filter((product) => product._id !== data.productId)
          );
          break;
        case 'COMMENT_ADDED':
          setProducts((prevProducts) =>
            prevProducts.map((product) =>
              product._id === data.productId ? { ...product } : product
            )
          );
          setCommentCounts((prevCounts) => ({
            ...prevCounts,
            [data.productId]: (prevCounts[data.productId] || 0) + 1,
          }));
          break;
        default:
          break;
      }
    };

    return () => {
      eventSource.close();
    };
  }, []);

  const handleDeleteProduct = async (productId: string) => {
    try {
      const deleteWithToken = async (token: string) => {
        try {
          await apiClient.delete(`/product/${productId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const updatedProducts = products.filter(
            (product) => product._id !== productId
          );
          setProducts(updatedProducts);
          ws.current?.send(JSON.stringify({ type: 'PRODUCT_DELETED', productId }));
        } catch (err) {
          if (axios.isAxiosError(err) && err.response && err.response.status === 401) {
            console.log('Refreshing token...');
            try {
              const newToken = await refreshAccessToken();
              await deleteWithToken(newToken); // Retry the delete request with the new token
            } catch (refreshErr) {
              console.error('Error refreshing token', refreshErr);
              navigate('/Error');
            }
          } else {
            navigate('/Error');
            throw err; // Re-throw if it's not a token error
          }
        }
      };

      const token = localStorage.getItem('accessToken');
      if (token) {
        await deleteWithToken(token);
      }
    } catch (err) {
      console.error('Error deleting product', err);
      navigate('/Error');
    }
  };

  const handleAddComment = async (productId: string) => {
    try {
      const token = localStorage.getItem('accessToken');
      const comment = newComment[productId];

      await apiClient.post(
        `/product/addComment/${productId}`,
        { userID: userId, username: username, text: comment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedProducts = products.map((product) =>
        product._id === productId
          ? {
              ...product,
              comments: [
                ...product.comments,
                { userId, username, text: comment },
              ],
            }
          : product
      );

      setProducts(updatedProducts);
      setNewComment({ ...newComment, [productId]: '' });
      ws.current?.send(
        JSON.stringify({
          type: 'COMMENT_ADDED',
          productId,
          comment: { userId, username, text: comment },
        })
      );
    } catch (err) {
      if (axios.isAxiosError(err) && err.response && err.response.status === 401) {
        try {
          const newToken = await refreshAccessToken();
          const comment = newComment[productId];

          await apiClient.post(
            `/product/addComment/${productId}`,
            { userID: userId, username: username, text: comment },
            {
              headers: {
                Authorization: `Bearer ${newToken}`,
              },
            }
          );

          const updatedProducts = products.map((product) =>
            product._id === productId
              ? {
                  ...product,
                  comments: [
                    ...product.comments,
                    { userId, username, text: comment },
                  ],
                }
              : product
          );

          setProducts(updatedProducts);
          setNewComment({ ...newComment, [productId]: '' });
          ws.current?.send(
            JSON.stringify({
              type: 'COMMENT_ADDED',
              productId,
              comment: { userId, username, text: comment },
            })
          );
        } catch (refreshErr) {
          console.error('Error refreshing token', refreshErr);
          navigate('/Error');
        }
      } else {
        console.error('Error adding comment', err);
        navigate('/Error');
      }
    }
  };

  const handleCommentChange = (productId: string, value: string) => {
    setNewComment({ ...newComment, [productId]: value });
  };

  const handleViewComments = (productId: string) => {
    navigate(`/commentsComp`, { state: { productId } });
  };

  const commentSchema = z.object({
    comment: z.string().min(1, { message: 'Comment cannot be empty' }),
  });

  const isCommentValid = (comment: string) => {
    try {
      commentSchema.parse({ comment });
      return true;
    } catch (e) {
      return false;
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Products</h1>
      {loading && <div className="spinner-border text-primary" />}
      {error && <div className="alert alert-danger">{error}</div>}
      <ul className="list-group">
        {products.length > 0 ? (
          products.map((item: Product, index: number) => (
            <li
              className="list-group-item d-flex justify-content-between align-items-start mb-3"
              key={index}
            >
              <div className="d-flex align-items-center">
                <img
                  src={item.imageUrl}
                  alt={`${item.name}'s photo`}
                  className="img-thumbnail me-3"
                  style={{ width: '80px', height: '80px' }}
                />
                <div>
                  <h5 className="mb-1">{item.name}</h5>
                  <p className="mb-1">Quantity: {item.amount}</p>
                </div>
              </div>
              <div className="d-flex flex-column align-items-end">
                {item.comments?.length > 0 && (
                  <div className="mb-2">
                    <strong>Comments: {commentCounts[item._id] || 0}</strong>
                  </div>
                )}
                <button
                  className="btn btn-info btn-sm mb-2"
                  onClick={() => handleViewComments(item._id)}
                >
                  View Comments
                </button>
                <button
                  className="btn btn-danger btn-sm mb-2"
                  onClick={() => handleDeleteProduct(item._id)}
                >
                  Delete
                </button>
                <div className="d-flex align-items-center">
                  <input
                    type="text"
                    value={newComment[item._id] || ''}
                    onChange={(e) => handleCommentChange(item._id, e.target.value)}
                    placeholder="Add a comment"
                    className="form-control me-2"
                    style={{ maxWidth: '200px' }}
                  />
                  <button
                    className="btn btn-primary"
                    onClick={() => handleAddComment(item._id)}
                    disabled={!isCommentValid(newComment[item._id] || '')}
                  >
                    Add Comment
                  </button>
                </div>
              </div>
            </li>
          ))
        ) : (
          <li className="list-group-item">No products available.</li>
        )}
      </ul>
    </div>
  );
}

export default ProductList;