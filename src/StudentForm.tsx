import { useState } from 'react';

function StudentForm() {
  const [name, setName] = useState('');
  const [age, setAge] = useState(0);
  const [id, setId] = useState('');
  const onsubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('ID:' + id + ' Name:' + name + ' Age:' + age);
  };
  return (
    <form className="m-3" onSubmit={onsubmit}>
      <div className="mb-3">
        <label htmlFor="id" className="form-label">
          ID:
        </label>
        <input
          type="text"
          id="id"
          name="id"
          className="form-control"
          onChange={(eve) => setId(eve.target.value)}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="name" className="form-label">
          Name:
        </label>
        <input
          type="text"
          id="name"
          name="name"
          className="form-control"
          onChange={(eve) => setName(eve.target.value)}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="age" className="form-label">
          age:
        </label>
        <input
          type="number"
          id="age"
          name="age"
          className="form-control"
          onChange={(eve) => setAge(Number(eve.target.value))}
        />
      </div>
      <button type="submit" className="btn btn-primary">
        Submit
      </button>
    </form>
  );
}

export default StudentForm;
