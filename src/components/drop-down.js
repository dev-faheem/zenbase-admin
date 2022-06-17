import { useState } from "react";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Label,
  Input
} from "reactstrap";
import { subscribeCheckBoxArr } from "../mockData";

export default function CustomDropDown({ onChangeCheckBox, checked }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropDown = () => {
    setIsDropdownOpen((prevState) => !prevState.isDropdownOpen);
  };

  return (
    <Dropdown
      style={{ marginLeft: 20 }}
      isOpen={isDropdownOpen}
      toggle={toggleDropDown}
      onMouseEnter={() => setIsDropdownOpen(true)}
      onMouseLeave={() => setIsDropdownOpen(false)}
    >
      <DropdownToggle caret>
        <em className="icon ni ni-filter"></em>
      </DropdownToggle>
      <DropdownMenu>
        {subscribeCheckBoxArr.map((item, index) => (
          <DropdownItem className="dropdown-item">
            <Label check style={{ marginLeft: 20 }}>
              <Input
                name={item.value}
                value={item.value}
                checked={checked[index]}
                onChange={() => onChangeCheckBox(index)}
                type="checkbox"
              />{" "}
              {item.name}
            </Label>
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}
