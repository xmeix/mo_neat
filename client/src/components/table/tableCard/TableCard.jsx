import "./TableCard.scss";
import { useState } from "react";
import ActionMenu from "../actionMenu/ActionMenu";
import {
  API_BASE_URL,
  MEDIA_BASE_URL,
} from "../../../store/apiCalls/apiService";

const TableCard = ({
  row,
  actions,
  headers,
  banned,
  footer,
  columns,
  special = [],
}) => {
  const [showActions, setShowActions] = useState(false);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Intl.DateTimeFormat("en-US", options).format(
      new Date(dateString)
    );
  };

  const getLabel = (key) => {
    return columns.find((col) => col.accessor === key)?.header;
  };

  const formatValue = (key, value) => {
    if (key === "colors") {
      return value.map((color) => (
        <span
          key={color}
          className="color-swatch"
          style={{ backgroundColor: color }}
          title={color}
        ></span>
      ));
    } else if (key === "sizes" || key === "categories") {
      return value.join(", ");
    }
    return value === true ? "YES" : value === false ? "NO" : value;
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
          <img
            src={MEDIA_BASE_URL + row["images"][0]}
            alt=""
            className="card-image"
          />
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
            special.includes(key) &&
            value !== null ? (
              <div className="card-field" key={index}>
                <span className="field-label">{getLabel(key)}:</span>
                <span className="field-value">{formatValue(key, value)}</span>
              </div>
            ) : null
          )}
        </div>
      </div>
      <div className="card-content card-content-hz">
        {Object.entries(row).map(([key, value], index) =>
          !headers.includes(key) &&
          !banned.includes(key) &&
          !footer.includes(key) &&
          !special.includes(key) &&
          value !== null ? (
            <div className="card-field" key={index}>
              <span className="field-label">{getLabel(key)}:</span>
              <span className="field-value">{formatValue(key, value)}</span>
            </div>
          ) : null
        )}
      </div>
      <div className="card-footer">
        {Object.entries(row).map(([key, value], index) =>
          footer.includes(key) ? (
            <div className="card-field" key={index}>
              <span className="field-label">{getLabel(key)}:</span>
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
