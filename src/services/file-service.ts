import apiClient from './api-client';

interface IUploadResponse {
  url: string;
}

export const uploadPhoto = async (photo: File): Promise<string> => {
  console.log('11111111111111111111111111111');
  return new Promise<string>((resolve, reject) => {
    console.log('Uploading photo...', photo);
    console.log('222222222222222222');
    const formData = new FormData();
    if (photo) {
      console.log('3333333333333333333333');
      formData.append('file', photo);
      console.log('44444444444444444');
      apiClient
        .post<IUploadResponse>('/file/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data', // Use multipart/form-data for file uploads
          },
        })
        .then((res) => {
          console.log('555555555555555555');
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
