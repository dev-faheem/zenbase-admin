import { Redirect } from "react-router";
import AuthLogin from "../pages/auth/login";
// import AuthRegister from "../pages/auth/register";
import AuthLogout from "../pages/auth/logout";
import Home from "../pages/dashboard/home";
import Search from "../pages/dashboard/search";
import SongUpload from "../pages/dashboard/song-upload";

import SearchTopcards from "../pages/dashboard/search-topcard";

import SongTopCard from "../pages/dashboard/song-topcard";
import Categories from "../pages/dashboard/categories";
import Tags from "../pages/dashboard/tags";
import Playlists from "../pages/dashboard/playlists";
import Settings from "../pages/dashboard/settings";
import Users from "../pages/dashboard/users";
import Admins from "../pages/dashboard/admins";
import ApproveSongs from "../pages/dashboard/approve-songs";
import RejectedSongs from "../pages/dashboard/rejected-songs";

function route(path, component, exact = true) {
  return { path, component, exact };
}

const routes = [
  route("/", () => <Redirect to="/login" />),
  route("/login", AuthLogin),
  // route("/register", AuthRegister),
  route("/logout", AuthLogout),
  route("/dashboard", Home),
  route("/songs", Search),
  route("/songs/create", SongUpload),
  route("/songs/update", SongUpload),
  route("/categories", Categories),

  route("/topcard/create", SongTopCard),
  route("/search-topcard/update", SongTopCard),

  route("/search-topcard", SearchTopcards),

  route("/tags", Tags),
  route("/playlists", Playlists),
  route("/settings", Settings),
  route("/users", Users),
  route("/admins", Admins),
  route("/approve-songs", ApproveSongs),
  route("/rejected-songs", RejectedSongs),
];

export default routes;
