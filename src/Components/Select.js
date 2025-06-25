// src/Components/Select.js
import React from "react";

const base = "border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500";
const sizeVariants = {
  sm: "px-2 py-1 text-sm",
  md: "px-3 py-2 text-sm",
  lg: "px-4 py-2 text-base"
};

const Select = ({
  children,
  className = "",
  size = "md",
  isMulti = false,
  options = [],
  ...props
}) => {
  return (
    <select
      className={`${base} ${sizeVariants[size]} ${className}`}
      multiple={isMulti}
      {...props}
    >
      {options.length > 0
        ? options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))
        : children}
    </select>
  );
};

export default Select;
