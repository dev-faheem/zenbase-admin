import AuthLogin from "../pages/auth/login";
import AuthRegister from "../pages/auth/register";
import AuthLogout from "../pages/auth/logout";
import Home from "../pages/dashboard/home";
import Search from "../pages/dashboard/search";
import Categories from "../pages/dashboard/categories";
import Tags from "../pages/dashboard/tags";
import Playlists from "../pages/dashboard/playlists";
import { Redirect } from "react-router";

function route(path, component, exact = true) {
  return { path, component, exact };
}

const routes = [
  route("/", () => <Redirect to="/login" />),
  route("/login", AuthLogin),
  route("/register", AuthRegister),
  route("/logout", AuthLogout),

  route("/dashboard", Home),
  route("/songs", Search),
  route("/categories", Categories),
  route("/tags", Tags),
  route("/playlists", Playlists),
];

export default routes;
