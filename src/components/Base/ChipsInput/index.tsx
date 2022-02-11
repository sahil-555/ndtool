import React from "react";
import { FormControl } from "react-bootstrap";
import Chip, { ChipProps } from "../Chip";

export interface ChipsInputProps {
  chips?: ChipProps[];
  chip?: ChipProps;
  disabled?: boolean;
}

const ChipsInput: React.FC<ChipsInputProps> = (props) => {
  return (
    <FormControl as="div" disabled={props.disabled}>
      {props.chips?.map((ch) => (
        <Chip {...ch} />
      ))}
      {props.chip && <Chip {...props.chip} />}
    </FormControl>
  );
};

export default ChipsInput;
