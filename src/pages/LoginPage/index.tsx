import React from "react";
import { Card, Container, Button, Col, Row } from "react-bootstrap";
import ABILogo from "../../assets/images/abi_logo.png";
import { useHistory } from "react-router-dom";
import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import { loginRequest } from "../../utils/msalconfig";

const LoginPage: React.FC = (props) => {
  const history = useHistory();

  const { instance } = useMsal();

  const isAuthenticated = useIsAuthenticated();

  const handleLogin = () =>
    instance.loginRedirect(loginRequest).then(console.log).catch(console.error);

  React.useEffect(() => {
    console.log(`AUTH LOG = ${isAuthenticated}`);
    if (isAuthenticated) history.push("/dashboard");
  }, [isAuthenticated]);

  return (
    <div className="tw-h-screen d-flex align-items-center justify-content-center">
      <Container>
        <Row>
          <Col className="col-login d-flex flex-column align-items-center justify-content-center mx-auto">
            <div className="text-center mb-6 d-flex align-items-center">
              <img
                src={ABILogo}
                className="h-6"
                alt="AB InBev Logo"
                style={{ paddingRight: "10px" }}
              />
            </div>
            <Card className="text-center p-2">
              <Card.Body className="d-grid">
                <Card.Title className="mb-3">
                  <h4>ND Tool Login Portal</h4>
                </Card.Title>
                <Button variant="primary" onClick={() => handleLogin()}>
                  Login
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default LoginPage;
