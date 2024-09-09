import "./ActionMenu.scss";
import { MoreVert } from "@mui/icons-material";

const ActionMenu = ({ setShowActions, showActions, actions, row }) => {
  return (
    <div className="action-menu">
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
    </div>
  );
};

export default ActionMenu;
