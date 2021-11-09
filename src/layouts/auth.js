import Footer from "../components/footer";

export default function Auth({ children }) {
  return (
    <div className="nk-app-root">
      <div className="nk-main ">
        <div className="nk-wrap nk-wrap-nosidebar">
          <div className="nk-content ">
            <div className="nk-block nk-block-middle nk-auth-body wide-xs">
              <div className="brand-logo pb-4 text-center">
                <a href="/" className="logo-link">
                  <img
                    className="logo-light logo-img logo-img-lg"
                    src="images/zenbase.png"
                    alt="logo"
                  />
                  <img
                    className="logo-dark logo-img logo-img-lg"
                    src="images/zenbase.png"
                    alt="logo-dark"
                  />
                </a>
              </div>
              {children}
            </div>
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
}
