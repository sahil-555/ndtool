import React from "react";

interface AnchorProps {
  list: React.RefObject<HTMLDivElement>;
  onToggle: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const DropdownAnchor: React.FC<AnchorProps> = ({
  list,
  children,
  onToggle,
}) => {
  const toggleDropdown = (e: React.MouseEvent<HTMLButtonElement>) => {
    list.current?.classList.toggle("open");
    onToggle(e);
  };

  return <button onClick={toggleDropdown}>{children}</button>;
};

export default React.memo(DropdownAnchor);
