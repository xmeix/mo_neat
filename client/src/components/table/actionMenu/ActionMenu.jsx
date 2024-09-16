import "./ActionMenu.scss";
import { MoreVert } from "@mui/icons-material";

const ActionMenu = ({
  setShowActions,
  showActions = false,
  actions,
  row,
  type = "default",
}) => {
  return (
    <div className="action-menu">
      {type !== "buttons" && (
        <>
          <MoreVert
            className="action-icon table-icon"
            onClick={() => setShowActions(!showActions)}
          />

          {showActions && (
            <div className="action-dropdown">
              {actions.map((action, index) => (
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
            </div>
          )}
        </>
      )}
      {type === "buttons" && (
        <div className="action-btns-header">
          {actions.map((action, index) => (
            <button
              key={index}
              className="action-btn"
              onClick={() => {
                action.onClick(row);
                setShowActions(false);
              }}
            >
              <action.icon
                className="action-btn-icon"
                style={{ color: action.iconColor }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActionMenu;
