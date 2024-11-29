import React from "react";
import Label from "./Label";
const InputField = ({
  type,
  name,
  value,
  className,
  placeholder,
  onClick,
  onChange,
  labelName,
  htmlFor,
}) => {
  return (
    <div className="flex flex-col">
      <Label htmlFor={htmlFor} children={labelName} />
      <input
        name={name}
        value={value}
        className={`${className} w-auto rounded-lg px-4 py-2 outline-none ring-1 hover:ring-blue-200 focus:ring-blue-500`}
        type={type}
        placeholder={placeholder}
        onClick={onClick}
        onChange={onChange}
      />
    </div>
  );
};

export default InputField;
