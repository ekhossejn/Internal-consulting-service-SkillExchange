import React from "react";
import { Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function User({ user }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/search/users/${user.id}/`);
  };
  return (
    <Card className="my-3 p-3 rounded" onClick={handleClick} style={{ cursor: "pointer" }}>
      <Card.Body>
        <Card.Title as="h3">{user.name}</Card.Title>
      </Card.Body>
    </Card>
  );
}

export default User;
