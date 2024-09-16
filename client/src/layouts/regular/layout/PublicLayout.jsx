import { Outlet, useNavigate } from "react-router-dom";
import "./PublicLayout.scss";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../store/apiCalls/auth";
import { useEffect } from "react";
import { getAllProducts } from "../../../store/apiCalls/product";
const PublicLayout = () => {
  const { isLoggedIn } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = () => {
    dispatch(logout());
    navigate("/auth");
  };

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(getAllProducts());
    }
  }, [dispatch, isLoggedIn]);

  return (
    <div className="user-layout">
      user header
      <Outlet />
      <br />
      {isLoggedIn && <button onClick={handleLogout}>Logout</button>}
      <br />
      user footer
    </div>
  );
};

export default PublicLayout;
