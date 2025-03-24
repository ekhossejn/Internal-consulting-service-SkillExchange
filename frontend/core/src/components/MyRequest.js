import React from "react";
import { Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function MyRequest({ myRequest }) {
  const navigate = useNavigate();

  const NavigateToRequestPage = () => {
    navigate(`/profile/requests/${myRequest.id}/`);
  };

  return (
    <Card className="my-3 p-3 rounded" style={{ backgroundColor: "var(--bs-light)" }}>
      <Card.Body>
        <Card.Title as="h3" onClick={NavigateToRequestPage} style={{ cursor: "pointer"}}>
          {myRequest.name}
        </Card.Title>
      </Card.Body>
    </Card>
  );
}

export default MyRequest;
