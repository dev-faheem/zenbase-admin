import { useState } from "react";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Label,
  Input
} from "reactstrap";

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
  onChnageSubscribe,
  onChangeUnSubscribe,
  onChnageAll
}) {
  const [isDropdown, setIsDropdown] = useState(false);

  const toggleDropDown = () => {
    setIsDropdown((prevState) => !prevState.isDropdown);
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
          <Dropdown
            style={{ marginLeft: 20 }}
            isOpen={isDropdown}
            toggle={toggleDropDown}
          >
            <DropdownToggle caret>
              {" "}
              <em className="icon ni ni-filter"></em>
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem style={{ color: "white" }}>
                <Label check style={{ marginLeft: 20 }}>
                  <Input
                    // onClick={onClickSubscibe}
                    onChange={onChangeUnSubscribe}
                    type="checkbox"
                  />{" "}
                  Not subscribe user
                </Label>
              </DropdownItem>
              <DropdownItem style={{ color: "white" }}>
                <Label check style={{ marginLeft: 20 }}>
                  <Input onChange={onChnageSubscribe} type="checkbox" />
                  Subscribe user
                </Label>
              </DropdownItem>
              <DropdownItem style={{ color: "white" }}>
                <Label check style={{ marginLeft: 20 }}>
                  <Input onChange={onChnageAll} type="checkbox" />
                  All
                </Label>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
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
