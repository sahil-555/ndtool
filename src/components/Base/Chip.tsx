import React from "react";

export interface ChipProps {
  img?: string;
  text: string;
  onRemove?: () => void;
}

const Chip: React.FC<ChipProps> = (props) => {
  return (
    <div className="tw-inline-flex tw-items-center tw-rounded-full tw-bg-gray-200 tw-border tw-border-gray-200 tw-p-px">
      {props.img && (
        <img
          className="tw-w-6 tw-h-6 tw-object-cover tw-rounded-full"
          src={props.img}
          alt="Avatar of Tailwind CSS Design"
        />
      )}
      <span className="tw-px-1 tw-text-sm">{props.text}</span>
      <button
        type="button"
        className="tw-h-6 tw-w-6 tw-p-1 tw-rounded-full tw-bg-opacity-25 focus:tw-outline-none"
        onClick={props.onRemove}
      >
        <svg
          className="tw-text-gray-500 tw-text-opacity-75"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          ></path>
        </svg>
      </button>
    </div>
  );
};

export default Chip;
