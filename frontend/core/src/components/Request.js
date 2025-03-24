import React from "react";
import { Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function Request({ request }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/search/requests/${request.id}/`);
  };

  return (
    <Card className="my-3 p-3 rounded" onClick={handleClick} style={{ cursor: "pointer", backgroundColor: "var(--bs-light)" }}>
      <Card.Body>
        <Card.Title as="h3">{request.name}</Card.Title>
      </Card.Body>
    </Card>
  );
}

export default Request;
