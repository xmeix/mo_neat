import { useState } from "react";
import "./Drawer.scss";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

const useDrawer = () => {
  const [showDrawer, setShowDrawer] = useState(false);

  const Drawer = ({ title, children }) => {
    return (
      <>
        {showDrawer && (
          <div className="drawer">
            <div className="drawer-wrapper">
              <div className="drawer-header">
                <div className="drawer-title">{title}</div>
                <div className="close-btn" onClick={() => setShowDrawer(false)}>
                  <CloseRoundedIcon />
                </div>
              </div>

              <div className="drawer-content">{children}</div>
            </div>
          </div>
        )}
      </>
    );
  };

  return { Drawer, showDrawer, setShowDrawer };
};

export default useDrawer;
