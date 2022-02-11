import React from "react";
import { Pagination } from "react-bootstrap";

interface TablePaginationProps {
  total: number;
  curr: number;
  setCurr: (val: number) => void;
}

const TablePagination: React.FC<TablePaginationProps> = ({
  total,
  curr,
  setCurr,
}) => {
  let pages = [];

  let start = curr - 2;
  let end = total > curr + 2 ? curr + 2 : total;

  if (curr < 3) {
    start = 1;
    end = start + 4 > total ? total : start + 4;
  }

  if (curr > total - 2) {
    end = total;
    start = end - 4 < 1 ? 1 : end - 4;
  }

  for (let c = start; c <= end; c++) {
    pages.push(
      <Pagination.Item key={c} onClick={() => setCurr(c)} active={c === curr}>
        {c}
      </Pagination.Item>
    );
  }

  return (
    <Pagination>
      <Pagination.Prev disabled={curr <= 1} onClick={() => setCurr(curr - 1)} />
      {pages}
      <Pagination.Next
        disabled={curr >= total}
        onClick={() => setCurr(curr + 1)}
      />
    </Pagination>
  );
};

export default TablePagination;
