import React from "react";
import { Table, Row, Col, Button, Form, InputGroup } from "react-bootstrap";
import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome";
import { fetchApprovers } from "../../utils/api";

interface ApprovalMatrixProps {
  zone: string;
  tower: string;
  approvers: User[];
  setApprovers: React.Dispatch<React.SetStateAction<User[]>>;
}

export interface User {
  name: string;
  email: string;
  role: string;
}

interface FieldProps {
  label: string;
  approver: User;
  setAttr: (val: string) => void;
}

const Field: React.FC<FieldProps> = ({ label, approver, setAttr }) => {
  const [disable, setDisable] = React.useState(
    ["stakeholder", "budget owner"].indexOf(approver.role) == -1
  );

  return (
    <Row className="my-2 align-items-center">
      <Col className="text-capitalize text-left h5">{label}</Col>
      <Col className="text-right" lg={5}>
        <InputGroup>
          <Form.Control
            type="email"
            value={approver.email}
            onChange={(e) => {
              setAttr(e.target.value);
            }}
            disabled={disable}
            placeholder="Email"
          />
          <Button
            variant="link"
            className={disable ? "text-success" : "text-danger"}
            onClick={() => setDisable(!disable)}
          >
            <Icon icon={disable ? "pen" : "lock"} />
          </Button>
        </InputGroup>
      </Col>
    </Row>
  );
};

const ApprovalMatrix: React.FC<ApprovalMatrixProps> = ({
  zone,
  tower,
  approvers,
  setApprovers,
}) => {
  const roleKeys: { [key: string]: string } = {
    stakeholder: "Stakeholder",
    "budget owner": "Budget Owner",
    "GCC Operations": "Tower Lead",
    "Tech Ops": "Tower Lead",
    "Digital Solutions": "Tower Lead",
    Procurement: "Tower Lead",
    GAC: "Tower Lead",
    "Tech Logistics & Supply": "Tower Lead",
    "People Tech": "Tower Lead",
    "Data & Integration": "Tower Lead",
    "Business Transformation": "Tower Lead",
    "Data & Architecture": "Tower Lead",
    SAP: "Tower Lead",
    eurZoneApprover: "EUR Zone Approver",
    PBP: "PBP",
    "Banding Approver": "Banding Approver",
    "Inflows Owner": "Inflows Owner",
    "GCC Finance": "GCC Finance",
    MDM: "MDM",
  };

  const setAttr = (index: number) => (val: string) => {
    approvers[index].email = val;
    setApprovers([...approvers]);
  };

  React.useEffect(() => {
    (() => {
      fetchApprovers(zone, tower).then((data) =>
        setApprovers([
          { role: "stakeholder", name: "", email: "" },
          { role: "budget owner", name: "", email: "" },
          ...data,
        ])
      );
    })();
  }, []);

  return (
    <React.Fragment>
      <Form id="approval-matrix">
        {approvers.map((approver: User, index: number) => (
          <Field
            key={approver.role}
            label={roleKeys[approver.role]}
            approver={approver}
            setAttr={setAttr(index)}
          />
        ))}
      </Form>
    </React.Fragment>
  );
};

export default ApprovalMatrix;
