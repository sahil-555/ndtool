import React, { createContext } from "react";
import { Table as BSTable } from "react-bootstrap";
import { ColumnProps } from "./Column";
export { default as Column } from "./Column";

interface ContextType {
  setCols: (val: ColumnProps) => void;
}

export interface TableProps {
  data: any[];
}

export const TableContext = createContext<ContextType>({
  setCols: (val: ColumnProps) => {},
});

const Table: React.FC<TableProps> = (props) => {
  const [cols, setCols] = React.useState<Array<ColumnProps>>([]);
  let tmpCols: Array<ColumnProps> = [];

  return (
    <TableContext.Provider
      value={{
        setCols: (val: ColumnProps) => {
          tmpCols.push(val);
          tmpCols.length === React.Children.toArray(props.children).length &&
            setCols(tmpCols);
        },
      }}
    >
      <BSTable striped bordered hover responsive className="text-nowrap">
        <thead>
          <tr>{props.children}</tr>
        </thead>
        <tbody>
          {props.data.map((row: any, rowIndex: number) => (
            <tr key={rowIndex}>
              {cols.map((Col: ColumnProps, colIndex: number) => (
                <td key={colIndex} className="table-cell px-2 py-1">
                  {Col.Render ? <Col.Render row={row} /> : row[Col.colId]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </BSTable>
    </TableContext.Provider>
  );
};

export default Table;
