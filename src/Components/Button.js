// button.js => src/Components/Button.js

import React from "react";
import PropTypes from "prop-types";

const Button = ({ children, type = "button", onClick, className }) => {
  return (
    <button
      type={type}
      className={`px-4 py-2 rounded-lg text-white transition duration-300 ease-in-out ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  type: PropTypes.oneOf(["button", "submit", "reset"]),
  onClick: PropTypes.func,
  className: PropTypes.string,
};

Button.defaultProps = {
  type: "button",
  onClick: () => {},
  className: "",
};

export default Button;
