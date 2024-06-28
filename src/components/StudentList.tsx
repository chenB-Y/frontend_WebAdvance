import useStudents from '../hooks/useStudents';

function StudentList() {
  console.log('StudentList');
  const { students, error, loading } = useStudents();

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
