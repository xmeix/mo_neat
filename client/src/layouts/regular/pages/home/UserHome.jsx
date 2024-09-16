import { useSelector } from "react-redux";
import "./UserHome.scss";
const UserHome = () => {
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  console.log(user);
  return (
    <div className="user-home">
      {isLoggedIn ? (
        <div>
          <h1>{user.name}</h1>
        </div>
      ) : (
        "a regular user"
      )}
    </div>
  );
};

export default UserHome;
