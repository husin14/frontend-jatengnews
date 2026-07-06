import React from "react";

interface PaginationProps {
  currentPage: number;
  lastPage: number;
  getPageUrl: (page: number) => string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  lastPage,
  getPageUrl,
}) => {
  if (lastPage <= 1) return null;

  const getPageRange = () => {
    const pages: (number | string)[] = [];
    const adjacents = 2;

    if (lastPage <= 10) {
      for (let counter = 1; counter <= lastPage; counter++) {
        pages.push(counter);
      }
    } else {
      if (currentPage <= 5) {
        for (let counter = 1; counter < 9; counter++) {
          pages.push(counter);
        }
        pages.push("...");
      } else if (currentPage > 5 && currentPage < lastPage - 4) {
        pages.push("...");
        for (
          let counter = currentPage - adjacents;
          counter <= currentPage + adjacents;
          counter++
        ) {
          pages.push(counter);
        }
        pages.push("...");
      } else {
        pages.push("...");
        for (
          let counter = lastPage - 6;
          counter <= lastPage;
          counter++
        ) {
          pages.push(counter);
        }
      }
    }
    return pages;
  };

  const displayedPages = getPageRange();
  const firstpage_class = currentPage > 1 ? "" : "disabled";
  const previouspage_class = currentPage <= 1 ? "disabled" : "";
  const nextpage_class = currentPage >= lastPage ? "disabled" : "";
  const lastpage_class = currentPage < lastPage ? "" : "disabled";

  const previous_page = Math.max(1, currentPage - 1);
  const next_page = Math.min(lastPage, currentPage + 1);

  return (
    <div className="row col-md-12 mt-5">
      <div className="text-center">
        <ul className="pagination pagination-rounded flex-wrap justify-center">
          <li className={`page-item ${firstpage_class}`}>
            <a className="page-link" href={getPageUrl(1)} aria-label="First">
              <span aria-hidden="true">&laquo;</span>
            </a>
          </li>

          <li className={`page-item ${previouspage_class}`}>
            <a className="page-link" href={getPageUrl(previous_page)} aria-label="Previous">
              <span aria-hidden="true">&lsaquo;</span>
            </a>
          </li>

          {displayedPages.map((pageNumber, index) => (
            <li
              key={index}
              className={`page-item ${
                pageNumber === currentPage ? "active" : ""
              } ${typeof pageNumber === "string" ? "disabled" : ""}`}
            >
              {typeof pageNumber === "number" ? (
                <a href={getPageUrl(pageNumber)} className="page-link">
                  {pageNumber}
                </a>
              ) : (
                <span className="page-link">{pageNumber}</span>
              )}
            </li>
          ))}

          <li className={`page-item ${nextpage_class}`}>
            <a className="page-link" href={getPageUrl(next_page)} aria-label="Next">
              <span aria-hidden="true">&rsaquo;</span>
            </a>
          </li>

          <li className={`page-item ${lastpage_class}`}>
            <a className="page-link" href={getPageUrl(lastPage)} aria-label="Last">
              <span aria-hidden="true">&raquo;</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Pagination;
