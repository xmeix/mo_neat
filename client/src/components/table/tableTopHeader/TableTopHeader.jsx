import useWindowWidth from "../../../utils/hooks/useWindowWidth";
import "./TableTopHeader.scss";
import AddIcon from "@mui/icons-material/Add";

const TableTopHeader = ({ data, unit, title, onCreate }) => {
  const windowWidth = useWindowWidth();

  return (
    <div className="table-top-header">
      <div className="table-title">{title} </div>
      <div className="table-item-num">
        {data.length} {unit}
      </div>
      {windowWidth >= 768 ? (
        <button className="create-btn" onClick={onCreate}>
          Create {unit.slice(0, -1)}
        </button>
      ) : (
        <button className="create-btn-sm" onClick={onCreate}>
          <AddIcon className="action-btn" />
        </button>
      )}
    </div>
  );
};

export default TableTopHeader;
