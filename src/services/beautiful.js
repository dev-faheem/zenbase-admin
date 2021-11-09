export const role = (role) => {
  switch (role) {
    case "user":
      return "User";
    case "admin":
      return "Administrator";
    default:
      return "Guest";
  }
};
