import { useState } from "react";
import "./../Table.scss";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import HighlightOffRoundedIcon from "@mui/icons-material/HighlightOffRounded";
import ActionMenu from "../actionMenu/ActionMenu";
import { formatDate, isISODate } from "../../../utils/functions";

const TableRow = ({ row, actions, columns }) => {
  const [showActions, setShowActions] = useState(false);

  const rowData = columns.map((column) => {
    return row[column.accessor];
  });

  return (
    <tr>
      {rowData.map((e, i) => (
        <td key={i}>
          {e === false ? (
            <HighlightOffRoundedIcon className="table-icon notexist" />
          ) : e === true ? (
            <CheckCircleOutlineRoundedIcon className="table-icon exists" />
          ) : e instanceof Date || (typeof e === "string" && isISODate(e)) ? (
            formatDate(e)
          ) : (
            e
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
