import { useState, useEffect } from 'react';
import productServices, { Product } from '../services/product-services';
import { CanceledError } from 'axios';

const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const accessToken = localStorage.getItem('accessToken');
    console.log('Access Token: ', accessToken);
    if (!accessToken) {
      setError('Access token not found');
      setLoading(false);
      return;
    }
    const { request, cancel } = productServices.getAllProducts(accessToken);
    request
      .then((response) => {
        console.log(response.data);
        setProducts(response.data);
        setLoading(false);
      })
      .catch((error) => {
        if (error instanceof CanceledError) return;
        console.error('Error fetching data', error);
        setError('Error fetching data');
        setLoading(false);
      });
    return () => cancel();
  }, []);

  return { products, error, loading };
};

export default useProducts;
