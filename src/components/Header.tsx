import React, { useState, useEffect, useContext } from "react";
import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import { loginRequest } from "../utils/msalconfig";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

import NotifyToast from "./NotifyToast";
import { UserContext } from "../context/UserContext";

import { callMsGraphPhoto } from "../utils/api";

import logo from "../assets/images/abi_logo.png";
import defaultProfilePhoto from "../assets/images/profile.jpg";
import Routes from "../routes.json";

interface NavItemProps {
  icon: string;
  to: string;
  route: string;
}

const Header: React.FC = (props) => {
  const { pathname: path } = useLocation();

  const [profilePhoto, setProfilePhoto] = useState<Blob | undefined>();

  const { user } = useContext(UserContext);

  const { instance, accounts } = useMsal();

  const isAuthenticated = useIsAuthenticated();

  const [isDropDownOpen, setisDropDownOpen] = useState(false);

  const togglingDropDown = () => {
    setisDropDownOpen(!isDropDownOpen);
  };

  const [isHeaderOpen, setisHeaderOpen] = useState(false);

  const togglingHeader = () => {
    setisHeaderOpen(!isHeaderOpen);
  };

  useEffect(() => {
    console.log("Account: ", accounts[0]);
    if (isAuthenticated) {
      instance
        .acquireTokenSilent({
          ...loginRequest,
          account: accounts[0],
        })
        .then((response) => {
          callMsGraphPhoto(response.accessToken).then((image) => {
            if (image && image.type === "image/jpeg") setProfilePhoto(image);
          });
        });
    }
  }, [isAuthenticated]);

  const NavItem: React.FC<NavItemProps> = (props) => (
    <li className="nav-item">
      <Link
        className={`nav-link ${path === props.to ? " active" : ""}`}
        to={props.to}
      >
        <Icon icon={props.icon as IconProp} />
        &nbsp; {props.route}
      </Link>
    </li>
  );

  return (
    <div className="top-nav">
      <div className="header py-4">
        <div className="container">
          <div className="d-flex">
            <a
              className="header-brand d-flex justify-content-center align-items-center"
              href="/"
            >
              <img src={logo} className="header-brand-img" alt="abi logo" />
            </a>
            <div className="d-flex order-lg-2 ml-auto text-left">
              <span style={{ color: "#F00F00" }}>
                <strong>
                  {process.env.REACT_APP_ENV == "prod" ? "LIVE" : "TEST"}
                </strong>
              </span>
              <div className="dropdown">
                <a
                  className="nav-link pr-0 leading-none"
                  onClick={togglingDropDown}
                >
                  <img
                    className="avatar"
                    src={
                      profilePhoto
                        ? URL.createObjectURL(profilePhoto)
                        : defaultProfilePhoto
                    }
                    alt=""
                  />
                  {/* <ProfilePhoto graphData={graphData} /> */}
                  <span className="ml-2 d-none d-lg-block">
                    <span className="text-default">
                      <strong>
                        {accounts.length > 0 ? accounts[0].name : ""}
                      </strong>
                    </span>
                    <span>&emsp;&emsp;&emsp;</span>
                    <small className="text-muted d-block mt-1">
                      {accounts.length > 0 ? accounts[0].username : ""}
                    </small>
                  </span>
                </a>
                {isDropDownOpen && (
                  <div
                    className="dropdown-menu dropdown-menu-right dropdown-menu-arrow show"
                    style={{ cursor: "pointer" }}
                  >
                    <a className="dropdown-item text-left" href="#">
                      Support
                    </a>
                    <a
                      className="dropdown-item text-left"
                      onClick={() => instance.logout()}
                    >
                      Sign out
                    </a>
                  </div>
                )}
              </div>
            </div>
            <a
              className={`header-toggler d-lg-none ml-3 ml-lg-0 ${
                isHeaderOpen ? "" : "collapsed"
              }`}
              onClick={togglingHeader}
            >
              <span className="header-toggler-icon"></span>
            </a>
          </div>
        </div>
      </div>
      <div
        className={`header collapse d-lg-flex p-0 ${
          isHeaderOpen ? "show" : ""
        }`}
        id="headerMenuCollapse"
        style={{ backgroundColor: "#b11f24" }}
      >
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg order-lg-first">
              <ul className="nav nav-tabs border-0 flex-column flex-lg-row">
                {Routes.map((route, index) => {
                  if (route.path === "/dashboard/admin" && !user.admin)
                    return <React.Fragment key={index} />;

                  return (
                    <NavItem
                      key={index}
                      to={route.path}
                      route={route.title}
                      icon={route.icon}
                    />
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
