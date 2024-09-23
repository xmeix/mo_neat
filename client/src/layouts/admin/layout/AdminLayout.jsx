import { Navigate, Outlet } from "react-router-dom";
import "./AdminLayout.scss";
import { useSelector } from "react-redux";
import AdminSideNav from "../components/adminNav/AdminSideNav";

const AdminLayout = () => {
  const { isLoggedIn, user } = useSelector((state) => state.auth);

  if (!isLoggedIn || !user?.isAdmin) {
    return <Navigate to="/auth" />;
  }
  return (
    <div className="admin-layout">
      <AdminSideNav />
      <div className="admin-outlet">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
