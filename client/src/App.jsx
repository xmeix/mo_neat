import "./App.scss";
import "./index.scss";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthLayout from "./layouts/auth/layout/AuthLayout";
import NotFound from "./components/errors/notFound/NotFound";
import PublicLayout from "./layouts/regular/layout/PublicLayout";
import UserHome from "./layouts/regular/pages/home/UserHome";
import LoginPage from "./layouts/auth/pages/login/LoginPage";
import AdminLayout from "./layouts/admin/layout/AdminLayout";
import AdminHome from "./layouts/admin/pages/home/AdminHome";
import AdminProducts from "./layouts/admin/pages/products/AdminProducts";

const router = createBrowserRouter([
  {
    path: "/",
    element: <PublicLayout />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <UserHome />, //home page of ecom
      },
    ],
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <LoginPage />,
      },
    ],
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <AdminHome />,
      },
      {
        path: "products",
        element: <AdminProducts />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
