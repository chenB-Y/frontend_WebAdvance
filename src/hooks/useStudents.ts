import { useState, useEffect } from 'react';
import studentServices, { Student } from '../services/student-services';
import { CanceledError } from 'axios';

const useStudents = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const accessToken = localStorage.getItem('accessToken');
    console.log('Access Token: ', accessToken);
    if (!accessToken) {
      setError('Access token not found');
      setLoading(false);
      return;
    }
    const { request, cancel } = studentServices.getAllStudent(accessToken);
    request
      .then((response) => {
        console.log(response.data);
        setStudents(response.data);
        setLoading(false);
      })
      .catch((error) => {
        if (error instanceof CanceledError) return;
        console.error('Error fetching data', error);
        setError('Error fetching data');
        setLoading(false);
      });
    return () => cancel();
  }, []);

  return { students, error, loading };
};

export default useStudents;
