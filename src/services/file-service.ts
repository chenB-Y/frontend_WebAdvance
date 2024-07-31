import axios from 'axios';
import apiClient from './api-client';
import { refreshAccessToken } from './user-services';

interface IUploadResponse {
  url: string;
}

export const uploadPhoto = (photo: File, type: string): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    console.log('Uploading photo...', photo);
    const formData = new FormData();
    if (photo) {
      formData.append('file', photo);
      const request = type === 'product' ? '/file/uploadProduct' : '/file/uploadUser';

      const uploadWithToken = async (token: string) => {
        try {
          console.log("111111111111")
          const res = await apiClient.post<IUploadResponse>(request, formData, {
            headers: {
              'Content-Type': 'multipart/form-data', // Use multipart/form-data for file uploads
              'Authorization': `Bearer ${token}`,
            },
          });
          console.log("22222222222222222222222")
          console.log(res);
          resolve(res.data.url);
        } catch (err) {
          if (axios.isAxiosError(err) && err.response && err.response.status === 401) {
            try {
              const newToken = await refreshAccessToken();
              const res = await apiClient.post<IUploadResponse>(request, formData, {
                headers: {
                  'Content-Type': 'multipart/form-data',
                  'Authorization': `Bearer ${newToken}`,
                },
              });
              console.log(res);
              resolve(res.data.url);
            } catch (refreshErr) {
              console.error('Error refreshing token', refreshErr);
              reject(refreshErr);
            }
          } else {
            console.error(err);
            reject(err);
          }
        }
      };

      const processUpload = async () => {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
          await uploadWithToken(accessToken);
        } else {
          reject('No access token provided');
        }
      };

      processUpload().catch(reject);
    } else {
      reject('No file provided');
    }
  });
};



export const uploadPhotoForRegister = async (
  photo: File,
): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    console.log('Uploading photo...', photo);
    const formData = new FormData();
    if (photo) {
      formData.append('file', photo);
      apiClient
        .post<IUploadResponse>('/file/uploadUser', formData, {
          headers: {
            'Content-Type': 'multipart/form-data', // Use multipart/form-data for file uploads
          },
        })
        .then((res) => {
          console.log(res);
          resolve(res.data.url);
        })
        .catch((err) => {
          console.error(err);
          reject(err);
        });
    } else {
      reject('No file provided');
    }
  });
};
