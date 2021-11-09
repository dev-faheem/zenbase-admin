import { useState, useEffect } from "react";
import { role as beautifulRole } from "../services/beautiful";
import useTemplate from "../services/useTemplate";
import useUser from "../services/useUser";
import cx from "classnames";

export default function Navbar({ setSidebar, sidebar }) {
  const { user } = useUser();
  const { setDarkMode: setDarkModeClass } = useTemplate();

  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    setDarkModeClass(darkMode);
  }, [darkMode, setDarkModeClass]);

  return (
    <div className="nk-header nk-header-fixed is-light">
      <div className="container-fluid">
        <div className="nk-header-wrap">
          <div className="nk-menu-trigger d-xl-none ml-n1">
            <a
              href="#/"
              className="nk-nav-toggle nk-quick-nav-icon"
              data-target="sidebarMenu"
              onClick={(e) => {
                e.preventDefault();

                setSidebar(true);
              }}
            >
              <em className="icon ni ni-menu"></em>
            </a>
          </div>
          <div className="nk-header-brand d-xl-none">
            <a href="/" className="logo-link">
              <img
                className="logo-light logo-img"
                src="/images/zenbase.png"
                alt="logo"
              />
              <img
                className="logo-dark logo-img"
                src="/images/zenbase.png"
                alt="logo-dark"
              />
            </a>
          </div>

          <div className="nk-header-tools">
            <ul className="nk-quick-nav">
              {/* <li className="hide-mb-xs">
                <div
                  className={cx("click nk-quick-nav-icon", {
                    active: darkMode,
                  })}
                  onClick={() => {
                    setDarkMode(!darkMode);
                  }}
                >
                  <div className="icon-status icon-status-na">
                    <em
                      className={cx(
                        "icon ni",
                        { "ni-sun": darkMode },
                        { "ni-sun-fill": !darkMode }
                      )}
                    ></em>
                  </div>
                </div>
              </li> */}
              <li>
                <a href="/password">
                  <div className="user-toggle">
                    <div className="user-avatar sm">
                      <em className="icon ni ni-user-alt"></em>
                    </div>
                    <div className="user-info d-none d-md-block">
                      <div className="user-status">
                        {beautifulRole(user.role) || "Guest"}
                      </div>
                      <div className="user-name">
                        {user.name || "Unknown User"}
                      </div>
                    </div>
                  </div>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
