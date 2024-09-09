import { useEffect, useState } from "react";
import "./Table.scss";
import TableRow from "./tableRow/TableRow";
import Pagination from "./pagination/Pagination";
import useWindowWidth from "../../hooks/useWindowWidth";
import NoData from "../nodata/NoData";
import TableCard from "./tableCard/TableCard";

const Table = ({
  columns,
  data,
  actions,
  rowsPerPage = 5,
  title,
  unit,
  cardHeaders,
  banned,
  footer,
  onCreate,
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = data.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(data.length / rowsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const windowWidth = useWindowWidth();
  if (data.length === 0) {
    return (
      <div className="table-container">
        <div className="table-title">{title}</div>
        <NoData text="No data available to show" />;
      </div>
    );
  } else
    return (
      <>
        <div className="table-container">
          <div className="table-top-header">
            <div className="table-title">{title} </div>
            <div className="table-item-num">
              {data.length} {unit}
            </div>
            <button className="create-btn" onClick={onCreate}>
              Create {unit.slice(0, -1)}
            </button>
          </div>

          {windowWidth < 768 && (
            <div className="cards-container">
              {currentRows.map((row) => (
                <TableCard
                  key={row.id}
                  row={row}
                  actions={actions}
                  headers={cardHeaders}
                  banned={banned}
                  footer={footer}
                />
              ))}
            </div>
          )}
          {windowWidth >= 768 && (
            <table className="custom-table">
              <thead>
                <tr>
                  {columns.map((column, index) => (
                    <th key={index}>{column.header}</th>
                  ))}
                  {actions && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {currentRows.map((row) => (
                  <TableRow
                    key={row.id}
                    row={row}
                    actions={actions}
                    columns={columns}
                  />
                ))}
              </tbody>
            </table>
          )}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            paginate={paginate}
          />
        </div>
      </>
    );
};

export default Table;
