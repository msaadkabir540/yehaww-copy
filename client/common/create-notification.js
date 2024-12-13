import { toast } from "react-toastify";

const createNotification = (type, message) => {
  switch (type) {
    case "info":
      toast.info(message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      break;
    case "success":
      toast.success(message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      break;
    case "warning":
      toast.warning(message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      break;
    case "error":
      toast.error(message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      break;
    default:
      return false;
  }
};

export default createNotification;
