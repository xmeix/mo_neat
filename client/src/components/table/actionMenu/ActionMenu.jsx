import { useEffect, useRef } from "react";
import "./ActionMenu.scss";
import {
  MoreVert,
  ToggleOffRounded,
  ToggleOnRounded,
} from "@mui/icons-material";

const ActionMenu = ({
  setShowActions,
  showActions = false,
  actions,
  row,
  type = "default",
}) => {
  const actionRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (actionRef.current && !actionRef.current.contains(event.target)) {
        setShowActions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setShowActions]);

  return (
    <div className="action-menu" ref={actionRef}>
      {type !== "buttons" && (
        <>
          <MoreVert
            className="action-icon table-icon"
            onClick={() => setShowActions(!showActions)}
          />

          {showActions && (
            <div className="action-dropdown">
              {actions.normal.map((action, index) => (
                <button
                  key={index}
                  className="action-btn"
                  onClick={() => {
                    action.onClick(row);
                    setShowActions(false);
                  }}
                >
                  {action.label}
                </button>
              ))}
              {row["enabled"] ? (
                <button
                  className="action-btn"
                  onClick={() => {
                    actions.toggle[0].onClick(row);
                    setShowActions(false);
                  }}
                >
                  {actions.toggle[0].label}
                </button>
              ) : (
                <button
                  className="action-btn"
                  onClick={() => {
                    actions.toggle[1].onClick(row);
                    setShowActions(false);
                  }}
                >
                  {actions.toggle[1].label}
                </button>
              )}
            </div>
          )}
        </>
      )}
      {type === "buttons" && (
        <div className="action-btns-header">
          {actions.normal.map((action, index) => (
            <button
              key={index}
              className="action-btn"
              onClick={() => {
                action.onClick(row);
                setShowActions(false);
              }}
            >
              <action.icon
                style={{
                  color: action.iconColor,
                  fontSize: action.iconSize,
                }}
              />
            </button>
          ))}
          {row["enabled"] ? (
            <button
              className="action-btn"
              onClick={() => {
                actions.toggle[0].onClick(row);
                setShowActions(false);
              }}
            >
              <ToggleOnRounded
                style={{
                  color: actions.toggle[0].iconColor,
                  fontSize: actions.toggle[0].iconSize,
                }}
              />
            </button>
          ) : (
            <button
              className="action-btn"
              onClick={() => {
                actions.toggle[1].onClick(row);
                setShowActions(false);
              }}
            >
              <ToggleOffRounded
                style={{
                  color: actions.toggle[1].iconColor,
                  fontSize: actions.toggle[1].iconSize,
                }}
              />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ActionMenu;
