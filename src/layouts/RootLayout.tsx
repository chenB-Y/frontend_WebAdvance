import { NavLink, Outlet } from 'react-router-dom';

export default function RootLayout() {
  return (
    <div className="root-layout">
      <header>
        <nav>
          <h1>Apppppp</h1>
          <NavLink to="/login">Login</NavLink>
          <NavLink to="/register">Register</NavLink>
          <NavLink to="/productForm">addProduct</NavLink>
          <NavLink to="/products">Products</NavLink>
          <NavLink to="/EditP">EditP</NavLink>
          <NavLink to="/GroupForm">group</NavLink>
        </nav>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  );
}
