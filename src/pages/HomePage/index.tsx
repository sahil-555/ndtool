import React from "react";
import NavCard from "./NavCard";
import Routes from "../../routes.json";
import { RouteType } from "../../types";

const routes: Array<RouteType> = Routes.map((route) => route as RouteType);

const HomePage: React.FC = (props) => {
  return (
    <div className="container mt-5">
      <div className="col-12 col-md-9 col-xl-6 mx-auto">
        <div className="row d-flex justify-content-center">
          {routes.map((route, index) => (
            <div key={index} className="col-6 col-md-4 col-lg-3 px-2 pb-3">
              <NavCard {...route} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
