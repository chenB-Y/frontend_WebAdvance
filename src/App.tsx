import { Fragment } from 'react/jsx-runtime';

function Post() {
  const array = [
    'An item',
    'A second item',
    'A third item',
    'A fourth item',
    'And a fifth one',
  ];
  return (
    <ul className="list-group">
      {array.map((item, index) => (
        <li className="list-group-item">
          An item: {item} index:{index}
        </li>
      ))}
    </ul>
  );
}

function App() {
  return (
    <Fragment>
      <h1>My List</h1>
      <Post />
    </Fragment>
  );
}

export default App;
