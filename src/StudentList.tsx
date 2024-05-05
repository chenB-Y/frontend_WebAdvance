import axios, { CanceledError } from 'axios';
import { useEffect, useState } from 'react';
import { set } from 'react-hook-form';

interface Student {
  name: string;
  age: number;
  _id: string;
}
function StudentList() {
  console.log('StudentList');
  const [students, setStudents] = useState<Student[]>();
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    axios
      .get('http://localhost:3000/student', { signal: controller.signal })
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
    return () => {
      controller.abort();
    };
  }, []);
  return (
    <div>
      <h1>Students</h1>
      {loading && <div className="spinner-border text-primary" />}
      {error && <div className="alert alert-danger">{error}</div>}
      {students?.map((item, index) => (
        <li className="list-group-item" key={index}>
          {item.name}
        </li>
      ))}
    </div>
  );
}

export default StudentList;
