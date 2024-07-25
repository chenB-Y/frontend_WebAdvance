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

export const refreshToken = () => {
  return new Promise<IUser>((resolve, reject) => {
    console.log('Refreshing token...');
    const refreshToken = localStorage.getItem('refreshToken'); // Get the refreshToken from localStorage
    if (!refreshToken) {
      reject(new Error('No refresh token available'));
      return;
    }
    apiClient
      .get('/auth/refresh', {
        headers: {
          refreshtoken: `${refreshToken}`, // Send the refreshToken
        },
      })
      .then((response) => {
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        console.log(response);
        resolve(response.data);
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
};
