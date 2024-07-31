import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from 'react-router-dom';
import './style/App.css';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import HomePage from './components/HomePage';
import HomeLayout from './layouts/HomeLayout';
import { AuthProvider } from './context/AuthContext';
import ProductList from './components/ProductList';
import ProductForm from './components/ProductForm';
import EditProfile from './components/EditProfile';
import GroupForm from './components/GroupForm';
import UserProducts from './components/UserProduct';
import ProductComment from './components/ProductComments';
import RecipeAPI from './components/RecipeAPI';
import ErrorPage from './components/ErrorPage';
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<HomeLayout />}>
      <Route index element={<HomePage />} />
      <Route path="home" element={<HomePage />} />
      <Route path="login" element={<LoginForm />} />
      <Route path="register" element={<RegisterForm />} />
      <Route path="productForm" element={<ProductForm />} />
      <Route path="EditP" element={<EditProfile />} />
      <Route path="GroupForm" element={<GroupForm />} />
      <Route path="products" element={<ProductList />} />
      <Route path="userProducts" element={<UserProducts />} />
      <Route path="commentsComp" element={<ProductComment />} />
      <Route path='recipeAPI' element={<RecipeAPI/>} />
      <Route path='Error' element={<ErrorPage/>}/>
      <Route path='*' element={<ErrorPage/>}/>
    </Route>
  )
);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
