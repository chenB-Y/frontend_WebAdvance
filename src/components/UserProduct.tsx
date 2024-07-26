import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import useProductsByOwner from '../hooks/useUserProduct'; // Correct import
import ProductEditModal from './EditProduct';
import { Product } from '../services/product-services';
import axios from 'axios';

function UserProducts() {
  const userId = localStorage.getItem('userID') ?? '';
  const {
    products: initialProducts,
    error,
    loading,
  } = useProductsByOwner(userId);
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    setProducts(initialProducts || []);
  }, [initialProducts]);

  useEffect(() => {
    ws.current = new WebSocket('wss://10.10.248.174:4001'); // Adjust the URL as necessary

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === 'PRODUCT_UPDATED') {
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product._id === data.product._id ? data.product : product
          )
        );
      } else if (data.type === 'PRODUCT_DELETED') {
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product._id !== data.productId)
        );
      }
    };

    return () => {
      ws.current?.close();
    };
  }, []);

  const updateProduct = (updatedProduct: Product) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product._id === updatedProduct._id ? updatedProduct : product
      )
    );
  };

  const handleEditClick = (product: Product) => {
    setSelectedProduct(product);
  };

  const logoutfunc = async () => {
    try {
      const token = localStorage.getItem('refreshToken');
      const response = await axios.get('https://10.10.248.174:4000/auth/logout', {
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
  };

  return (
    <div>
      <h1>User's Products</h1>
      {loading && <div className="spinner-border text-primary" />}
      {error && <div className="alert alert-danger">{error}</div>}
      <ul className="list-group">
        {products.length > 0 ? (
          products.map((item, index) => (
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
              </div>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => handleEditClick(item)}
              >
                Edit
              </button>
            </li>
          ))
        ) : (
          <div>No products found</div>
        )}
      </ul>
      <button onClick={logoutfunc} className="btn btn-primary">
        Logout
      </button>

      {selectedProduct && (
        <ProductEditModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onSave={updateProduct}
        />
      )}
    </div>
  );
}

export default UserProducts;
