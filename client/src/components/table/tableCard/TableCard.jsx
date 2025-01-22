import "./TableCard.scss";
import { useState } from "react";
import ActionMenu from "../actionMenu/ActionMenu";
import { MEDIA_BASE_URL } from "../../../store/apiCalls/apiService";
import { formatDate } from "../../../utils/functions";

const TableCard = ({ row, actions, content, columns }) => {
  const [showActions, setShowActions] = useState(false);

  const getLabel = (key) => {
    return columns.find((col) => col.accessor === key)?.header;
  };
  const render = (header) => {
    const keys = header.split(".");

    const getValue = (obj, keys) => {
      for (const key of keys) {
        if (!obj || obj[key] === undefined) return undefined;
        obj = obj[key];
      }
      return obj;
    };

    return columns.reduce((value, col) => {
      if (value) return value;

      const childKeys = col.children ? [col.accessor, ...keys.slice(1)] : keys;
      return (
        (col.accessor === keys[0] && getValue(row, childKeys)) || undefined
      );
    }, undefined);
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

      <div className="card-content">
        {row["images"] && (
          <div className="card-image-container">
            <img
              src={MEDIA_BASE_URL + row["images"][0]}
              alt=""
              className="card-image"
            />
          </div>
        )}
        <div className="card-header">
          {content.headers.map((header, index) => (
            <div
              key={index}
              className={
                index === 0 ? "card-header-primary" : "card-header-secondary"
              }
            >
              {render(header)}
            </div>
          ))}
        </div>
        <div className="card-content-container">
          <div className="card-main">
            {content.main.map((header, index) => (
              <div
                key={index}
                className={
                  index === 0 ? "card-header-primary" : "card-header-secondary"
                }
              >
                {header.includes("price") || header.includes("Fee") ? (
                  <div className="price-div">
                    {render(header)} <span className="currency">DA</span>{" "}
                  </div>
                ) : (
                  render(header)
                )}
              </div>
            ))}
          </div>
          <div className="card-special">
            {content.special.map((header, index) => (
              <div
                key={index}
                className={
                  render(header) === false ? "" : "card-special-primary false-bg"
                }
              >
                {render(header) === false
                  ? ""
                  : getLabel(header).concat(
                      header === "onSale" || header === "discountPercentage"
                        ? ` ${row["discountPercentage"]}%`
                        : ""
                    )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="card-footer">
        {Object.entries(row).map(([key, value], index) =>
          content.footer.includes(key) ? (
            <div className="card-footer-field" key={index}>
              <span className="card-footer-field-label">{getLabel(key)}:</span>
              <span className="card-footer-field-value">
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
