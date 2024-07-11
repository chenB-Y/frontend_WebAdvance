import { useState, useEffect } from 'react';
import productServices, { Product } from '../services/product-services';
import { CanceledError } from 'axios';
//import { set } from 'react-hook-form';

const useProducts = (groupID: string) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const accessToken = localStorage.getItem('accessToken');
      console.log('Access Token: ', accessToken);
      if (!accessToken) {
        setError('Access token not found');
        setLoading(false);
        return;
      }
      try {
        const response = await productServices.getAllProducts(
          accessToken,
          groupID
        );
        console.log(response);
        setProducts(response);
      } catch (error) {
        if (error instanceof CanceledError) return;
        console.error('Error fetching data', error);
        setError('Error fetching data');
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return { products, error, loading };
};



export default useProducts;