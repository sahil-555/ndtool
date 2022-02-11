import React from "react";
import {
  Card,
  Row,
  Col,
  Button,
  Badge,
  FormSelect,
  Spinner,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome";
import Table, { Column } from "../../components/Base/Table";
import Pagination from "../../components/Base/TablePagination";
import { fetchRequests } from "../../utils/api";
import { UserContext } from "../../context/UserContext";
import { statusColors } from "../YourRequestsPage";
import moment from "moment";
import RequestApprovalModal from "../../components/Modals/RequestApprovalModal";

export interface RequestType {
  approval: any;
  budget: string | null;
  consolidatedInvoiceToZone: boolean;
  costCenter: string | null;
  crossCharge: boolean;
  crossCharge1stTimeFromIndia: boolean;
  demandType: string | null;
  entityCode: string | null;
  glCode: string | null;
  id: number;
  inflowType: string | null;
  io: string | null;
  nameOfProject: string | null;
  requestDate: string | null;
  requestor: string | null;
  ria: string | null;
  subZone: string | null;
  zone: string | null;
}

export const Cols: { [key: string]: string } = {
  id: "#",
  requestDate: "Request Date",
  crossCharge: "Cross-Charge",
  nameOfProject: "Project Name",
  requestor: "Requested By",
  zone: "Zone",
  subZone: "Sub Zone",
  status: "Status",
};

const ApproveRequestsPage: React.FC = (props) => {
  interface ModalState {
    show: boolean;
    type: "approval" | "rejection";
    data: { id: number; approval: any };
  }
  const [data, setData] = React.useState<Array<RequestType>>([]);

  const { user } = React.useContext(UserContext);

  const [currPage, setCurrPage] = React.useState<number>(1);

  const [type, setType] = React.useState<string>("pending");
  const [loading, setLoading] = React.useState<boolean>(false);
  const [modalData, setModalData] = React.useState<ModalState>({
    show: false,
    type: "approval",
    data: { id: -1, approval: {} },
  });

  const onApprove = ({ id, approval }: { id: number; approval: any }) => {
    setModalData({ show: true, type: "approval", data: { id, approval } });
  };

  const onReject = ({ id, approval }: { id: number; approval: any }) => {
    setModalData({ show: true, type: "rejection", data: { id, approval } });
  };

  const getRole = (data: any) => {
    let role = "";
    if (user.email.length > 0) {
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          const element = data[key];
          if (element === user.email) {
            role = key;
            break;
          }
        }
      }
    }
    return role;
  };

  React.useEffect(() => {
    if (user.email.length > 0) {
      setLoading(true);
      (() => {
        fetchRequests({}, type, user.email).then((resdata) => {
          if (resdata) setData(resdata);
          setLoading(false);
        });
      })();
    }
  }, [user, type]);

  return (
    <>
      <Card>
        <Card.Header>
          <div className="w-100 d-flex justify-content-between align-items-center">
            <h4 className="m-0">Approve Requests</h4>
            <div>
              <FormSelect
                value={type}
                onChange={(e) => {
                  setType(e.currentTarget.value);
                }}
              >
                <option value={"pending"}>Pending</option>
                <option value={"approved"}>Approved</option>
                <option value={"rejected"}>Rejected</option>
              </FormSelect>
            </div>
          </div>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col xs={12} className="mb-4">
              {type === "pending" ? (
                <Table
                  data={
                    loading
                      ? []
                      : data.slice((currPage - 1) * 10, currPage * 10)
                  }
                >
                  {Object.keys(Cols).map((item, index) => (
                    <Column
                      key={index}
                      title={Cols[item]}
                      colId={item}
                      Render={(props) => (
                        <React.Fragment>
                          {item === "id" ? (
                            <Link to={`/dashboard/review/${props.row.id}`}>
                              {props.row.id}
                            </Link>
                          ) : item === "requestDate" ? (
                            moment(props.row.requestDate).format("DD/MM/YYYY")
                          ) : item === "crossCharge" ? (
                            props.row.crossCharge ? (
                              "Yes"
                            ) : (
                              "No"
                            )
                          ) : item === "status" ? (
                            <Badge
                              pill
                              bg={statusColors[props.row.approval[item]]}
                            >
                              {props.row.approval[item]}
                            </Badge>
                          ) : (
                            props.row[item]
                          )}
                        </React.Fragment>
                      )}
                    />
                  ))}
                  <Column
                    title="Actions"
                    colId="actions"
                    Render={({ row }) => (
                      <React.Fragment>
                        <Button
                          variant="danger"
                          size="sm"
                          className="mr-2"
                          onClick={() => onReject(row)}
                        >
                          <Icon icon="times" />
                        </Button>
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => onApprove(row)}
                        >
                          <Icon icon="check" />
                        </Button>
                      </React.Fragment>
                    )}
                  />
                </Table>
              ) : (
                <Table
                  data={
                    loading
                      ? []
                      : data.slice((currPage - 1) * 10, currPage * 10)
                  }
                >
                  {Object.keys(Cols).map((item, index) => (
                    <Column
                      key={index}
                      title={Cols[item]}
                      colId={item}
                      Render={(props) => (
                        <React.Fragment>
                          {item === "id" ? (
                            <Link to={`/dashboard/review/${props.row.id}`}>
                              {props.row.id}
                            </Link>
                          ) : item === "requestDate" ? (
                            moment(props.row.requestDate).format("DD/MM/YYYY")
                          ) : item === "crossCharge" ? (
                            props.row.crossCharge ? (
                              "Yes"
                            ) : (
                              "No"
                            )
                          ) : item === "status" ? (
                            <Badge
                              pill
                              bg={statusColors[props.row.approval[item]]}
                            >
                              {props.row.approval[item]}
                            </Badge>
                          ) : (
                            props.row[item]
                          )}
                        </React.Fragment>
                      )}
                    />
                  ))}
                </Table>
              )}
            </Col>
            {loading && (
              <Col xs={12} className="d-flex justify-content-center">
                <Spinner animation="border" variant="danger" />
              </Col>
            )}
            {!data.length && !loading && (
              <Col xs={12}>
                <span className="p-2">No action items available!</span>
              </Col>
            )}
          </Row>
        </Card.Body>
        <Card.Footer className="py-3 d-flex justify-content-end">
          <Pagination
            total={Math.ceil(data.length / 10)}
            curr={currPage}
            setCurr={(val: number) => setCurrPage(val)}
          />
        </Card.Footer>
      </Card>
      {modalData.show && (
        <RequestApprovalModal
          type={modalData.type}
          data={modalData.data}
          show={modalData.show}
          onClose={() =>
            setModalData({
              show: false,
              type: "approval",
              data: { id: -1, approval: {} },
            })
          }
          pbp={modalData.data.approval?.pbp === user.email}
          role={getRole(modalData.data.approval!)}
        />
      )}
    </>
  );
};

export default ApproveRequestsPage;
