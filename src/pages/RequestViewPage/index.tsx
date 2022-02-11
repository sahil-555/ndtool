import React from "react";
import { Card, Row, Col, Badge, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import Table, { Column } from "../../components/Base/Table";
import Pagination from "../../components/Base/TablePagination";
import { RequestType } from "../ApproveRequestsPage";
import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import { fetchRequests, fetchPositions } from "../../utils/api";
import moment from "moment";

export const Cols: { [key: string]: string } = {
  requestId: "Request",
  nameOfProject: "Project Name",
  requestor: "Requested By",
  crossChargeDate: "Cross-Charge",
  tower: "Tower",
  subTower: "Sub Tower",
  zone: "Zone",
  subZone: "Sub Zone",
  status: "Status",
};

export const statusColors: { [key: string]: string } = {
  Pending: "warning",
  Approved: "success",
  Rejected: "danger",
  Hold: "secondary",
};

interface Position {
  band?: string | null;
  crossChargeDate?: string | null;
  existingPositionID?: string | null;
  existingResourceName?: string | null;
  hiringType?: string | null;
  id?: number;
  lineManager?: string | null;
  newRole?: boolean;
  positionEndDate?: string | null;
  positionRequired?: number;
  positionStartDate?: string | null;
  requestId?: number;
  roleIdentity?: string | null;
  requestor?: string | null;
  tower?: string | null;
  subTower?: string | null;
  zone?: string | null;
  subZone?: string | null;
  status?: string | null;
  sharps: string[];
}

const PositionRequestViewPage: React.FC = (props) => {
  const [data, setData] = React.useState<Array<Position & { sharpId: string }>>(
    []
  );

  const [currPage, setCurrPage] = React.useState<number>(1);
  const [loading, setLoading] = React.useState<boolean>(false);

  const { accounts } = useMsal();

  const isAuthenticated = useIsAuthenticated();

  React.useEffect(() => {
    if (isAuthenticated) {
      (() => {
        setLoading(true);

        fetchRequests({
          requestor: accounts[0].username,
          approval: { status: "Approved" },
        })
          .then((resdata) => {
            let tmpdata: any[] = [];

            if (resdata) {
              resdata.forEach(
                (item: RequestType & { positions: Position[] }) => {
                  item.positions.forEach((pos: Position) => {
                    tmpdata = [
                      ...tmpdata,
                      ...Array.from(
                        { length: pos.positionRequired! },
                        (v, i) => ({
                          ...pos,
                          zone: item.zone,
                          subZone: item.subZone,
                          status: item.approval.status,
                          requestor: item.requestor,
                          nameOfProject: item.nameOfProject,
                          sharpId: pos.sharps[i],
                        })
                      ),
                    ];
                  });
                }
              );

              setData(tmpdata);
            }
          })
          .catch(console.error)
          .finally(() => setLoading(false));
      })();
    }
  }, [isAuthenticated, accounts]);

  return (
    <>
      <Card>
        <Card.Header className="h4">Position View</Card.Header>
        <Card.Body>
          <Row>
            <Col xs={12} className="mb-4">
              <Table data={data.slice((currPage - 1) * 10, currPage * 10)}>
                {Object.keys(Cols).map((item, index) => (
                  <Column
                    key={index}
                    title={Cols[item]}
                    colId={item}
                    Render={(props) => {
                      return (
                        <React.Fragment>
                          {item === "requestId" ? (
                            <Link
                              to={`/dashboard/requests/${props.row.requestId}`}
                            >
                              {props.row.requestId}
                            </Link>
                          ) : item === "crossChargeDate" ? (
                            props.row.crossChargeDate ? (
                              moment(props.row.crossChargeDate).format(
                                "DD/MM/YYYY"
                              )
                            ) : null
                          ) : item === "status" ? (
                            <Badge pill bg={statusColors[props.row.status]}>
                              {props.row.status}
                            </Badge>
                          ) : (
                            props.row[item]
                          )}
                        </React.Fragment>
                      );
                    }}
                  />
                ))}
              </Table>
            </Col>
            {loading && (
              <Col xs={12} className="d-flex justify-content-center">
                <Spinner animation="border" variant="danger" />
              </Col>
            )}
            {!data.length && !loading && (
              <Col xs={12}>
                <span className="p-2">No requests available!</span>
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
    </>
  );
};

export default PositionRequestViewPage;
