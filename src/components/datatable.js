import CustomDropDown from "./drop-down";
import "../styles/index.css";

export default function DataTable({
  columns,
  rows,
  onChangeNext,
  onChangePrevious,
  search,
  onSearch,
  showSearch = true,
  showPagination = true,
  checked,
  onChangeCheckBox,
  pagination,
  pageNumbers,
  onPaginate,
}) {
  console.log("pagination", pagination);
  return (
    <>
      {showSearch && (
        <div className="d-flex mb-4">
          <input
            type="search"
            className="form-control w-30"
            value={search}
            onChange={(e) => onSearch?.(e.target.value)}
            placeholder="Search..."
          />
          <CustomDropDown
            checked={checked}
            onChangeCheckBox={onChangeCheckBox}
          />
        </div>
      )}
      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={index}>{column.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((column, index) => {
                // if (scoped[column]) {
                //   return (
                //     <td key={index}>
                //       {scoped[column](row, rowIndex, column)}
                //     </td>
                //   );
                // }
                return <td key={index}>{column.selector(row, rowIndex)}</td>;
              })}
            </tr>
          ))}
        </tbody>
      </table>
      {showPagination && (
        <div className="mt-4 d-flex justify-content-end">
          <button
            className="mx-1 btn btn-outline-primary"
            onClick={() => {
              onChangePrevious?.(pagination.previous);
            }}
            disabled={pagination.previous === null}
          >
            Previous
          </button>
          {pageNumbers.map((pageNo) => (
            <button
              className={`px-1 btn rounded-circle round-button mx-1 ${pagination.page === pageNo ? "btn-primary" : " btn-outline-primary"}`}
              key={pageNo}
              onClick={() => onPaginate(pageNo)}
            >
              <p>
                {pageNo}
              </p>
            </button>
          ))}
          <div>
          </div>
          <button
            className="mx-1 btn btn-outline-primary"
            onClick={() => {
              onChangeNext?.(pagination.next);
            }}
            disabled={pagination.next === null}
          >
            Next
          </button>
        </div>
      )}
    </>
  );
}
