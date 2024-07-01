import apiClient from './api-client';
import { CredentialResponse } from '@react-oauth/google';

export interface IUser {
  email: string;
  password?: string;
  _id?: string;
  imgUrl?: string;
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
