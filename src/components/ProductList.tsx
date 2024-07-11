import axios from 'axios';
import useProducts from '../hooks/useProducts';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { Product } from '../services/product-services';

function ProductList() {
  const groupID = localStorage.getItem('groupID') ?? '';
  const userId = localStorage.getItem('userID') ?? '';
  const username = localStorage.getItem('username') ?? '';
  const { products: initialProducts, error, loading } = useProducts(groupID);
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [newComment, setNewComment] = useState<{ [key: string]: string }>({});
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    setProducts(initialProducts || []);
  }, [initialProducts]);

  useEffect(() => {
    ws.current = new WebSocket('ws://localhost:8080'); // Adjust the URL as necessary

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'PRODUCT_ADDED') {
        console.log('********************************************');
        console.log('Product added:', data.newProduct);
        console.log('********************************************');
        setProducts((prevProducts) => [...prevProducts, data.newProduct]);
      } else if (data.type === 'PRODUCT_UPDATED') {
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product._id === data.product._id ? data.product : product
          )
        );
      } else if (data.type === 'PRODUCT_DELETED') {
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product._id !== data.productId)
        );
      } else if (data.type === 'COMMENT_ADDED') {
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product._id === data.productId
              ? { ...product, comments: [...product.comments, data.comment] }
              : product
          )
        );
      }
    };

    return () => {
      ws.current?.close();
    };
  }, []);

  async function logoutfunc() {
    try {
      const token = localStorage.getItem('refreshToken');
      const response = await axios.get('http://localhost:3000/auth/logout', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userID');
        navigate('/login');
      }
    } catch (err) {
      console.error('Logout failed', err);
    }
  }

  const handleDeleteProduct = async (productId: string) => {
    try {
      const token = localStorage.getItem('accessToken');
      await axios.delete(`http://localhost:3000/product/${productId}`, {
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
      console.error('Error deleting product', err);
    }
  };

  const handleAddComment = async (productId: string) => {
    try {
      const token = localStorage.getItem('accessToken');
      const comment = newComment[productId];

      await axios.post(
        `http://localhost:3000/product/addComment/${productId}`,
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
      console.error('Error adding comment', err);
    }
  };

  const handleCommentChange = (productId: string, value: string) => {
    setNewComment({ ...newComment, [productId]: value });
  };

  const handleViewComments = (productId: string) => {
    navigate(`/commentsComp`, { state: { productId } });
  };

  return (
    <div>
      <h1>Products</h1>
      {loading && <div className="spinner-border text-primary" />}
      {error && <div className="alert alert-danger">{error}</div>}
      <ul className="list-group">
        {products.length > 0 ? (
          products.map((item: Product, index: number) => (
            <li
              className="list-group-item d-flex justify-content-between align-items-center"
              key={index}
            >
              <div className="d-flex align-items-center">
                <img
                  src={item.imageUrl}
                  alt={`${item.name}'s photo`}
                  style={{ width: '50px', height: '50px', marginRight: '10px' }}
                />
                {`Product name: ${item.name}`}
                <br />
                {`Quantity: ${item.amount}`}
                <br />
                <input
                  type="text"
                  value={newComment[item._id] || ''}
                  onChange={(e) =>
                    handleCommentChange(item._id, e.target.value)
                  }
                  placeholder="Add a comment"
                />
                <button
                  className="btn btn-primary btn-sm ms-2"
                  onClick={() => handleAddComment(item._id)}
                >
                  Add Comment
                </button>
              </div>
              <div>
                {item.comments?.length > 0 && (
                  <div>
                    <strong>Comments: {item.comments.length}</strong>
                  </div>
                )}
                <button
                  className="btn btn-info btn-sm"
                  onClick={() => handleViewComments(item._id)}
                >
                  View Comments
                </button>
                <br />
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDeleteProduct(item._id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))
        ) : (
          <div>No products found</div>
        )}
      </ul>
      <button onClick={logoutfunc} className="btn btn-primary mt-3">
        Logout
      </button>
    </div>
  );
}

export default ProductList;
