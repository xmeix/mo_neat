import "./../Table.scss";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded";

const Pagination = ({ currentPage, totalPages, paginate }) => {
  const pageNumbers = [];
  const maxPageNumbersToShow = 2;
  let startPage = Math.max(
    currentPage - Math.floor(maxPageNumbersToShow / 2),
    1
  );
  let endPage = Math.min(startPage + maxPageNumbersToShow - 1, totalPages);

  // Adjust startPage if endPage is at the end
  if (endPage === totalPages) {
    startPage = Math.max(totalPages - maxPageNumbersToShow + 1, 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="pagination">
      <button
        onClick={() => paginate(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ArrowBackIosRoundedIcon className="pag-btn-icon" />
      </button>
      {startPage > 1 && (
        <>
          <button
            key={1}
            onClick={() => paginate(1)}
            className={currentPage === 1 ? "pag-num active" : "pag-num"}
          >
            1
          </button>
          {startPage > 2 && <span className="pag-ellipsis">...</span>}
        </>
      )}
      {pageNumbers.map((number) => (
        <button
          key={number}
          onClick={() => paginate(number)}
          className={currentPage === number ? "pag-num active" : "pag-num"}
        >
          {number}
        </button>
      ))}
      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && (
            <span className="pag-ellipsis">...</span>
          )}
          <button
            key={totalPages}
            onClick={() => paginate(totalPages)}
            className={
              currentPage === totalPages ? "pag-num active" : "pag-num"
            }
          >
            {totalPages}
          </button>
        </>
      )}
      <button
        onClick={() => paginate(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <ArrowForwardIosRoundedIcon className="pag-btn-icon" />
      </button>
    </div>
  );
};

export default Pagination;
