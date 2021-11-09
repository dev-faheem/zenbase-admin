import { useEffect, useState } from "react";
import Footer from "../components/footer";
import Navbar from "../components/navbar";
import Sidebar from "../components/sidebar";
import cx from "classnames";
import useUser from "../services/useUser";
import { useHistory } from "react-router";
import axios from "axios";

export default function Dashboard({ children, fluid = true }) {
  const [sidebar, setSidebar] = useState(false);
  const history = useHistory();
  const { getUser } = useUser();

  useEffect(() => {
    if (sidebar === true) {
      document.body.classList.add("nav-shown");
    } else {
      document.body.classList.remove("nav-shown");
    }
  }, [sidebar]);

  useEffect(() => {
    document.body.classList.add("dark-mode");

    const user = getUser();

    if (!user) {
      console.log("User is invalid", { user });
      history.push("/login");
    } else {
      axios.interceptors.request.use((config) => {
        config.headers.Authorization = user.token;
        return config;
      });
    }
  }, []);

  return (
    <div className="nk-app-root">
      <div className="nk-main">
        <Sidebar sidebar={sidebar} setSidebar={setSidebar} />
        <div className="nk-wrap">
          <Navbar sidebar={sidebar} setSidebar={setSidebar} />
          {sidebar && (
            <div className="nk-sidebar-overlay" data-target="sidebarMenu"></div>
          )}
          <div className="nk-content">
            <div
              className={cx({ "container-fluid": fluid, container: !fluid })}
            >
              <div className="nk-content-inner">
                <div className="nk-content-body">{children}</div>
              </div>
            </div>
          </div>
          <Footer fluid={fluid} />
        </div>
      </div>
    </div>
  );
}
