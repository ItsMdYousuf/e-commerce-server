import React from "react";

const Label = ({ children, className, htmlFor }) => {
  return (
    <label
      className={`${className} mb-2 text-xs font-semibold capitalize`}
      htmlFor={htmlFor}
    >
      {children}
    </label>
  );
};

export default Label;
