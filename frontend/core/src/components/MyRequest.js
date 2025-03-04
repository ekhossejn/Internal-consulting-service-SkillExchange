import React from "react";
import { Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function MyRequest({ myRequest }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/profile/requests/${myRequest.id}/`);
  };

  return (
    <Card className="my-3 p-3 rounded" onClick={handleClick} style={{ cursor: "pointer" }}>
      <Card.Body>
        <Card.Title as="h3">{myRequest.name}</Card.Title>
      </Card.Body>
    </Card>
  );
}

export default MyRequest;
