import AuthLogin from "../pages/auth/login";
import AuthRegister from "../pages/auth/register";
import AuthLogout from "../pages/auth/logout";
import Home from "../pages/dashboard/home";
import Search from "../pages/dashboard/search";
import SongUpload from "../pages/dashboard/song-upload";
import Categories from "../pages/dashboard/categories";
import Tags from "../pages/dashboard/tags";
import Playlists from "../pages/dashboard/playlists";
import { Redirect } from "react-router";
import Settings from "../pages/dashboard/settings";

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
  route("/songs/create", SongUpload),
  route("/categories", Categories),
  route("/tags", Tags),
  route("/playlists", Playlists),
  route("/settings", Settings),
];

export default routes;
