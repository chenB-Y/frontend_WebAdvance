import { useState } from 'react';
import { Fragment } from 'react/jsx-runtime';

interface PostProps {
  title: string;
  content: string[];
  onItemSelected: (index: number) => void;
}
function PostList({ title, content, onItemSelected }: PostProps) {
  console.log('Post');
  //const array = ['An item','A second item','A third item','A fourth item','And a fifth item'];
  // const array: string[] = [];
  const [clickedIndex, setClickedIndex] = useState(-1);
  const handleClick = (eve: React.MouseEvent<HTMLLIElement>) => {
    const textContent = eve.currentTarget.textContent;
    if (textContent) {
      const match = textContent.match(/\d+/); // Match one or more digits
      if (match) {
        const index = Number(match[0]);
        console.log('item clicked', eve.currentTarget.textContent);
        setClickedIndex(index);
        onItemSelected(index);
      }
    }
  };
  return (
    <Fragment>
      <h1>{title}</h1>
      {/*the && is like if the condition is true do that ... */}
      {content.length === 0 && <p>No items to display</p>}
      {/* {array.length === 0 ? <p>No items to display</p> : null} */}
      <ul className="list-group">
        {content.map((item, index) => (
          <li
            className={
              clickedIndex == index
                ? 'list-group-item active'
                : 'list-group-item'
            }
            key={index}
            onClick={handleClick}
          >
            An item: {item} index:{index}
          </li>
        ))}
      </ul>
    </Fragment>
  );
}

function App() {
  const [displayAlert, setDisplayAlert] = useState(false);
  console.log('App');
  const array = [
    'An item',
    'A second item',
    'A third item',
    'A fourth item',
    'And a fifth item',
  ];
  const array2 = ['black', 'blue', 'green', 'red', 'yellow'];
  return (
    <Fragment>
      {displayAlert && (
        <div
          className="alert alert-warning alert-dismissible fade show"
          role="alert"
        >
          <strong>Holy guacamole!</strong> You should check in on some of those
          fields below.
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="alert"
            aria-label="Close"
            onClick={() => {
              setDisplayAlert(false);
            }}
          ></button>
        </div>
      )}
      <PostList
        title="This is my List"
        content={array}
        onItemSelected={(index) => {
          console.log('item selected ' + index);
        }}
      />
      <PostList
        title="This is my Colors"
        content={array2}
        onItemSelected={(index) => {
          console.log('color selected ' + array2[index]);
        }}
      />
      <button
        type="button"
        className="btn btn-primary"
        onClick={() => {
          setDisplayAlert(true);
        }}
      >
        Display alert
      </button>
    </Fragment>
  );
}

export default App;
