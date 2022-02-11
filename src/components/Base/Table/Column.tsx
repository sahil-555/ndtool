import React, { useEffect, FC } from "react";
import { TableContext } from ".";

export interface ColumnProps {
  title: string;
  colId: string;
  Render?: FC<any>;
}

const Column: React.FC<ColumnProps> = ({ title, colId, Render }) => {
  const { setCols } = React.useContext(TableContext);
  useEffect(() => setCols({ title, colId, Render }), []);

  return <th>{title}</th>;
};

export default Column;
