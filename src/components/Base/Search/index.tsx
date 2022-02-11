import React from "react";
import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome";

const Search: React.FC = (props) => {
  return (
    <div className="tw-flex tw-justify-center tw-items-center">
      <input
        type="text"
        className="tw-py-1 tw-px-2 tw-bg-gray-200 tw-rounded-l-md tw-outline-none tw-ring-blue-800 tw-ring-inset focus:tw-bg-white focus:tw-ring-2"
        placeholder="Search..."
      />
      <button className="tw-py-auto tw-px-2 tw-py-1 tw-self-stretch tw-bg-blue-800 tw-rounded-r-md">
        <Icon
          icon="search"
          className="tw-text-lg tw-text-white hover:tw-text-white"
        />
      </button>
    </div>
  );
};

export default Search;
