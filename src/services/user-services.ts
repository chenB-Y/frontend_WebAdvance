import apiClient from './api-client';
import { CredentialResponse } from '@react-oauth/google';

export interface IUser {
  email: string;
  username: string;
  userID: string;
  imgUrl?: string;
  groupID?: string;
  accessToken?: string;
  refreshToken?: string;
}

export const registrUser = (user: IUser) => {
  return new Promise<IUser>((resolve, reject) => {
    console.log('Registering user...');
    console.log(user);
    apiClient
      .post('/auth/register', user)
      .then((response) => {
        console.log(response);
        resolve(response.data);
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
};

export const googleSignin = (credentialResponse: CredentialResponse) => {
  return new Promise<IUser>((resolve, reject) => {
    console.log('googleSignin ...');
    apiClient
      .post('/auth/google', credentialResponse)
      .then((response) => {
        console.log(response);
        resolve(response.data);
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
};

export const refreshAccessToken = async () => {
  const refreshT = localStorage.getItem('refreshToken');
  if (!refreshT) {
    throw new Error('No refresh token available');
  }

  const response = await apiClient.get('/auth/refresh', {
    headers: {
      refreshtoken: refreshT,
    },
  });

  const { accessToken, refreshToken } = response.data;
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken)
  return accessToken;
};