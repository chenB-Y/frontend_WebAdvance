import { AxiosRequestConfig } from 'axios';
import apiClient from './api-client';
//import { refreshToken } from './user-services';
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

const getAllProducts = async (accessToken: string, groupID: string) => {
  try {
    const response = await apiClient.get(`/group/getGroup/${groupID}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log('Response: ', response.data.products);
    if (response.status === 200) {
      return response.data.products;
    }
    // if (response.status === 401) {
    //   console.log('Unauthorized');
    //   // refrsh token
    //   const newToken = await refreshToken();
    //   if (newToken.accessToken && newToken.refreshToken) {
    //     localStorage.setItem('accessToken', newToken.accessToken);
    //     localStorage.setItem('refreshToken', newToken.refreshToken);
    //     getAllProducts(newToken.accessToken, groupID);
    //   }
    // }
  } catch (err) {
    console.log(err);
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
