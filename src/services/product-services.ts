import axios, { AxiosRequestConfig } from 'axios';
import apiClient from './api-client';
import { refreshAccessToken } from './user-services';
export interface Comment {
  userId: string;
  username: string;
  text: string;
}

export interface Product {
  _id: string;
  name: string;
  amount: number;
  imageUrl: string;
  ownerId: string;
  comments: Comment[];
}

let isRefreshing = false; // Flag to check if token refresh is in progress
let refreshSubscribers: ((token: string) => void)[] = []; // List of pending requests

// Function to add request to the queue
const addSubscriber = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

// Function to handle token refresh
const onTokenRefreshed = (token: string) => {
  refreshSubscribers.forEach(callback => callback(token));
  refreshSubscribers = []; // Clear subscribers
};

const fetchProducts = async (accessToken: string, groupID: string) => {
  try {
    const response = await apiClient.get(`/group/getGroup/${groupID}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log('Response:', response.data.products);
    return response.data.products;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response && err.response.status === 401) {
      // Token is expired, handle refresh
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const newToken = await refreshAccessToken();
          isRefreshing = false;
          onTokenRefreshed(newToken); // Notify all pending requests
          return fetchProducts(newToken, groupID); // Retry with new token
        } catch (refreshErr) {
          isRefreshing = false;
          console.error('Token refresh failed', refreshErr);
          throw new Error('Token refresh failed');
        }
      }

      // If a refresh is already in progress, wait for it to complete
      return new Promise<string>((resolve, reject) => {
        addSubscriber((newToken) => {
          fetchProducts(newToken, groupID).then(resolve).catch(reject);
        });
      });
    } else {
      // Rethrow other errors
      throw err;
    }
  }
};

const getAllProducts = async (accessToken: string, groupID: string) => {
  try {
    return await fetchProducts(accessToken, groupID);
  } catch (err) {
    console.error('Error fetching products', err);
    throw new Error('Failed to fetch products');
  }
};

const addProduct = async (
  productData: FormData,
  accessToken: string,
  groupID: string
) => {
  const config: AxiosRequestConfig = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };
  const response = await apiClient.post(
    `/group/addProduct/${groupID}`,
    productData,
    config
  );
  return response.data;
};

export default {
  getAllProducts,
  addProduct,
};
