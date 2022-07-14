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
  onPaginate,
}) {
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
      <table className="table table-striped table-bordered table-responsive">
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={index}>{column.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows?.map((row, rowIndex) => (
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
          <div className="pt-1 pr-1">
            {1 + (pagination.page -1) * pagination.limit} - {pagination.page * pagination.limit} of {pagination.count}
          </div>
          <button
            className="mx-1 btn btn-outline-primary"
            onClick={() => {
              onChangePrevious?.(pagination?.previous);
            }}
            disabled={pagination?.previous === null}
          >
            Previous
          </button>
          <div>
          </div>
          <button
            className="mx-1 btn btn-outline-primary"
            onClick={() => {
              onChangeNext?.(pagination?.next);
            }}
            disabled={pagination?.next === null}
          >
            Next
          </button>
        </div>
      )}
    </>
  );
}
