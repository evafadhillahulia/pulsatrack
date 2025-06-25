// Input.js => src/Components/Input.js

import React from "react";

const Input = ({ type = "text", id, placeholder, value, onChange, required, ...props }) => {
  return (
    <input
      type={type}
      id={id}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
      {...props}
    />
  );
};

export default Input;
