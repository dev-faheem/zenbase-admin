function link(
  title,
  icon,
  to = "#/",
  children = null,
  badge = null,
  admin = false
) {
  return { title, icon, to, children, badge, heading: false, admin };
}

function heading(title, admin) {
  return { title, heading: true, admin };
}

// Icons: https://dashlite.net/demo2/components/misc/nioicon.html

const sidebar = [
  link("Dashboard", "layout-fill", "#"),

  heading("Songs"),
  link("Search", "search", "/songs"),
  link("Categories", "view-grid-fill", "/categories"),
  link("Tags", "tags-fill", "/tags"),
  link("Playlists", "list-index", "/playlists"),

  heading("Administration"),
  link("Global Settings", "setting", "#"),
  link("Users", "users-fill", "#"),
  link("Admins", "user-circle-fill", "#"),
  // link("Item 2", "list-fill", "#"),
  // link("Menu", "star-fill", "#", [
  //   link("Sub Menu 1", "menu-circled", "#"),
  //   link("Sub Menu 2", "video-fill", "#"),
  //   link("Sub Menu 3", "video", "#"),
  // ]),
  heading("Account"),
  link("Change Password", "shield-star-fill", "/password"),
  link("Logout", "signout", "/logout"),
];

export default sidebar;
