import React from "react";

const Label = ({ children, htmlFor }) => {
  return (
    <label className="font-semibold" htmlFor={htmlFor}>
      {children}
    </label>
  );
};

export default Label;
