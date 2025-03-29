import React from "react";
import { Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const options = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
};

function MyRequest({ myRequest }) {
  const navigate = useNavigate();

  const NavigateToRequestPage = () => {
    navigate(`/profile/requests/${myRequest.id}/`);
  };

  return (
    <Card
      className="my-3 p-3 rounded"
      onClick={NavigateToRequestPage}
      style={{
        backgroundColor: "var(--bs-light)",
        cursor: "pointer",
        maxHeight: "20vh",
        overflow: "auto",
        
      }}
    >
        <Card.Title as="h3" style={{fontSize: "22px" }}>{myRequest.name}</Card.Title>
        <h3 style={{fontSize: "14px"}}>{new Date(myRequest.createdAt).toLocaleString('ru-RU', options)}</h3>
        <h3 style={{fontSize: "17px", marginTop: "1.5vh"}}>{myRequest.text}</h3>
    </Card>
  );
}

export default MyRequest;
