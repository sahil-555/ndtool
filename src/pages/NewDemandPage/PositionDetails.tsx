import React from "react";
import { Table, Row, Col, Button, FormControl } from "react-bootstrap";
import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome";
import Pagination from "../../components/Base/TablePagination";
import NewPositionModal from "../../components/Modals/NewPositionModal";

export interface RequestDataType {
  id: number;
  roleIdentity: string;
  band: string;
  rate: number;
  positionRequired: boolean;
  hiringType: string;
  positionStartDate: string;
  positionEndDate: string;
  expectedCrossChargeStartDate: string;
  tower: string;
  subTower: string;
  lineManager: string;
  newRole: boolean;
  roleDescription: string;
  existingResourceName: string;
  existingPositionID: string;
  attachJobDescription: string;
}

interface PositionDetailsProps {
  data: Array<RequestDataType>;
  setData: React.Dispatch<React.SetStateAction<Array<RequestDataType>>>;
}

const PositionDetails: React.FC<PositionDetailsProps> = (props) => {
  const Cols = [
    "Action",
    "ID",
    "Role Identity",
    "Band",
    "Rate",
    "Position Required",
    "Hiring Type",
    "Position Start Date",
    "Position End Date",
    "Expected Cross-Charge Start Date",
    "Tower",
    "Sub Tower",
    "Line Manager",
    "New Role",
    "Role Description",
    "Existing Resource Name",
    "Existing Position ID",
    "Attach Job Description",
  ];

  const [currPage, setCurrPage] = React.useState<number>(1);

  const [openModal, setOpenModal] = React.useState(false);

  const { data, setData } = props;
  const [defaultData, setDefaultData] = React.useState(-1);

  const fetchDefaultData = () =>
    defaultData > -1
      ? data[defaultData]
      : data.length
      ? {
          roleIdentity: data[0]?.roleIdentity,
          newRole: data[0]?.newRole,
          tower: data[0]?.tower,
          subTower: data[0]?.subTower,
        }
      : {};

  const editPosition = (index: number) => {
    setDefaultData(index);
  };

  const deletePosition = (index: number) => {
    const newData = [...data];
    newData.splice(index, 1);
    setData(newData);
  };

  React.useEffect(() => {
    if (openModal === false) setDefaultData(-1);
  }, [openModal]);

  React.useEffect(() => {
    if (defaultData !== -1) {
      setOpenModal(true);
    }
  }, [defaultData]);

  return (
    <React.Fragment>
      <Row>
        <Col xs={12} className="mb-4">
          <div className="d-flex justify-content-between">
            <Button variant="success" onClick={() => setOpenModal(true)}>
              Add Position
            </Button>
            <div>
              <FormControl type="text" placeholder="Search" />
            </div>
          </div>
        </Col>
        <Col xs={12} className="mb-4">
          <Table striped bordered hover responsive className="text-nowrap">
            <thead>
              <tr>
                {Cols.map((col, index) => (
                  <th key={index}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody className="text-center">
              {data.map((item, index) => (
                <tr key={index}>
                  <td>
                    <Button
                      variant="link"
                      className="text-success"
                      onClick={() => editPosition(index)}
                    >
                      <Icon icon="edit" />
                    </Button>
                    <Button
                      variant="link"
                      className="text-danger"
                      onClick={() => deletePosition(index)}
                    >
                      <Icon icon="trash" />
                    </Button>
                  </td>
                  <td>{item.id}</td>
                  <td>{item.roleIdentity}</td>
                  <td>{item.band}</td>
                  <td>{item.rate}</td>
                  <td>{item.positionRequired}</td>
                  <td>{item.hiringType}</td>
                  <td>{item.positionStartDate}</td>
                  <td>{item.positionEndDate}</td>
                  <td>{item.expectedCrossChargeStartDate}</td>
                  <td>{item.tower}</td>
                  <td>{item.subTower}</td>
                  <td>{item.lineManager}</td>
                  <td>{item.newRole}</td>
                  <td>{item.roleDescription}</td>
                  <td>{item.existingResourceName}</td>
                  <td>{item.existingPositionID}</td>
                  <td>{item.attachJobDescription}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          {!data.length && (
            <span className="p-2">No action items available!</span>
          )}
        </Col>
        <Col xs={12}>
          <Pagination
            total={1}
            curr={currPage}
            setCurr={(val: number) => setCurrPage(val)}
          />
        </Col>
      </Row>
      {openModal && (
        <NewPositionModal
          show={openModal}
          onClose={() => setOpenModal(false)}
          onAdd={(formData: any) => {
            if (defaultData > -1) {
              setData([
                ...data.slice(0, defaultData),
                {
                  ...formData,
                  id: data[defaultData].id,
                },
                ...data.slice(defaultData + 1),
              ]);
            } else {
              setData([...data, { ...formData }]);
            }
            setOpenModal(false);
          }}
          defaultData={fetchDefaultData()}
          disabled={
            data.length
              ? {
                  roleIdentity: true,
                  newRole: true,
                  tower: true,
                  subTower: true,
                }
              : {}
          }
        />
      )}
    </React.Fragment>
  );
};

export default PositionDetails;
