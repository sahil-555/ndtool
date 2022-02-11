import React from "react";
import { Form, Row, Col } from "react-bootstrap";

export interface RequestDetails {
  data: any;
  changeAttr: (key: string, val: any, extra?: { [key: string]: any }) => void;
}

const RequestDetails: React.FC<RequestDetails> = ({ data, changeAttr }) => {
  React.useEffect(() => {
    if (data.zone !== "AFR") changeAttr("subZone", "");
  }, [data.zone]);

  React.useEffect(() => {
    changeAttr("", "", { io: "", ria: "", costCenter: "", glCode: "" });
  }, [data.budget]);

  React.useEffect(() => {
    changeAttr("", "", {
      budget: "",
      io: "",
      ria: "",
      costCenter: "",
      glCode: "",
    });
  }, [data.crossCharge]);

  return (
    <Form>
      <Row>
        <Col xs={12} lg={4}>
          <Form.Group
            className="form-group"
            controlId="nameOfProjectInitiative"
          >
            <Form.Label>Name of Project/Initiative</Form.Label>
            <Form.Control
              type="text"
              defaultValue={data["nameOfProjectInitiative"]}
              onChange={(e) =>
                changeAttr("nameOfProjectInitiative", e.target.value)
              }
            />
          </Form.Group>
        </Col>
        <Col xs={12} lg={2}>
          <Form.Group className="form-group" controlId="zone">
            <Form.Label>Zone</Form.Label>
            <Form.Control
              as="select"
              defaultValue={data["zone"]}
              onChange={(e) => changeAttr("zone", e.target.value)}
            >
              <option value={""}>Select</option>
              <option value={"AFR"}>AFR</option>
              <option value={"APAC"}>APAC</option>
              <option value={"EUR"}>EUR</option>
              <option value={"GHQ"}>GHQ</option>
              <option value={"MAZ"}>MAZ</option>
              <option value={"NAZ"}>NAZ</option>
              <option value={"SAZ"}>SAZ</option>
            </Form.Control>
          </Form.Group>
        </Col>
        <Col xs={12} lg={2}>
          <Form.Group className="form-group" controlId="subZone">
            <Form.Label>Sub Zone</Form.Label>
            <Form.Control
              as="select"
              value={data["subZone"]}
              onChange={(e) => changeAttr("subZone", e.target.value)}
              disabled={(() => data["zone"] !== "AFR")()}
            >
              <option value={""}>Select</option>
              <option value={"MAU"}>MAU</option>
              <option value={"ROA"}>ROA</option>
              <option value={"SA"}>SA</option>
            </Form.Control>
          </Form.Group>
        </Col>
        {data["crossCharge"] && (
          <Col xs={12} lg={4}>
            <Form.Group className="form-group" controlId="budget">
              <Form.Label>Budget</Form.Label>
              <Form.Control
                as="select"
                defaultValue={data["budget"]}
                onChange={(e) => changeAttr("budget", e.target.value)}
              >
                <option value={""}>Select</option>
                <option value={"Capex"}>Capex</option>
                <option value={"Opex"}>Opex</option>
              </Form.Control>
            </Form.Group>
          </Col>
        )}
        <Col xs={12} lg={4}>
          <Form.Group className="form-group" controlId="entityCode">
            <Form.Label>Entity Code</Form.Label>
            <Form.Control
              type="text"
              value={data["entityCode"]}
              maxLength={6}
              onChange={(e) => changeAttr("entityCode", e.target.value)}
            />
          </Form.Group>
        </Col>
        {data["crossCharge"] && (
          <>
            {data["budget"] !== "Opex" && (
              <React.Fragment>
                <Col xs={12} lg={2}>
                  <Form.Group className="form-group" controlId="io">
                    <Form.Label>IO</Form.Label>
                    <Form.Control
                      type="text"
                      disabled={(() => data["budget"] !== "Capex")()}
                      value={data["io"]}
                      onChange={(e) => changeAttr("io", e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} lg={2}>
                  <Form.Group className="form-group" controlId="ria">
                    <Form.Label>RIA</Form.Label>
                    <Form.Control
                      type="text"
                      disabled={(() => data["budget"] !== "Capex")()}
                      value={data["ria"]}
                      onChange={(e) => changeAttr("ria", e.target.value)}
                    />
                  </Form.Group>
                </Col>
              </React.Fragment>
            )}
            {data["budget"] === "Opex" && (
              <React.Fragment>
                <Col xs={12} lg={2}>
                  <Form.Group className="form-group" controlId="costCenter">
                    <Form.Label>Cost-Center</Form.Label>
                    <Form.Control
                      type="text"
                      value={data["costCenter"]}
                      onChange={(e) => changeAttr("costCenter", e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} lg={2}>
                  <Form.Group className="form-group" controlId="glCode">
                    <Form.Label>GL Code</Form.Label>
                    <Form.Control
                      type="text"
                      value={data["glCode"]}
                      onChange={(e) => changeAttr("glCode", e.target.value)}
                    />
                  </Form.Group>
                </Col>
              </React.Fragment>
            )}
          </>
        )}
        <Col xs={12} lg={12}>
          <Form.Group className="form-group" controlId="crossCharge">
            <Form.Check
              type="checkbox"
              label="Cross Charge?"
              checked={data["crossCharge"]}
              onChange={(e) => changeAttr("crossCharge", !data["crossCharge"])}
            />
          </Form.Group>
        </Col>
      </Row>
    </Form>
  );
};

export default RequestDetails;
