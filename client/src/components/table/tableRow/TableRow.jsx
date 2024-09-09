import { useState } from "react";
import "./../Table.scss";
@import "./../../../index.scss";
import { MoreVert } from "@mui/icons-material";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import HighlightOffRoundedIcon from "@mui/icons-material/HighlightOffRounded";
import ActionMenu from "../actionMenu/ActionMenu";

const TableRow = ({ row, actions, columns }) => {
  const [showActions, setShowActions] = useState(false);

  const rowData = columns.map((column) => {
    return row[column.accessor] || "";
  });

  const isRoleColumn = (element) => {
    if (element === "ADMIN") return <div className="admin-div">admin</div>;
    else if (element === "REGULAR")
      return <div className="regular-div">regular</div>;
    else if (element === "POSTER")
      return <div className="poster-div">poster</div>;
    else return element;
  };

  return (
    <tr>
      {rowData.map((e, i) => (
        <td key={i}>
          {" "}
          {e === false ? (
            <HighlightOffRoundedIcon className="table-icon" />
          ) : e === true || e === "" ? (
            <CheckCircleOutlineRoundedIcon className="table-icon" />
          ) : (
            isRoleColumn(e)
          )}
        </td>
      ))}
      {actions && (
        <td>
          <ActionMenu
            actions={actions}
            setShowActions={setShowActions}
            showActions={showActions}
            row={row}
          />
        </td>
      )}
    </tr>
  );
};

export default TableRow;
