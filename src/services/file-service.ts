import apiClient from './api-client';

interface IUploadResponse {
  url: string;
}

export const uploadPhoto = async (photo: File): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    console.log('Uploading photo...', photo);
    const formData = new FormData();
    if (photo) {
      formData.append('file', photo);
      apiClient
        .post<IUploadResponse>('/file/upload', formData, {
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
