import cx from "classnames";

export default function Footer({ auth = false, fluid = true }) {
  if (auth === true) fluid = false;
  return (
    <div className={cx("nk-footer", { "nk-auth-footer-full": auth })}>
      <div className={cx({ container: !fluid, "container-fluid": fluid })}>
        <div className="nk-footer-wrap">
          <div className="nk-footer-copyright">
            &copy; 2020 Zenbase. All rights reserved &copy;
          </div>
          <div className="nk-footer-links">
            <ul className="nav nav-sm">
              <li className="nav-item">
                <a
                  className="nav-link"
                  target="_blank"
                  rel="noreferrer"
                  href="http://zenbase.us"
                >
                  Terms
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link"
                  target="_blank"
                  rel="noreferrer"
                  href="http://zenbase.us"
                >
                  Privacy
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link"
                  target="_blank"
                  rel="noreferrer"
                  href="http://zenbase.us"
                >
                  Help
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
