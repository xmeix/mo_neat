import "./AuthLayout.scss";
import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
const AuthLayout = () => {
  const { isLoggedIn } = useSelector((state) => state.auth);
  if (isLoggedIn) {
    return <Navigate to="/" />;
  } else
    return (
      <div className="auth-wrapper">
        <Outlet />
      </div>
    );
};

export default AuthLayout;
