import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

interface NavCardProps {
  path: string;
  title: string;
  icon: IconProp;
  bg: string;
}

const NavCard: React.FC<NavCardProps> = (props) => {
  return (
    <Link to={props.path}>
      <div
        style={{ aspectRatio: "1/1", backgroundColor: props.bg }}
        className="d-flex p-2 justify-content-center align-items-center flex-column"
      >
        <Icon className="h1 text-white" icon={props.icon || "çhecklist"} />
        <h6 className="mt-sm-3 mt-1 text-center text-white">{props.title}</h6>
      </div>
    </Link>
  );
};

export default NavCard;
