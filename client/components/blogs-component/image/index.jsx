import React from "react";
import Image from "next/image";

const BlogImage = ({ className, src, alt, fill, priority, style, onClick, height, width }) => {
  return (
    <>
      <div className={className} onClick={onClick} style={{ position: "relative" }}>
        <Image
          src={src}
          alt={alt}
          fill={fill}
          width={width}
          style={style}
          height={height}
          priority={priority}
        />{" "}
      </div>
    </>
  );
};

export default BlogImage;
