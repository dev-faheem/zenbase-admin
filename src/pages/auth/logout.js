import { useEffect } from "react";
import { useHistory } from "react-router";
import Auth from "../../layouts/auth";
import useUser from "../../services/useUser";

export default function Logout() {
  const history = useHistory();
  const { deleteUser } = useUser();

  useEffect(() => {
    deleteUser();
    history.push("/login");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Auth>
      {" "}
      <div className="brand-logo pb-4 text-center">
        <a href="html/index.html" className="logo-link">
          <img
            className="logo-light logo-img logo-img-lg"
            src="./images/logo.png"
            alt="logo"
          />
          <img
            className="logo-dark logo-img logo-img-lg"
            src="./images/logo-dark.png"
            alt="logo-dark"
          />
        </a>
      </div>
      <div className="card">
        <div className="card-inner card-inner-lg">
          <div className="nk-block-head">
            <div className="nk-block-head-content">
              <h4 className="nk-block-title">Logout</h4>
              <div className="nk-block-des">
                <p>Please wait while we log you out.</p>
              </div>
              <button
                onClick={() => history.push("/login")}
                className="btn btn-lg btn-primary btn-block mt-5"
              >
                <div class="spinner-border text-dark" role="status">
                  <span class="sr-only">Loading...</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Auth>
  );
}
