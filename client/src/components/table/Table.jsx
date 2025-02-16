import { useState } from "react";
import "./Table.scss";
import TableRow from "./tableRow/TableRow";
import Pagination from "./pagination/Pagination";
import NoData from "../nodata/NoData";
import TableCard from "./tableCard/TableCard";
import useWindowWidth from "../../utils/hooks/useWindowWidth";
import TableTopHeader from "./tableTopHeader/TableTopHeader";

const Table = ({
  columns,
  data,
  actions,
  rowsPerPage = 5,
  title,
  unit,
  cardSections,
  banned,
  onCreate,
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;

  const currentRows = data.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(data.length / rowsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const windowWidth = useWindowWidth();
  const neededColumns = (type) =>
    columns.filter((e) => !banned[type].includes(e.accessor));

  if (data.length === 0) {
    return (
      <div className="table-container">
        <TableTopHeader
          data={data}
          onCreate={onCreate}
          title={title}
          unit={unit}
        />
        <NoData text="No data available to show" />
      </div>
    );
  } else
    return (
      <>
        <div className="table-container">
          <TableTopHeader
            data={data}
            onCreate={onCreate}
            title={title}
            unit={unit}
          />

          {windowWidth < 768 && (
            <div className="cards-container">
              {currentRows.map((row) => (
                <TableCard
                  key={row.id}
                  row={row}
                  actions={actions}
                  content={{
                    headers: cardSections.headers,
                    main: cardSections.content,
                    enum: cardSections.enum,
                    special: cardSections.special,
                    footer: cardSections.footer,
                  }}
                  columns={neededColumns(0)}
                />
              ))}
            </div>
          )}
          {windowWidth >= 768 && (
            <table className="custom-table">
              <thead>
                <tr>
                  {neededColumns(1).map((column, index) => (
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
                    columns={neededColumns(1)}
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
