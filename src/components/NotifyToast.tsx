import React, { useContext } from "react";

import { Toast, ToastContainer } from "react-bootstrap";
import { NotifContext } from "../context/ToastContext";

const NotifyToast: React.FC = (props) => {
  const { notif, notifDispatch } = useContext(NotifContext);

  const onClose = () => {
    notifDispatch({ type: "SHOW_NOTIF", payload: { visible: false } });
  };

  return (
    <ToastContainer position="top-end">
      <Toast onClose={onClose} show={notif.visible} animation={true} autohide>
        <Toast.Header>
          <strong className="mr-auto">{notif.header}</strong>
        </Toast.Header>
        <Toast.Body>
          <p>{notif.message}</p>
        </Toast.Body>
      </Toast>
    </ToastContainer>
  );
};

export default NotifyToast;
