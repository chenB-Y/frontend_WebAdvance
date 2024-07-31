import { useState, useEffect } from 'react';
import productServices, { Product } from '../services/product-services';
import { CanceledError } from 'axios';
import { useNavigate } from 'react-router-dom';

const useProductsByOwner = (userId: string) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const accessToken = localStorage.getItem('accessToken');
      const groupId = localStorage.getItem('groupID') || '';

      if (!accessToken) {
        setError('Access token not found');
        setLoading(false);
        return;
      }

      try {
        const response = await productServices.getAllProducts(
          accessToken,
          groupId
        );
        const userProducts = response.filter(
          (product: Product) => product.ownerId === userId
        );
        setProducts(userProducts);
      } catch (error) {
        if (error instanceof CanceledError) return;
        setError('Error fetching data');
        navigate('/Error')
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [userId]);

  return { products, error, loading };
};

export default useProductsByOwner;
