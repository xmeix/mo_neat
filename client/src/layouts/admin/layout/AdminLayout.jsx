import { Navigate, Outlet } from "react-router-dom";
import "./AdminLayout.scss";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import AdminSideNav from "../components/adminNav/AdminSideNav";
const AdminLayout = () => {
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isLoggedIn && user?.isAdmin) {
      // dispatch(getAllUsers());
    }
  }, [isLoggedIn, user?.isAdmin, dispatch]);

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
