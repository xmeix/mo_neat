import { useDispatch, useSelector } from "react-redux";
import "./NotFound.scss";
import { Link } from "react-router-dom";
import { logout } from "../../../store/apiCalls/auth";
const NotFound = () => {
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state) => state.auth);
  return (
    <div className="not-found">
      <div className="not-found-text">404 Not Found</div>
      <Link className="not-found-btn" to="/">
        go to home
      </Link>
      <br />
      {isLoggedIn && <button onClick={() => dispatch(logout())}>Logout</button>}
      {!isLoggedIn && (
        <Link className="not-found-btn" to="/auth/">
          login
        </Link>
      )}
    </div>
  );
};

export default NotFound;
