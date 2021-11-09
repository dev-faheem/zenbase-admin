import data from "../data/sidebar";
import cx from "classnames";
import { useState } from "react";
import { useHistory } from "react-router";
import useUser from "../services/useUser";

function Heading({ title, admin }) {
  const { user } = useUser();
  if (admin && user.role !== "admin") return null;

  return (
    <li className="nk-menu-heading">
      <h6 className="overline-title text-primary-alt">{title}</h6>
    </li>
  );
}

function SidebarItem({ title, icon, to, children, badge, admin }) {
  const { user } = useUser();
  const [open, setOpen] = useState(false);
  const history = useHistory();

  if (admin && user.role !== "admin") return null;

  return (
    <li
      className={cx("nk-menu-item", { "has-sub": children != null })}
      onClick={(e) => setOpen(!open)}
    >
      <a
        href={to}
        onClick={(e) => {
          e.preventDefault();
          history.push(to);
        }}
        className={cx("nk-menu-link", { "nk-menu-toggle": children != null })}
      >
        {icon ? (
          <span className="nk-menu-icon">
            <em className={cx("icon", "ni", "ni-" + icon)}></em>
          </span>
        ) : null}
        <span className="nk-menu-text">{title}</span>
      </a>
      {children != null ? (
        <ul
          className="nk-menu-sub"
          style={{
            display: children == null ? "block" : open ? "block" : "none",
          }}
        >
          {children.map(mapSidebarItem)}
        </ul>
      ) : null}
    </li>
  );
}

function mapSidebarItem(item, index) {
  if (item.heading) {
    return <Heading key={index} {...item} />;
  }
  return <SidebarItem key={index} {...item} />;
}

export default function Sidebar({ setSidebar, sidebar }) {
  return (
    <div
      className={cx("nk-sidebar nk-sidebar-fixed", {
        "nk-sidebar-active": sidebar,
      })}
      data-content="sidebarMenu"
    >
      <div className="nk-sidebar-element nk-sidebar-head">
        <div className="nk-menu-trigger">
          <a
            href="#/"
            className="nk-nav-toggle nk-quick-nav-icon d-xl-none"
            data-target="sidebarMenu"
            onClick={() => setSidebar(false)}
          >
            <em className="icon ni ni-arrow-left"></em>
          </a>
        </div>
        <div className="nk-sidebar-brand">
          <a href="/dashboard" className="logo-link nk-sidebar-logo d-flex">
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
            <h4 className="ml-3">Zenbase</h4>
          </a>
        </div>
      </div>

      <div className="nk-sidebar-element nk-sidebar-body">
        <div className="nk-sidebar-content">
          <div className="nk-sidebar-menu" data-simplebar>
            <ul className="nk-menu">{data.map(mapSidebarItem)}</ul>
          </div>
        </div>
      </div>
    </div>
  );
}
