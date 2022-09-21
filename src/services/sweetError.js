import swal from "sweetalert";

const sweetError = (e) => {
  console.error(e);
  if (e.response?.data.error)
    swal({
      title: "Something went wrong",
      text: e.response?.data.error,
      icon: "error",
    });
  else
    swal({
      title: "Something went wrong",
      text: e.message,
      icon: "error",
    });
};

export default sweetError;
