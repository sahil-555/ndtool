import React from "react";
import { Card, Row, Col } from "react-bootstrap";
import Table, { Column } from "../../components/Base/Table";
import Pagination from "../../components/Base/TablePagination";
import { RequestType } from "../ApproveRequestsPage";

const AdminViewPage: React.FC = (props) => {
  const Cols: { [key: string]: string } = {
    id: "ID",
    status: "Status",
    request_date: "Request Date",
    project_name: "Project / Initiative Name",
    requestor: "Requested By",
    demand_type: "New Demand Type",
    zone: "Zone",
    sub_zone: "Sub Zone",
  };

  const [currPage, setCurrPage] = React.useState<number>(1);

  const data: Array<RequestType> = [];
  return (
    <>
      <Card>
        <Card.Header className="h4">Admin View</Card.Header>
        <Card.Body>
          <Row>
            <Col xs={12} className="mb-4">
              <Table data={data}>
                {Object.keys(Cols).map((item, index) => (
                  <Column key={index} title={Cols[item]} colId={item} />
                ))}
              </Table>
            </Col>
            {!data.length && (
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

export default AdminViewPage;
