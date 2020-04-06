import { Modal } from "antd";

function errorAlert() {
  Modal.error({
    content: "Check again your album name !"
  });
}
function successAlert(value) {
  Modal.success({
    content: `Your album is ${value} !`
  });
}
export { errorAlert, successAlert };
