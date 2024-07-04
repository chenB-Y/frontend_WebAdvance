import { AxiosRequestConfig } from 'axios';
import apiClient from './api-client';
export interface Student {
  name: string;
  age: number;
  _id: string;
  url: string;
}

const getAllStudent = (accessToken: string) => {
  const abortController = new AbortController();
  const config: AxiosRequestConfig = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    signal: abortController.signal,
  };
  const request = apiClient.get<Student[]>('/student', config);
  return { request, cancel: () => abortController.abort() };
};

const addStudent = async (studentData: FormData, accessToken: string) => {
  const config: AxiosRequestConfig = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };
  const response = await apiClient.post('/student', studentData, config);
  return response.data;
};

export default {
  getAllStudent,
  addStudent,
};
