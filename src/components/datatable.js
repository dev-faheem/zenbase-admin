import { useState } from "react";

export default function DataTable({ columns, rows, scoped = {}, count = 10 }) {
  const [current, setCurrent] = useState(0);
  const [query, setQuery] = useState("");
  return (
    <>
      <div className="d-flex mb-4">
        <input
          type="search"
          className="form-control w-30"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search..."
        />
      </div>
      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={index}>
                {column.charAt(0).toUpperCase() + column.slice(1)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows
            .filter((row) => {
              if (query !== "") {
                return Object.values(row).some((column) => {
                  return column
                    .toString()
                    .toLowerCase()
                    .includes(query.toLowerCase());
                });
              }
              return true;
            })
            .slice(current * count, current * count + count)
            .map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((column, index) => {
                  if (scoped[column]) {
                    return (
                      <td key={index}>
                        {scoped[column](row, rowIndex, column)}
                      </td>
                    );
                  }
                  return <td key={index}>{row[column]}</td>;
                })}
              </tr>
            ))}
        </tbody>
      </table>
      <div className="mt-4 d-flex justify-content-between">
        <button
          className="btn btn-outline-primary"
          onClick={() => setCurrent(current - 1)}
          disabled={current <= 0}
        >
          Previous
        </button>
        <button
          className="btn btn-outline-primary"
          onClick={() => setCurrent(current + 1)}
          disabled={current >= Math.floor(rows.length / count) - 1}
        >
          Next
        </button>
      </div>
    </>
  );
}
