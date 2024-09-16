import "./TableCard.scss";
import { useState } from "react";
import ActionMenu from "../actionMenu/ActionMenu";

const TableCard = ({ row, actions, headers, banned, footer, columns }) => {
  const [showActions, setShowActions] = useState(false);
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Intl.DateTimeFormat("en-US", options).format(
      new Date(dateString)
    );
  };

  const getLabel = (key) => {
    return columns.filter((col) => col.accessor === key)[0].header;
  };
  return (
    <div className="table-card">
      <ActionMenu
        className="tc-actions"
        actions={actions}
        setShowActions={setShowActions}
        showActions={showActions}
        row={row}
        type="buttons"
      />
      <div className="card-headers-container">
        <div className="card-important">
          <img src={row["img"][0]} alt="" className="card-image" />
        </div>
        <div className="card-headers">
          {headers.map((header, index) => (
            <div
              key={index}
              className={
                index === 0 ? "card-header-primary" : "card-header-secondary"
              }
            >
              {String(row[header])}
            </div>
          ))}
        </div>
        <div className="card-content">
          {Object.entries(row).map(([key, value], index) =>
            !headers.includes(key) &&
            !banned.includes(key) &&
            !footer.includes(key) &&
            value !== null ? (
              <div className="card-field" key={index}>
                <span className="field-label">{getLabel(key)}:</span>
                <span className="field-value">
                  {value === true ? "YES" : value === false ? "NO" : value}
                </span>
              </div>
            ) : null
          )}
        </div>{" "}
      </div>

      <div className="card-footer">
        {Object.entries(row).map(([key, value], index) =>
          footer.includes(key) ? (
            <div className="card-field" key={index}>
              <span className="field-label">
                {key == "createdAt" ? "created at" : "updated at"}:
              </span>
              <span className="field-value">
                {value instanceof Date || !isNaN(Date.parse(value))
                  ? formatDate(value)
                  : String(value)}
              </span>
            </div>
          ) : null
        )}
      </div>
    </div>
  );
};

export default TableCard;
