import { Link, useHistory } from "react-router-dom";
import Auth from "../../layouts/auth";
import AuthInput from "../../components/auth-input";
import { Formik } from "formik";
import sweetError from "../../services/sweetError";
import axios from "axios";
import useUser from "../../services/useUser";

export default function Login() {
  const { saveUser } = useUser();
  const history = useHistory();

  const initialValues = {
    email: "",
    password: "",
  };

  const onSubmit = async (values) => {
    try {
      const response = await axios.post("/auth/login", values);
      const userResponse = response.data.data;
      saveUser(userResponse);

      history.push("/dashboard");
    } catch (e) {
      sweetError(e);
    }
  };

  return (
    <Auth>
      <div className="card">
        <div className="card-inner card-inner-lg">
          <div className="nk-block-head">
            <div className="nk-block-head-content">
              <h4 className="nk-block-title">Sign-In</h4>
              <div className="nk-block-des">
                <p>Access using your email and password</p>
              </div>
            </div>
          </div>
          <Formik initialValues={initialValues} onSubmit={onSubmit}>
            {({ handleSubmit }) => (
              <form onSubmit={handleSubmit}>
                <AuthInput
                  id="email"
                  label="Email"
                  placeholder="Enter your email"
                  type="email"
                />
                <AuthInput
                  id="password"
                  label="Password"
                  helper={
                    <a
                      className="link link-primary link-sm"
                      href="/forgot-passowrd"
                    >
                      Forgot Password?
                    </a>
                  }
                  placeholder="Enter your password"
                  type="password"
                />
                <div className="form-group">
                  <button
                    className="btn btn-lg btn-primary btn-block"
                    type="submit"
                  >
                    Sign in
                  </button>
                </div>
              </form>
            )}
          </Formik>
          <div className="form-note-s2 text-center pt-4">
            New on our platform? <Link to="/register">Create an account</Link>
          </div>
        </div>
      </div>
    </Auth>
  );
}
