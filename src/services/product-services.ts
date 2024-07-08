import { AxiosRequestConfig } from 'axios';
import apiClient from './api-client';
export interface Product {
  name: string;
  amount: number;
  imageUrl: string;
  _id?: string;
  ownerId?: string;
  comments?: string[];
}

const getAllProducts = (accessToken: string) => {
  const abortController = new AbortController();
  const config: AxiosRequestConfig = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    signal: abortController.signal,
  };
  const request = apiClient.get<Product[]>('/product', config);
  return { request, cancel: () => abortController.abort() };
};

const addProduct = async (productData: FormData, accessToken: string) => {
  const config: AxiosRequestConfig = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };
  const response = await apiClient.post('/product', productData, config);
  return response.data;
};

export default {
  getAllProducts,
  addProduct,
};
