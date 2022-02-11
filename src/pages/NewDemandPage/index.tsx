import React from "react";
import { Card, Row, Col, Button, ButtonGroup } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { useMsal } from "@azure/msal-react";
import RequestDetails from "./RequestDetails";
import PositionDetails, { RequestDataType } from "./PositionDetails";
import ApprovalMatrix, { User } from "./ApprovalMatrix";
import {
  createRequest,
  createPositions,
  createApproval,
} from "../../utils/api";

const NewDemandPage: React.FC = (props) => {
  const [panel, setPanel] = React.useState(0);
  const [formData, setFormData] = React.useState<{ [key: string]: any }>({
    nameOfProjectInitiative: "",
    zone: "",
    subZone: "",
    budget: "",
    entityCode: "",
    io: "",
    ria: "",
    costCenter: "",
    glCode: "",
    crossCharge: false,
  });

  const [positionData, setPositionData] = React.useState<
    Array<RequestDataType>
  >([]);

  const [approvers, setApprovers] = React.useState<User[]>([]);

  const history = useHistory();

  const { accounts } = useMsal();

  const changeAttr = (
    key: string,
    val: any,
    extra?: { [key: string]: any }
  ) => {
    if (extra) {
      setFormData({ ...formData, ...extra });
    } else {
      setFormData({ ...formData, [key]: val });
    }
  };

  const Panels = [
    {
      name: "Request Details",
      component: <RequestDetails data={formData} changeAttr={changeAttr} />,
    },
    {
      name: "Position Details",
      component: (
        <PositionDetails data={positionData} setData={setPositionData} />
      ),
    },
    {
      name: "Approval Matrix",
      component: (
        <ApprovalMatrix
          zone={formData.zone}
          tower={positionData[0]?.tower}
          approvers={approvers}
          setApprovers={setApprovers}
        />
      ),
    },
  ];

  const validateRequestDetails = () => {
    if (
      formData.nameOfProjectInitiative &&
      formData.entityCode &&
      formData.zone &&
      (formData.zone === "AFR" ? formData.subZone : true) &&
      (formData.crosCharge
        ? formData.budget &&
          (formData.budget === "Capex"
            ? formData.io && formData.ria
            : formData.budget === "Opex"
            ? formData.costCenter && formData.glCode
            : true)
        : true)
    )
      return true;
    return false;
  };

  const validateApprovalMatrix = () => {
    for (let i = 0; i < approvers.length; i++) {
      if (!approvers[i].email) {
        return false;
      }
    }

    return true;
  };

  const validatePanel = () => {
    const validationFunc = [
      validateRequestDetails,
      () => positionData.length > 0,
      validateApprovalMatrix,
    ];
    return validationFunc[panel]();
  };

  const previousPanel = () => {
    setPanel(panel - 1);
  };

  const nextPanel = () => {
    if (validatePanel()) setPanel(panel + 1);
    else window.alert("Fill in the Required Fields.");
  };

  const submit = () => {
    let reqId = 0;
    createRequest(formData, accounts[0].username)
      .then((data) => {
        if (data) reqId = data.id;
      })
      .then(() =>
        createPositions(reqId, positionData).then((data) => {
          console.log(data);
        })
      )
      .then(() => {
        createApproval(reqId, approvers).then((data) => {
          if (data) window.alert("Request Submitted Successfully.");
        });
      })
      .finally(() => history.push("/dashboard/requests"));
  };

  return (
    <>
      <Card>
        <Card.Header className="h4">New Demand Request</Card.Header>
        <Row className="sidebar-row">
          <Col lg={12} xs={12}>
            <Card.Body className="pb-2">{Panels[panel].component}</Card.Body>
            <Card.Footer className="py-3 d-flex justify-content-end">
              <ButtonGroup>
                <Button
                  variant="warning"
                  disabled={!panel}
                  onClick={previousPanel}
                >
                  Previous
                </Button>
                {!(panel === Panels.length - 1) && (
                  <Button
                    variant="warning"
                    disabled={panel === Panels.length - 1}
                    onClick={nextPanel}
                  >
                    Next
                  </Button>
                )}
                {panel === Panels.length - 1 && (
                  <Button
                    variant="success"
                    disabled={panel !== Panels.length - 1}
                    onClick={() => {
                      if (validatePanel()) submit();
                      else window.alert("Fill in the Required Fields.");
                    }}
                  >
                    Submit
                  </Button>
                )}
              </ButtonGroup>
            </Card.Footer>
          </Col>
        </Row>
      </Card>
    </>
  );
};

export default NewDemandPage;
