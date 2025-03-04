import React from "react";
import { Card, Row, Col } from "react-bootstrap";

function Document({ document }) {
  return (
    <img
      src={document.image}
      alt="Profile"
      style={{
        width: "150px",
        height: "150px",
        objectFit: "cover",
      }}
    />
  );
}

export default Document;
