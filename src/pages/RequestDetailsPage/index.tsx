import React from "react";
import {
  Card,
  Row,
  Col,
  Spinner,
  ListGroup,
  FormControl,
  InputGroup,
  Button,
} from "react-bootstrap";
import { useParams, useLocation } from "react-router-dom";
import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome";
import Text from "../../components/Text";
import {
  fetchRequest,
  fetchRequestComments,
  postComment,
} from "../../utils/api";
import { UserContext } from "../../context/UserContext";
import moment from "moment";

export const requestKeys = {
  budget: "Budget",
  consolidatedInvoiceToZone: "Consolidated Invoice to Zone?",
  costCenter: "Cost Center",
  crossCharge: "Cross-Charge",
  crossCharge1stTimeFromIndia: "Cross-Charge 1st Time From India?",
  demandType: "Demand Type",
  entityCode: "Entity Code",
  glCode: "GL Code",
  id: "#",
  inflowType: "Inflow Type",
  io: "IO",
  nameOfProject: "Name of Project / Initiative",
  requestDate: "Request Date",
  requestor: "Requestor",
  ria: "RIA",
  subZone: "Sub Zone",
  zone: "Zone",
};

const roleKeys: { [key: string]: string } = {
  stakeholder: "Stakeholder",
  budgetOwner: "Budget Owner",
  eurZoneApprover: "EUR Zone Approver",
  towerLead: "Tower Lead",
  pbp: "PBP",
  bandingApprover: "Banding Approver",
  inflowsOwner: "Inflows Owner",
  gccFinance: "GCC Finance",
};

interface Approval {
  [key: string]: number | string | null;
  id: number;
  requestId: number;
  status: string;
  stakeholder: string | null;
  stakeholderApprovalTimestamp: string | null;
  budgetOwner: string | null;
  budgetOwnerApprovalTimestamp: string | null;
  eurZoneApprover: string | null;
  eurZoneApprovalTimestamp: string | null;
  towerLead: string | null;
  towerLeadApprovalTimestamp: string | null;
  pbp: string | null;
  pbpApprovalTimestamp: string | null;
  bandingApprover: string | null;
  bandingApprovalTimestamp: string | null;
  inflowsOwner: string | null;
  inflowsOwnerApprovalTimestamp: string | null;
  gccFinance: string | null;
  gccFinanaceApprovalTimestamp: string | null;
  rejectedBy: string | null;
  rejectionReason: string | null;
  rejectionTimestamp: string | null;
}

interface Request {
  nameOfProject: string;
  requestDate: string;
  requestor: string;
  ria: string;
  subZone: string;
  zone: string;
  budget: string;
  consolidatedInvoiceToZone: boolean;
  costCenter: string;
  crossCharge: boolean;
  crossCharge1stTimeFromIndia: boolean;
  demandType: string;
  entityCode: string;
  glCode: string;
  id: number;
  inflowType: string;
  io: string;
  approval: Approval;
  positions: { [key: string]: any }[];
}

interface Comment {
  message: string;
  timestamp: string;
  user: string;
}

interface AMListItemProps {
  label: string;
  data?: { time: string | null; rejected: boolean; reqtype: string };
}

const AMListItem: React.FC<AMListItemProps> = (props) => {
  // TODO: FIX Responsiveness
  return (
    <ListGroup.Item>
      <div className="d-flex justify-content-between">
        <div className="h5">
          <span style={{ width: 20 }}>
            <Icon
              icon={
                props.data?.rejected
                  ? "times"
                  : props.data?.reqtype === "Approved"
                  ? "check"
                  : "hourglass-half"
              }
              className={
                "mr-2 " +
                (props.data?.rejected
                  ? "text-danger"
                  : props.data?.reqtype === "Approved"
                  ? "text-success"
                  : "text-warning")
              }
            />
          </span>
          <span>{props.label}</span>
          {props.data?.time && (
            <span className="ml-2 text-muted">{props.data.time}</span>
          )}
        </div>
        <span className={"text-right"}>{props.children}</span>
      </div>
    </ListGroup.Item>
  );
};

const RequestDetailsPage: React.FC<{ approvals?: boolean }> = (props) => {
  const { id }: { id: string } = useParams();
  const { pathname } = useLocation();
  const [request, setRequest] = React.useState<Request>({
    nameOfProject: "",
    requestDate: "",
    requestor: "",
    zone: "",
    subZone: "",
    budget: "",
    entityCode: "",
    io: "",
    ria: "",
    costCenter: "",
    glCode: "",
    crossCharge: false,
    crossCharge1stTimeFromIndia: false,
    demandType: "",
    inflowType: "",
    consolidatedInvoiceToZone: false,
    id: 0,
    approval: {
      id: 0,
      requestId: 0,
      status: "Pending",
      stakeholder: "",
      stakeholderApprovalTimestamp: "",
      budgetOwner: "",
      budgetOwnerApprovalTimestamp: "",
      eurZoneApprover: "",
      eurZoneApprovalTimestamp: "",
      towerLead: "",
      towerLeadApprovalTimestamp: "",
      pbp: "",
      pbpApprovalTimestamp: "",
      bandingApprover: "",
      bandingApprovalTimestamp: "",
      inflowsOwner: "",
      inflowsOwnerApprovalTimestamp: "",
      gccFinance: "",
      gccFinanaceApprovalTimestamp: "",
      rejectedBy: "",
      rejectionReason: "",
      rejectionTimestamp: "",
    },
    positions: [],
  });
  const [loading, setLoading] = React.useState(false);
  const [show, setShow] = React.useState(false);
  const [comments, setComments] = React.useState<Comment[]>([]);
  const [message, setMessage] = React.useState("");

  const { user } = React.useContext(UserContext);

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

  const getTime = (key: string) => {
    let time = request.approval[approvalTimestamp[key]];

    let reqtype = "";

    if (time) {
      reqtype = "Approved";
    } else {
      reqtype = "Requested";
      if (
        [
          "stakeholder",
          "budgetOwner",
          "eurZoneApprover",
          "towerLead",
          "pbp",
        ].indexOf(key) > -1
      ) {
        time = request.approval.requestDate;
      } else if (key === "bandingApprover") {
        time = request.approval.pbpApprovalTimestamp;
      } else if (key === "inflowsOwner") {
        time = request.approval.bandingApprovalTimestamp;
      } else if (key === "gccFinance") {
        time = request.approval.inflowsOwnerApprovalTimestamp;
      }
    }

    return [
      typeof time === "object"
        ? "Awaiting Previous Approvals"
        : reqtype + " on " + moment(time).format("DD MMM YYYY [at] hh:mm a"),
      reqtype,
    ];
  };

  React.useEffect(() => {
    (() => {
      setLoading(true);
      if (id) {
        fetchRequest(id).then((res) => {
          setRequest(res);
        });
        fetchRequestComments(id).then((res) => {
          setComments(res);
        });
      }
      setLoading(false);
    })();
  }, [id]);

  return (
    <React.Fragment>
      <Card>
        <Card.Header className="h4 d-flex justify-content-between">
          Request {"#" + id}
          {pathname.split("/")[2] === "review" && (
            <div className="d-inline">
              <Button variant="success">
                <span>
                  <Icon icon="check" />{" "}
                  <span className="d-none d-md-inline">Approve</span>
                </span>
              </Button>
              <Button variant="danger" className="d-inline ml-1">
                <span>
                  <Icon icon="times" />{" "}
                  <span className="d-none d-md-inline">Reject</span>
                </span>
              </Button>
            </div>
          )}
        </Card.Header>
        <Card.Body>
          {loading ? (
            <Spinner animation="border" variant="primary" />
          ) : (
            <React.Fragment>
              <Row>
                <Col xs={12} lg={4}>
                  <Text label={requestKeys["nameOfProject"]}>
                    {request["nameOfProject"]}
                  </Text>
                </Col>
                <Col xs={12} lg={4}>
                  <Text label={requestKeys["requestDate"]} styles="mb-0">
                    {moment(request["requestDate"]).format("DD/MM/YYYY")}
                  </Text>
                </Col>
                <Col xs={12} lg={4}>
                  <Text label={requestKeys["requestor"]} styles="mb-0">
                    {request["requestor"]}
                  </Text>
                </Col>
                <Col xs={12} lg={4}>
                  <Text label={requestKeys["zone"]}>{request["zone"]}</Text>
                </Col>
                <Col xs={12} lg={4}>
                  <Text label={requestKeys["subZone"]}>
                    {request["subZone"] ? request["subZone"] : "N/A"}
                  </Text>
                </Col>
                <Col xs={12} lg={4}>
                  <Text label={requestKeys["entityCode"]} styles="mb-0">
                    {request["entityCode"]}
                  </Text>
                </Col>
                <Col xs={12} lg={4}>
                  <Text label={requestKeys["crossCharge"]} styles="mb-0">
                    {request["crossCharge"] ? "Yes" : "No"}
                  </Text>
                </Col>
              </Row>
              <hr />
              {request["crossCharge"] && (
                <React.Fragment>
                  <Row>
                    <Col xs={12} lg={4}>
                      <Text label={requestKeys["budget"]} styles="mb-0">
                        {request["budget"]}
                      </Text>
                    </Col>
                    {request["budget"] !== "Opex" ? (
                      <React.Fragment>
                        <Col xs={12} lg={4}>
                          <Text label={requestKeys["io"]} styles="mb-0">
                            {request["io"]}
                          </Text>
                        </Col>
                        <Col xs={12} lg={4}>
                          <Text label={requestKeys["ria"]} styles="mb-0">
                            {request["ria"]}
                          </Text>
                        </Col>
                      </React.Fragment>
                    ) : (
                      <React.Fragment>
                        <Col xs={12} lg={4}>
                          <Text label={requestKeys["io"]} styles="mb-0">
                            {request["costCenter"]}
                          </Text>
                        </Col>
                        <Col xs={12} lg={4}>
                          <Text label={requestKeys["ria"]} styles="mb-0">
                            {request["glCode"]}
                          </Text>
                        </Col>
                      </React.Fragment>
                    )}
                  </Row>
                  <hr />
                </React.Fragment>
              )}
            </React.Fragment>
          )}
        </Card.Body>
        <Card.Header className="h4">Approval Matrix</Card.Header>
        <Card.Body>
          {loading ? (
            <Spinner animation="border" variant="primary" />
          ) : (
            <React.Fragment>
              <ListGroup variant="flush">
                {Object.keys(roleKeys).map((key: string) => {
                  const [message, reqtype] = getTime(key);

                  if (!request.approval[key])
                    return <React.Fragment key={key} />;

                  return (
                    <AMListItem
                      key={key}
                      label={roleKeys[key]}
                      data={{
                        time: message,
                        rejected: request.approval.rejectedBy === key,
                        reqtype: reqtype,
                      }}
                    >
                      {request.approval[key]}
                    </AMListItem>
                  );
                })}
              </ListGroup>
            </React.Fragment>
          )}
        </Card.Body>
        <div
          className={
            "position-fixed bottom-0 end-0 text-white rounded-top " +
            (show ? "comment" : "")
          }
          style={{ backgroundColor: "rgb(177, 31, 36)" }}
        >
          <div
            className="px-4 py-2 header rounded-top d-flex justify-content-between align-items-center"
            style={{ backgroundColor: "rgb(177, 31, 36)" }}
            onClick={() => setShow(!show)}
          >
            <span>
              <Icon icon={"comment"} className="mr-2" />
              Comments
            </span>
            <span
              className="border border-1 ml-2 px-1"
              style={{ height: 24, width: 24 }}
            >
              <Icon icon={show ? "chevron-down" : "chevron-up"} />
            </span>
          </div>
          {show && (
            <React.Fragment>
              <div className={"bg-white text-black mx-1 comments"}>
                <Row>
                  {comments.map((comment: Comment, index: number) => (
                    <Col xs={12} key={index}>
                      <Text
                        label={
                          comment.user === user.email ? "You" : comment.user
                        }
                        styles={
                          "border border-1 px-2 py-1 mx-2 mt-2 " +
                          (comment.user === user.email ? "you" : "user")
                        }
                        labelStyles="text-muted fw-light mb-0 text-left"
                      >
                        {comment.message}
                        <div className="text-muted" style={{ fontSize: 12 }}>
                          {moment(comment.timestamp).format(
                            "DD/MM/YY [@]hh:mm a"
                          )}
                        </div>
                      </Text>
                    </Col>
                  ))}
                </Row>
              </div>
              <div className="p-1">
                <InputGroup>
                  <FormControl
                    as="input"
                    placeholder="Post your comment.."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  <Button
                    onClick={() => {
                      if (message.length > 0) {
                        postComment(id, message, user.email).then((data) => {
                          setComments([data, ...comments]);
                          setMessage("");
                        });
                      }
                    }}
                  >
                    <Icon icon="chevron-right" />
                  </Button>
                </InputGroup>
              </div>
            </React.Fragment>
          )}
        </div>
      </Card>
    </React.Fragment>
  );
};

export default RequestDetailsPage;
