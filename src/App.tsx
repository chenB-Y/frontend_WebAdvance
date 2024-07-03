// import LoginForm from './components/LoginForm';
// // import RegisterForm from './components/RegisterForm';
// // // import StudentForm from './components/StudentForm';
// // import StudentList from './components/StudentList';
// function App() {
//   console.log('App');
//   return (
//     <div>
//       {/* <StudentList />
//       <RegisterForm /> */}
//       <LoginForm />
//     </div>
//   );
// }

// export default App;

import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from 'react-router-dom';
import './App.css';

import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import StudentForm from './components/StudentForm';
import StudentList from './components/StudentList';
import RootLayout from './layouts/RootLayout';
import EditProfile from './components/EditProfile';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route index path="students" element={<StudentList />} />
      <Route path="login" element={<LoginForm />} />
      <Route path="register" element={<RegisterForm />} />
      <Route path="studentForm" element={<StudentForm />} />
      <Route path="EditP" element={<EditProfile />} />
    </Route>
  )
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
