import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { library } from "@fortawesome/fontawesome-svg-core";
import { IconList } from "./icons";
import { Container } from "react-bootstrap";
import { useMsal, useIsAuthenticated } from "@azure/msal-react";

import Header from "./components/Header";
import NewDemandPage from "./pages/NewDemandPage";
import YourRequestsPage from "./pages/YourRequestsPage";
import ApproveRequestsPage from "./pages/ApproveRequestsPage";
import AdminViewPage from "./pages/AdminViewPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import PositionRequestViewPage from "./pages/RequestViewPage";
import RequestDetailsPage from "./pages/RequestDetailsPage";

import "./App.css";
import NotifyToast from "./components/NotifyToast";
import { UserContext, UserContextProvider } from "./context/UserContext";
import { NotifContextProvider } from "./context/ToastContext";

import { fetchUser } from "./utils/api";

library.add(...IconList);

const ProtectedRoute: React.FC<{
  component: React.FC<any>;
  [key: string | number | symbol]: any;
}> = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      // localStorage.getItem("token") ? (
      true ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: "/",
            state: { from: props.location },
          }}
        />
      )
    }
  />
);

const ProtectedRoutes: React.FC = () => {
  const { user, userDispatch } = React.useContext(UserContext);
  const { instance, accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated();

  React.useEffect(() => {
    if (isAuthenticated) {
      (() => {
        fetchUser(accounts[0].username).then((user) => {
          userDispatch({ type: "SET_USER", payload: user });
        });
      })();
    }
  }, [isAuthenticated]);

  return (
    <div className="page">
      <Header />
      <Container className="my-3 my-md-5 text-left">
        <NotifyToast />
        <ProtectedRoute exact path="/dashboard" component={DashboardPage} />
        <ProtectedRoute
          exact
          path="/dashboard/new-demand"
          component={NewDemandPage}
        />
        <ProtectedRoute
          exact
          path="/dashboard/requests"
          component={YourRequestsPage}
        />
        <ProtectedRoute
          exact
          path="/dashboard/approver"
          component={ApproveRequestsPage}
        />
        {user.admin && (
          <ProtectedRoute
            exact
            path="/dashboard/admin"
            component={AdminViewPage}
          />
        )}
        <ProtectedRoute
          exact
          path="/dashboard/position-requester"
          component={PositionRequestViewPage}
        />
        <ProtectedRoute
          exact
          path="/dashboard/requests/:id"
          component={RequestDetailsPage}
        />
        <ProtectedRoute
          exact
          path="/dashboard/review/:id"
          component={RequestDetailsPage}
        />
      </Container>
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <div className="App-header">
        <UserContextProvider>
          <NotifContextProvider>
            <Router>
              <Switch>
                <Route exact path="/" component={LoginPage} />
                <ProtectedRoute path="/dashboard" component={ProtectedRoutes} />
              </Switch>
            </Router>
          </NotifContextProvider>
        </UserContextProvider>
      </div>
    </div>
  );
}

export default App;
