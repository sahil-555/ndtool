import React from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { updateApproval } from "../../utils/api";
import { UserContext } from "../../context/UserContext";

interface RequestApprovalModalProps {
  type: "approval" | "rejection";
  show: boolean;
  onClose: () => void;
  data: any;
  pbp?: boolean;
  role: string;
}

const RequestApprovalModal: React.FC<RequestApprovalModalProps> = (props) => {
  const { user } = React.useContext(UserContext);
  const [graded, setGraded] = React.useState<string>("");
  const [reason, setReason] = React.useState<string>("");

  const approvalTimestamp: { [key: string]: string } = {
    stakeholder: "stakeholderApprovalTimestamp",
    budgetOwner: "budgetOwnerApprovalTimestamp",
    eurZoneApprover: "eurZoneApprovalTimestamp",
    towerLead: "towerLeadApprovalTimestamp",
    pbp: "pbpApprovalTimestamp",
    bandingApprover: "bandingApprovalTimestamp",
    inflowsOwner: "inflowsOwnerApprovalTimestamp",
    gccFinance: "gccFinanaceApprovalTimestamp",
  };

  const approve = () => {
    let body: { [key: string]: any } = {
      [approvalTimestamp[props.role]]: new Date().toISOString(),
    };
    if (props.pbp)
      body = { ...body, request: { isJobGraded: graded === "yes" } };

    updateApproval(props.data.id, body)
      .then((resdata) => {
        console.log(resdata);
        props.onClose();
      })
      .catch(console.error);
  };

  const reject = () => {
    updateApproval(props.data.id, {
      status: "Request Rejected by " + props.role,
      rejectedBy: user.email,
      rejectionTimestamp: new Date().toISOString(),
      rejectionReason: reason,
    })
      .then((resdata) => {
        console.log(resdata);
        props.onClose();
      })
      .catch(console.error);
  };

  const validate = () => {
    if (props.type === "approval") {
      if (props.pbp) {
        if (graded === "") {
          return false;
        }
      }
    } else {
      return !!reason;
    }
    return true;
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (validate() && props.type === "approval") {
      approve();
    } else if (validate() && props.type === "rejection") {
      reject();
    }
  };

  return (
    <Modal show={props.show} onHide={props.onClose}>
      <Modal.Header closeButton>
        <strong>
          {props.type === "approval" ? "Approve" : "Reject"} Request
        </strong>
      </Modal.Header>
      <Modal.Body>
        <Form id="approval-form" onSubmit={onSubmit}>
          Do you want to {props.type === "approval" ? "Approve" : "Reject"}{" "}
          request <strong>#{props.data.id}</strong>
          {props.pbp && props.type === "approval" && (
            <Form.Group className="my-3 form-group">
              <Form.Label>Is Job graded?</Form.Label>
              <Form.Control
                as="select"
                required
                onChange={(e) => setGraded(e.currentTarget.value)}
              >
                <option value="">Select</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </Form.Control>
            </Form.Group>
          )}
          {props.type === "rejection" && (
            <Form.Group className="my-3 form-group">
              <Form.Label>Reason for rejection</Form.Label>
              <Form.Control
                as="textarea"
                required
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.currentTarget.value)}
              />
            </Form.Group>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer className="p-2">
        <Button
          variant={props.type === "approval" ? "success" : "danger"}
          type="submit"
          form="approval-form"
        >
          {props.type === "approval" ? "Approve" : "Reject"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RequestApprovalModal;
