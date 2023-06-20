import React, { useRef } from "react";
import CustomDropDown from "./drop-down";
import "../styles/index.css";
import { Button } from "reactstrap";

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
  sortingVar,
  sortingFunction,
  downloadAll,
  isDeleteAll,
  deleteSelectedSongs,
  deleteSelectedUsers,
  isDeleteAllUser,
  isDraggable = false,
  updateRow = () => {},
}) {
  const dragItem = useRef();
  const dragOverItem = useRef();
  const dragStart = (e, position) => {
    dragItem.current = position;
  };
  const dragEnter = (e, position) => {
    dragOverItem.current = position;
  };
  const drop = (e) => {
    const copyListItems = [...rows];
    const dragItemContent = copyListItems[dragItem.current];
    copyListItems.splice(dragItem.current, 1);
    copyListItems.splice(dragOverItem.current, 0, dragItemContent);
    dragItem.current = null;
    dragOverItem.current = null;
    updateRow(copyListItems);
  };
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
            using={"filter"}
            onChangeCheckBox={onChangeCheckBox}
          />
          <Button className="ml-3" onClick={downloadAll}>
            Download All
          </Button>
          {isDeleteAll && (
            <Button className="ml-3" onClick={deleteSelectedSongs}>
              Delete All
            </Button>
          )}
          {isDeleteAllUser && (
            <Button className="ml-3" onClick={deleteSelectedUsers}>
              Delete All
            </Button>
          )}
        </div>
      )}
      <table className="table table-striped table-bordered table-responsive">
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                className={
                  column.sortable
                    ? "d-flex pt-4 pr-4"
                    : column.checkBox
                    ? "pb-1 pl-5"
                    : ""
                }
              >
                {column.name}
                {column.sortable === true ? (
                  <img
                    src={
                      sortingVar
                        ? "/images/icons/arrow-up.svg"
                        : "/images/icons/arrow-down.svg"
                    }
                    alt=""
                    className="ml-1"
                    height={"17px"}
                    width={"20px"}
                    onClick={() => sortingFunction()}
                  />
                ) : (
                  ""
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows?.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              {...(isDraggable && {
                style: { cursor: "grab" },
                onDragStart: (e) => dragStart(e, rowIndex),
                onDragEnter: (e) => dragEnter(e, rowIndex),
                onDragEnd: drop,
                draggable: true,
              })}
            >
              {columns.map((column, index) => {
                return (
                  <td key={index} className={column.checkBox ? "pl-5" : ""}>
                    {column.selector(row, rowIndex)}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      {showPagination && (
        <div className="mt-4 d-flex justify-content-end">
          <div className="pt-1 pr-1">
            {1 + (pagination?.page - 1) * pagination?.limit} -{" "}
            {pagination?.page * pagination?.limit < pagination.count
              ? pagination?.page * pagination?.limit
              : pagination?.count}{" "}
            of {pagination?.count}
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
          <div></div>
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
