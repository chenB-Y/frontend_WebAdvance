import axios from 'axios';
import useProducts from '../hooks/useProducts';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ProductEditModal from './EditProduct';
import { Product } from '../services/product-services';

function ProductList() {
  const { products: initialProducts, error, loading } = useProducts();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    setProducts(initialProducts || []);
  }, [initialProducts]);

  const updateProduct = (updatedProduct: Product) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product._id === updatedProduct._id ? updatedProduct : product
      )
    );
  };

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

  const handleEditClick = (product: Product) => {
    setSelectedProduct(product);
  };

  return (
    <div>
      <h1>Products</h1>
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

export default ProductList;
