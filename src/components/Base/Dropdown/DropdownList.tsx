import React from "react";

export default React.forwardRef<HTMLDivElement>((props, ref) => {
  return <div ref={ref}>{props.children}</div>;
});
