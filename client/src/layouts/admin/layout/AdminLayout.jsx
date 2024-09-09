import { Navigate, Outlet } from "react-router-dom";
import "./AdminLayout.scss";
import { useDispatch, useSelector } from "react-redux";
import AdminSideNav from "../adminNav/AdminSideNav";
import { useEffect } from "react";
import { getAllUsers } from "../../../store/apiCalls/user";
const AdminLayout = () => {
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isLoggedIn && user?.role === "ADMIN") {
      dispatch(getAllUsers());
    }
  }, [isLoggedIn, user?.role, dispatch]);

  if (!isLoggedIn || user?.role !== "ADMIN") {
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
