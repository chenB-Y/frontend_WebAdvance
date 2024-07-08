
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from 'react-router-dom';
import './App.css';

import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import ProductForm from './components/ProductForm';
import ProductList from './components/ProductList';
import RootLayout from './layouts/RootLayout';
import EditProfile from './components/EditProfile';
import GroupForm from './components/GroupForm';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route index path="products" element={<ProductList />} />
      <Route path="login" element={<LoginForm />} />
      <Route path="register" element={<RegisterForm />} />
      <Route path="productForm" element={<ProductForm />} />
      <Route path="EditP" element={<EditProfile />} />
      <Route path="GroupForm" element={<GroupForm/>} />
    </Route>
  )
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
