import apiClient from './api-client';

export interface IUser {
  email: string;
  password?: string;
  _id?: string;
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
