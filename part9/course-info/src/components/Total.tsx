import React from "react";

const Total: React.FC<{ quantity: number }> = ({ quantity }) => (
  <p>Number of exercises {quantity}</p>
);

export default Total;
