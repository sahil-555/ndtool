import React from "react";

interface AvatarProps {
  src: string;
  alt: string;
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({ src, alt, className }) => {
  return (
    <img
      src={src}
      alt={alt}
      className={"tw-rounded-full tw-w-8 " + className}
      style={{ aspectRatio: "1/1" }}
    />
  );
};

export default Avatar;
