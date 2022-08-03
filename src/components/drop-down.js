import { useState } from "react";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Label,
  Input
} from "reactstrap";
import { subscribeCheckBoxArr, userActions, songActions } from "../mockData";

export default function CustomDropDown({ onChangeCheckBox, checked, using, onClickUserAction, onClickSongsAction }) {
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
      {using === 'filter' ?
        <>
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
                    checked={checked?.[index]}
                    onChange={() => onChangeCheckBox(index)}
                    type="checkbox"
                  />
                  {item.name}
                </Label>
              </DropdownItem>
            ))}
          </DropdownMenu>
        </> : ''
      }

      {using === 'users' ?
        <>
          <DropdownToggle caret>
            <div>Actions</div>
          </DropdownToggle>
          <DropdownMenu>
            {userActions.map((item, index) => (
              <DropdownItem className="dropdown-item">
                <Label onClick={() => onClickUserAction(index)} check style={{ marginLeft: 20 }}>
                  {item.name}
                </Label>
              </DropdownItem>
            ))}
          </DropdownMenu>
        </> : ''}


      {using === 'songs' ?
        <>
          <DropdownToggle caret>
            <div>Actions</div>
          </DropdownToggle>
          <DropdownMenu>
            {songActions.map((item, index) => (
              <DropdownItem className="dropdown-item">
                <Label onClick={() => onClickSongsAction(index)} check style={{ marginLeft: 20 }}>
                  {item.name}
                </Label>
              </DropdownItem>
            ))}
          </DropdownMenu>
        </> : ''}



    </Dropdown>
  );
}
