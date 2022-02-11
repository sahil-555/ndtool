import React from "react";
import { Card, Row, Col, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import Table, { Column } from "../../components/Base/Table";
import Pagination from "../../components/Base/TablePagination";
import { RequestType } from "../ApproveRequestsPage";
import { fetchRequests } from "../../utils/api";
import moment from "moment";

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

export const statusColors: { [key: string]: string } = {
  Pending: "warning",
  Approved: "success",
  Rejected: "danger",
  Hold: "secondary",
};

const YourRequstsPage: React.FC = (props) => {
  const [data, setData] = React.useState<Array<RequestType>>([]);

  const [currPage, setCurrPage] = React.useState<number>(1);

  const { accounts } = useMsal();

  const isAuthenticated = useIsAuthenticated();

  React.useEffect(() => {
    if (isAuthenticated) {
      (() => {
        fetchRequests({ requestor: accounts[0].username }).then((resdata) => {
          if (resdata) setData(resdata);
        });
      })();
    }
  }, [isAuthenticated, accounts]);

  return (
    <>
      <Card>
        <Card.Header className="h4">Your Requests</Card.Header>
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
                          {item === "id" ? (
                            <Link to={`/dashboard/requests/${props.row.id}`}>
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
                      );
                    }}
                  />
                ))}
              </Table>
            </Col>
            {!data.length && (
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
    </>
  );
};

export default YourRequstsPage;
