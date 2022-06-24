import { useState } from "react";
import CustomDropDown from "./drop-down";

export default function DataTable({
  columns,
  rows,
  page,
  onChangePage,
  previousPage,
  nextPage,
  search,
  onSearch,
  showSearch = true,
  showPagination = true,
  checked,
  onChangeCheckBox
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
        <div className="mt-4 d-flex justify-content-between">
          <button
            className="btn btn-outline-primary"
            onClick={() => {
              onChangePage?.(previousPage);
            }}
            disabled={previousPage == null || previousPage == page}
          >
            Previous
          </button>
          <button
            className="btn btn-outline-primary"
            onClick={() => {
              onChangePage?.(nextPage);
            }}
            disabled={nextPage == null || nextPage == page}
          >
            Next
          </button>
        </div>
      )}
    </>
  );
}
