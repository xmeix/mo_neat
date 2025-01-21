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
import AdminCoupons from "./layouts/admin/pages/coupons/AdminCoupons";
import AdminWilayas from "./layouts/admin/pages/geo/wilaya/AdminWilayas";
import AdminStopDesks from "./layouts/admin/pages/geo/stopDesks/AdminStopDesks";
import AdminCommunes from "./layouts/admin/pages/geo/communes/AdminCommunes";
import ImportExport from "./layouts/admin/pages/delivery/export-import/ImportExport";
import DeliveryServices from "./layouts/admin/pages/delivery/services/DeliveryServices";
import ShippingZones from "./layouts/admin/pages/delivery/szones/ShippingZones";

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
      {
        path: "coupons",
        element: <AdminCoupons />,
      },
      {
        path: "geo/services",
        element: <DeliveryServices />,
      },
      {
        path: "geo/szones",
        element: <ShippingZones />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
