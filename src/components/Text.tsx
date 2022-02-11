import React from "react";

interface TextProps {
  label?: string;
  styles?: string;
  labelStyles?: string;
  textStyles?: string;
}

const Text: React.FC<TextProps> = (props) => {
  return (
    <div className={"d-flex flex-column " + (props.styles ?? "mb-3")}>
      <span className={"h5 mb-2 " + (props.labelStyles ?? "")}>
        {props.label}
      </span>
      <span className={props.textStyles ?? ""}>{props.children}</span>
    </div>
  );
};

export default Text;
