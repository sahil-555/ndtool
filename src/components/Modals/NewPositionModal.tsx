import React from "react";
import {
  Modal,
  Button,
  Row,
  Col,
  Form,
  OverlayTrigger,
  Popover,
} from "react-bootstrap";
import { fetchSuggestedUser } from "../../utils/api";

export interface NewPositionModalProps {
  show: boolean;
  onClose: () => void;
  onAdd: (data: any) => void;
  defaultData?: any;
  disabled?: any;
}

const tower: Array<{ name: string; subTower: Array<string> }> = [
  {
    name: "GCC Operations",
    subTower: [
      "CX",
      "PMI",
      "ATR",
      "FP&A",
      "PBS",
      "CP&A",
      "ROA ops",
      "Ops-Others",
      "AFR",
      "People",
    ],
  },
  {
    name: "Tech Ops",
    subTower: [
      "Compliance",
      "SALESFORCE C4E",
      "Cyber Security Ops",
      "Applications",
      "Digital Workplace",
      "Global DC & Cloud",
      "Netwirk Ops",
    ],
  },
  { name: "Digital Solutions", subTower: ["Digital Solutions"] },
  { name: "Procurement", subTower: ["Procurement"] },
  { name: "GAC", subTower: ["GAC"] },
  {
    name: "Tech Logistics & Supply",
    subTower: ["Tech Logistics", "Tech Supply"],
  },
  {
    name: "People Tech",
    subTower: ["People Transformation", "Employee Experience"],
  },
  { name: "Data & Integration", subTower: ["Data Engineering", "IT D&D"] },
  { name: "Business Transformation", subTower: ["Business Transformation"] },
  { name: "Data & Architecture", subTower: ["Data & Architecture"] },
  { name: "SAP", subTower: ["SAP"] },
];

const SuggestionPopover: React.FC<{
  setAttr: (key: string, val: any) => void;
  fieldName: string;
  formData: any;
}> = ({ setAttr, fieldName, formData }) => {
  const [suggested, setSuggested] = React.useState<
    Array<{ name: string; email: string }>
  >([]);

  const fetchSuggested = async (val: string) => {
    try {
      const sug = await fetchSuggestedUser(val);
      setSuggested(sug);
    } catch (err) {
      console.log(err);
    }
  };

  const onSelect = (name: string) => {
    setAttr(fieldName, name);
  };

  return (
    <OverlayTrigger
      trigger="focus"
      placement={"bottom"}
      overlay={
        <Popover id={fieldName}>
          <Popover.Header as="h3">Suggested People</Popover.Header>
          <Popover.Body>
            {suggested.map((item, index) => (
              <button
                key={index}
                className="text-start"
                onClick={() => onSelect(item.name)}
              >
                <div className="h5 mb-1">{item.name}</div>
                <div className="small">{item.email}</div>
              </button>
            ))}
          </Popover.Body>
        </Popover>
      }
    >
      <Form.Control
        type="text"
        defaultValue={formData[fieldName]}
        onChange={(e) => fetchSuggested(e.currentTarget.value)}
      />
    </OverlayTrigger>
  );
};

const NewPositionModal: React.FC<NewPositionModalProps> = (props) => {
  const [formData, setFormData] = React.useState({
    roleIdentity: "",
    band: "",
    positionRequired: 1,
    hiringType: "",
    positionStartDate: "",
    positionEndDate: "",
    expectedCrossChargeDate: "",
    tower: "",
    subTower: "",
    lineManager: "",
    newRole: false,
    roleDescription: "",
    existingResourceName: "",
    existingPositionID: "",
    attachJobDescription: "",
    ...props.defaultData,
  });

  const [subTower, setSubTower] = React.useState<Array<string>>([]);

  const setAttr = (key: string, val: any) => {
    setFormData({ ...formData, [key]: val });
  };

  React.useEffect(() => {
    let subTowers =
      tower.find((tow) => tow.name === formData.tower)?.subTower ?? [];
    setSubTower([...subTowers]);
  }, [formData.tower]);

  React.useEffect(() => {
    if (
      ["Sabbatical", "Maternity", "Re-banding"].indexOf(
        formData.roleIdentity
      ) == -1
    )
      setAttr("existingPositionID", "");
  }, [formData.roleIdentity]);

  return (
    <Modal show={props.show} onHide={props.onClose} size="lg">
      <Modal.Header>Position Details</Modal.Header>
      <Modal.Body>
        <Form>
          <Row>
            <Col xs={12} lg={3}>
              <Form.Group className="form-group" controlId="roleIdentity">
                <Form.Label>Role Identity</Form.Label>
                <Form.Select
                  value={formData.roleIdentity}
                  onChange={(e) =>
                    setAttr("roleIdentity", e.currentTarget.value)
                  }
                  disabled={props.disabled?.roleIdentity}
                >
                  <option value={""}>Select</option>
                  <option value={"Permanent"}>Permanent</option>
                  <option value={"In Transit"}>In Transit</option>
                  <option value={"Sabbatical"}>Sabbatical</option>
                  <option value={"Intern"}>Intern</option>
                  <option value={"Maternity"}>Maternity</option>
                  <option value={"Re-banding"}>Re-banding</option>
                  <option value={"Others"}>Others</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col xs={12} lg={3}>
              <Form.Group className="from-group" controlId="band">
                <Form.Label>Band</Form.Label>
                <Form.Select
                  value={formData.band}
                  onChange={(e) => setAttr("band", e.currentTarget.value)}
                  disabled={props.disabled?.band}
                >
                  <option value={""}>Select</option>
                  <option value={"4A"}>4A</option>
                  <option value={"4B"}>4B</option>
                  <option value={"5A"}>5A</option>
                  <option value={"5B"}>5B</option>
                  <option value={"6A"}>6A</option>
                  <option value={"6B"}>6B</option>
                  <option value={"7A"}>7A</option>
                  <option value={"7B"}>7B</option>
                  <option value={"8A"}>8A</option>
                  <option value={"8B"}>8B</option>
                  <option value={"9A"}>9A</option>
                  <option value={"9B"}>9B</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col xs={12} lg={3}>
              <Form.Group className="form-group" controlId="positionRequired">
                <Form.Label>Position Required</Form.Label>
                <Form.Control
                  type="number"
                  min="1"
                  value={formData.positionRequired}
                  onChange={(e) =>
                    setAttr("positionRequired", e.currentTarget.value)
                  }
                  disabled={props.disabled?.positionRequired}
                />
              </Form.Group>
            </Col>
            <Col xs={12} lg={3}>
              <Form.Group className="form-group" controlId="hiringType">
                <Form.Label>Hiring Type</Form.Label>
                <Form.Select
                  value={formData.hiringType}
                  onChange={(e) => setAttr("hiringType", e.currentTarget.value)}
                  disabled={props.disabled?.hiringType}
                >
                  <option value={""}>Select</option>
                  <option value={"Internal Hire"}>Internal Hire</option>
                  <option value={"External Hire"}>External Hire</option>
                  <option value={"Not Sure"}>Not Sure Yet</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col xs={12} lg={3}>
              <Form.Group className="form-group" controlId="positionStartDate">
                <Form.Label>Position Start Date</Form.Label>
                <Form.Control
                  type="date"
                  value={formData.positionStartDate}
                  onChange={(e) =>
                    setAttr("positionStartDate", e.currentTarget.value)
                  }
                  disabled={props.disabled?.positionStartDate}
                />
              </Form.Group>
            </Col>
            <Col xs={12} lg={3}>
              <Form.Group className="form-group" controlId="tower">
                <Form.Label>Tower</Form.Label>
                <Form.Select
                  value={formData.tower}
                  onChange={(e) => setAttr("tower", e.currentTarget.value)}
                  disabled={props.disabled?.tower}
                >
                  <option value={""}>Select</option>
                  {tower.map((item, index) => (
                    <option
                      key={index}
                      value={item.name}
                      onClick={() => setSubTower(tower[index].subTower)}
                    >
                      {item.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col xs={12} lg={3}>
              <Form.Group className="form-group" controlId="subTower">
                <Form.Label>Sub Tower</Form.Label>
                <Form.Select
                  value={formData.subTower}
                  onChange={(e) => setAttr("subTower", e.currentTarget.value)}
                  disabled={props.disabled?.subTower}
                >
                  <option value={""}>Select</option>
                  {subTower.map((item, index) => (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col xs={12} lg={3}>
              <Form.Group className="form-group" controlId="existingPositionId">
                <Form.Label>Existing Position ID</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.existingPositionID}
                  onChange={(e) =>
                    setAttr("existingPositionID", e.currentTarget.value)
                  }
                  disabled={
                    props.disabled?.existingPositionId ||
                    ["Sabbatical", "Maternity", "Re-banding"].indexOf(
                      formData.roleIdentity
                    ) == -1
                  }
                />
              </Form.Group>
            </Col>
            <Col xs={12} lg={3}>
              <Form.Group
                className="form-group"
                controlId="existingResourceName"
              >
                <Form.Label>Existing Resource</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.existingResourceName}
                  placeholder="email"
                  onChange={(e) =>
                    setAttr("existingResourceName", e.currentTarget.value)
                  }
                  disabled={props.disabled?.existingResourceName}
                />
              </Form.Group>
            </Col>
            <Col xs={12} lg={3}>
              <Form.Group className="form-group" controlId="lineManager">
                <Form.Label>Line Manager</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.lineManager}
                  placeholder="email"
                  onChange={(e) =>
                    setAttr("lineManager", e.currentTarget.value)
                  }
                  disabled={props.disabled?.lineManager}
                />
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="success" onClick={() => props.onAdd(formData)}>
          Add
        </Button>
        <Button variant="danger" onClick={props.onClose}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default NewPositionModal;
