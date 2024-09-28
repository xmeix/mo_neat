import { useEffect, useRef, useState } from "react";
import "./AdminNav.scss";
import ExpandLessRoundedIcon from "@mui/icons-material/ExpandLessRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../../store/apiCalls/auth";
import { navItems } from "../../../../assets/data/navItems";
 

const AdminSideNav = () => {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [isNavExpanded, setIsNavExpanded] = useState(true);
  const { user } = useSelector((state) => state.auth);
  const navRef = useRef(null);
  const dispatch = useDispatch();
  const handleToggle = (index) => {
    setExpandedIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const handleOpenMenu = (event) => {
    setIsNavExpanded((prev) => !prev);
  };

  const handleClickOutside = (event) => {
    if (navRef.current && !navRef.current.contains(event.target)) {
      setIsNavExpanded(false);
    } 
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={navRef}>
      <nav className="admin-nav">
        <div className="nav-pan">
          <MenuRoundedIcon className="nav-icon" onClick={handleOpenMenu} />
          <div className="admin-logo">Evento.</div>{" "}
          <button onClick={() => dispatch(logout())}>Logout</button>
        </div>

        <div className="nav-user">
          <div className="nav-user-name">{user.name.charAt(0)}</div>
        </div>
      </nav>
      <nav
        className={`admin-side-nav ${isNavExpanded ? "expanded" : "collapsed"}`}
      >
        <ul className="admin-side-nav-list">
          {navItems.map((item, index) => (
            <li key={index}>
              <div className="nav-item" onClick={() => handleToggle(index)}>
                <div className="nav-item-one">
                  {<item.icon className="btn-icon" />}
                  <div className="nav-item-text">{item.title}</div>
                </div>
                {expandedIndex === index ? (
                  <ExpandLessRoundedIcon className="btn-icon" />
                ) : (
                  <ExpandMoreRoundedIcon className="btn-icon" />
                )}
              </div>
              {expandedIndex === index && (
                <ul className="sub-nav">
                  {item.children.map((subItem, subIndex) => (
                    <Link to={subItem.path} key={subIndex}>
                      <li className="sub-nav-item">
                        {<subItem.icon className="btn-icon" />}
                        <div className="sub-nav-item-text">{subItem.title}</div>
                      </li>
                    </Link>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default AdminSideNav;
