import swal from "sweetalert";

const sweetInfo = (msg) => {
  console.error(msg);
  if (msg)
    swal({
      title: "Success",
      text: msg,
      icon: "success",
    });
  else
    swal({
      title: "Success",
      text: "Success",
      icon: "success",
    });
};

export default sweetInfo;
