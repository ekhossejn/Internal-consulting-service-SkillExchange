import React, { useState } from "react";
import { Card, Row, Col } from "react-bootstrap";

function Document({ document }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <img
        src={document.image}
        alt="Profile"
        style={{
          width: "150px",
          height: "150px",
          objectFit: "cover",
          cursor: "pointer",
        }}
        onClick={() => setIsOpen(true)}
      />
      {isOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
          onClick={() => setIsOpen(false)}
        >
          <img
            src={document.image}
            alt="Fullscreen"
            style={{ maxWidth: "90vw", maxHeight: "90vh", objectFit: "contain" }}
          />
        </div>
      )}
    </>
  );
}

export default Document;
